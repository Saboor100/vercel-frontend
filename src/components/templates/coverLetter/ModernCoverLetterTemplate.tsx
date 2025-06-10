import React from "react";
import { CoverLetterData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface ModernCoverLetterTemplateProps {
  data: CoverLetterData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const ModernCoverLetterTemplate: React.FC<ModernCoverLetterTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="font-serif p-4 max-w-[800px] mx-auto text-[10px] print:text-[9pt]">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-4 border-b-2 border-blue-400">
        <div>
          <h1
            className="text-[11px] font-semibold text-blue-600 mb-1"
            data-field="name"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.name || t("moderncoverLetter.yourName")}
          </h1>
          <p
            className="text-gray-600 text-[9px]"
            data-field="location"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.location || t("moderncoverLetter.yourLocation")}
          </p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <p
            className="mb-1 text-[9px]"
            data-field="phone"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.phone || t("moderncoverLetter.yourPhone")}
          </p>
          <p
            className="mb-1 text-[9px]"
            data-field="email"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.email || t("moderncoverLetter.yourEmail")}
          </p>
          <p className="text-[9px] text-gray-500">{today}</p>
        </div>
      </div>

      <div className="mb-6">
        {data.recipientInfo.name && (
          <p className="font-semibold text-[9px] mb-1">
            {data.recipientInfo.name}
          </p>
        )}
        {data.recipientInfo.title && (
          <p className="mb-1 text-[9px]">{data.recipientInfo.title}</p>
        )}
        {data.recipientInfo.company && (
          <p className="font-semibold text-[9px] mb-1">
            {data.recipientInfo.company}
          </p>
        )}
      </div>

      <div className="space-y-4 text-gray-700">
        <p className="font-semibold text-[9px]">
          {t("moderncoverLetter.dear")}{" "}
          {data.recipientInfo.name || t("moderncoverLetter.hiringManager")},
        </p>

        <p className="text-[9px]">
          {t("moderncoverLetter.intro1")}
          <span className="text-blue-600 font-semibold">
            {data.jobInfo.title || t("moderncoverLetter.position")}
          </span>
          {t("moderncoverLetter.at")}
          {data.recipientInfo.company || t("moderncoverLetter.yourCompany")}
          {data.jobInfo.reference
            ? ` (${t("moderncoverLetter.reference")}: ${
                data.jobInfo.reference
              })`
            : ""}
          .
        </p>

        {data.experience && <p className="text-[9px]">{data.experience}</p>}

        {data.skills && <p className="text-[9px]">{data.skills}</p>}

        {data.motivation && <p className="text-[9px]">{data.motivation}</p>}

        {data.closing && <p className="text-[9px]">{data.closing}</p>}

        <div className="mt-8">
          <p className="mb-4 text-[9px]">{t("moderncoverLetter.sincerely")}</p>
          <p className="text-blue-600 font-semibold text-[9px]">
            {data.personalInfo.name || t("moderncoverLetter.yourName")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernCoverLetterTemplate;
