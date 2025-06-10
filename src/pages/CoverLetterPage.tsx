import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CoverLetterForm from "@/components/CoverLetterForm";
import DocumentPreview from "@/components/DocumentPreview";
import TemplateSelector from "@/components/TemplateSelector";
import CoverLetterToolbar from "@/components/CoverLetterToolbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CoverLetterData } from "@/types/documents";
import { coverLetterApi, paymentApi } from "@/services/apiClient";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const initialCoverLetterData: CoverLetterData = {
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
  },
  jobInfo: {
    title: "",
    reference: "",
  },
  experience: "",
  skills: "",
  motivation: "",
  closing: "",
  template: "professional",
};

const CoverLetterPage = () => {
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(
    initialCoverLetterData
  );
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [featureRequested, setFeatureRequested] = useState<
    "ai" | "download" | null
  >(null);
  const { t, i18n } = useTranslation();
  const localeCurrencyMap = {
    en: { locale: "en-US", currency: "USD" },
    fr: { locale: "fr-FR", currency: "EUR" },
  };

  const { locale, currency: defaultCurrency } =
    localeCurrencyMap[i18n.language] || localeCurrencyMap.en;

  const { user } = useFirebaseAuth();
  const { data: planData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["subscription-plans", defaultCurrency],
    queryFn: async () => {
      const result = await paymentApi.getPlans(defaultCurrency);
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Robust plan checker for pro and basic (active only)
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

  // Helper for only pro plans
  const hasPro = () => {
    if (
      !user?.subscription ||
      !user.subscription.status ||
      !user.subscription.plan
    )
      return false;
    const plan = user.subscription.plan.toLowerCase().replace(/\s+/g, "");
    return user.subscription.status === "active" && plan.includes("pro");
  };

  // Update template in coverLetterData when it changes
  useEffect(() => {
    setCoverLetterData((prevData) => ({
      ...prevData,
      template: selectedTemplate,
    }));
  }, [selectedTemplate]);

  // Create a type-safe wrapper for setCoverLetterData
  const handleUpdateCoverLetterData = (data: CoverLetterData | any) => {
    const typedData = data as CoverLetterData;
    setCoverLetterData(typedData);
  };

  // Handle download PDF request
  const handleDownloadRequest = () => {
    if (!hasSubscription()) {
      setFeatureRequested("download");
      setShowSubscribeDialog(true);
      return;
    }
    // The actual download happens in DocumentPreview component
    return true;
  };

  // Handle subscription checkout
  const handleSubscribe = async (plan: "basic" | "pro") => {
    setShowSubscribeDialog(false);
    toast.loading("Preparing checkout...");
    try {
      const result = await paymentApi.createCheckoutSession(
        plan,
        defaultCurrency
      );
      if (!result.success) {
        toast.error("Checkout Error", {
          description: result.message || "Could not create checkout session",
        });
      }
      // Redirect happens in the API client
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout Failed", {
        description: "Failed to start checkout process. Please try again.",
      });
    }
  };

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount || !currency) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Add pb-32 to main so toolbar is never covered by bottom navbar */}
      <main className="flex-1 py-10 pb-32 sm:pb-28 bg-muted/30">
        <div className="container-xl">
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
                {t("coverLetterBuilder.title")}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="max-w-full w-full lg:max-w-2xl mx-auto lg:mx-0 pb-28 sm:pb-20 overflow-visible lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto pr-0 lg:pr-4">
              <Tabs defaultValue="content">
                <TabsList className="mb-6 sticky top-0 bg-background z-10 w-full">
                  <TabsTrigger value="content">{t("tabs.content")}</TabsTrigger>
                  <TabsTrigger value="template">
                    {t("tabs.template")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4">
                  <CoverLetterForm
                    setCoverLetterData={setCoverLetterData}
                    coverLetterData={coverLetterData}
                  />
                </TabsContent>
                <TabsContent value="template">
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    type="coverLetter"
                    // TemplateSelector uses robust pro check internally now
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview/Toolbar column, sticky for lg, full width on mobile */}
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
                  {t("previews.title")}
                </h2>
                <div
                  className="flex-1 overflow-auto min-h-[300px]"
                  style={{
                    maxHeight: "calc(60vh - 56px)",
                  }}
                >
                  <DocumentPreview
                    type="coverLetter"
                    data={coverLetterData}
                    selectedTemplate={selectedTemplate}
                    setData={handleUpdateCoverLetterData}
                    onDownloadRequest={handleDownloadRequest}
                  />
                </div>
              </div>
              {/* Toolbar should not be sticky or fixed. Just normal margin-top */}
              <div className="mt-4">
                <CoverLetterToolbar
                  coverLetterData={coverLetterData}
                  setCoverLetterData={setCoverLetterData}
                  // If you have plan checks in CoverLetterToolbar, update them to use hasPro() or hasSubscription()
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Subscription Dialog */}
      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent className="w-full max-w-lg md:max-w-xl max-w-[95vw] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{t("dialog.title")}</DialogTitle>
            <DialogDescription>
              {featureRequested === "ai"
                ? t("dialog.description.ai")
                : t("dialog.description.download")}
            </DialogDescription>
          </DialogHeader>

          {isLoadingPlans ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="border rounded-lg p-4 flex flex-col">
                <h3 className="text-lg font-medium mb-2">
                  {t("coverplans.basic.title")}
                </h3>
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
                    <span>{t("coverplans.basic.features.pdf")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("coverplans.basic.features.templates")}</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <span className="mr-2">✗</span>
                    <span>{t("coverplans.basic.features.ai")}</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe("basic")}
                  className="w-full mt-auto"
                  disabled={hasSubscription()}
                >
                  {hasSubscription()
                    ? t("coverplans.current")
                    : t("coverplans.basic.button")}
                </Button>
              </div>

              <div className="border rounded-lg p-4 bg-primary/5 flex flex-col relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs py-1 px-2 rounded">
                  {t("coverplans.pro.badge")}
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {t("coverplans.pro.title")}
                </h3>
                <p className="text-2xl font-bold mb-2">
                  {planData?.pro
                    ? formatPrice(planData.pro.amount, planData.pro.currency)
                    : "$49.99"}
                </p>
                <ul className="space-y-2 mb-4 flex-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("coverplans.pro.features.pdf")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("coverplans.pro.features.templates")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("coverplans.pro.features.ai")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("coverplans.pro.features.linkedin")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t("coverplans.pro.features.support")}</span>
                  </li>
                </ul>
                <Button
                  variant="default"
                  onClick={() => handleSubscribe("pro")}
                  className="w-full mt-auto"
                  disabled={hasPro()}
                >
                  {hasPro()
                    ? t("coverplans.current")
                    : t("coverplans.pro.button")}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubscribeDialog(false)}
            >
              {t("dialog.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoverLetterPage;
