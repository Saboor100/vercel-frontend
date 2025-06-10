import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Linkedin, Target, Loader2 } from "lucide-react";
import { CoverLetterData } from "@/types/documents";
import AtsOptimizationPanel from "./AtsOptimizationPanel";
import { makeService } from "@/services/makeService";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { openaiService } from "@/services/openaiService";

interface CoverLetterToolbarProps {
  coverLetterData: CoverLetterData;
  setCoverLetterData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
}

// --- Robust Pro Plan Checker ---
function hasActivePro(user: any) {
  return (
    user?.subscription?.status === "active" &&
    user?.subscription?.plan &&
    user.subscription.plan.toLowerCase().replace(/\s+/g, "").includes("pro")
  );
}

const CoverLetterToolbar: React.FC<CoverLetterToolbarProps> = ({
  coverLetterData,
  setCoverLetterData,
}) => {
  const { t, i18n } = useTranslation(); // <-- i18n used
  const [linkedInTips, setLinkedInTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { user } = useFirebaseAuth();

  const hasPro = hasActivePro(user);

  const handleLinkedInOptimize = async () => {
    if (!hasPro) {
      toast.error(t("coverLetterToolbar.linkedInProError"));
      return;
    }

    setIsLoading(true);
    try {
      const adaptedData = {
        summary: coverLetterData.motivation || "",
        experience: [
          {
            company: coverLetterData.recipientInfo?.company || "",
            position: coverLetterData.jobInfo?.title || "",
            description: coverLetterData.experience || "",
          },
        ],
        skills: [
          {
            category: "Skills",
            skills: coverLetterData.skills || "",
          },
        ],
      };

      const result = await makeService.getLinkedInOptimizationTips(
        adaptedData as any,
        i18n.language // ✅ Language parameter added here
      );

      if (result.success && result.tips) {
        setLinkedInTips(result.tips);
        toast.success(t("coverLetterToolbar.linkedInSuccess"));
      } else {
        toast.error(t("coverLetterToolbar.linkedInFail"));
      }
    } catch (error) {
      console.error("LinkedIn optimization error:", error);
      toast.error(t("coverLetterToolbar.linkedInError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIEnhance = async () => {
    if (!hasPro) {
      toast.error(t("coverLetterToolbar.aiProError"));
      return;
    }

    setIsEnhancing(true);
    try {
      const result = await openaiService.enhanceCoverLetter(
        coverLetterData,
        i18n.language
      );
      if (result.success) {
        setCoverLetterData(result.data);
        toast.success(t("coverLetterToolbar.aiSuccess"));
      } else {
        toast.error(t("coverLetterToolbar.aiFail"));
      }
    } catch (error) {
      console.error("AI enhancement error:", error);
      toast.error(t("coverLetterToolbar.aiError"));
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
          {t("coverLetterToolbar.aiEnhancement")}
          {!hasPro && (
            <span className="ml-2 text-xs text-amber-500">
              {t("coverLetterToolbar.proTag")}
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
          {t("coverLetterToolbar.linkedInOptimization")}
          {!hasPro && (
            <span className="ml-2 text-xs text-amber-500">
              {t("coverLetterToolbar.proTag")}
            </span>
          )}
        </Button>
      </div>

      {linkedInTips && (
        <Alert className="mt-4">
          <AlertTitle>{t("coverLetterToolbar.linkedInTipsTitle")}</AlertTitle>
          <AlertDescription className="text-sm whitespace-pre-line">
            {linkedInTips}
          </AlertDescription>
        </Alert>
      )}

      <AtsOptimizationPanel resumeData={coverLetterData as any} />
    </div>
  );
};

export default CoverLetterToolbar;
