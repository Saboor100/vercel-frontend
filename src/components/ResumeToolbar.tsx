import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Linkedin, Target, Loader2 } from "lucide-react";
import { ResumeData } from "@/types/documents";
import AtsOptimizationPanel from "./AtsOptimizationPanel";
import { makeService } from "@/services/makeService";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { openaiService } from "@/services/openaiService";
import { useTranslation } from "react-i18next";

// --- Robust Pro Plan Checker ---
function hasActivePro(user: any) {
  return (
    user?.subscription?.status === "active" &&
    user?.subscription?.plan &&
    user.subscription.plan.toLowerCase().replace(/\s+/g, "").includes("pro")
  );
}

interface ResumeToolbarProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ResumeToolbar: React.FC<ResumeToolbarProps> = ({
  resumeData,
  setResumeData,
}) => {
  const [linkedInTips, setLinkedInTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { user } = useFirebaseAuth();
  const { t, i18n } = useTranslation();

  const hasPro = hasActivePro(user);

  const handleLinkedInOptimize = async () => {
    if (!hasPro) {
      toast.error(t("resumeToolbar.linkedInRequiresPro"));
      return;
    }

    setIsLoading(true);
    try {
      // Now passing the language parameter
      const result = await makeService.getLinkedInOptimizationTips(
        resumeData,
        i18n.language
      );
      if (result.success && result.tips) {
        setLinkedInTips(result.tips);
        toast.success(t("resumeToolbar.linkedInSuccess"));
      } else {
        toast.error(t("resumeToolbar.linkedInFail"));
      }
    } catch (error) {
      console.error("LinkedIn optimization error:", error);
      toast.error(t("resumeToolbar.linkedInError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIEnhance = async () => {
    if (!hasPro) {
      toast.error(t("resumeToolbar.enhanceRequiresPro"));
      return;
    }

    setIsEnhancing(true);
    try {
      const result = await openaiService.enhanceResume(
        resumeData,
        i18n.language
      );
      if (result.success) {
        setResumeData(result.data); // Full REPLACE!
        toast.success(t("resumeToolbar.enhanceSuccess"));
      } else {
        toast.error(t("resumeToolbar.enhanceFail"));
      }
    } catch (error) {
      console.error("AI enhancement error:", error);
      toast.error(t("resumeToolbar.enhanceError"));
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 w-full space-y-4">
      <div className="space-y-4">
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
          onClick={handleAIEnhance}
          disabled={isEnhancing || !hasPro}
        >
          {isEnhancing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Target className="mr-2 h-4 w-4" />
          )}
          {t("resumeToolbar.enhanceButton", "Enhance with AI")}
          {!hasPro && (
            <span className="ml-2 text-xs text-amber-500">
              {t("resumeToolbar.proLabel", "Pro")}
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
          disabled={isLoading || !hasPro}
          onClick={handleLinkedInOptimize}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Linkedin className="mr-2 h-4 w-4" />
          )}
          {t("resumeToolbar.linkedinButton", "LinkedIn Optimization")}
          {!hasPro && (
            <span className="ml-2 text-xs text-amber-500">
              {t("resumeToolbar.proLabel", "Pro")}
            </span>
          )}
        </Button>
      </div>

      {linkedInTips && (
        <Alert className="mt-4">
          <AlertTitle>
            {t("resumeToolbar.linkedInAlertTitle", "LinkedIn Tips")}
          </AlertTitle>
          <AlertDescription className="text-sm whitespace-pre-line">
            {linkedInTips}
          </AlertDescription>
        </Alert>
      )}

      <AtsOptimizationPanel resumeData={resumeData} />
    </div>
  );
};

export default ResumeToolbar;
