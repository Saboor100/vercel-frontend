import React from "react";
import { CoverLetterData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface CorporateCoverLetterTemplateProps {
  data: CoverLetterData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const CorporateCoverLetterTemplate: React.FC<
  CorporateCoverLetterTemplateProps
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
      {/* Corporate header */}
      <div className="bg-blue-800 text-white p-4 mb-6">
        <div className="flex justify-between items-center">
          <h1
            className="text-[11px] font-semibold text-white"
            data-field="name"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.name || t("corporatecoverLetter.yourName")}
          </h1>
          <div className="text-right">
            <div className="text-[9px]">
              {t("corporatecoverLetter.professionalApplication")}
            </div>
            <div className="text-[8px] mt-1">
              {t("corporatecoverLetter.corporateCoverLetter")}
            </div>
          </div>
        </div>
      </div>

      {/* Contact information */}
      <div className="mb-8 flex flex-wrap justify-between items-center text-[9px]">
        <div className="space-y-1">
          <div
            className="flex items-center"
            data-field="email"
            {...(editMode ? editableProps : {})}
          >
            <span className="w-5 inline-block">✉️</span>
            <span>
              {data.personalInfo.email || t("corporatecoverLetter.yourEmail")}
            </span>
          </div>
          <div
            className="flex items-center"
            data-field="phone"
            {...(editMode ? editableProps : {})}
          >
            <span className="w-5 inline-block">📱</span>
            <span>
              {data.personalInfo.phone || t("corporatecoverLetter.yourPhone")}
            </span>
          </div>
          <div
            className="flex items-center"
            data-field="location"
            {...(editMode ? editableProps : {})}
          >
            <span className="w-5 inline-block">📍</span>
            <span>
              {data.personalInfo.location ||
                t("corporatecoverLetter.yourLocation")}
            </span>
          </div>
        </div>
        <div className="text-right text-[9px]">{formattedDate}</div>
      </div>

      {/* Position header */}
      <div className="mb-8 bg-blue-50 p-4 border-l-4 border-blue-800 text-[9px]">
        <h2 className="text-[10px] font-semibold">
          {t("corporatecoverLetter.position")}:{" "}
          {data.jobInfo.title || t("corporatecoverLetter.positionPlaceholder")}
        </h2>
        {data.jobInfo.reference && (
          <p className="text-[8px] mt-1">
            {t("corporatecoverLetter.reference")}: {data.jobInfo.reference}
          </p>
        )}
      </div>

      {/* Recipient information */}
      <div className="mb-6 text-[9px]">
        <p
          className="font-semibold"
          data-field="recipientName"
          {...(editMode ? editableProps : {})}
        >
          {data.recipientInfo.name || t("corporatecoverLetter.recipientName")}
        </p>
        <p data-field="recipientTitle" {...(editMode ? editableProps : {})}>
          {data.recipientInfo.title || t("corporatecoverLetter.recipientTitle")}
        </p>
        <p
          className="font-semibold"
          data-field="recipientCompany"
          {...(editMode ? editableProps : {})}
        >
          {data.recipientInfo.company ||
            t("corporatecoverLetter.recipientCompany")}
        </p>
      </div>

      {/* Greeting */}
      <div className="mb-6 text-[9px]">
        <p>
          {t("corporatecoverLetter.dear")}{" "}
          {data.recipientInfo.name || t("corporatecoverLetter.hiringManager")},
        </p>
      </div>

      {/* Introduction */}
      <div className="mb-5 text-[9px]">
        <p>
          {t("corporatecoverLetter.intro1")}
          {data.jobInfo.title || t("corporatecoverLetter.positionPlaceholder")}
          {t("corporatecoverLetter.positionAppend")}
          {t("corporatecoverLetter.at")}
          {data.recipientInfo.company || t("corporatecoverLetter.yourCompany")}
          {t("corporatecoverLetter.intro2")}
        </p>
      </div>

      {/* Professional Experience paragraph */}
      <div className="mb-5 text-[9px]">
        <h3 className="text-blue-800 font-semibold text-[8px] uppercase border-b border-blue-200 pb-1 mb-2">
          {t("corporatecoverLetter.professionalExperience")}
        </h3>
        <p data-field="experience" {...(editMode ? editableProps : {})}>
          {data.experience}
        </p>
      </div>

      {/* Skills paragraph */}
      <div className="mb-5 text-[9px]">
        <h3 className="text-blue-800 font-semibold text-[8px] uppercase border-b border-blue-200 pb-1 mb-2">
          {t("corporatecoverLetter.coreCompetencies")}
        </h3>
        <p data-field="skills" {...(editMode ? editableProps : {})}>
          {data.skills}
        </p>
      </div>

      {/* Company-specific motivation */}
      <div className="mb-5 text-[9px]">
        <h3 className="text-blue-800 font-semibold text-[8px] uppercase border-b border-blue-200 pb-1 mb-2">
          {t("corporatecoverLetter.why")}{" "}
          {data.recipientInfo.company || t("corporatecoverLetter.yourCompany")}
        </h3>
        <p data-field="motivation" {...(editMode ? editableProps : {})}>
          {data.motivation}
        </p>
      </div>

      {/* Closing paragraph */}
      <div className="mb-5 text-[9px]">
        <p data-field="closing" {...(editMode ? editableProps : {})}>
          {data.closing}
        </p>
      </div>

      {/* Signature */}
      <div className="mt-10 mb-5 text-[9px]">
        <p>{t("corporatecoverLetter.sincerely")}</p>
        <p
          className="font-semibold mt-6"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("corporatecoverLetter.yourName")}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-[8px] text-gray-500 border-t pt-2 mt-10">
        <p>
          {t("corporatecoverLetter.applicationFor")}{" "}
          {data.jobInfo.title || t("corporatecoverLetter.positionPlaceholder")}
          {t("corporatecoverLetter.at")}
          {data.recipientInfo.company || t("corporatecoverLetter.yourCompany")}
        </p>
      </div>
    </div>
  );
};

export default CorporateCoverLetterTemplate;
