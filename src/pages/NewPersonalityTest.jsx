
import React, { useState } from "react";
import { PersonalityTest } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Save,
  ArrowLeft,
  Brain
} from "lucide-react";
import { motion } from "framer-motion";

const testTypes = [
  { value: "mbti", label: "MBTI (Myers-Briggs)" },
  { value: "big_five", label: "Big Five Personality" },
  { value: "disc", label: "DISC Assessment" },
  { value: "clifton_strengths", label: "CliftonStrengths" },
  { value: "enneagram", label: "Enneagram" },
  { value: "hogan", label: "Hogan Assessment" },
  { value: "16pf", label: "16PF Questionnaire" },
  { value: "riasec", label: "RIASEC/Holland Code" },
  { value: "via_character", label: "VIA Character Strengths" },
  { value: "predictive_index", label: "Predictive Index" },
  { value: "core_drivers", label: "Core Drivers" },
  { value: "hbdi", label: "HBDI (Herrmann Brain Dominance)" },
  { value: "hexaco", label: "HEXACO" },
  { value: "mmpi", label: "MMPI" },
  { value: "birkman", label: "Birkman Method" },
  { value: "thomas_kilmann", label: "Thomas-Kilmann Conflict Mode" },
  { value: "sdi", label: "Strength Deployment Inventory" },
  { value: "eysenck", label: "Eysenck Personality" },
  { value: "belbin", label: "Belbin Team Roles" },
  { value: "keirsey", label: "Keirsey Temperament" },
  { value: "socionics", label: "Socionics" },
  { value: "mbti_variant", label: "MBTI Variant" },
  { value: "neo_ffi", label: "NEO-FFI" },
  { value: "holland_career", label: "Holland Career Assessment" },
  { value: "work_style", label: "Work Style Assessment" },
  { value: "working_genius", label: "Working Genius" }
];

