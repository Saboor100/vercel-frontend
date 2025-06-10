import React from "react";
import { CoverLetterData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface AcademicCoverLetterTemplateProps {
  data: CoverLetterData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const AcademicCoverLetterTemplate: React.FC<
  AcademicCoverLetterTemplateProps
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
      {/* Header with academic styling */}
      <div className="bg-emerald-700 text-white p-4 mb-8 text-center">
        <h1
          className="text-[11px] font-semibold tracking-wide text-white"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("academiccoverLetter.yourName")}
        </h1>
        <p className="text-[9px] mt-1 italic text-emerald-100">
          {t("academiccoverLetter.academicProfessional")}
        </p>
        <div className="mt-3 flex justify-center flex-wrap gap-x-6 text-emerald-100 text-[9px]">
          <span data-field="email" {...(editMode ? editableProps : {})}>
            {data.personalInfo.email || t("academiccoverLetter.yourEmail")}
          </span>
          <span data-field="phone" {...(editMode ? editableProps : {})}>
            {data.personalInfo.phone || t("academiccoverLetter.yourPhone")}
          </span>
          <span data-field="location" {...(editMode ? editableProps : {})}>
            {data.personalInfo.location ||
              t("academiccoverLetter.yourLocation")}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="text-right mb-8 text-[9px]">{formattedDate}</div>

      {/* Recipient info formatted for academic context */}
      <div className="mb-6 text-[9px]">
        <p
          className="font-semibold"
          data-field="recipientName"
          {...(editMode ? editableProps : {})}
        >
          {data.recipientInfo.name || t("academiccoverLetter.recipientName")},{" "}
          {data.recipientInfo.title || t("academiccoverLetter.recipientTitle")}
        </p>
        <p data-field="recipientCompany" {...(editMode ? editableProps : {})}>
          {data.recipientInfo.company ||
            t("academiccoverLetter.recipientCompany")}
        </p>
      </div>

      {/* Formal academic greeting */}
      <div className="mb-6 text-[9px]">
        <p>
          {t("academiccoverLetter.dearProfessor")}{" "}
          {data.recipientInfo.name || t("academiccoverLetter.hiringManager")},
        </p>
      </div>

      {/* Introduction paragraph with position reference */}
      <div className="mb-4 text-[9px]">
        <p className="text-justify">
          {t("academiccoverLetter.intro1")}
          {data.jobInfo.title || t("academiccoverLetter.position")}
          {t("academiccoverLetter.positionAppend")}
          {data.jobInfo.reference
            ? ` (${t("academiccoverLetter.reference")}: ${
                data.jobInfo.reference
              })`
            : ""}
          {t("academiccoverLetter.at")}
          {data.recipientInfo.company || t("academiccoverLetter.yourCompany")}
          {t("academiccoverLetter.intro2")}
        </p>
      </div>

      {/* Academic Experience paragraph */}
      <div className="mb-4 text-[9px]">
        <div className="font-semibold text-emerald-800 mb-2">
          {t("academiccoverLetter.academicBackground")}
        </div>
        <p
          className="text-justify"
          data-field="experience"
          {...(editMode ? editableProps : {})}
        >
          {data.experience}
        </p>
      </div>

      {/* Academic Skills paragraph */}
      <div className="mb-4 text-[9px]">
        <div className="font-semibold text-emerald-800 mb-2">
          {t("academiccoverLetter.researchAndTeachingCompetencies")}
        </div>
        <p
          className="text-justify"
          data-field="skills"
          {...(editMode ? editableProps : {})}
        >
          {data.skills}
        </p>
      </div>

      {/* Academic Motivation paragraph */}
      <div className="mb-4 text-[9px]">
        <div className="font-semibold text-emerald-800 mb-2">
          {t("academiccoverLetter.interestInYourInstitution")}
        </div>
        <p
          className="text-justify"
          data-field="motivation"
          {...(editMode ? editableProps : {})}
        >
          {data.motivation}
        </p>
      </div>

      {/* Formal academic closing */}
      <div className="mb-6 text-[9px]">
        <p
          className="text-justify"
          data-field="closing"
          {...(editMode ? editableProps : {})}
        >
          {data.closing}
        </p>
      </div>

      {/* Academic signature block */}
      <div className="mt-10 text-[9px]">
        <p>{t("academiccoverLetter.respectfullySubmitted")}</p>
        <p
          className="font-semibold mt-8"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("academiccoverLetter.yourName")}
        </p>
      </div>
    </div>
  );
};

export default AcademicCoverLetterTemplate;
