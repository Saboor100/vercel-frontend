import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuth } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import { ResumeData } from "@/types/documents";
import { formatDate } from "@/utils/format";

// Enhanced country formatting configurations with requirements
const countryFormats = {
  US: {
    name: "United States",
    phoneFormat: "(###) ###-####",
    phonePattern: /^\(\d{3}\) \d{3}-\d{4}$/,
    dateFormat: "MM/DD/YYYY",
    addressFormat: "City, State ZIP",
    locale: "en-US",
    currency: "USD",
    phoneExample: "(555) 123-4567",
    addressExample: "New York, NY 10001",
    requiresPhoto: false,
    photoRecommended: false,
    mandatoryFields: ["name", "email", "phone", "location"],
    skillsCategories: [
      "Technical Skills",
      "Soft Skills",
      "Languages",
      "Certifications",
    ],
    customSectionSuggestions: ["Volunteer Work", "Publications", "Awards"],
    summaryStyle: "brief", // brief, detailed, bullet
    experienceFormat: "standard", // standard, detailed, compact
  },
  UK: {
    name: "United Kingdom",
    phoneFormat: "+44 #### ######",
    phonePattern: /^\+44 \d{4} \d{6}$/,
    dateFormat: "DD/MM/YYYY",
    addressFormat: "City, County, Postcode",
    locale: "en-GB",
    currency: "GBP",
    phoneExample: "+44 1234 567890",
    addressExample: "London, Greater London, SW1A 1AA",
    requiresPhoto: false,
    photoRecommended: false,
    mandatoryFields: ["name", "email", "phone", "location"],
    skillsCategories: [
      "Technical Skills",
      "Soft Skills",
      "Languages",
      "Qualifications",
    ],
    customSectionSuggestions: [
      "Voluntary Work",
      "Publications",
      "Professional Memberships",
    ],
    summaryStyle: "detailed",
    experienceFormat: "detailed",
  },
  CA: {
    name: "Canada",
    phoneFormat: "(###) ###-####",
    phonePattern: /^\(\d{3}\) \d{3}-\d{4}$/,
    dateFormat: "DD/MM/YYYY",
    addressFormat: "City, Province, Postal Code",
    locale: "en-CA",
    currency: "CAD",
    phoneExample: "(416) 555-0123",
    addressExample: "Toronto, ON M5V 3A8",
    requiresPhoto: false,
    photoRecommended: false,
    mandatoryFields: ["name", "email", "phone", "location"],
    skillsCategories: [
      "Technical Skills",
      "Soft Skills",
      "Languages",
      "Certifications",
    ],
    customSectionSuggestions: [
      "Volunteer Experience",
      "Publications",
      "Professional Development",
    ],
    summaryStyle: "brief",
    experienceFormat: "standard",
  },
  AU: {
    name: "Australia",
    phoneFormat: "+61 # #### ####",
    phonePattern: /^\+61 \d \d{4} \d{4}$/,
    dateFormat: "DD/MM/YYYY",
    addressFormat: "City, State Postcode",
    locale: "en-AU",
    currency: "AUD",
    phoneExample: "+61 2 1234 5678",
    addressExample: "Sydney, NSW 2000",
    requiresPhoto: false,
    photoRecommended: false,
    mandatoryFields: ["name", "email", "phone", "location"],
    skillsCategories: [
      "Technical Skills",
      "Soft Skills",
      "Languages",
      "Qualifications",
    ],
    customSectionSuggestions: [
      "Volunteer Work",
      "Publications",
      "Professional Memberships",
    ],
    summaryStyle: "brief",
    experienceFormat: "standard",
  },
  DE: {
    name: "Germany",
    phoneFormat: "+49 ### #######",
    phonePattern: /^\+49 \d{3} \d{7}$/,
    dateFormat: "DD.MM.YYYY",
    addressFormat: "Street, PLZ City",
    locale: "de-DE",
    currency: "EUR",
    phoneExample: "+49 123 4567890",
    addressExample: "Musterstraße 1, 10115 Berlin",
    requiresPhoto: true,
    photoRecommended: true,
    mandatoryFields: ["name", "email", "phone", "location", "photo"],
    skillsCategories: [
      "Fachkenntnisse",
      "Soft Skills",
      "Sprachen",
      "Zertifikate",
    ],
    customSectionSuggestions: [
      "Ehrenamtliche Tätigkeit",
      "Veröffentlichungen",
      "Weiterbildungen",
    ],
    summaryStyle: "detailed",
    experienceFormat: "detailed",
  },
  FR: {
    name: "France",
    phoneFormat: "+33 # ## ## ## ##",
    phonePattern: /^\+33 \d \d{2} \d{2} \d{2} \d{2}$/,
    dateFormat: "DD/MM/YYYY",
    addressFormat: "Street, Postal Code City",
    locale: "fr-FR",
    currency: "EUR",
    phoneExample: "+33 1 23 45 67 89",
    addressExample: "123 Rue de la Paix, 75001 Paris",
    requiresPhoto: true,
    photoRecommended: true,
    mandatoryFields: ["name", "email", "phone", "location", "photo"],
    skillsCategories: [
      "Compétences Techniques",
      "Compétences Relationnelles",
      "Langues",
      "Certifications",
    ],
    customSectionSuggestions: [
      "Bénévolat",
      "Publications",
      "Formations Complémentaires",
    ],
    summaryStyle: "detailed",
    experienceFormat: "detailed",
  },
  IN: {
    name: "India",
    phoneFormat: "+91 ##### #####",
    phonePattern: /^\+91 \d{5} \d{5}$/,
    dateFormat: "DD/MM/YYYY",
    addressFormat: "City, State PIN",
    locale: "en-IN",
    currency: "INR",
    phoneExample: "+91 98765 43210",
    addressExample: "Mumbai, Maharashtra 400001",
    requiresPhoto: true,
    photoRecommended: true,
    mandatoryFields: ["name", "email", "phone", "location", "photo"],
    skillsCategories: [
      "Technical Skills",
      "Soft Skills",
      "Languages",
      "Certifications",
    ],
    customSectionSuggestions: [
      "Extra-curricular Activities",
      "Publications",
      "Professional Training",
    ],
    summaryStyle: "detailed",
    experienceFormat: "detailed",
  },
  JP: {
    name: "Japan",
    phoneFormat: "+81 ## #### ####",
    phonePattern: /^\+81 \d{2} \d{4} \d{4}$/,
    dateFormat: "YYYY/MM/DD",
    addressFormat: "City, Prefecture Postal Code",
    locale: "ja-JP",
    currency: "JPY",
    phoneExample: "+81 90 1234 5678",
    addressExample: "Tokyo, Tokyo 100-0001",
    requiresPhoto: true,
    photoRecommended: true,
    mandatoryFields: ["name", "email", "phone", "location", "photo"],
    skillsCategories: ["技術スキル", "ソフトスキル", "言語", "資格"],
    customSectionSuggestions: ["課外活動", "出版物", "研修歴"],
    summaryStyle: "detailed",
    experienceFormat: "compact",
  },
};