// Dynamic form templates based on test type - EXPANDED WITH ALL OPTIONS
const getFormTemplate = (testType) => {
  switch (testType) {
    case "mbti":
      return {
        fields: [
          { name: "type", label: "MBTI Type", type: "select", options: ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"], required: true },
          { name: "description", label: "Description", type: "textarea", placeholder: "Brief description of your type..." },
          { name: "dominant_function", label: "Dominant Function", type: "select", options: ["Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe"] },
          { name: "auxiliary_function", label: "Auxiliary Function", type: "select", options: ["Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe"] }
        ]
      };
    case "big_five":
      return {
        fields: [
          { name: "openness", label: "Openness", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "conscientiousness", label: "Conscientiousness", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "extraversion", label: "Extraversion", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "agreeableness", label: "Agreeableness", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "neuroticism", label: "Neuroticism", type: "number", min: 0, max: 100, placeholder: "0-100", required: true }
        ]
      };
    case "disc":
      return {
        fields: [
          { name: "primary_style", label: "Primary Style", type: "select", options: ["Dominance", "Influence", "Steadiness", "Conscientiousness"], required: true },
          { name: "secondary_style", label: "Secondary Style", type: "select", options: ["Dominance", "Influence", "Steadiness", "Conscientiousness"] },
          { name: "d_score", label: "D Score", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "i_score", label: "I Score", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "s_score", label: "S Score", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "c_score", label: "C Score", type: "number", min: 0, max: 100, placeholder: "0-100" }
        ]
      };
    case "enneagram":
      return {
        fields: [
          { name: "type", label: "Enneagram Type", type: "select", options: ["1 - The Perfectionist", "2 - The Helper", "3 - The Achiever", "4 - The Individualist", "5 - The Investigator", "6 - The Loyalist", "7 - The Enthusiast", "8 - The Challenger", "9 - The Peacemaker"], required: true },
          { name: "wing", label: "Wing", type: "select", options: ["1w9", "1w2", "2w1", "2w3", "3w2", "3w4", "4w3", "4w5", "5w4", "5w6", "6w5", "6w7", "7w6", "7w8", "8w7", "8w9", "9w8", "9w1"] },
          { name: "instinct", label: "Instinctual Variant", type: "select", options: ["sp/so (Self-Preservation/Social)", "sp/sx (Self-Preservation/Sexual)", "so/sp (Social/Self-Preservation)", "so/sx (Social/Sexual)", "sx/sp (Sexual/Self-Preservation)", "sx/so (Sexual/Social)"] },
          { name: "description", label: "Type Description", type: "textarea", placeholder: "Describe your type characteristics..." }
        ]
      };
    case "clifton_strengths":
      return {
        fields: [
          { name: "strength_1", label: "#1 Strength", type: "select", options: [
            "Achiever", "Activator", "Adaptability", "Analytical", "Arranger", "Belief", "Command", "Communication",
            "Competition", "Connectedness", "Consistency", "Context", "Deliberative", "Developer", "Discipline",
            "Empathy", "Focus", "Futuristic", "Harmony", "Ideation", "Includer", "Individualization", "Input",
            "Intellection", "Learner", "Maximizer", "Positivity", "Relator", "Responsibility", "Restorative",
            "Self-Assurance", "Significance", "Strategic", "Woo"
          ], required: true },
          { name: "strength_2", label: "#2 Strength", type: "select", options: [
            "Achiever", "Activator", "Adaptability", "Analytical", "Arranger", "Belief", "Command", "Communication",
            "Competition", "Connectedness", "Consistency", "Context", "Deliberative", "Developer", "Discipline",
            "Empathy", "Focus", "Futuristic", "Harmony", "Ideation", "Includer", "Individualization", "Input",
            "Intellection", "Learner", "Maximizer", "Positivity", "Relator", "Responsibility", "Restorative",
            "Self-Assurance", "Significance", "Strategic", "Woo"
          ], required: true },
          { name: "strength_3", label: "#3 Strength", type: "select", options: [
            "Achiever", "Activator", "Adaptability", "Analytical", "Arranger", "Belief", "Command", "Communication",
            "Competition", "Connectedness", "Consistency", "Context", "Deliberative", "Developer", "Discipline",
            "Empathy", "Focus", "Futuristic", "Harmony", "Ideation", "Includer", "Individualization", "Input",
            "Intellection", "Learner", "Maximizer", "Positivity", "Relator", "Responsibility", "Restorative",
            "Self-Assurance", "Significance", "Strategic", "Woo"
          ], required: true },
          { name: "strength_4", label: "#4 Strength", type: "select", options: [
            "Achiever", "Activator", "Adaptability", "Analytical", "Arranger", "Belief", "Command", "Communication",
            "Competition", "Connectedness", "Consistency", "Context", "Deliberative", "Developer", "Discipline",
            "Empathy", "Focus", "Futuristic", "Harmony", "Ideation", "Includer", "Individualization", "Input",
            "Intellection", "Learner", "Maximizer", "Positivity", "Relator", "Responsibility", "Restorative",
            "Self-Assurance", "Significance", "Strategic", "Woo"
          ], required: true },
          { name: "strength_5", label: "#5 Strength", type: "select", options: [
            "Achiever", "Activator", "Adaptability", "Analytical", "Arranger", "Belief", "Command", "Communication",
            "Competition", "Connectedness", "Consistency", "Context", "Deliberative", "Developer", "Discipline",
            "Empathy", "Focus", "Futuristic", "Harmony", "Ideation", "Includer", "Individualization", "Input",
            "Intellection", "Learner", "Maximizer", "Positivity", "Relator", "Responsibility", "Restorative",
            "Self-Assurance", "Significance", "Strategic", "Woo"
          ], required: true }
        ]
      };
    case "hogan":
      return {
        fields: [
          { name: "adjustment", label: "Adjustment", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "ambition", label: "Ambition", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "sociability", label: "Sociability", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "interpersonal_sensitivity", label: "Interpersonal Sensitivity", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "prudence", label: "Prudence", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "inquisitive", label: "Inquisitive", type: "number", min: 0, max: 100, placeholder: "0-100" },
          { name: "learning_approach", label: "Learning Approach", type: "number", min: 0, max: 100, placeholder: "0-100" }
        ]
      };
    case "16pf":
      return {
        fields: [
          { name: "warmth", label: "Warmth (A)", type: "number", min: 1, max: 10, placeholder: "1-10" },
          { name: "reasoning", label: "Reasoning (B)", type: "number", min: 1, max: 10, placeholder: "1-10" },
          { name: "emotional_stability", label: "Emotional Stability (C)", type: "number", min: 1, max: 10, placeholder: "1-10" },
          { name: "dominance", label: "Dominance (E)", type: "number", min: 1, max: 10, placeholder: "1-10" },
          { name: "liveliness", label: "Liveliness (F)", type: "number", min: 1, max: 10, placeholder: "1-10" },
          { name: "rule_consciousness", label: "Rule-Consciousness (G)", type: "number", min: 1, max: 10, placeholder: "1-10" }
        ]
      };
    case "riasec":
      return {
        fields: [
          { name: "realistic", label: "Realistic", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "investigative", label: "Investigative", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "artistic", label: "Artistic", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "social", label: "Social", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "enterprising", label: "Enterprising", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "conventional", label: "Conventional", type: "number", min: 0, max: 100, placeholder: "0-100", required: true },
          { name: "top_three", label: "Top 3 Areas", type: "textarea", placeholder: "List your top 3 areas in order..." }
        ]
      };
    case "via_character":
      return {
        fields: [
          { name: "top_strength", label: "Top Character Strength", type: "select", options: [
            "Creativity", "Curiosity", "Judgment", "Love of Learning", "Perspective", "Bravery", "Perseverance", 
            "Honesty", "Zest", "Love", "Kindness", "Social Intelligence", "Teamwork", "Fairness", "Leadership", 
            "Forgiveness", "Humility", "Prudence", "Self-Regulation", "Appreciation of Beauty", "Gratitude", 
            "Hope", "Humor", "Spirituality"
          ], required: true },
          { name: "strength_2", label: "2nd Strength", type: "select", options: [
            "Creativity", "Curiosity", "Judgment", "Love of Learning", "Perspective", "Bravery", "Perseverance", 
            "Honesty", "Zest", "Love", "Kindness", "Social Intelligence", "Teamwork", "Fairness", "Leadership", 
            "Forgiveness", "Humility", "Prudence", "Self-Regulation", "Appreciation of Beauty", "Gratitude", 
            "Hope", "Humor", "Spirituality"
          ] },
          { name: "strength_3", label: "3rd Strength", type: "select", options: [
            "Creativity", "Curiosity", "Judgment", "Love of Learning", "Perspective", "Bravery", "Perseverance", 
            "Honesty", "Zest", "Love", "Kindness", "Social Intelligence", "Teamwork", "Fairness", "Leadership", 
            "Forgiveness", "Humility", "Prudence", "Self-Regulation", "Appreciation of Beauty", "Gratitude", 
            "Hope", "Humor", "Spirituality"
          ] }
        ]
      };
    case "predictive_index":
      return {
        fields: [
          { name: "dominance", label: "Dominance", type: "select", options: ["Very Low", "Low", "Moderate", "High", "Very High"], required: true },
          { name: "extraversion", label: "Extraversion", type: "select", options: ["Very Low", "Low", "Moderate", "High", "Very High"], required: true },
          { name: "patience", label: "Patience", type: "select", options: ["Very Low", "Low", "Moderate", "High", "Very High"], required: true },
          { name: "formality", label: "Formality", type: "select", options: ["Very Low", "Low", "Moderate", "High", "Very High"], required: true },
          { name: "behavioral_pattern", label: "Behavioral Pattern", type: "select", options: ["Analyzer", "Controller", "Maverick", "Specialist", "Strategist", "Venturer", "Altruist", "Captain", "Collaborator", "Maverick", "Operator", "Persuader", "Promoter", "Scholar"] }
        ]
      };
    case "core_drivers":
      return {
        fields: [
          { name: "driver_1", label: "Primary Driver", type: "select", options: ["Achievement", "Recognition", "Power", "Affiliation", "Autonomy", "Security", "Stimulation"], required: true },
          { name: "driver_2", label: "Secondary Driver", type: "select", options: ["Achievement", "Recognition", "Power", "Affiliation", "Autonomy", "Security", "Stimulation"] },
          { name: "driver_3", label: "Tertiary Driver", type: "select", options: ["Achievement", "Recognition", "Power", "Affiliation", "Autonomy", "Security", "Stimulation"] },
          { name: "description", label: "Driver Description", type: "textarea", placeholder: "Describe how these drivers manifest in your life..." }
        ]
      };
    case "hbdi":
      return {
        fields: [
          { name: "analytical", label: "Analytical (A)", type: "number", min: 0, max: 150, placeholder: "0-150", required: true },
          { name: "practical", label: "Practical (B)", type: "number", min: 0, max: 150, placeholder: "0-150", required: true },
          { name: "relational", label: "Relational (C)", type: "number", min: 0, max: 150, placeholder: "0-150", required: true },
          { name: "experimental", label: "Experimental (D)", type: "number", min: 0, max: 150, placeholder: "0-150", required: true },
          { name: "primary_quadrant", label: "Primary Thinking Style", type: "select", options: ["A - Analytical", "B - Practical", "C - Relational", "D - Experimental"] }
        ]
      };
    case "hexaco":
      return {
        fields: [
          { name: "honesty_humility", label: "Honesty-Humility", type: "number", min: 1, max: 5, placeholder: "1-5 scale", required: true },
          { name: "emotionality", label: "Emotionality", type: "number", min: 1, max: 5, placeholder: "1-5 scale", required: true },
          { name: "extraversion", label: "eXtraversion", type: "number", min: 1, max: 5, placeholder: "1-5 scale", required: true },
          { name: "agreeableness", label: "Agreeableness", type: "number", min: 1, max: 5, placeholder: "1-5 scale", required: true },
          { name: "conscientiousness", label: "Conscientiousness", type: "number", min: 1, max: 5, placeholder: "1-5 scale", required: true },
          { name: "openness", label: "Openness to Experience", type: "number", min: 1, max: 5, placeholder: "1-5 scale", required: true }
        ]
      };
    case "belbin":
      return {
        fields: [
          { name: "primary_role", label: "Primary Team Role", type: "select", options: ["Plant", "Resource Investigator", "Coordinator", "Shaper", "Monitor Evaluator", "Teamworker", "Implementer", "Completer Finisher", "Specialist"], required: true },
          { name: "secondary_role", label: "Secondary Role", type: "select", options: ["Plant", "Resource Investigator", "Coordinator", "Shaper", "Monitor Evaluator", "Teamworker", "Implementer", "Completer Finisher", "Specialist"] },
          { name: "manageable_weakness", label: "Manageable Weakness", type: "textarea", placeholder: "Describe your manageable weaknesses..." }
        ]
      };
    case "working_genius":
      return {
        fields: [
          { name: "genius_1", label: "First Genius", type: "select", options: ["Wonder", "Invention", "Discernement", "Galvanizing", "Enablement", "Tenacity"], required: true },
          { name: "genius_2", label: "Second Genius", type: "select", options: ["Wonder", "Invention", "Discernement", "Galvanizing", "Enablement", "Tenacity"], required: true },
          { name: "competency_1", label: "First Competency", type: "select", options: ["Wonder", "Invention", "Discernement", "Galvanizing", "Enablement", "Tenacity"] },
          { name: "competency_2", label: "Second Competency", type: "select", options: ["Wonder", "Invention", "Discernement", "Galvanizing", "Enablement", "Tenacity"] },
          { name: "frustration_1", label: "First Frustration", type: "select", options: ["Wonder", "Invention", "Discernement", "Galvanizing", "Enablement", "Tenacity"] },
          { name: "frustration_2", label: "Second Frustration", type: "select", options: ["Wonder", "Invention", "Discernement", "Galvanizing", "Enablement", "Tenacity"] }
        ]
      };
    default:
      return null;
  }
};

export default function NewPersonalityTest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    test_type: "",
    test_name: "",
    results: "",
    date_taken: "",
    notes: "",
    is_primary: false
  });
  const [dynamicResults, setDynamicResults] = useState({});
  const [useStructuredForm, setUseStructuredForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset dynamic form when test type changes
    if (field === "test_type") {
      setDynamicResults({});
      setUseStructuredForm(false); // Reset structured form preference
    }
  };

  const handleDynamicFieldChange = (fieldName, value) => {
    setDynamicResults(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const currentTemplate = formData.test_type ? getFormTemplate(formData.test_type) : null;

  const isDynamicFormValid = () => {
    if (!currentTemplate) return false;
    return currentTemplate.fields.every(field => {
      if (field.required) {
        const value = dynamicResults[field.name];
        if (field.type === 'number') {
          // Check if value is a number and within min/max if specified
          const numValue = parseFloat(value);
          if (isNaN(numValue)) return false;
          if (field.min !== undefined && numValue < field.min) return false;
          if (field.max !== undefined && numValue > field.max) return false;
          return true;
        }
        return value !== null && value !== undefined && String(value).trim() !== '';
      }
      return true;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.test_type || !formData.test_name) {
      alert("Please fill in test type and name.");
      return;
    }

    let finalResults;
    if (useStructuredForm && currentTemplate) {
      // Validate structured form fields
      if (!isDynamicFormValid()) {
        const missingFields = currentTemplate.fields.filter(field => 
          field.required && 
          (dynamicResults[field.name] === null || 
           dynamicResults[field.name] === undefined || 
           String(dynamicResults[field.name]).trim() === '' ||
           (field.type === 'number' && isNaN(parseFloat(dynamicResults[field.name])))
          )
        );
        alert(`Please fill in all required fields for the structured form: ${missingFields.map(f => f.label).join(", ")}`);
        return;
      }
      finalResults = dynamicResults;
    } else if (formData.results) {
      // Parse manual results as JSON if possible
      try {
        finalResults = JSON.parse(formData.results);
      } catch (error) {
        // If it's not valid JSON, treat as plain text
        finalResults = { result: formData.results };
      }
    } else {
      alert("Please fill in test results, either manually or using the structured form.");
      return;
    }

    setIsSubmitting(true);
    try {
      const testData = {
        test_type: formData.test_type,
        test_name: formData.test_name.trim(),
        results: finalResults,
        date_taken: formData.date_taken || new Date().toISOString().split('T')[0],
        notes: formData.notes.trim() || undefined,
        is_primary: formData.is_primary
      };

      await PersonalityTest.create(testData);
      navigate(createPageUrl("PersonalityTests"));
    } catch (error) {
      console.error("Error creating personality test:", error);
      alert("There was an error saving your test results. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDynamicField = (field) => {
    const value = dynamicResults[field.name] !== undefined ? dynamicResults[field.name] : "";
    
    switch (field.type) {
      case "select":
        return (
          <Select 
            value={String(value)} 
            onValueChange={(val) => handleDynamicFieldChange(field.name, val)}
          >
            <SelectTrigger className="border-stone-200 focus:border-purple-300">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "number":
        return (
          <Input
            type="number"
            min={field.min}
            max={field.max}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
            className="border-stone-200 focus:border-purple-300"
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
            className="border-stone-200 focus:border-purple-300 min-h-[80px]"
          />
        );
      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
            className="border-stone-200 focus:border-purple-300"
          />
        );
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("PersonalityTests"))}
            className="border-stone-200 hover:bg-stone-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Add Personality Test Result</h1>
            <p className="text-stone-600 mt-1">Record the results of your personality assessment</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Test Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Test Type */}
                <div className="space-y-2">
                  <Label htmlFor="test_type" className="text-stone-700 font-medium">Test Type *</Label>
                  <Select value={formData.test_type} onValueChange={(value) => handleInputChange("test_type", value)}>
                    <SelectTrigger className="border-stone-200 focus:border-purple-300 focus:ring-purple-200">
                      <SelectValue placeholder="Select the type of personality test" />
                    </SelectTrigger>
                    <SelectContent>
                      {testTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Test Name */}
                <div className="space-y-2">
                  <Label htmlFor="test_name" className="text-stone-700 font-medium">Test Name *</Label>
                  <Input
                    id="test_name"
                    placeholder="e.g., Official MBTI Assessment, 16Personalities Test"
                    value={formData.test_name}
                    onChange={(e) => handleInputChange("test_name", e.target.value)}
                    className="border-stone-200 focus:border-purple-300 focus:ring-purple-200"
                    required
                  />
                </div>

                {/* Dynamic Form Toggle */}
                {currentTemplate && (
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="use_structured_form"
                        checked={useStructuredForm}
                        onCheckedChange={setUseStructuredForm}
                      />
                      <Label htmlFor="use_structured_form" className="text-purple-800 font-medium">
                        Use structured form for {testTypes.find(t => t.value === formData.test_type)?.label}
                      </Label>
                    </div>
                    <p className="text-purple-700 text-sm">
                      We can provide a structured form specifically designed for this test type, or you can enter results manually below.
                    </p>
                  </div>
                )}

                {/* Structured Form Fields */}
                {useStructuredForm && currentTemplate && (
                  <div className="space-y-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <h3 className="font-medium text-stone-800 mb-4">
                      {testTypes.find(t => t.value === formData.test_type)?.label} Results
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentTemplate.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name} className="text-stone-700 font-medium">
                            {field.label} {field.required && "*"}
                          </Label>
                          {renderDynamicField(field)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual Results Input */}
                {!useStructuredForm && (
                  <div className="space-y-2">
                    <Label htmlFor="results" className="text-stone-700 font-medium">Results *</Label>
                    <Textarea
                      id="results"
                      placeholder='Enter your test results. You can use JSON format like {"type": "ENFP", "description": "..."} or plain text'
                      value={formData.results}
                      onChange={(e) => handleInputChange("results", e.target.value)}
                      className="min-h-[150px] border-stone-200 focus:border-purple-300 focus:ring-purple-200"
                    />
                    <p className="text-xs text-stone-500">
                      You can enter results as JSON for structured data or as plain text
                    </p>
                  </div>
                )}

                {/* Date Taken */}
                <div className="space-y-2">
                  <Label htmlFor="date_taken" className="text-stone-700 font-medium">Date Taken</Label>
                  <Input
                    id="date_taken"
                    type="date"
                    value={formData.date_taken}
                    onChange={(e) => handleInputChange("date_taken", e.target.value)}
                    className="border-stone-200 focus:border-purple-300 focus:ring-purple-200"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-stone-700 font-medium">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about this test or your thoughts on the results..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="min-h-[100px] border-stone-200 focus:border-purple-300 focus:ring-purple-200"
                  />
                </div>

                {/* Primary Result */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_primary"
                    checked={formData.is_primary}
                    onCheckedChange={(checked) => handleInputChange("is_primary", checked)}
                  />
                  <Label htmlFor="is_primary" className="text-stone-700">
                    Mark as primary result for this test type
                  </Label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-stone-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(createPageUrl("PersonalityTests"))}
                    disabled={isSubmitting}
                    className="border-stone-200 hover:bg-stone-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !formData.test_type || 
                      !formData.test_name || 
                      (useStructuredForm ? !currentTemplate || !isDynamicFormValid() : !formData.results) || 
                      isSubmitting
                    }
                    className="compass-gradient-bg text-white hover:opacity-90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Test Result"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
