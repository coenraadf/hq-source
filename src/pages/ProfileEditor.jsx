import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save, User as UserIcon, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProfileEditor() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        preferred_app_name: '',
        username: '',
        bio: '',
        specialization: '',
        phone: '',
        city: '',
        company: '',
        website_url: '',
        linkedin_url: '',
        facebook_url: '',
        instagram_url: '',
        tiktok_url: '',
        other_url: '',
        profile_photo_url: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await User.me();
                setUser(userData);
                setFormData({
                    preferred_app_name: userData.preferred_app_name || userData.full_name || '',
                    username: userData.username || '',
                    bio: userData.bio || '',
                    specialization: userData.specialization || '',
                    phone: userData.phone || '',
                    city: userData.city || '',
                    company: userData.company || '',
                    website_url: userData.website_url || '',
                    linkedin_url: userData.linkedin_url || '',
                    facebook_url: userData.facebook_url || '',
                    instagram_url: userData.instagram_url || '',
                    tiktok_url: userData.tiktok_url || '',
                    other_url: userData.other_url || '',
                    profile_photo_url: userData.profile_photo_url || '',
                });
                setPreviewImage(userData.profile_photo_url);
            } catch (error) {
                console.error("Failed to load user data:", error);
                navigate(createPageUrl('CoreCompassHome'));
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let updatedData = { ...formData };

            if (imageFile) {
                const { file_url } = await UploadFile({ file: imageFile });
                updatedData.profile_photo_url = file_url;
            }
            
            // Filter out any empty fields so we don't overwrite existing data with empty strings
            Object.keys(updatedData).forEach(key => {
                if (updatedData[key] === null || updatedData[key] === undefined) {
                    delete updatedData[key];
                }
            });

            await User.updateMyUserData(updatedData);
            navigate(createPageUrl('Profile'));
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("An error occurred while saving your profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const getUserDisplayName = (user) => {
        return user?.preferred_app_name || user?.full_name || 'User';
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-secondary)]">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSave}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-h1 flex items-center gap-3">
                                <UserIcon className="w-8 h-8 text-[var(--brand-primary)]" />
                                Edit Profile
                            </h1>
                            <p className="text-body-large text-text-secondary">Update your personal information and preferences.</p>
                        </div>
                        <Button type="submit" disabled={isSaving} className="mt-4 md:mt-0 btn-primary w-full md:w-auto">
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <Card className="base-card">
                                <CardHeader className="items-center text-center">
                                    <div className="relative w-32 h-32">
                                        <Avatar className="w-32 h-32 text-4xl">
                                            <AvatarImage src={previewImage} />
                                            <AvatarFallback className="brand-gradient text-white">
                                                {getUserDisplayName(user).charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <label htmlFor="profile_photo_upload" className="absolute bottom-1 right-1 bg-white rounded-full p-2 cursor-pointer border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                                            <Camera className="w-5 h-5 text-[var(--brand-primary)]" />
                                            <input id="profile_photo_upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    </div>
                                    <CardTitle className="pt-4">{getUserDisplayName(user)}</CardTitle>
                                    <CardDescription>{user?.email}</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="base-card">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label htmlFor="preferred_app_name" className="text-sm font-medium">Display Name</label>
                                            <Input id="preferred_app_name" name="preferred_app_name" value={formData.preferred_app_name} onChange={handleInputChange} className="form-input"/>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="username" className="text-sm font-medium">Username</label>
                                            <Input id="username" name="username" value={formData.username} onChange={handleInputChange} className="form-input" placeholder="@your-username"/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                                            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="(123) 456-7890"/>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="city" className="text-sm font-medium">City</label>
                                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className="form-input" placeholder="San Francisco, CA"/>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                            <label htmlFor="company" className="text-sm font-medium">Company</label>
                                            <Input id="company" name="company" value={formData.company} onChange={handleInputChange} className="form-input" placeholder="Your Company Inc."/>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="base-card">
                                <CardHeader>
                                    <CardTitle>Professional Details</CardTitle>
                                    <CardDescription>This information is visible to your clients/coach.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {user?.user_type === 'coach' && (
                                        <div className="space-y-1">
                                            <label htmlFor="specialization" className="text-sm font-medium">Specialization</label>
                                            <Input id="specialization" name="specialization" value={formData.specialization} onChange={handleInputChange} className="form-input" placeholder="e.g., Executive Coaching, Career Transition"/>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} className="form-input min-h-[120px]" placeholder="Tell us a bit about yourself..."/>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="base-card">
                                <CardHeader>
                                    <CardTitle>Social & Website Links</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label htmlFor="website_url" className="text-sm font-medium">Website</label>
                                            <Input id="website_url" name="website_url" type="url" value={formData.website_url} onChange={handleInputChange} className="form-input" placeholder="https://"/>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="linkedin_url" className="text-sm font-medium">LinkedIn</label>
                                            <Input id="linkedin_url" name="linkedin_url" type="url" value={formData.linkedin_url} onChange={handleInputChange} className="form-input" placeholder="https://linkedin.com/in/..."/>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="facebook_url" className="text-sm font-medium">Facebook</label>
                                            <Input id="facebook_url" name="facebook_url" type="url" value={formData.facebook_url} onChange={handleInputChange} className="form-input" placeholder="https://facebook.com/..."/>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="instagram_url" className="text-sm font-medium">Instagram</label>
                                            <Input id="instagram_url" name="instagram_url" type="url" value={formData.instagram_url} onChange={handleInputChange} className="form-input" placeholder="https://instagram.com/..."/>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="tiktok_url" className="text-sm font-medium">TikTok</label>
                                            <Input id="tiktok_url" name="tiktok_url" type="url" value={formData.tiktok_url} onChange={handleInputChange} className="form-input" placeholder="https://tiktok.com/@..."/>
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="other_url" className="text-sm font-medium">Other</label>
                                            <Input id="other_url" name="other_url" type="url" value={formData.other_url} onChange={handleInputChange} className="form-input" placeholder="https://"/>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}