const initialEducation = {
  institution: "",
  degree: "",
  date: "",
  description: "",
};
const initialExperience = {
  company: "",
  position: "",
  date: "",
  description: "",
};
const initialSkills = { category: "Technical Skills", skills: "" };
const initialProject = {
  name: "",
  description: "",
  link: "",
  technologies: "",
  date: "",
};
const initialCertification = { title: "", name: "", date: "" };
interface Certification {
  title: string;
  name: string;
  date: string;
}

interface CustomSection {
  title: string;
  content: string;
}

const initialCustomSection: CustomSection = {
  title: "",
  content: "",
};

const initialResumeData: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    photo: "",
  },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  customSections: [],
};

const ResumeForm = ({
  setResumeData,
  resumeData,
}: {
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
  resumeData: ResumeData;
}) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("US");

  const [errors, setErrors] = useState<{
    email?: boolean;
    phone?: boolean;
    photo?: boolean;
  }>({});

  // Get current country format
  const currentFormat =
    countryFormats[selectedCountry as keyof typeof countryFormats];

  // Email regex remains universal
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Initialize formData with proper fallbacks for all array fields
  const [formData, setFormData] = useState<ResumeData>({
    ...initialResumeData,
    ...resumeData,
    education: resumeData.education || [],
    experience: resumeData.experience || [],
    skills: resumeData.skills || [],
    projects: resumeData.projects || [],
    certifications: resumeData.certifications || [],
    customSections: resumeData.customSections || [],
  });

  // Keep formData in sync with new resumeData props (such as after AI enhancement)
  useEffect(() => {
    setFormData({
      ...initialResumeData,
      ...resumeData,
      education: resumeData.education || [],
      experience: resumeData.experience || [],
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      certifications: resumeData.certifications || [],
      customSections: resumeData.customSections || [],
    });
  }, [resumeData]);

  // Handle country change and update form accordingly
  useEffect(() => {
    const format =
      countryFormats[selectedCountry as keyof typeof countryFormats];

    // Update skills categories based on country
    if (formData.skills.length > 0) {
      const updatedSkills = formData.skills.map((skill, index) => ({
        ...skill,
        category: skill.category || format.skillsCategories[0],
      }));

      setFormData((prev) => ({
        ...prev,
        skills: updatedSkills,
      }));
    }

    // Clear photo if not required by new country
    if (
      !format.requiresPhoto &&
      !format.photoRecommended &&
      formData.personalInfo.photo
    ) {
      toast({
        title: "Photo Removed",
        description: `Photos are not typically used in ${format.name} resumes. Your photo has been removed.`,
        variant: "default",
      });

      const updated = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          photo: "",
        },
      };
      updateForm(updated); // This will update both local and parent state
    }

    // Show photo requirement message
    if (format.requiresPhoto && !formData.personalInfo.photo) {
      toast({
        title: "Photo Required",
        description: `A professional photo is required for ${format.name} resumes.`,
        variant: "default",
      });
    } else if (format.photoRecommended && !formData.personalInfo.photo) {
      toast({
        title: "Photo Recommended",
        description: `A professional photo is recommended for ${format.name} resumes.`,
        variant: "default",
      });
    }

    // Clear validation errors when country changes
    setErrors({});
  }, [selectedCountry]);

  // --- handlers: when the user edits, update both local and parent state ---
  const updateForm = (updated: ResumeData) => {
    setFormData(updated);
    setResumeData(updated);
  };

  // Format phone number based on country
  const formatPhoneNumber = (phone: string, countryCode: string): string => {
    const format = countryFormats[countryCode as keyof typeof countryFormats];
    if (!format) return phone;

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // Apply country-specific formatting
    switch (countryCode) {
      case "US":
      case "CA":
        if (digits.length === 10) {
          return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
            6
          )}`;
        }
        break;
      case "UK":
        if (digits.length === 11 && digits.startsWith("44")) {
          return `+44 ${digits.slice(2, 6)} ${digits.slice(6)}`;
        }
        break;
      case "AU":
        if (digits.length === 10) {
          return `+61 ${digits.slice(1, 2)} ${digits.slice(
            2,
            6
          )} ${digits.slice(6)}`;
        }
        break;
      case "DE":
        if (digits.length >= 10) {
          return `+49 ${digits.slice(2, 5)} ${digits.slice(5)}`;
        }
        break;
      case "FR":
        if (digits.length === 10) {
          return `+33 ${digits.slice(1, 2)} ${digits.slice(
            2,
            4
          )} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
        }
        break;
      case "IN":
        if (digits.length === 10) {
          return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
        }
        break;
      case "JP":
        if (digits.length === 11) {
          return `+81 ${digits.slice(1, 3)} ${digits.slice(
            3,
            7
          )} ${digits.slice(7)}`;
        }
        break;
    }
    return phone;
  };

  // Format date based on country
  const formatDateByCountry = (
    dateString: string,
    countryCode: string
  ): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const format = countryFormats[countryCode as keyof typeof countryFormats];

    if (!format) return dateString;

    return new Intl.DateTimeFormat(format.locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  // Check if field is mandatory for current country
  const isFieldMandatory = (fieldName: string): boolean => {
    return currentFormat.mandatoryFields.includes(fieldName);
  };

  // Get placeholder text based on country and summary style
  const getSummaryPlaceholder = (): string => {
    const baseText = "Write a professional summary...";

    switch (currentFormat.summaryStyle) {
      case "brief":
        return t("summary.brief");
      case "detailed":
        return t("summary.detailed");
      case "bullet":
        return t("summary.bullet");
      default:
        return baseText;
    }
  };

  const handleAutoGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      // Get Firebase auth token
      const user = getAuth().currentUser;
      const token = user ? await user.getIdToken() : null;
      if (!token) {
        toast({
          title: t("toasts.summaryError") || "Not logged in",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Debug: log the lang and payload being sent
      console.log("Sending AI enhance-summary payload:", {
        resumeData: formData,
        lang: i18n.language,
        country: selectedCountry,
      });

      const response = await fetch("/api/resume/enhance-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeData: formData,
          lang: i18n.language,
          country: selectedCountry,
          countryFormat: currentFormat,
        }),
      });
      const result = await response.json();
      if (result.success && result.data.summary) {
        updateForm({ ...formData, summary: result.data.summary });
        toast({
          title: t("toasts.summaryGenerated") || "Summary generated!",
          variant: "default",
        });
      } else {
        toast({
          title: t("toasts.summaryFailed") || "Failed to generate summary",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("toasts.summaryError") || "Error contacting AI",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const updated = {
          ...formData,
          personalInfo: {
            ...formData.personalInfo,
            photo: reader.result as string,
          },
        };
        updateForm(updated);
        // Clear photo error if it was set
        setErrors((prev) => ({ ...prev, photo: false }));
      };

      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    const updated = {
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        photo: "",
      },
    };
    updateForm(updated);

    // Show toast only if photo was recommended but not required
    if (currentFormat.photoRecommended && !currentFormat.requiresPhoto) {
      toast({
        title: "Photo Removed",
        description: `Your photo has been removed, though it was recommended for ${currentFormat.name} resumes.`,
        variant: "default",
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return currentFormat.phonePattern.test(phone);
  };

  const validatePhoto = (): boolean => {
    return !currentFormat.requiresPhoto || !!formData.personalInfo.photo;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      const isValid = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: !isValid }));
      if (value !== "" && !isValid) {
        toast({
          title: t("information.invalidEmailTitle"),
          description: t("information.invalidEmailDesc"),
          variant: "destructive",
        });
      }
    }

    if (name === "phone") {
      const isValid = validatePhone(value);
      setErrors((prev) => ({ ...prev, phone: !isValid }));
      if (value !== "" && !isValid) {
        toast({
          title: t("information.invalidPhoneTitle"),
          description: `Please enter phone in format: ${currentFormat.phoneExample}`,
          variant: "destructive",
        });
      }
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Auto-format phone number as user types
    if (name === "phone") {
      processedValue = formatPhoneNumber(value, selectedCountry);
    }

    const updated = {
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [name]: processedValue,
      },
    };
    updateForm(updated);
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = {
      ...formData,
      summary: e.target.value,
    };
    updateForm(updated);
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    type: "education" | "experience" | "skills" | "projects" | "certifications"
  ) => {
    const { name, value } = e.target;
    const updatedArray = [...(formData[type] || [])];
    updatedArray[index] = { ...updatedArray[index], [name]: value };

    const updated = {
      ...formData,
      [type]: updatedArray,
    };
    updateForm(updated);
  };

  const addItem = (
    type:
      | "education"
      | "experience"
      | "skills"
      | "projects"
      | "certifications"
      | "customSections"
  ) => {
    let newItem: any;
    if (type === "education") newItem = { ...initialEducation };
    else if (type === "experience") newItem = { ...initialExperience };
    else if (type === "projects") newItem = { ...initialProject };
    else if (type === "certifications") newItem = { ...initialCertification };
    else if (type === "customSections") newItem = { ...initialCustomSection };
    else
      newItem = {
        ...initialSkills,
        category: currentFormat.skillsCategories[0],
      };

    const updated = {
      ...formData,
      [type]: [...(formData[type] || []), newItem],
    };
    updateForm(updated);
  };

  const removeItem = (
    index: number,
    type:
      | "education"
      | "experience"
      | "skills"
      | "projects"
      | "certifications"
      | "customSections"
  ) => {
    const updatedArray = [...(formData[type] || [])];
    updatedArray.splice(index, 1);

    const updated = {
      ...formData,
      [type]: updatedArray,
    };
    updateForm(updated);
  };

  const handleCustomSectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof CustomSection
  ) => {
    const value = e.target.value;
    const updatedSections = [...(formData.customSections || [])];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };

    const updated = {
      ...formData,
      customSections: updatedSections,
    };
    updateForm(updated);
  };

  // ----------- LOCALIZED DATE HANDLERS -----------
  const handleEducationDateChange = (date: Date | undefined, index: number) => {
    if (!date) return;
    const isoDate = date.toISOString().split("T")[0];
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      date: isoDate,
    };
    const updated = {
      ...formData,
      education: updatedEducation,
    };
    updateForm(updated);
  };

  const handleProjectDateChange = (date: Date | undefined, index: number) => {
    if (!date) return;
    const isoDate = date.toISOString().split("T")[0];
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], date: isoDate };
    const updated = {
      ...formData,
      projects: updatedProjects,
    };
    updateForm(updated);
  };

  const handleExperienceStartDateChange = (
    date: Date | undefined,
    index: number
  ) => {
    if (!date) return;
    const updatedExperience = [...formData.experience];
    const currentDateParts = updatedExperience[index].date.split(" - ");
    const endDate =
      currentDateParts.length > 1 ? currentDateParts[1] : "Present";
    const startISO = date.toISOString().split("T")[0];
    updatedExperience[index] = {
      ...updatedExperience[index],
      date: `${startISO} - ${endDate}`,
    };
    const updated = {
      ...formData,
      experience: updatedExperience,
    };
    updateForm(updated);
  };

  const handleExperienceEndDateChange = (
    date: Date | undefined,
    index: number
  ) => {
    if (!date) return;
    const updatedExperience = [...formData.experience];
    const currentDateParts = updatedExperience[index].date.split(" - ");
    const startDate =
      currentDateParts.length > 0
        ? currentDateParts[0]
        : new Date().toISOString().split("T")[0];
    const endISO = date.toISOString().split("T")[0];
    updatedExperience[index] = {
      ...updatedExperience[index],
      date: `${startDate} - ${endISO}`,
    };
    const updated = {
      ...formData,
      experience: updatedExperience,
    };
    updateForm(updated);
  };

  const handleSetPresentDate = (index: number) => {
    const updatedExperience = [...formData.experience];
    const currentDateParts = updatedExperience[index].date.split(" - ");
    const startDate =
      currentDateParts.length > 0
        ? currentDateParts[0]
        : new Date().toISOString().split("T")[0];
    updatedExperience[index] = {
      ...updatedExperience[index],
      date: `${startDate} - Present`,
    };
    const updated = {
      ...formData,
      experience: updatedExperience,
    };
    updateForm(updated);
  };

  const handleGenerate = async () => {
    // Validate mandatory fields
    const missingFields = [];

    if (isFieldMandatory("name") && !formData.personalInfo.name) {
      missingFields.push("Name");
    }
    if (isFieldMandatory("email") && !formData.personalInfo.email) {
      missingFields.push("Email");
    }
    if (isFieldMandatory("phone") && !formData.personalInfo.phone) {
      missingFields.push("Phone");
    }
    if (isFieldMandatory("location") && !formData.personalInfo.location) {
      missingFields.push("Location");
    }
    if (isFieldMandatory("photo") && !formData.personalInfo.photo) {
      missingFields.push("Photo");
    }

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `${t("toasts.description")} ${
          currentFormat.name
        }: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      updateForm({
        ...formData,
        summary: formData.summary || t("card.defaultsummary"),
      });

      toast({
        title: t("toasts.resumeGenerated"),
        description: t("toasts.resumeCreated"),
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: t("toasts.generationFailed"),
        description: t("toasts.generationError"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Country Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("countrycard.title")}</CardTitle>
          <CardDescription>{t("countrycard.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country-select">{t("countrycard.select")}</Label>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]">
                  <SelectValue
                    placeholder={t("countrycard.selectplaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(countryFormats).map(([code, format]) => (
                    <SelectItem
                      key={code}
                      value={code}
                      className="hover:bg-[#E67912] hover:text-white focus:bg-[#E67912] focus:text-white"
                    >
                      {format.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Country-specific requirements display */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">
                {t("countrycard.countryspecific")} {currentFormat.name}:
              </h4>
              <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
                {currentFormat.requiresPhoto && (
                  <li>{t("countrycard.photorecommendation")}</li>
                )}
                {currentFormat.photoRecommended &&
                  !currentFormat.requiresPhoto && (
                    <li>{t("countrycard.photorecommendationDesc")}</li>
                  )}
                <li>
                  {t("countrycard.phoneFormat")}: {currentFormat.phoneExample}
                </li>
                <li>
                  {t("countrycard.dateFormat")}: {currentFormat.dateFormat}
                </li>
                <li>
                  {t("countrycard.addressFormat")}:{" "}
                  {currentFormat.addressExample}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("information.title")}</CardTitle>
          <CardDescription>{t("information.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo Upload */}
          {(currentFormat.requiresPhoto || currentFormat.photoRecommended) && (
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                {formData.personalInfo.photo ? (
                  <AvatarImage src={formData.personalInfo.photo} />
                ) : (
                  <AvatarFallback>{t("information.photo")}</AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="photo-upload">
                  {currentFormat.requiresPhoto
                    ? t("information.requiredPhoto")
                    : t("information.profilePhoto")}
                </Label>
                <div className="flex space-x-2">
                  {!formData.personalInfo.photo ? (
                    <>
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() =>
                          document.getElementById("photo-upload")?.click()
                        }
                        className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {t("information.upload")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        id="photo-update"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() =>
                          document.getElementById("photo-update")?.click()
                        }
                        className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {t("information.update")}
                      </Button>
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          if (currentFormat.requiresPhoto) {
                            toast({
                              title: t("information.photoRequiredTitle"),
                              description: t("information.photoRequiredDesc", {
                                country: currentFormat.name,
                              }),
                              variant: "destructive",
                            });
                          } else {
                            removePhoto();
                          }
                        }}
                        className={
                          currentFormat.requiresPhoto
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t("information.remove")}
                      </Button>
                    </>
                  )}
                </div>
                {errors.photo && (
                  <p className="text-sm text-red-500">
                    {t("information.photoError")}
                  </p>
                )}
                {currentFormat.requiresPhoto && (
                  <p className="text-xs text-gray-500">
                    {t("information.photoRequiredText", {
                      country: currentFormat.name,
                    })}
                  </p>
                )}
                {currentFormat.photoRecommended &&
                  !currentFormat.requiresPhoto && (
                    <p className="text-xs text-gray-500">
                      {t("information.photoRecommendedText", {
                        country: currentFormat.name,
                      })}
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("information.fullName")}
              {isFieldMandatory("name") && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.personalInfo.name}
              onChange={handlePersonalInfoChange}
              placeholder={t("information.namePlaceholder")}
              required={isFieldMandatory("name")}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("information.email")}
              {isFieldMandatory("email") && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              onBlur={handleBlur}
              placeholder={t("information.emailPlaceholder")}
              required={isFieldMandatory("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                {t("information.emailError")}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              {t("information.phone")}
              {isFieldMandatory("phone") && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              onBlur={handleBlur}
              placeholder={currentFormat.phoneExample}
              required={isFieldMandatory("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">
                {t("information.phoneError", {
                  format: currentFormat.phoneExample,
                })}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              {t("information.location")}
              {isFieldMandatory("location") && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.personalInfo.location}
              onChange={handlePersonalInfoChange}
              placeholder={currentFormat.addressExample}
              required={isFieldMandatory("location")}
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="linkedin">{t("information.linkedin")}</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
              placeholder={t("information.linkedinPlaceholder")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("summary.title")}</CardTitle>
              <CardDescription>{t("summary.description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.summary}
            onChange={handleSummaryChange}
            placeholder={getSummaryPlaceholder()}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Education Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("education.title")}</CardTitle>
              <CardDescription>{t("education.description")}</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("education")}
              className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("education.addButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.education.map((edu, index) => (
            <div
              key={index}
              className="space-y-4 border p-4 rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeItem(index, "education")}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="space-y-2">
                <Label htmlFor={`education-institution-${index}`}>
                  {t("education.institution")}
                </Label>
                <Input
                  id={`education-institution-${index}`}
                  name="institution"
                  value={edu.institution}
                  onChange={(e) => handleArrayChange(e, index, "education")}
                  placeholder={t("education.institutionPlaceholder")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`education-degree-${index}`}>
                    {t("education.degree")}
                  </Label>
                  <Input
                    id={`education-degree-${index}`}
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange(e, index, "education")}
                    placeholder={t("education.degreePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("education.date")}</Label>
                  <DatePicker
                    value={edu.date ? dayjs(edu.date) : null}
                    onChange={(date) =>
                      handleEducationDateChange(date?.toDate(), index)
                    }
                    format={currentFormat.dateFormat}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`education-description-${index}`}>
                  {t("education.descriptionLabel")}
                </Label>
                <Textarea
                  id={`education-description-${index}`}
                  name="description"
                  value={edu.description}
                  onChange={(e) => handleArrayChange(e, index, "education")}
                  placeholder={t("education.descriptionPlaceholder")}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}

          {formData.education.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("education.emptyMessage")}</p>
              <Button
                type="button"
                variant="link"
                onClick={() => addItem("education")}
                className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("education.addFirstButton")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("experience.title")}</CardTitle>
              <CardDescription>{t("experience.description")}</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("experience")}
              className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("experience.addButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.experience.map((exp, index) => (
            <div
              key={index}
              className="space-y-4 border p-4 rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeItem(index, "experience")}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`experience-company-${index}`}>
                    {t("experience.company")}
                  </Label>
                  <Input
                    id={`experience-company-${index}`}
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleArrayChange(e, index, "experience")}
                    placeholder={t("experience.companyPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`experience-position-${index}`}>
                    {t("experience.position")}
                  </Label>
                  <Input
                    id={`experience-position-${index}`}
                    name="position"
                    value={exp.position}
                    onChange={(e) => handleArrayChange(e, index, "experience")}
                    placeholder={t("experience.positionPlaceholder")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("experience.startDate")}</Label>
                  <DatePicker
                    value={
                      exp.date.split(" - ")[0]
                        ? dayjs(exp.date.split(" - ")[0])
                        : null
                    }
                    onChange={(date) =>
                      handleExperienceStartDateChange(date?.toDate(), index)
                    }
                    format={currentFormat.dateFormat}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("experience.endDate")}</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <DatePicker
                        value={
                          exp.date.includes("Present") ||
                          !exp.date.split(" - ")[1]
                            ? null
                            : dayjs(exp.date.split(" - ")[1])
                        }
                        onChange={(date) =>
                          handleExperienceEndDateChange(date?.toDate(), index)
                        }
                        format={currentFormat.dateFormat}
                        disabled={exp.date.includes("Present")}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                          },
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        type="button"
                        variant={
                          exp.date.includes("Present") ? "default" : "outline"
                        }
                        size="sm"
                        className={`w-full transition ${
                          exp.date.includes("Present")
                            ? "bg-[#E67912] text-white hover:opacity-90"
                            : "text-[#E67912] border-[#E67912] hover:bg-[#E67912] hover:text-white"
                        }`}
                        onClick={() => handleSetPresentDate(index)}
                      >
                        {exp.date.includes("Present")
                          ? t("experience.current")
                          : t("experience.setCurrent")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`experience-description-${index}`}>
                  {t("experience.descriptionLabel")}
                </Label>
                <Textarea
                  id={`experience-description-${index}`}
                  name="description"
                  value={exp.description}
                  onChange={(e) => handleArrayChange(e, index, "experience")}
                  placeholder={t("experience.descriptionPlaceholder")}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}

          {formData.experience.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("experience.emptyMessage")}</p>
              <Button
                type="button"
                variant="link"
                onClick={() => addItem("experience")}
                className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("experience.addFirstButton")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("skills.title")}</CardTitle>
              <CardDescription>{t("skills.description")}</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("skills")}
              className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("skills.addButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.skills.map((skill, index) => (
            <div
              key={index}
              className="space-y-4 border p-4 rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeItem(index, "skills")}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`skills-category-${index}`}>
                    {t("skills.category")}
                  </Label>
                  <Select
                    value={skill.category}
                    onValueChange={(value) => {
                      const updatedSkills = [...formData.skills];
                      updatedSkills[index] = {
                        ...updatedSkills[index],
                        category: value,
                      };
                      updateForm({ ...formData, skills: updatedSkills });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("skills.categoryPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {currentFormat.skillsCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`skills-skills-${index}`}>
                    {t("skills.skillsLabel")}
                  </Label>
                  <Input
                    id={`skills-skills-${index}`}
                    name="skills"
                    value={skill.skills}
                    onChange={(e) => handleArrayChange(e, index, "skills")}
                    placeholder={t("skills.skillsPlaceholder")}
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.skills.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("skills.emptyMessage")}</p>
              <Button
                type="button"
                variant="link"
                onClick={() => addItem("skills")}
                className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("skills.addFirstButton")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("projects.title")}</CardTitle>
              <CardDescription>{t("projects.description")}</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("projects")}
              className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("projects.addButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.projects.map((project, index) => (
            <div
              key={index}
              className="space-y-4 border p-4 rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeItem(index, "projects")}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="space-y-2">
                <Label htmlFor={`project-name-${index}`}>
                  {t("projects.name")}
                </Label>
                <Input
                  id={`project-name-${index}`}
                  name="name"
                  value={project.name}
                  onChange={(e) => handleArrayChange(e, index, "projects")}
                  placeholder={t("projects.namePlaceholder")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`project-technologies-${index}`}>
                    {t("projects.technologies")}
                  </Label>
                  <Input
                    id={`project-technologies-${index}`}
                    name="technologies"
                    value={project.technologies}
                    onChange={(e) => handleArrayChange(e, index, "projects")}
                    placeholder={t("projects.technologiesPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("projects.date")}</Label>
                  <DatePicker
                    value={project.date ? dayjs(project.date) : null}
                    onChange={(date) =>
                      handleProjectDateChange(date?.toDate(), index)
                    }
                    format={currentFormat.dateFormat}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-link-${index}`}>
                  {t("projects.linkLabel")}
                </Label>
                <Input
                  id={`project-link-${index}`}
                  name="link"
                  value={project.link}
                  onChange={(e) => handleArrayChange(e, index, "projects")}
                  placeholder={t("projects.linkPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-description-${index}`}>
                  {t("projects.descriptionLabel")}
                </Label>
                <Textarea
                  id={`project-description-${index}`}
                  name="description"
                  value={project.description}
                  onChange={(e) => handleArrayChange(e, index, "projects")}
                  placeholder={t("projects.descriptionPlaceholder")}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}

          {formData.projects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t("projects.emptyMessage")}</p>
              <Button
                type="button"
                variant="link"
                onClick={() => addItem("projects")}
                className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("projects.addFirstButton")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certifications Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("certifications.title")}</CardTitle>
              <CardDescription>
                {t("certifications.description")}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("certifications")}
              className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("certifications.addButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.certifications.map((cert, index) => (
            <div
              key={index}
              className="space-y-4 border p-4 rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeItem(index, "certifications")}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`certification-title-${index}`}>
                    {t("certifications.titleLabel")}
                  </Label>
                  <Input
                    id={`certification-title-${index}`}
                    name="title"
                    onChange={(e) =>
                      handleArrayChange(e, index, "certifications")
                    }
                    placeholder={t("certifications.titlePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`certification-name-${index}`}>
                    {t("certifications.issuer")}
                  </Label>
                  <Input
                    id={`certification-name-${index}`}
                    name="name"
                    value={cert.name}
                    onChange={(e) =>
                      handleArrayChange(e, index, "certifications")
                    }
                    placeholder={t("certifications.issuerPlaceholder")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("certifications.dateEarned")}</Label>
                <DatePicker
                  value={cert.date ? dayjs(cert.date) : null}
                  onChange={(date) => {
                    const updatedCerts = [...formData.certifications];
                    updatedCerts[index] = {
                      ...updatedCerts[index],
                      date: date?.toISOString().split("T")[0] || "",
                    };
                    updateForm({ ...formData, certifications: updatedCerts });
                  }}
                  format={currentFormat.dateFormat}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </div>
            </div>
          ))}

          {formData.certifications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {t("certifications.emptyMessage")}
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => addItem("certifications")}
                className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("certifications.addFirstButton")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Sections Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("customSections.title")}</CardTitle>
              <CardDescription>
                {t("customSections.description")}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("customSections")}
              className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("customSections.addButton")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentFormat.customSectionSuggestions.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">
                {t("customSections.suggestionsTitle", {
                  country: currentFormat.name,
                })}
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentFormat.customSectionSuggestions.map((section) => (
                  <Button
                    key={section}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addItem("customSections");
                      const newSections = [
                        ...formData.customSections,
                        { title: section, content: "" },
                      ];
                      updateForm({ ...formData, customSections: newSections });
                    }}
                    className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
                  >
                    {section}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {formData.customSections.map((section, index) => (
            <div
              key={index}
              className="space-y-4 border p-4 rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-[#E67912] hover:bg-[#E67912] hover:text-white"
                onClick={() => removeItem(index, "customSections")}
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="space-y-2">
                <Label htmlFor={`custom-section-title-${index}`}>
                  {t("customSections.sectionTitle")}
                </Label>
                <Input
                  id={`custom-section-title-${index}`}
                  value={section.title}
                  onChange={(e) => handleCustomSectionChange(e, index, "title")}
                  placeholder={t("customSections.titlePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`custom-section-content-${index}`}>
                  {t("customSections.content")}
                </Label>
                <Textarea
                  id={`custom-section-content-${index}`}
                  value={section.content}
                  onChange={(e) =>
                    handleCustomSectionChange(e, index, "content")
                  }
                  placeholder={t("customSections.contentPlaceholder")}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}

          {formData.customSections.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {t("customSections.emptyMessage")}
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => addItem("customSections")}
                className="text-[#E67912] hover:bg-[#E67912] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("customSections.addFirstButton")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default ResumeForm;
