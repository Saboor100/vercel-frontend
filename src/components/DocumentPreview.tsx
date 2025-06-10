import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Maximize2, Minimize2, Edit2, Eye } from "lucide-react";
import { toast } from "sonner";
import { ResumeData, CoverLetterData } from "@/types/documents";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";

import ModernResumeTemplate from "@/components/templates/resume/ModernResumeTemplate";
import MinimalistResumeTemplate from "@/components/templates/resume/MinimalistResumeTemplate";
import CreativeResumeTemplate from "@/components/templates/resume/CreativeResumeTemplate";
import ProfessionalResumeTemplate from "@/components/templates/resume/ProfessionalResumeTemplate";
import ProfessionalDarkTemplate from "@/components/templates/resume/ProfessionalDarkTemplate";
import ProfessionalPurpleTemplate from "@/components/templates/resume/ProfessionalPurpleTemplate";
import ProfessionalModernTemplate from "@/components/templates/resume/ProfessionalModernTemplate";

import ModernCoverLetterTemplate from "@/components/templates/coverLetter/ModernCoverLetterTemplate";
import MinimalistCoverLetterTemplate from "@/components/templates/coverLetter/MinimalistCoverLetterTemplate";
import CreativeCoverLetterTemplate from "@/components/templates/coverLetter/CreativeCoverLetterTemplate";
import ProfessionalCoverLetterTemplate from "@/components/templates/coverLetter/ProfessionalCoverLetterTemplate";
import AcademicResumeTemplate from "./templates/resume/AcademicResumeTemplate";
import CorporateResumeTemplate from "./templates/resume/CorporateResumeTemplate";
import ExecutiveResumeTemplate from "./templates/resume/ExecutiveResumeTemplate";
import ElegantResumeTemplate from "./templates/resume/ElegantResumeTemplate";
import TechnicalResumeTemplate from "./templates/resume/TechnicalResumeTemplate";
import AcademicCoverLetterTemplate from "./templates/coverLetter/AcademicCoverLetterTemplate";
import CorporateCoverLetterTemplate from "./templates/coverLetter/CorporateCoverLetterTemplate";
import ExecutiveCoverLetterTemplate from "./templates/coverLetter/ExecutiveCoverLetterTemplate";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import TechnicalCoverLetterTemplate from "./templates/coverLetter/TechnicalCoverLetterTemplate";

// --- Type Narrowing for setData ---
type DocumentPreviewProps =
  | {
      type: "resume";
      data: ResumeData;
      selectedTemplate: string;
      setData?: (data: ResumeData) => void;
      onDownloadRequest?: () => boolean;
    }
  | {
      type: "coverLetter";
      data: CoverLetterData;
      selectedTemplate: string;
      setData?: (data: CoverLetterData) => void;
      onDownloadRequest?: () => boolean;
    };

const DocumentPreview: React.FC<DocumentPreviewProps> = (props) => {
  const { type, data, selectedTemplate, setData, onDownloadRequest } = props;
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Add local state to handle data updates
  const [localData, setLocalData] = useState(data);

  // Update local data when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [pages, setPages] = useState<number[]>([0]);

  const PAGE_WIDTH = 800;
  const PAGE_HEIGHT = 842;
  const PRINT_SCALE = 4;

  useEffect(() => {
    const checkContentHeight = () => {
      const docElement = documentRef.current;
      if (!docElement) return;

      const contentElement = docElement.firstElementChild as HTMLElement | null;
      if (!contentElement) return;

      const totalHeight = contentElement.scrollHeight;
      setContentHeight(totalHeight);

      const numberOfPages = Math.max(1, Math.ceil(totalHeight / PAGE_HEIGHT));
      setIsOverflowing(numberOfPages > 1);

      setPages(Array.from({ length: numberOfPages }, (_, i) => i));
    };

    checkContentHeight();

    const observer = new MutationObserver(checkContentHeight);
    const currentDoc = documentRef.current;

    if (currentDoc) {
      observer.observe(currentDoc, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    return () => observer.disconnect();
  }, [localData, selectedTemplate]); // Use localData instead of data

  const handleDownload = async () => {
    if (!printRef.current) return;
    if (onDownloadRequest && !onDownloadRequest()) {
      return;
    }

    let toastId: string | number | undefined;

    try {
      toastId = toast.loading("Generating high quality PDF...");
      await document.fonts.ready;

      const printDiv = printRef.current.firstElementChild as HTMLElement | null;
      if (!printDiv) {
        throw new Error("Printable document not found");
      }
      if (!printDiv.innerHTML.trim()) {
        throw new Error(
          "The document is empty or not rendered. Please check your template."
        );
      }

      const canvas = await html2canvas(printDiv, {
        scale: PRINT_SCALE,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error(
          "Rendered canvas is empty. Please ensure your template is visible and rendered correctly."
        );
      }

      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else {
            reject(
              new Error(
                "Canvas toBlob failed. This is usually caused by images, fonts, or other assets in your document that are loaded from a different origin (CORS issue). Please ensure all images and fonts are loaded from your own domain or have proper CORS headers."
              )
            );
          }
        }, "image/png");
      });

      const formData = new FormData();
      formData.append("image", imageBlob, "document.png");

      const pdfApiUrl = `${import.meta.env.VITE_API_URL}/convert-to-cmyk-pdf`;
      console.log("PDF fetch URL:", pdfApiUrl);

      const response = await fetch(pdfApiUrl, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/pdf",
        },
      });

      console.log("PDF response status:", response.status);
      console.log(
        "PDF response headers:",
        Array.from(response.headers.entries())
      );

      if (!response.ok) {
        try {
          const errorText = await response.text();
          console.error("PDF fetch error response body:", errorText);
        } catch (err) {}
        throw new Error("Failed to generate CMYK PDF");
      }

      const contentType = response.headers.get("Content-Type");
      console.log("PDF response content-type:", contentType);
      if (!contentType?.includes("application/pdf")) {
        try {
          const errorText = await response.text();
          console.error("PDF response is not pdf, response body:", errorText);
        } catch (err) {}
        throw new Error("Response is not a PDF");
      }

      let blob = await response.blob();
      if (blob.type !== "application/pdf") {
        blob = blob.slice(0, blob.size, "application/pdf");
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${type === "resume" ? "resume" : "cover-letter"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success("Download Complete", {
        description: `Your ${
          type === "resume" ? "resume" : "cover letter"
        } has been downloaded in CMYK quality.`,
      });

      const user = getAuth().currentUser;
      const userId = user?.uid;

      if (userId) {
        const db = getDatabase();
        const docRef = ref(
          db,
          `users/${userId}/${
            type === "resume" ? "resumes" : "coverLetters"
          }/${Date.now()}`
        );

        await set(docRef, {
          ...localData, // Use localData instead of data
          template: selectedTemplate,
          downloadedAt: new Date().toISOString(),
        });

        await fetch(
          "https://hook.us2.make.com/0p2e2f7l60nakt13hfwjch26q1jq8cj7",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              type,
              email: user.email,
              displayName: user.displayName,
              template: selectedTemplate,
              downloadedAt: new Date().toISOString(),
            }),
          }
        );
      } else {
        console.warn(
          "No authenticated user found. Skipping email notification."
        );
      }
    } catch (error: any) {
      console.error("CMYK PDF generation error:", error);
      if (toastId) toast.dismiss(toastId);
      toast.error("Download Failed", {
        description:
          (typeof error === "string" ? error : error?.message) ||
          "There was an error generating your CMYK PDF. Check the browser console for details. If you see a CORS or canvas error, ensure all images/fonts are loaded from your domain or with CORS enabled.",
      });
    }
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleContentEdit = (e: React.FocusEvent<HTMLElement>) => {
    if (!isEditMode || !setData) return;

    const target = e.currentTarget;
    const fieldName = target.getAttribute("data-field");
    const sectionIndex = target.getAttribute("data-index");

    if (!fieldName) return;

    const newValue = target.innerText;

    if (type === "resume") {
      const resumeData = { ...(localData as ResumeData) };

      if (fieldName === "name") {
        resumeData.personalInfo.name = newValue;
      } else if (fieldName === "email") {
        resumeData.personalInfo.email = newValue;
      } else if (fieldName === "phone") {
        resumeData.personalInfo.phone = newValue;
      } else if (fieldName === "location") {
        resumeData.personalInfo.location = newValue;
      } else if (fieldName === "linkedin") {
        resumeData.personalInfo.linkedin = newValue;
      } else if (fieldName === "summary") {
        resumeData.summary = newValue;
      } else if (fieldName.startsWith("education.") && sectionIndex) {
        const subField = fieldName.split(".")[1];
        const index = parseInt(sectionIndex);

        if (resumeData.education[index]) {
          resumeData.education[index][
            subField as keyof (typeof resumeData.education)[0]
          ] = newValue;
        }
      } else if (fieldName.startsWith("experience.") && sectionIndex) {
        const subField = fieldName.split(".")[1];
        const index = parseInt(sectionIndex);

        if (resumeData.experience[index]) {
          resumeData.experience[index][
            subField as keyof (typeof resumeData.experience)[0]
          ] = newValue;
        }
      } else if (fieldName.startsWith("skills.") && sectionIndex) {
        const subField = fieldName.split(".")[1];
        const index = parseInt(sectionIndex);

        if (resumeData.skills[index]) {
          resumeData.skills[index][
            subField as keyof (typeof resumeData.skills)[0]
          ] = newValue;
        }
      } else if (fieldName.startsWith("projects.") && sectionIndex) {
        const subField = fieldName.split(".")[1];
        const index = parseInt(sectionIndex);

        if (resumeData.projects && resumeData.projects[index]) {
          resumeData.projects[index][
            subField as keyof (typeof resumeData.projects)[0]
          ] = newValue;
        }
      }

      setLocalData(resumeData);
      (setData as (data: ResumeData) => void)?.(resumeData);
    } else {
      const coverLetterData = { ...(localData as CoverLetterData) };

      if (fieldName === "name") {
        coverLetterData.personalInfo.name = newValue;
      } else if (fieldName === "email") {
        coverLetterData.personalInfo.email = newValue;
      } else if (fieldName === "phone") {
        coverLetterData.personalInfo.phone = newValue;
      } else if (fieldName === "location") {
        coverLetterData.personalInfo.location = newValue;
      } else if (fieldName === "recipientName") {
        coverLetterData.recipientInfo.name = newValue;
      } else if (fieldName === "recipientTitle") {
        coverLetterData.recipientInfo.title = newValue;
      } else if (fieldName === "recipientCompany") {
        coverLetterData.recipientInfo.company = newValue;
      } else if (fieldName === "jobTitle") {
        coverLetterData.jobInfo.title = newValue;
      } else if (fieldName === "jobReference") {
        coverLetterData.jobInfo.reference = newValue;
      } else if (fieldName === "experience") {
        coverLetterData.experience = newValue;
      } else if (fieldName === "skills") {
        coverLetterData.skills = newValue;
      } else if (fieldName === "motivation") {
        coverLetterData.motivation = newValue;
      } else if (fieldName === "closing") {
        coverLetterData.closing = newValue;
      }

      setLocalData(coverLetterData);
      (setData as (data: CoverLetterData) => void)?.(coverLetterData);
    }
  };

  const renderTemplate = (scale = 1.0) => {
    const editableProps = isEditMode
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          onBlur: handleContentEdit,
          className:
            "outline-none focus:ring-1 focus:ring-[#E67912] hover:bg-gray-50 transition-colors",
        }
      : {};

    const commonProps = {
      editMode: isEditMode,
      editableProps,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${PAGE_WIDTH}px`,
        minHeight: `${PAGE_HEIGHT}px`,
      },
    };

    if (type === "resume") {
      const resumeData = localData as ResumeData; // Use localData

      switch (selectedTemplate) {
        case "modern":
          return <ModernResumeTemplate data={resumeData} {...commonProps} />;
        case "minimalist":
          return (
            <MinimalistResumeTemplate data={resumeData} {...commonProps} />
          );
        case "creative":
          return <CreativeResumeTemplate data={resumeData} {...commonProps} />;
        case "professionalDark":
          return (
            <ProfessionalDarkTemplate data={resumeData} {...commonProps} />
          );
        case "professionalPurple":
          return (
            <ProfessionalPurpleTemplate data={resumeData} {...commonProps} />
          );
        case "professionalModern":
          return (
            <ProfessionalModernTemplate data={resumeData} {...commonProps} />
          );
        case "executive":
          return <ExecutiveResumeTemplate data={resumeData} {...commonProps} />;
        case "academic":
          return <AcademicResumeTemplate data={resumeData} {...commonProps} />;
        case "corporate":
          return <CorporateResumeTemplate data={resumeData} {...commonProps} />;
        case "elegant":
          return <ElegantResumeTemplate data={resumeData} {...commonProps} />;
        case "technical":
          return <TechnicalResumeTemplate data={resumeData} {...commonProps} />;
        case "professional":
        default:
          return (
            <ProfessionalResumeTemplate data={resumeData} {...commonProps} />
          );
      }
    } else {
      const coverLetterData = localData as CoverLetterData; // Use localData

      switch (selectedTemplate) {
        case "modern":
          return (
            <ModernCoverLetterTemplate
              data={coverLetterData}
              {...commonProps}
            />
          );
        case "minimalist":
          return (
            <MinimalistCoverLetterTemplate
              data={coverLetterData}
              {...commonProps}
            />
          );
        case "creative":
          return (
            <CreativeCoverLetterTemplate
              data={coverLetterData}
              {...commonProps}
            />
          );
        case "academic":
          return (
            <AcademicCoverLetterTemplate
              data={coverLetterData}
              {...commonProps}
            />
          );
        case "executive":
          return (
            <ExecutiveCoverLetterTemplate
              data={coverLetterData}
              {...commonProps}
            />
          );
        case "corporate":
          return (
            <CorporateCoverLetterTemplate
              data={coverLetterData}
              {...commonProps}
            />
          );
        case "technical":
          return (
            <TechnicalCoverLetterTemplate
              data={coverLetterData}
              {...commonProps}
            />
          );
        case "professional":
        default:
          return (
            <ProfessionalCoverLetterTemplate
              data={coverLetterData}
              {...commonProps}
            />
          );
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2 p-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleEditMode}
            className={`mr-2 text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912] ${
              isEditMode ? "bg-gray-100" : ""
            }`}
          >
            {isEditMode ? (
              <>
                <Eye className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">
                  {t("preview.viewbutton")}
                </span>
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">
                  {t("preview.editbutton")}
                </span>
              </>
            )}
          </Button>
          {isEditMode && (
            <p className="text-sm text-muted-foreground hidden sm:block">
              {t("preview.viewbuttondesc")}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="mr-2 text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t("preview.pdfbutton")}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-[#E67912] hover:bg-[#E67912] hover:text-white border-[#E67912]">
                  Exit Fullscreen
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center group cursor-pointer">
                  <Maximize2 />
                  <span className="  px-2 py-1 group-hover:text-white">
                    {t("preview.fullscreenbutton")}
                  </span>
                </div>
              </>
            )}
          </Button>
        </div>
      </div>

      <div
        className={`border border-gray-200 rounded-md mx-auto overflow-hidden ${
          isOverflowing ? "shadow-md" : ""
        }`}
        style={{
          width: `${PAGE_WIDTH / 1.2}px`,
          height: isOverflowing ? `${PAGE_HEIGHT / 1.2}px` : "auto",
          overflowY: isOverflowing ? "auto" : "visible",
        }}
        ref={documentRef}
      >
        {pages.map((pageIndex) => (
          <div
            key={pageIndex}
            id={`document-page-${pageIndex}`}
            className="bg-white"
            style={{
              width: `${PAGE_WIDTH / 1.2}px`,
              minHeight: `${PAGE_HEIGHT / 1.2}px`,
              boxSizing: "border-box",
              overflow: "hidden",
              position: "relative",
              breakAfter: "page",
              breakInside: "avoid",
            }}
          >
            {pageIndex === 0 && renderTemplate(1 / 1.2)}
          </div>
        ))}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl w-[95vw]">
          <DialogTitle>{t("preview.previewtext")}</DialogTitle>
          <div
            className="border border-gray-200 rounded-md overflow-auto max-h-[80vh]"
            style={{
              width: "100%",
            }}
          >
            {renderTemplate(0.83)}
          </div>
        </DialogContent>
      </Dialog>

      {/* Offscreen print container for html2canvas (do NOT use display: none or className="hidden") */}
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: `${PAGE_WIDTH}px`,
          minHeight: `${PAGE_HEIGHT}px`,
          pointerEvents: "none",
          opacity: 0,
          zIndex: -1,
        }}
        ref={printRef}
      >
        <div
          style={{ width: `${PAGE_WIDTH}px`, minHeight: `${PAGE_HEIGHT}px` }}
        >
          {renderTemplate(1.0)}
        </div>
      </div>
    </>
  );
};

export default DocumentPreview;
