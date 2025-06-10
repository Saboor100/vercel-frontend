import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ResumeForm from "@/components/ResumeForm";
import DocumentPreview from "@/components/DocumentPreview";
import TemplateSelector from "@/components/TemplateSelector";
import ResumeToolbar from "@/components/ResumeToolbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ResumeData } from "@/types/documents";
import { resumeApi, paymentApi } from "@/services/apiClient";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

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
  education: [{ institution: "", degree: "", date: "", description: "" }],
  experience: [{ company: "", position: "", date: "", description: "" }],
  projects: [
    { name: "", description: "", link: "", technologies: "", date: "" },
  ],
  skills: [{ category: "Technical Skills", skills: "" }],
  template: "professional",
  languages: [],
  interests: [],
  customSections: [],
};

const ResumePage = () => {
  const { t, i18n } = useTranslation();
  const localeCurrencyMap = {
    en: { locale: "en-US", currency: "USD" },
    fr: { locale: "fr-FR", currency: "EUR" },
  };
  const { locale, currency: defaultCurrency } =
    localeCurrencyMap[i18n.language] || localeCurrencyMap.en;

  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [featureRequested, setFeatureRequested] = useState<
    "ai" | "download" | null
  >(null);
  const [activeTab, setActiveTab] = useState("content");
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  const { data: planData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["subscription-plans", defaultCurrency],
    queryFn: async () => {
      const result = await paymentApi.getPlans(defaultCurrency);
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setResumeData((prevData) => ({
      ...prevData,
      template: selectedTemplate,
    }));
  }, [selectedTemplate]);

  // Accepts partial or full ResumeData, just like CoverLetter handling
  const handleUpdateResumeData: React.Dispatch<
    React.SetStateAction<ResumeData>
  > = (update) => {
    setResumeData((prev) => {
      if (typeof update === "function") {
        return update(prev);
      } else {
        // Detect a "full" ResumeData (AI/toolbar/replace) and do a full replace
        if (
          update &&
          typeof update === "object" &&
          "personalInfo" in update &&
          "summary" in update &&
          "education" in update &&
          "experience" in update
        ) {
          // Always sync the template for consistency
          return { ...update, template: selectedTemplate } as ResumeData;
        }
        // Otherwise, treat as partial update (from form, etc)
        return { ...prev, ...update, template: selectedTemplate };
      }
    });
  };

  // Robust subscription checker
  const hasSubscription = () => {
    if (
      !user?.subscription ||
      !user.subscription.status ||
      !user.subscription.plan
    )
      return false;
    const plan = user.subscription.plan.toLowerCase().replace(/\s+/g, "");
    return (
      user.subscription.status === "active" &&
      (plan.includes("basic") || plan.includes("pro"))
    );
  };

  const handleDownloadRequest = () => {
    if (!hasSubscription()) {
      setFeatureRequested("download");
      setShowSubscribeDialog(true);
      return;
    }
    return true;
  };

  const handleSubscribe = async (plan: "basic" | "pro") => {
    setShowSubscribeDialog(false);
    toast.loading(t("resume.n1"));
    try {
      const result = await paymentApi.createCheckoutSession(
        plan,
        defaultCurrency
      );
      if (!result.success) {
        toast.error(t("resume.n2"), {
          description: result.message || t("resume.n3"),
        });
      }
    } catch (error) {
      toast.error(t("resume.n4"), {
        description: t("resume.n5"),
      });
    }
  };

  const createResumeMutation = useMutation({
    mutationFn: async (data: ResumeData) => {
      const result = await resumeApi.generate(data);
      return result;
    },
    onSuccess: () => {
      toast.success(t("resume.n6"));
    },
    onError: (error) => {
      toast.error(t("resume.n7"), {
        description: error instanceof Error ? error.message : t("resume.n8"),
      });
    },
  });

  const handleSaveResume = () => {
    if (!user) {
      toast.error(t("resume.n9"));
      navigate("/login");
      return;
    }
    createResumeMutation.mutate(resumeData);
  };

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount || !currency) return "";
    const cur = currency.toUpperCase() || defaultCurrency;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: cur,
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 pt-4 pb-32 sm:pb-28">
        <div className="container px-2 sm:px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="hover:bg-[#E67912] p-2 rounded-md transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#E67912]" />
                {t("resume.n10")}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="max-w-full w-full lg:max-w-2xl mx-auto lg:mx-0 pb-28 sm:pb-20 overflow-visible lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto pr-0 lg:pr-4">
              <Tabs
                defaultValue="content"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-6 sticky top-0 bg-background z-10 w-full">
                  <TabsTrigger
                    value="content"
                    className="w-1/2 sm:w-auto text-xs sm:text-sm"
                  >
                    {t("resume.n11")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="template"
                    className="w-1/2 sm:w-auto text-xs sm:text-sm"
                  >
                    {t("resume.n12")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4">
                  <ResumeForm
                    setResumeData={handleUpdateResumeData}
                    resumeData={resumeData}
                  />
                </TabsContent>
                <TabsContent value="template">
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    type="resume"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:block lg:sticky lg:top-10 h-full lg:h-[calc(100vh-160px)] w-full max-w-full">
              <div
                className="bg-white rounded-lg shadow-sm border flex flex-col h-full"
                style={{
                  maxHeight: "60vh",
                  minHeight: 300,
                  overflow: "hidden",
                }}
              >
                <h2 className="text-lg font-medium p-4 border-b">
                  {t("resume.n13")}
                </h2>
                <div
                  className="flex-1 overflow-auto min-h-[300px]"
                  style={{
                    maxHeight: "calc(60vh - 56px)",
                  }}
                >
                  <DocumentPreview
                    type="resume"
                    data={resumeData}
                    selectedTemplate={selectedTemplate}
                    setData={handleUpdateResumeData}
                    onDownloadRequest={handleDownloadRequest}
                  />
                </div>
              </div>
              <div className="mt-4">
                <ResumeToolbar
                  resumeData={resumeData}
                  setResumeData={handleUpdateResumeData}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent className="w-full max-w-lg md:max-w-xl max-w-[95vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{t("resume.n14")}</DialogTitle>
            <DialogDescription>
              {featureRequested === "ai" ? t("resume.n15") : t("resume.n16")}
            </DialogDescription>
          </DialogHeader>

          {isLoadingPlans ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              {/* Basic Plan */}
              <div className="border rounded-lg p-4 flex flex-col">
                <h3 className="text-lg font-medium mb-2">{t("resume.n17")}</h3>
                <p className="text-2xl font-bold mb-2">
                  {planData?.basic
                    ? formatPrice(
                        planData.basic.amount,
                        planData.basic.currency
                      )
                    : "$19.99"}
                </p>
                <ul className="space-y-2 mb-4 flex-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("resume.n18")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("resume.n19")}</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <span className="mr-2">✗</span>
                    <span>{t("resume.n20")}</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe("basic")}
                  className="w-full mt-auto text-sm py-2"
                  disabled={hasSubscription()}
                >
                  {hasSubscription() ? t("resume.n21") : t("resume.n22")}
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="border rounded-lg p-4 bg-primary/5 flex flex-col relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs py-1 px-2 rounded">
                  {t("resume.n23")}
                </div>
                <h3 className="text-lg font-medium mb-2">{t("resume.n24")}</h3>
                <p className="text-2xl font-bold mb-2">
                  {planData?.pro
                    ? formatPrice(planData.pro.amount, planData.pro.currency)
                    : "$49.99"}
                </p>
                <ul className="space-y-2 mb-4 flex-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("resume.n18")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("resume.n25")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("resume.n26")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("resume.n27")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("resume.n28")}</span>
                  </li>
                </ul>
                <Button
                  variant="default"
                  onClick={() => handleSubscribe("pro")}
                  className="w-full mt-auto text-sm py-2"
                  disabled={hasSubscription()}
                >
                  {hasSubscription() ? t("resume.n21") : t("resume.n29")}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="text-sm py-2"
              onClick={() => setShowSubscribeDialog(false)}
            >
              {t("resume.n30")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumePage;
