import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Globe, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Country-specific cover letter rules
const COUNTRY_RULES = {
  US: {
    name: "United States",
    greeting: "formal",
    structure: "brief",
    tone: "confident",
    maxLength: 300,
    dateFormat: "MM/DD/YYYY",
    addressFormat: "US",
    salutation: ["Dear Hiring Manager", "Dear [Name]"],
    closing: ["Sincerely", "Best regards"],
    culturalNotes:
      "Keep it concise and achievement-focused. Quantify accomplishments.",
    phoneFormat: "+1 (XXX) XXX-XXXX",
  },
  UK: {
    name: "United Kingdom",
    greeting: "formal",
    structure: "moderate",
    tone: "professional",
    maxLength: 400,
    dateFormat: "DD/MM/YYYY",
    addressFormat: "UK",
    salutation: ["Dear Sir/Madam", "Dear [Name]"],
    closing: ["Yours faithfully", "Yours sincerely", "Kind regards"],
    culturalNotes:
      "Slightly more formal. Include relevant qualifications and experience.",
    phoneFormat: "+44 XXXX XXX XXX",
  },
  DE: {
    name: "Germany",
    greeting: "very_formal",
    structure: "detailed",
    tone: "formal",
    maxLength: 500,
    dateFormat: "DD.MM.YYYY",
    addressFormat: "DE",
    salutation: [
      "Sehr geehrte Damen und Herren",
      "Sehr geehrte/r Frau/Herr [Name]",
    ],
    closing: ["Mit freundlichen Grüßen"],
    culturalNotes:
      "Very formal and structured. Include education and certifications prominently.",
    phoneFormat: "+49 XXX XXXXXXX",
  },
  FR: {
    name: "France",
    greeting: "formal",
    structure: "detailed",
    tone: "formal",
    maxLength: 450,
    dateFormat: "DD/MM/YYYY",
    addressFormat: "FR",
    salutation: ["Madame, Monsieur", "Madame/Monsieur [Name]"],
    closing: [
      "Cordialement",
      "Je vous prie d'agréer mes salutations distinguées",
    ],
    culturalNotes:
      "Formal and well-structured. Emphasize education and formal qualifications.",
    phoneFormat: "+33 X XX XX XX XX",
  },
  CA: {
    name: "Canada",
    greeting: "formal",
    structure: "moderate",
    tone: "professional",
    maxLength: 350,
    dateFormat: "MM/DD/YYYY",
    addressFormat: "CA",
    salutation: ["Dear Hiring Manager", "Dear [Name]"],
    closing: ["Sincerely", "Best regards"],
    culturalNotes:
      "Professional but approachable. Include bilingual skills if relevant.",
    phoneFormat: "+1 (XXX) XXX-XXXX",
  },
  AU: {
    name: "Australia",
    greeting: "semi_formal",
    structure: "brief",
    tone: "approachable",
    maxLength: 300,
    dateFormat: "DD/MM/YYYY",
    addressFormat: "AU",
    salutation: ["Dear Hiring Manager", "Dear [Name]"],
    closing: ["Kind regards", "Best regards"],
    culturalNotes:
      "Friendly but professional. Focus on cultural fit and teamwork.",
    phoneFormat: "+61 X XXXX XXXX",
  },
  JP: {
    name: "Japan",
    greeting: "very_formal",
    structure: "detailed",
    tone: "respectful",
    maxLength: 400,
    dateFormat: "YYYY/MM/DD",
    addressFormat: "JP",
    salutation: ["拝啓", "Dear [Name]-san"],
    closing: ["敬具", "Respectfully yours"],
    culturalNotes:
      "Extremely formal and respectful. Emphasize loyalty and long-term commitment.",
    phoneFormat: "+81-XX-XXXX-XXXX",
  },
};

