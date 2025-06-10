import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, X, AlertCircle } from "lucide-react";
import { aiService } from "@/services/firebaseClient";
import { ResumeData } from "@/types/documents";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface AtsOptimizationPanelProps {
  resumeData: ResumeData;
}

interface AtsAnalysis {
  keywordsAnalysis: Array<{
    keyword: string;
    included: boolean;
    importance: "high" | "medium" | "low";
  }>;
  missingSkills: string[];
  formatImprovements: string[];
  contentSuggestions: string[];
  overallScore: number;
  summary: string;
}

const AtsOptimizationPanel: React.FC<AtsOptimizationPanelProps> = ({
  resumeData,
}) => {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: t("ats.jobDescriptionRequired"),
        description: t("ats.pasteJobDescriptionWarning"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare resume without photo
      const {
        personalInfo: { photo, ...personalInfoWithoutPhoto },
        ...resumeWithoutPhoto
      } = resumeData;
      const modifiedResumeData = {
        ...resumeWithoutPhoto,
        personalInfo: personalInfoWithoutPhoto,
      };

      // Get current language code from i18next (e.g. 'en', 'fr', etc.)
      const userLang = i18n.language || "en";

      // Pass language to backend service
      const result = await aiService.getAtsOptimization(
        modifiedResumeData,
        jobDescription,
        userLang // <-- pass userLang as third parameter
      );

      if (result.success) {
        setAnalysis(result.data);
        toast({
          title: t("ats.analysisComplete"),
          description: t("ats.analysisDescription"),
        });
      } else {
        toast({
          title: t("ats.analysisFailed"),
          description: result.error || t("ats.analysisError"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: t("ats.error"),
        description: t("ats.unexpectedError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getImportanceColor = (importance: "high" | "medium" | "low") => {
    switch (importance) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {t("ats.panelTitle")}
          </CardTitle>
          <CardDescription>{t("ats.panelDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t("ats.textareaPlaceholder")}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyze}
            disabled={loading || !jobDescription.trim()}
            className="w-full text-[#E67912] bg-[#E67912] hover:bg-[#f19239] text-white border-[#E67912]"
          >
            {loading ? t("ats.loading") : t("ats.analyzeButton")}
          </Button>
        </CardFooter>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">
                {t("ats.resultsTitle")}
              </CardTitle>
              <div className="flex items-center">
                <span className="mr-2">{t("ats.atsScore")}:</span>
                <span
                  className={`text-2xl font-bold ${getScoreColor(
                    analysis.overallScore
                  )}`}
                >
                  {analysis.overallScore}/10
                </span>
              </div>
            </div>
            <Progress value={analysis.overallScore * 10} className="h-2 mt-2" />
            <CardDescription className="mt-4">
              {analysis.summary}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("ats.keywordsAnalysis")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywordsAnalysis.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant={keyword.included ? "default" : "outline"}
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {keyword.keyword}
                    <span
                      className={`ml-1 w-2 h-2 rounded-full ${getImportanceColor(
                        keyword.importance
                      )}`}
                    ></span>
                    {keyword.included ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-red-500" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("ats.missingSkills")}
              </h3>
              {analysis.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 font-medium">
                  {t("ats.noCriticalSkills")}
                </p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("ats.formatImprovements")}
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {analysis.formatImprovements.map((improvement, index) => (
                  <li key={index} className="text-gray-700">
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">
                {t("ats.contentSuggestions")}
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {analysis.contentSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-700">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("ats.proTipTitle")}</AlertTitle>
              <AlertDescription>{t("ats.proTipDesc")}</AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AtsOptimizationPanel;
