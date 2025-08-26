
import React, { useState, useEffect, useRef } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { UploadFile } from "@/api/integrations";
import {
  Camera,
  Save,
  User as UserIcon,
  Edit,
  X,
  MapPin,
  Linkedin,
  Facebook,
  Instagram,
  Globe,
  Link as LinkIcon,
  Share2,
  Eye,
  Loader2,
  Mail,
  Building,
  Phone,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// Helper to convert Data URL to File object for uploading
function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Profile picture editor state
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [originalImageSrc, setOriginalImageSrc] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(new Image());

  useEffect(() => {
    loadUser();
  }, []);

  // Effect to determine if changes have been made
  useEffect(() => {
    if (user && editableUser) {
      let changes = false;
      const allKeys = new Set([...Object.keys(user), ...Object.keys(editableUser)]);

      for (const key of allKeys) {
        if (user[key] !== editableUser[key]) {
          changes = true;
          break;
        }
      }
      // Also check profile_photo_url separately as it might be updated via editor
      if (user.profile_photo_url !== editableUser.profile_photo_url) {
        changes = true;
      }
      setHasChanges(changes);
    } else {
      setHasChanges(false);
    }
  }, [user, editableUser]); // Depend on user and editableUser for change detection

  // Effect for drawing image when editor is open or scale/pan changes
  useEffect(() => {
    if (isImageEditorOpen && originalImageSrc && imageRef.current.complete) {
      drawEditorImage();
    }
  }, [scale, pan, isImageEditorOpen, originalImageSrc]);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setEditableUser({ ...currentUser });
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setEditableUser((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    if (!editableUser || !hasChanges) return; // Prevent saving if no changes or no user data
    setIsSaving(true);
    try {
      // Create a payload with only the changed fields
      const changedData = {};
      Object.keys(editableUser).forEach(key => {
        if (editableUser[key] !== user[key]) {
          changedData[key] = editableUser[key];
        }
      });

      if (Object.keys(changedData).length > 0) {
        await User.updateMyUserData(changedData);
        const updatedUser = await User.me(); // Re-fetch user to ensure full sync
        setUser(updatedUser);
        setEditableUser({ ...updatedUser });
      }
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditableUser({ ...user }); // Revert changes to the original user data
    setIsEditMode(false);
    setHasChanges(false); // Reset changes status
  };

  // Image editor functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setOriginalImageSrc(imageUrl);
        imageRef.current.src = imageUrl;
        imageRef.current.onload = () => {
          openImageEditor();
        };
      };
      reader.readAsDataURL(file);
    }
    // Clear the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const drawEditorImage = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.src) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save current context state before clipping
    ctx.save();
    
    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.clip(); // Clip everything outside this circle

    // Calculate dimensions and position
    let imgWidth = img.width;
    let imgHeight = img.height;

    // Ensure image is large enough to cover the canvas at min scale
    const minScaleToCover = Math.max(canvas.width / imgWidth, canvas.height / imgHeight);
    const effectiveScale = Math.max(scale, minScaleToCover); // Ensure image always covers the circle

    const scaledWidth = imgWidth * effectiveScale;
    const scaledHeight = imgHeight * effectiveScale;

    // Centered position + pan
    const drawX = (canvas.width / 2) - (scaledWidth / 2) + pan.x;
    const drawY = (canvas.height / 2) - (scaledHeight / 2) + pan.y;

    ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
    
    // Restore context to remove clipping path for next draws
    ctx.restore();
    
    // Draw circular border
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 1, 0, Math.PI * 2, false);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const openImageEditor = () => {
    if (!imageRef.current.src) return;
    
    // Calculate initial scale to fit image, ensuring it fills the circle
    const img = imageRef.current;
    const canvasSize = 400; // Hardcoded canvas size for simplicity, matches JSX
    
    const initialScaleToCover = Math.max(canvasSize / img.width, canvasSize / img.height);
    
    setScale(initialScaleToCover); // Start with scale that covers the circle
    setPan({ x: 0, y: 0 });
    setIsImageEditorOpen(true);
    
    // Draw after state update and DOM is ready
    // Using requestAnimationFrame to ensure canvas is ready for drawing
    requestAnimationFrame(() => drawEditorImage());
  };

  const closeImageEditor = () => {
    setIsImageEditorOpen(false);
    setOriginalImageSrc(null); // Clear image source after closing
    setScale(1); // Reset scale
    setPan({ x: 0, y: 0 }); // Reset pan
  };

  const handleImageSave = async () => {
    setIsSavingImage(true);
    const canvas = canvasRef.current;
    
    try {
      // Create a new canvas for the final crop
      const cropCanvas = document.createElement('canvas');
      const cropCtx = cropCanvas.getContext('2d');
      const previewSize = 300; // Final desired size for the profile picture
      cropCanvas.width = previewSize;
      cropCanvas.height = previewSize;

      // Draw the editor canvas onto the crop canvas, scaling it down
      cropCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, previewSize, previewSize);
      
      const croppedDataUrl = cropCanvas.toDataURL('image/png'); // Using PNG for transparency support
      const imageFile = dataURLtoFile(croppedDataUrl, 'profile.png');
      
      const { file_url } = await UploadFile({ file: imageFile });
      
      // Update both user states
      const updatedData = { profile_photo_url: file_url };
      await User.updateMyUserData(updatedData); // Update backend
      
      setUser(prev => ({ ...prev, ...updatedData }));
      setEditableUser(prev => ({ ...prev, ...updatedData }));
      
      closeImageEditor();
    } catch (error) {
      console.error("Failed to save profile picture:", error);
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleImageDelete = async () => {
    setIsSavingImage(true);
    try {
      await User.updateMyUserData({ profile_photo_url: null });
      setUser(prev => ({ ...prev, profile_photo_url: null }));
      setEditableUser(prev => ({ ...prev, profile_photo_url: null }));
      if(fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
    } finally {
      setIsSavingImage(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const onMouseDown = (e) => {
    setIsPanning(true);
    setPanStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  const onMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };
  
  const onMouseUp = () => setIsPanning(false);

  const getUserDisplayName = (user) => {
    if (!user) return "";
    return user.preferred_app_name || user.full_name || "User";
  };

  const socialFields = [
    { name: 'website_url', icon: Globe, placeholder: 'https://your-website.com' },
    { name: 'linkedin_url', icon: Linkedin, placeholder: 'https://linkedin.com/in/...' },
    { name: 'facebook_url', icon: Facebook, placeholder: 'https://facebook.com/...' },
    { name: 'instagram_url', icon: Instagram, placeholder: 'https://instagram.com/...' },
    { name: 'tiktok_url', icon: Share2, placeholder: 'https://tiktok.com/@...' },
    { name: 'other_url', icon: LinkIcon, placeholder: 'https://another-link.com' }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Could not load user profile.</div>;
  }

  const isCoach = user.user_type === "coach";

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-h1 text-text-primary">Your Profile</h1>
          {isEditMode ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="btn-secondary">
                <X className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="btn-primary"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin sm:mr-2" />
                ) : (
                  <Save className="w-4 h-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditMode(true)} className="btn-primary">
              <Edit className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="base-card p-6">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center gap-6">
                  <div className="relative group">
                    {isEditMode ? (
                      <div className="relative">
                        <Avatar
                          className="w-24 h-24 sm:w-32 sm:h-32 text-4xl border-4 border-white shadow-md cursor-pointer"
                          onClick={() => fileInputRef.current.click()}
                        >
                          <AvatarImage src={editableUser.profile_photo_url || user.profile_photo_url || ""} alt={getUserDisplayName(user)} />
                          <AvatarFallback className="text-white bg-[var(--brand-primary)]">
                            {getUserDisplayName(user).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer transition hover:scale-110"
                             onClick={() => fileInputRef.current.click()}>
                          <Camera className="h-4 w-4 text-gray-600" />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                        {user.profile_photo_url && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 mt-2"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Avatar
                        className="w-24 h-24 sm:w-32 sm:h-32 text-4xl border-4 border-white shadow-md"
                      >
                        <AvatarImage src={user.profile_photo_url || ""} alt={getUserDisplayName(user)} />
                        <AvatarFallback className="text-white bg-[var(--brand-primary)]">
                          {getUserDisplayName(user).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left lg:text-center">
                    {isEditMode ? (
                      <Input
                        name="preferred_app_name"
                        value={editableUser.preferred_app_name || ""}
                        onChange={handleInputChange}
                        className="text-2xl font-bold mb-2 text-center"
                        placeholder="Your Display Name"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-text-primary">{getUserDisplayName(user)}</h2>
                    )}
                    <p className="text-text-secondary text-base">{user.email}</p>
                    {isEditMode ? (
                      <Input
                        name="city"
                        value={editableUser.city || ""}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="mt-2 text-center"
                      />
                    ) : user.city && (
                      <p className="flex items-center justify-center gap-2 text-text-muted mt-2 text-sm">
                        <MapPin className="w-4 h-4" /> {user.city}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Other Cards (Personal Info, Social Links) */}
          <div className="lg:col-span-2 space-y-8">
            {isEditMode ? (
              <>
                <Card className="base-card">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="preferred_app_name">Display Name</Label>
                      <Input
                        id="preferred_app_name"
                        name="preferred_app_name"
                        value={editableUser.preferred_app_name || ""}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="The name others will see"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={editableUser.username || ""}
                        onChange={handleInputChange}
                        placeholder="@username"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="full_name" className="text-text-muted">Full Name (Private)</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={editableUser.full_name || ""}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Your legal name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={editableUser.phone || ""} onChange={handleInputChange} className="form-input" />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        name="timezone"
                        value={editableUser.timezone || ""}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    {user.user_type === "coach" && (
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          name="specialization"
                          value={editableUser.specialization || ""}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" name="bio" value={editableUser.bio || ""} onChange={handleInputChange} className="form-input" />
                    </div>

                    {/* Privacy Controls */}
                    <div className="border-t border-[var(--border-color)] pt-4 space-y-4">
                      <h3 className="font-medium text-text-primary">Privacy Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-text-muted" />
                            <Label htmlFor="share_contact_info">
                              Share contact information with {isCoach ? "clients" : "coach"}
                            </Label>
                          </div>
                          <Switch
                            id="share_contact_info"
                            checked={editableUser.share_contact_info || false}
                            onCheckedChange={(checked) => handleSwitchChange("share_contact_info", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-text-muted" />
                            <Label htmlFor="share_social_links">
                              Share social media links with {isCoach ? "clients" : "coach"}
                            </Label>
                          </div>
                          <Switch
                            id="share_social_links"
                            checked={editableUser.share_social_links || false}
                            onCheckedChange={(checked) => handleSwitchChange("share_social_links", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="base-card">
                  <CardHeader>
                    <CardTitle>Social & Links</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialFields.map(field => {
                      const Icon = field.icon;
                      return (
                        <div key={field.name}>
                          <Label htmlFor={field.name} className="flex items-center gap-2 mb-1 capitalize text-text-secondary">
                            <Icon className="w-4 h-4" />
                            {field.name.split('_')[0]}
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={editableUser[field.name] || ""}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className="form-input"
                          />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="base-card">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary">{user.bio || "No bio provided."}</p>
                    {user.user_type === "coach" && user.specialization && (
                      <div className="mt-4">
                        <h3 className="font-semibold text-text-primary">Specialization</h3>
                        <p className="text-text-secondary">{user.specialization}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {socialFields.some(field => user[field.name]) && (
                  <Card className="base-card">
                    <CardHeader>
                      <CardTitle>Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4">
                        {socialFields.filter(field => user[field.name]).map(field => {
                          const Icon = field.icon;
                          return (
                            <a key={field.name} href={user[field.name]} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="btn-secondary flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span className="capitalize">{field.name.split('_')[0]}</span>
                              </Button>
                            </a>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Editor Modal */}
      <Dialog open={isImageEditorOpen} onOpenChange={setIsImageEditorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            <DialogDescription>Pan and zoom to frame your picture perfectly.</DialogDescription>
          </DialogHeader>
          <div 
            className="w-full flex justify-center my-4 overflow-hidden rounded-full"
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseMove={onMouseMove}
          >
            <canvas 
              ref={canvasRef} 
              width="400" 
              height="400" 
              className="w-full aspect-square rounded-lg cursor-grab active:cursor-grabbing border-2 border-dashed border-gray-300"
              onMouseDown={onMouseDown}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zoom-slider">Zoom</Label>
            <Slider
              id="zoom-slider"
              min={0.5}
              max={3}
              step={0.01}
              value={[scale]}
              onValueChange={(value) => setScale(value[0])}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeImageEditor}>Cancel</Button>
            <Button onClick={handleImageSave} disabled={isSavingImage}>
              {isSavingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete your profile picture? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleImageDelete} disabled={isSavingImage}>
              {isSavingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