const CoverLetterForm = ({
  setCoverLetterData,
  coverLetterData,
}: {
  setCoverLetterData: React.Dispatch<React.SetStateAction<any>>;
  coverLetterData: any;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetCountry, setTargetCountry] = useState("US");
  const [showCountryInfo, setShowCountryInfo] = useState(false);
  const [updateLock, setUpdateLock] = useState(false);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    targetCountry: "US",
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
    recipientInfo: {
      name: "",
      title: "",
      company: "",
      address: "",
    },
    jobInfo: {
      title: "",
      reference: "",
    },
    experience: "",
    skills: "",
    motivation: "",
    closing: "",
    salutation: COUNTRY_RULES["US"].salutation[0],
    closingPhrase: COUNTRY_RULES["US"].closing[0],
  });

  const currentRules =
    COUNTRY_RULES[targetCountry as keyof typeof COUNTRY_RULES];

  useEffect(() => {
    if (coverLetterData && !updateLock) {
      setFormData((prevData) => ({
        ...prevData,
        ...coverLetterData,
        targetCountry: targetCountry,
        salutation:
          coverLetterData.salutation ||
          COUNTRY_RULES[targetCountry as keyof typeof COUNTRY_RULES]
            .salutation[0],
        closingPhrase:
          coverLetterData.closingPhrase ||
          COUNTRY_RULES[targetCountry as keyof typeof COUNTRY_RULES].closing[0],
      }));
    }
  }, [coverLetterData, targetCountry, updateLock]);

  const debouncedSetCoverLetterData = React.useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (data: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!updateLock) {
            setCoverLetterData(data);
          }
        }, 100);
      };
    }, [setCoverLetterData, updateLock]),
    [setCoverLetterData, updateLock]
  );

  useEffect(() => {
    if (!isGenerating && !updateLock) {
      debouncedSetCoverLetterData(formData);
    }
  }, [formData, isGenerating, updateLock, debouncedSetCoverLetterData]);

  const [errors, setErrors] = useState<{ email?: boolean; phone?: boolean }>(
    {}
  );

  const formatPhoneNumber = (phone: string, country: string): string => {
    const rules = COUNTRY_RULES[country as keyof typeof COUNTRY_RULES];
    if (!rules) return phone;

    // Basic phone formatting based on country
    const digits = phone.replace(/\D/g, "");
    switch (country) {
      case "US":
      case "CA":
        if (digits.length === 10) {
          return `+1 (${digits.slice(0, 3)}) ${digits.slice(
            3,
            6
          )}-${digits.slice(6)}`;
        }
        break;
      case "UK":
        if (digits.length === 11) {
          return `+44 ${digits.slice(1, 5)} ${digits.slice(
            5,
            8
          )} ${digits.slice(8)}`;
        }
        break;
      case "DE":
        if (digits.length >= 10) {
          return `+49 ${digits.slice(1, 4)} ${digits.slice(4)}`;
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
    }
    return phone;
  };

  const handleCountryChange = (country: string) => {
    setTargetCountry(country);
    setFormData((prev) => ({
      ...prev,
      targetCountry: country,
      personalInfo: {
        ...prev.personalInfo,
        phone: formatPhoneNumber(prev.personalInfo.phone, country),
      },
      salutation:
        COUNTRY_RULES[country as keyof typeof COUNTRY_RULES].salutation[0],
      closingPhrase:
        COUNTRY_RULES[country as keyof typeof COUNTRY_RULES].closing[0],
    }));
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "phone") {
      processedValue = formatPhoneNumber(value, targetCountry);
    }

    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [name]: processedValue,
      },
    });
  };

  const validateEmail = (email: string): boolean =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePhone = (phone: string): boolean =>
    /^[\d\s\-+()]{1,20}$/.test(phone);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      const isValid = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: !isValid }));
    }

    if (name === "phone") {
      const isValid = validatePhone(value);
      setErrors((prev) => ({ ...prev, phone: !isValid }));
    }
  };

  const handleRecipientInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      recipientInfo: {
        ...formData.recipientInfo,
        [name]: value,
      },
    });
  };

  const handleJobInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      jobInfo: {
        ...formData.jobInfo,
        [name]: value,
      },
    });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isGenerating || updateLock) return;

    const { name, value } = e.target;

    if (value.length > currentRules.maxLength) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateCountrySpecificContent = () => {
    const rules = currentRules;
    const company = formData.recipientInfo.company || "the company";
    const position = formData.jobInfo.title || "the position";

    let experience = "";
    let skills = "";
    let motivation = "";
    let closing = "";

    switch (targetCountry) {
      case "US":
        experience = `I have successfully delivered results in previous roles, including achieving key performance metrics and driving team success.`;
        skills = `My core competencies include leadership, problem-solving, and technical expertise that directly align with your requirements.`;
        motivation = `I am excited about the opportunity to contribute to ${company}'s continued growth and success in ${position}.`;
        closing = `I look forward to discussing how my experience can benefit your team.`;
        break;

      case "UK":
        experience = `My professional background includes relevant experience in similar roles, with a strong track record of achievements and continuous professional development.`;
        skills = `I possess the necessary qualifications and skills, including strong analytical abilities and excellent communication skills.`;
        motivation = `I am particularly drawn to ${company} due to its reputation for excellence and would welcome the opportunity to contribute to the ${position} role.`;
        closing = `I would be delighted to discuss my application further at your convenience.`;
        break;

      case "DE":
        experience = `Meine berufliche Laufbahn umfasst relevante Erfahrungen mit nachweislichen Erfolgen und kontinuierlicher Weiterbildung.`;
        skills = `Zu meinen Kernkompetenzen gehören analytisches Denken, Teamfähigkeit und fundierte Fachkenntnisse.`;
        motivation = `Ich bin besonders an ${company} interessiert aufgrund Ihres ausgezeichneten Rufes und möchte gerne zur Position ${position} beitragen.`;
        closing = `Über die Möglichkeit eines persönlichen Gesprächs würde ich mich sehr freuen.`;
        break;

      case "FR":
        experience = `Mon parcours professionnel comprend des expériences pertinentes avec des réalisations démontrables et un développement professionnel continu.`;
        skills = `Mes compétences principales incluent l'analyse, le travail d'équipe et une expertise technique solide.`;
        motivation = `Je suis particulièrement intéressé(e) par ${company} en raison de sa réputation d'excellence et souhaiterais contribuer au poste de ${position}.`;
        closing = `Je serais ravi(e) de discuter de ma candidature lors d'un entretien.`;
        break;

      case "CA":
        experience = `My professional experience includes diverse roles where I've demonstrated adaptability and strong performance in multicultural environments.`;
        skills = `I bring strong communication skills, cultural awareness, and technical expertise to support team objectives.`;
        motivation = `I am enthusiastic about joining ${company} and contributing to the ${position} role while embracing Canadian values of collaboration and innovation.`;
        closing = `I would welcome the opportunity to discuss how I can contribute to your team's success.`;
        break;

      case "AU":
        experience = `My background includes hands-on experience in collaborative environments where I've contributed to team success and positive workplace culture.`;
        skills = `I offer strong interpersonal skills, adaptability, and technical capabilities that align well with your team's needs.`;
        motivation = `I'm keen to join ${company} and contribute to the ${position} role while bringing a positive, solution-focused approach.`;
        closing = `I'd love the chance to chat about how I can add value to your team.`;
        break;

      case "JP":
        experience = `私の職歴には、継続的な学習と改善を通じて、チームの成功に貢献してきた経験が含まれています。`;
        skills = `私の主要なスキルには、細心の注意、チームワーク、および継続的な品質向上への取り組みが含まれます。`;
        motivation = `${company}の優れた評判と企業文化に深く感銘を受け、${position}のポジションで長期的に貢献したいと考えております。`;
        closing = `お時間をいただき、私の応募についてお話しする機会をいただければ幸いです。`;
        break;

      default:
        experience = formData.experience;
        skills = formData.skills;
        motivation = formData.motivation;
        closing = formData.closing;
    }

    return {
      experience,
      skills,
      motivation,
      closing,
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setUpdateLock(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedContent = generateCountrySpecificContent();

      const updatedData = {
        ...formData,
        experience: formData.experience || generatedContent.experience,
        skills: formData.skills || generatedContent.skills,
        motivation: formData.motivation || generatedContent.motivation,
        closing: formData.closing || generatedContent.closing,
        salutation: formData.salutation || currentRules.salutation[0],
        closingPhrase: formData.closingPhrase || currentRules.closing[0],
      };

      // Update form data first
      setFormData(updatedData);

      // Then update parent component after a delay
      setTimeout(() => {
        setCoverLetterData(updatedData);
        setUpdateLock(false);
        setIsGenerating(false);
      }, 200);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setUpdateLock(false);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Target Country Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("coverLetterform.targetCountry.title")}
          </CardTitle>
          <CardDescription>
            {t("coverLetterform.targetCountry.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="country">
                {t("coverLetterform.targetCountry.countryLabel")}
              </Label>
              <Select value={targetCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="border-[#E67912] text-[#E67912] hover:bg-[#E67912] hover:text-white">
                  <SelectValue
                    placeholder={t("coverLetterform.targetCountry.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COUNTRY_RULES).map(([code, rules]) => (
                    <SelectItem
                      key={code}
                      value={code}
                      className="hover:bg-[#E67912] hover:text-white focus:bg-[#E67912] focus:text-white aria-selected:bg-[#E67912] aria-selected:text-white"
                    >
                      {rules.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-[#E67912] border-[#E67912] hover:bg-[#E67912] hover:text-white"
              onClick={() => setShowCountryInfo(!showCountryInfo)}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">
                {t("coverLetterform.targetCountry.infoButton")}
              </span>
            </Button>
          </div>

          {showCountryInfo && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>{currentRules.name}</strong>
                <br />
                {currentRules.culturalNotes}
                <br />
                <strong>
                  {t("coverLetterform.targetCountry.maxLength")}:
                </strong>{" "}
                {currentRules.maxLength} {t("words")}
                <br />
                <strong>{t("coverLetterform.targetCountry.tone")}:</strong>{" "}
                {currentRules.tone}
                <br />
                <strong>
                  {t("coverLetterform.targetCountry.phoneFormat")}:
                </strong>{" "}
                {currentRules.phoneFormat}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("coverLetterform.personalInfo.title")}</CardTitle>
          <CardDescription>
            {t("coverLetterform.personalInfo.description", {
              country: currentRules.name,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t("coverLetterform.personalInfo.fullName")}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.personalInfo.name}
                onChange={handlePersonalInfoChange}
                placeholder={t("coverLetterform.personalInfo.placeholder.name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {t("coverLetterform.personalInfo.email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                className={
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                value={formData.personalInfo.email}
                onBlur={handleBlur}
                onChange={handlePersonalInfoChange}
                placeholder={t(
                  "coverLetterform.personalInfo.placeholder.email"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                {t("coverLetterform.personalInfo.phone")} (
                {currentRules.phoneFormat})
              </Label>
              <Input
                id="phone"
                name="phone"
                onBlur={handleBlur}
                value={formData.personalInfo.phone}
                onChange={handlePersonalInfoChange}
                placeholder={currentRules.phoneFormat}
                className={
                  errors.phone
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">
                {t("coverLetterform.personalInfo.location")}
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.personalInfo.location}
                onChange={handlePersonalInfoChange}
                placeholder={t(
                  "coverLetterform.personalInfo.placeholder.location"
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipient Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("coverLetterform.recipientInfo.title")}</CardTitle>
          <CardDescription>
            {t("coverLetterform.recipientInfo.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipientName">
                {t("coverLetterform.recipientInfo.name")}
              </Label>
              <Input
                id="recipientName"
                name="name"
                value={formData.recipientInfo.name}
                onChange={handleRecipientInfoChange}
                placeholder={t(
                  "coverLetterform.recipientInfo.placeholder.name"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientTitle">
                {t("coverLetterform.recipientInfo.titleLabel")}
              </Label>
              <Input
                id="recipientTitle"
                name="title"
                value={formData.recipientInfo.title}
                onChange={handleRecipientInfoChange}
                placeholder={t(
                  "coverLetterform.recipientInfo.placeholder.title"
                )}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="company">
                {t("coverLetterform.recipientInfo.company")}
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.recipientInfo.company}
                onChange={handleRecipientInfoChange}
                placeholder={t(
                  "coverLetterform.recipientInfo.placeholder.company"
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("coverLetterform.jobInfo.title")}</CardTitle>
          <CardDescription>
            {t("coverLetterform.jobInfo.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">
                {t("coverLetterform.jobInfo.titleLabel")}
              </Label>
              <Input
                id="jobTitle"
                name="title"
                value={formData.jobInfo.title}
                onChange={handleJobInfoChange}
                placeholder={t("coverLetterform.jobInfo.placeholder.title")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobReference">
                {t("coverLetterform.jobInfo.reference")}
              </Label>
              <Input
                id="jobReference"
                name="reference"
                value={formData.jobInfo.reference}
                onChange={handleJobInfoChange}
                placeholder={t("coverLetterform.jobInfo.placeholder.reference")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Greeting & Closing */}
      <Card>
        <CardHeader>
          <CardTitle>{t("coverLetterform.greetingClosing.title")}</CardTitle>
          <CardDescription>
            {t("coverLetterform.greetingClosing.description", {
              country: currentRules.name,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salutation">
                {t("coverLetterform.greetingClosing.salutation")}
              </Label>
              <Select
                value={formData.salutation}
                onValueChange={(value) =>
                  setFormData({ ...formData, salutation: value })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "coverLetterform.greetingClosing.placeholder.salutation"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {currentRules.salutation.map((greeting) => (
                    <SelectItem
                      key={greeting}
                      value={greeting}
                      className="hover:bg-[#E67912] hover:text-white focus:bg-[#E67912] focus:text-white aria-selected:bg-[#E67912] aria-selected:text-white"
                    >
                      {greeting}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="closingPhrase">
                {t("coverLetterform.greetingClosing.closing")}
              </Label>
              <Select
                value={formData.closingPhrase}
                onValueChange={(value) =>
                  setFormData({ ...formData, closingPhrase: value })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "coverLetterform.greetingClosing.placeholder.closing"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {currentRules.closing.map((closing) => (
                    <SelectItem
                      key={closing}
                      value={closing}
                      className="hover:bg-[#E67912] hover:text-white focus:bg-[#E67912] focus:text-white aria-selected:bg-[#E67912] aria-selected:text-white"
                    >
                      {closing}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <Card>
        <CardHeader>
          <CardTitle>{t("coverLetterform.content.title")}</CardTitle>
          <CardDescription>
            {t("coverLetterform.content.description", {
              country: currentRules.name,
              maxLength: currentRules.maxLength,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {["experience", "skills", "motivation", "closing"].map((field) => (
            <div className="space-y-2" key={field}>
              <Label htmlFor={field} className="flex justify-between">
                <span>{t(`coverLetterform.content.${field}`)}</span>
                <span className="text-xs text-muted-foreground">
                  {(formData as any)[field]?.length || 0}/
                  {currentRules.maxLength}
                </span>
              </Label>
              <Textarea
                id={field}
                name={field}
                value={(formData as any)[field]}
                onChange={handleTextAreaChange}
                placeholder={t("enterField", {
                  field: t(`coverLetterform.content.${field}`),
                })}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                {t("coverLetterform.content.autoGenerate", {
                  country: currentRules.name,
                })}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          variant="outline" // keeps background transparent, no blue fill
          size="lg"
          className="min-w-[200px] flex items-center gap-2 text-[#E67912] border-[#E67912] hover:bg-[#E67912] hover:text-white transition"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("coverLetterform.generateButton.generating")}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {t("coverLetterform.generateButton.default")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CoverLetterForm;
