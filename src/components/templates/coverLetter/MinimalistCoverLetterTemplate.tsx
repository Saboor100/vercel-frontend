import React from "react";
import { CoverLetterData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface MinimalistCoverLetterTemplateProps {
  data: CoverLetterData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const MinimalistCoverLetterTemplate: React.FC<
  MinimalistCoverLetterTemplateProps
> = ({ data, editMode = false, editableProps = {} }) => {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="font-serif p-6 max-w-[800px] mx-auto text-[10px] print:text-[9pt] text-black bg-white border-2 border-gray-200 shadow-lg">
      <div className="text-left mb-4">
        <h2 className="text-[16px] font-semibold mb-3 text-center text-gray-800 border-b-2 border-gray-300 pb-2">
          {t("minimalistcoverLetter.coverLetter")}
        </h2>

        <div className="mb-4">
          <div className="mb-2">
            <p
              className="mb-1 text-[11px] font-semibold"
              data-field="name"
              {...(editMode ? editableProps : {})}
            >
              {data.personalInfo.name || t("minimalistcoverLetter.yourName")}
            </p>
            <p
              className="mb-0.5 text-[9px]"
              data-field="location"
              {...(editMode ? editableProps : {})}
            >
              {data.personalInfo.location ||
                t("minimalistcoverLetter.yourLocation")}
            </p>
            <p
              className="mb-0.5 text-[9px]"
              data-field="phone"
              {...(editMode ? editableProps : {})}
            >
              {data.personalInfo.phone || t("minimalistcoverLetter.yourPhone")}
            </p>
            <p
              className="text-[9px]"
              data-field="email"
              {...(editMode ? editableProps : {})}
            >
              {data.personalInfo.email || t("minimalistcoverLetter.yourEmail")}
            </p>
          </div>

          <p className="text-[9px] mb-4">{today}</p>

          <div className="mt-4">
            <h3 className="text-[12px] font-semibold text-gray-700 mb-2">
              {t("minimalistcoverLetter.recipientInformation")}
            </h3>
            {data.recipientInfo.name && (
              <p
                className="mb-0.5 text-[9px]"
                data-field="recipientName"
                {...(editMode ? editableProps : {})}
              >
                {data.recipientInfo.name}
              </p>
            )}
            {data.recipientInfo.title && (
              <p
                className="mb-0.5 text-[9px]"
                data-field="recipientTitle"
                {...(editMode ? editableProps : {})}
              >
                {data.recipientInfo.title}
              </p>
            )}
            {data.recipientInfo.company && (
              <p
                className="text-[9px]"
                data-field="recipientCompany"
                {...(editMode ? editableProps : {})}
              >
                {data.recipientInfo.company}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-[12px] font-semibold text-gray-700 mb-2">
            {t("minimalistcoverLetter.dear")}{" "}
            {data.recipientInfo.name ||
              t("minimalistcoverLetter.hiringManager")}
            ,
          </h3>
          <p className="mb-1.5 text-[9px] leading-tight">
            {t("minimalistcoverLetter.intro1")}
            <span data-field="jobTitle" {...(editMode ? editableProps : {})}>
              {data.jobInfo.title || t("minimalistcoverLetter.position")}
            </span>
            {t("minimalistcoverLetter.at")}
            {data.recipientInfo.company ||
              t("minimalistcoverLetter.yourCompany")}
            {data.jobInfo.reference ? (
              <span
                data-field="jobReference"
                {...(editMode ? editableProps : {})}
              >
                {` (${t("minimalistcoverLetter.reference")}: ${
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
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold">
            {t("minimalistcoverLetter.sincerely")}
          </p>
          <p className="text-[11px] font-semibold">
            {data.personalInfo.name || t("minimalistcoverLetter.yourName")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinimalistCoverLetterTemplate;
