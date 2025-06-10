import React from "react";
import { CoverLetterData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface ExecutiveCoverLetterTemplateProps {
  data: CoverLetterData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const ExecutiveCoverLetterTemplate: React.FC<
  ExecutiveCoverLetterTemplateProps
> = ({ data, editMode = false, editableProps = {} }) => {
  const { t } = useTranslation();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="font-serif p-4 max-w-[800px] mx-auto text-[10px] print:text-[9pt]">
      {/* Header with classic executive styling */}
      <div className="bg-gray-900 text-white p-4 mb-8 text-center">
        <h1
          className="text-[11px] font-semibold tracking-widest uppercase text-white"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("executivecoverLetter.yourName")}
        </h1>
        <div className="mt-2 flex justify-center flex-wrap gap-x-4 text-gray-300">
          <span
            className="text-[9px]"
            data-field="email"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.email || t("executivecoverLetter.yourEmail")}
          </span>
          <span
            className="text-[9px]"
            data-field="phone"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.phone || t("executivecoverLetter.yourPhone")}
          </span>
          <span
            className="text-[9px]"
            data-field="location"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.location ||
              t("executivecoverLetter.yourLocation")}
          </span>
        </div>
      </div>

      {/* Date and recipient info */}
      <div className="mb-6">
        <div className="text-right mb-6 text-[9px]">{formattedDate}</div>

        <div className="mb-6">
          <p
            className="font-semibold text-[9px]"
            data-field="recipientName"
            {...(editMode ? editableProps : {})}
          >
            {data.recipientInfo.name || t("executivecoverLetter.recipientName")}
          </p>
          <p
            className="text-[9px]"
            data-field="recipientTitle"
            {...(editMode ? editableProps : {})}
          >
            {data.recipientInfo.title ||
              t("executivecoverLetter.recipientTitle")}
          </p>
          <p
            className="font-semibold text-[9px]"
            data-field="recipientCompany"
            {...(editMode ? editableProps : {})}
          >
            {data.recipientInfo.company ||
              t("executivecoverLetter.recipientCompany")}
          </p>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-6">
        <p className="text-[9px]">
          {t("executivecoverLetter.dear")}{" "}
          {data.recipientInfo.name || t("executivecoverLetter.hiringManager")},
        </p>
      </div>

      {/* Introduction paragraph with job reference */}
      <div className="mb-4">
        <p className="text-justify text-[9px]">
          {t("executivecoverLetter.intro1")}
          <span data-field="jobTitle" {...(editMode ? editableProps : {})}>
            {data.jobInfo.title || t("executivecoverLetter.position")}
          </span>
          {t("executivecoverLetter.positionAppend")}
          {data.jobInfo.reference
            ? ` (${t("executivecoverLetter.reference")}: ${
                data.jobInfo.reference
              })`
            : ""}
          {t("executivecoverLetter.at")}
          {data.recipientInfo.company || t("executivecoverLetter.yourCompany")}
          {t("executivecoverLetter.intro2")}
        </p>
      </div>

      {/* Experience paragraph */}
      <div className="mb-4">
        <p
          className="text-justify text-[9px]"
          data-field="experience"
          {...(editMode ? editableProps : {})}
        >
          {data.experience}
        </p>
      </div>

      {/* Skills paragraph */}
      <div className="mb-4">
        <p
          className="text-justify text-[9px]"
          data-field="skills"
          {...(editMode ? editableProps : {})}
        >
          {data.skills}
        </p>
      </div>

      {/* Motivation paragraph */}
      <div className="mb-4">
        <p
          className="text-justify text-[9px]"
          data-field="motivation"
          {...(editMode ? editableProps : {})}
        >
          {data.motivation}
        </p>
      </div>

      {/* Closing */}
      <div className="mb-4">
        <p
          className="text-justify text-[9px]"
          data-field="closing"
          {...(editMode ? editableProps : {})}
        >
          {data.closing}
        </p>
      </div>

      {/* Signature */}
      <div className="mt-8">
        <p className="text-[9px]">{t("executivecoverLetter.sincerely")}</p>
        <p
          className="font-semibold mt-6 text-[9px]"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("executivecoverLetter.yourName")}
        </p>
      </div>
    </div>
  );
};

export default ExecutiveCoverLetterTemplate;
