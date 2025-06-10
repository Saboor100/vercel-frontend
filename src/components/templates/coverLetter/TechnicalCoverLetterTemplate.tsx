import React from "react";
import { CoverLetterData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface TechnicalCoverLetterTemplateProps {
  data: CoverLetterData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const TechnicalCoverLetterTemplate: React.FC<
  TechnicalCoverLetterTemplateProps
> = ({ data, editMode = false, editableProps = {} }) => {
  const { t } = useTranslation();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="font-sans p-4 max-w-[800px] mx-auto text-[10px] print:text-[9pt]">
      {/* Header with technical styling */}
      <div className="bg-indigo-700 text-white p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1
            className="text-[11px] font-semibold mb-2 md:mb-0 text-white"
            data-field="name"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.name || t("technicalcoverLetter.yourName")}
          </h1>
          <div className="flex flex-wrap gap-4 text-[9px]">
            <div
              className="flex items-center"
              data-field="email"
              {...(editMode ? editableProps : {})}
            >
              <span className="mr-1">✉️</span>
              <span>
                {data.personalInfo.email || t("technicalcoverLetter.yourEmail")}
              </span>
            </div>
            <div
              className="flex items-center"
              data-field="phone"
              {...(editMode ? editableProps : {})}
            >
              <span className="mr-1">📱</span>
              <span>
                {data.personalInfo.phone || t("technicalcoverLetter.yourPhone")}
              </span>
            </div>
            <div
              className="flex items-center"
              data-field="location"
              {...(editMode ? editableProps : {})}
            >
              <span className="mr-1">📍</span>
              <span>
                {data.personalInfo.location ||
                  t("technicalcoverLetter.yourLocation")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary header with job title */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
        <h2 className="text-[10px] font-bold">
          {t("technicalcoverLetter.application")}:{" "}
          {data.jobInfo.title || t("technicalcoverLetter.position")}
        </h2>
        {data.jobInfo.reference && (
          <p className="text-[9px] text-gray-600">
            {t("technicalcoverLetter.reference")}: {data.jobInfo.reference}
          </p>
        )}
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
            {data.recipientInfo.name || t("technicalcoverLetter.recipientName")}
          </p>
          <p
            className="text-[9px]"
            data-field="recipientTitle"
            {...(editMode ? editableProps : {})}
          >
            {data.recipientInfo.title ||
              t("technicalcoverLetter.recipientTitle")}
          </p>
          <p
            className="text-[9px]"
            data-field="recipientCompany"
            {...(editMode ? editableProps : {})}
          >
            {data.recipientInfo.company ||
              t("technicalcoverLetter.recipientCompany")}
          </p>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-5">
        <p className="text-[9px]">
          {t("technicalcoverLetter.dear")}{" "}
          {data.recipientInfo.name || t("technicalcoverLetter.hiringManager")},
        </p>
      </div>

      {/* Introduction */}
      <div className="mb-4">
        <p className="text-[9px]">
          {t("technicalcoverLetter.intro1")}
          {data.jobInfo.title || t("technicalcoverLetter.position")}
          {t("technicalcoverLetter.at")}
          {data.recipientInfo.company || t("technicalcoverLetter.yourCompany")}
          {t("technicalcoverLetter.intro2")}
        </p>
      </div>

      {/* Technical Experience paragraph with styling */}
      <div className="mb-4">
        <h3 className="text-[9px] font-bold text-indigo-700 uppercase mb-2">
          {t("technicalcoverLetter.technicalExperience")}
        </h3>
        <p
          className="text-[9px]"
          data-field="experience"
          {...(editMode ? editableProps : {})}
        >
          {data.experience}
        </p>
      </div>

      {/* Technical Skills paragraph with styling */}
      <div className="mb-4">
        <h3 className="text-[9px] font-bold text-indigo-700 uppercase mb-2">
          {t("technicalcoverLetter.technicalSkills")}
        </h3>
        <p
          className="text-[9px]"
          data-field="skills"
          {...(editMode ? editableProps : {})}
        >
          {data.skills}
        </p>
      </div>

      {/* Motivation paragraph with styling */}
      <div className="mb-4">
        <h3 className="text-[9px] font-bold text-indigo-700 uppercase mb-2">
          {t("technicalcoverLetter.whyInterested")}
        </h3>
        <p
          className="text-[9px]"
          data-field="motivation"
          {...(editMode ? editableProps : {})}
        >
          {data.motivation}
        </p>
      </div>

      {/* Closing */}
      <div className="mb-6">
        <p
          className="text-[9px]"
          data-field="closing"
          {...(editMode ? editableProps : {})}
        >
          {data.closing}
        </p>
      </div>

      {/* Signature with technical styling */}
      <div className="mt-8">
        <p className="mb-1 text-[9px]">{t("technicalcoverLetter.sincerely")}</p>
        <div
          className="font-semibold text-indigo-700 text-[9px]"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("technicalcoverLetter.yourName")}
        </div>
        <div className="mt-1 bg-indigo-100 h-1 w-32"></div>
      </div>
    </div>
  );
};

export default TechnicalCoverLetterTemplate;
