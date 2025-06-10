import React from "react";
import { CoverLetterData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface CreativeCoverLetterTemplateProps {
  data: CoverLetterData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const CreativeCoverLetterTemplate: React.FC<
  CreativeCoverLetterTemplateProps
> = ({ data, editMode = false, editableProps = {} }) => {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="font-sans p-4 max-w-[800px] mx-auto text-[10px] print:text-[9pt]">
      <div className="bg-purple-500 text-white p-4 rounded-lg mb-6">
        <h1
          className="text-xl font-bold mb-1 text-white"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("creativecoverLetter.yourName")}
        </h1>
        <p
          className="text-purple-100 mb-0.5"
          data-field="location"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.location || t("creativecoverLetter.yourLocation")}
        </p>
        <p
          className="text-purple-100 mb-0.5"
          data-field="phone"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.phone || t("creativecoverLetter.yourPhone")}
        </p>
        <p
          className="text-purple-100"
          data-field="email"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.email || t("creativecoverLetter.yourEmail")}
        </p>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          {data.recipientInfo.name && (
            <p
              className="font-bold mb-0.5"
              data-field="recipientName"
              {...(editMode ? editableProps : {})}
            >
              {data.recipientInfo.name}
            </p>
          )}
          {data.recipientInfo.title && (
            <p
              className="text-gray-700 mb-0.5"
              data-field="recipientTitle"
              {...(editMode ? editableProps : {})}
            >
              {data.recipientInfo.title}
            </p>
          )}
          {data.recipientInfo.company && (
            <p
              className="text-purple-600 font-medium"
              data-field="recipientCompany"
              {...(editMode ? editableProps : {})}
            >
              {data.recipientInfo.company}
            </p>
          )}
        </div>
        <p className="text-gray-500 italic">{today}</p>
      </div>

      <div className="mb-2">
        <p className="mb-1.5 text-[10px] font-semibold">
          {t("creativecoverLetter.dear")}{" "}
          {data.recipientInfo.name || t("creativecoverLetter.hiringManager")},
        </p>

        <p className="mb-1.5 text-[9px] leading-tight">
          {t("creativecoverLetter.intro1")}
          <span data-field="jobTitle" {...(editMode ? editableProps : {})}>
            {data.jobInfo.title || t("creativecoverLetter.position")}
          </span>
          {t("creativecoverLetter.at")}
          {data.recipientInfo.company || t("creativecoverLetter.yourCompany")}
          {data.jobInfo.reference ? (
            <span
              data-field="jobReference"
              {...(editMode ? editableProps : {})}
            >
              {` (${t("creativecoverLetter.reference")}: ${
                data.jobInfo.reference
              })`}
            </span>
          ) : (
            ""
          )}
          .
        </p>

        {data.experience && (
          <p
            className="mb-1.5 text-[9px] leading-tight"
            data-field="experience"
            {...(editMode ? editableProps : {})}
          >
            {data.experience}
          </p>
        )}

        {data.skills && (
          <p
            className="mb-1.5 text-[9px] leading-tight"
            data-field="skills"
            {...(editMode ? editableProps : {})}
          >
            {data.skills}
          </p>
        )}

        {data.motivation && (
          <p
            className="mb-1.5 text-[9px] leading-tight"
            data-field="motivation"
            {...(editMode ? editableProps : {})}
          >
            {data.motivation}
          </p>
        )}

        {data.closing && (
          <p
            className="mb-1.5 text-[9px] leading-tight"
            data-field="closing"
            {...(editMode ? editableProps : {})}
          >
            {data.closing}
          </p>
        )}

        <div className="mt-4">
          <p className="mb-2">{t("creativecoverLetter.sincerely")}</p>
          <p className="text-[11px] font-semibold">
            {data.personalInfo.name || t("creativecoverLetter.yourName")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreativeCoverLetterTemplate;
