import React from "react";
import { ResumeData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface ProfessionalResumeTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const ProfessionalResumeTemplate: React.FC<ProfessionalResumeTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();

  // DEBUG: Log summary every render
  console.log(
    "ProfessionalResumeTemplate data.summary:",
    JSON.stringify(data.summary)
  );

  return (
    <div className="font-serif p-6 max-w-[800px] mx-auto text-sm bg-white shadow-md rounded-md">
      <div className="text-center mb-6">
        {data.personalInfo.photo && (
          <img
            src={data.personalInfo.photo}
            alt={t("professionalresume.profilePhotoAlt")}
            className="w-full max-w-[100px] h-auto rounded-full mx-auto mb-3 object-cover border border-gray-300 shadow-sm"
          />
        )}
        <h1
          className="text-2xl font-bold text-gray-800"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("professionalresume.yourName")}
        </h1>
        <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
          {data.personalInfo.location && (
            <span data-field="location" {...(editMode ? editableProps : {})}>
              {data.personalInfo.location}
            </span>
          )}
          {data.personalInfo.email && (
            <span data-field="email" {...(editMode ? editableProps : {})}>
              {data.personalInfo.email}
            </span>
          )}
          {data.personalInfo.phone && (
            <span data-field="phone" {...(editMode ? editableProps : {})}>
              {data.personalInfo.phone}
            </span>
          )}
          {data.personalInfo.linkedin && (
            <span>
              <a
                href={`https://${data.personalInfo.linkedin.replace(
                  "https://",
                  ""
                )}`}
                className="hover:underline"
                data-field="linkedin"
                {...(editMode ? { ...editableProps, href: undefined } : {})}
              >
                {data.personalInfo.linkedin
                  .replace("https://www.linkedin.com/in/", "")
                  .replace("https://linkedin.com/in/", "")}
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Always show summary for debugging and user transparency */}
      <div className="mb-6">
        <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2 text-gray-800">
          {t("professionalresume.summary")}
        </h2>
        <p
          className="text-xs leading-snug text-gray-700"
          data-field="summary"
          {...(editMode ? editableProps : {})}
          style={{
            fontStyle: !data.summary?.trim() ? "italic" : undefined,
            color: !data.summary?.trim() ? "#aaa" : undefined,
          }}
        >
          {data.summary && data.summary.trim()
            ? data.summary
            : t("professionalresume.noSummary")}
        </p>
      </div>

      {data.experience?.some((exp) => exp.company || exp.position) && (
        <div className="mb-6">
          <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2 text-gray-800">
            {t("professionalresume.experience")}
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp, index) =>
              exp.company || exp.position ? (
                <div key={index}>
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className="text-sm font-semibold"
                        data-field={`experience.position`}
                        data-index={index.toString()}
                        {...(editMode ? editableProps : {})}
                      >
                        {exp.position || t("professionalresume.position")}
                      </h3>
                      <h4
                        className="text-xs text-gray-700"
                        data-field={`experience.company`}
                        data-index={index.toString()}
                        {...(editMode ? editableProps : {})}
                      >
                        {exp.company || t("professionalresume.company")}
                      </h4>
                    </div>
                    <span
                      className="text-xs text-gray-500"
                      data-field={`experience.date`}
                      data-index={index.toString()}
                      {...(editMode ? editableProps : {})}
                    >
                      {exp.date || t("professionalresume.date")}
                    </span>
                  </div>
                  {exp.description && (
                    <p
                      className="text-xs mt-1 text-gray-700"
                      data-field={`experience.description`}
                      data-index={index.toString()}
                      {...(editMode ? editableProps : {})}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {data.projects &&
        data.projects.some(
          (project) => project.name || project.description
        ) && (
          <div className="mb-6">
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2 text-gray-800">
              {t("professionalresume.projects")}
            </h2>
            <div className="space-y-3">
              {data.projects.map((project, index) =>
                project.name || project.description ? (
                  <div key={index}>
                    <div className="flex justify-between">
                      <div>
                        <h3
                          className="text-sm font-semibold"
                          data-field={`projects.name`}
                          data-index={index.toString()}
                          {...(editMode ? editableProps : {})}
                        >
                          {project.name || t("professionalresume.projectName")}
                        </h3>
                        {project.technologies && (
                          <h4 className="text-xs italic text-gray-600">
                            {project.technologies}
                          </h4>
                        )}
                      </div>
                      {project.date && (
                        <span
                          className="text-xs text-gray-500"
                          data-field={`projects.date`}
                          data-index={index.toString()}
                          {...(editMode ? editableProps : {})}
                        >
                          {project.date}
                        </span>
                      )}
                    </div>
                    {project.description && (
                      <p
                        className="text-xs mt-1 text-gray-700"
                        data-field={`projects.description`}
                        data-index={index.toString()}
                        {...(editMode ? editableProps : {})}
                      >
                        {project.description}
                      </p>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-xs hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.link}
                      </a>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

      {data.education?.some((edu) => edu.institution || edu.degree) && (
        <div className="mb-6">
          <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2 text-gray-800">
            {t("professionalresume.education")}
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) =>
              edu.institution || edu.degree ? (
                <div key={index}>
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className="text-sm font-semibold"
                        data-field={`education.degree`}
                        data-index={index.toString()}
                        {...(editMode ? editableProps : {})}
                      >
                        {edu.degree || t("professionalresume.degree")}
                      </h3>
                      <h4
                        className="text-xs text-gray-700"
                        data-field={`education.institution`}
                        data-index={index.toString()}
                        {...(editMode ? editableProps : {})}
                      >
                        {edu.institution || t("professionalresume.institution")}
                      </h4>
                    </div>
                    <span
                      className="text-xs text-gray-500"
                      data-field={`education.date`}
                      data-index={index.toString()}
                      {...(editMode ? editableProps : {})}
                    >
                      {edu.date || t("professionalresume.date")}
                    </span>
                  </div>
                  {edu.description && (
                    <p
                      className="text-xs mt-1 text-gray-700"
                      data-field={`education.description`}
                      data-index={index.toString()}
                      {...(editMode ? editableProps : {})}
                    >
                      {edu.description}
                    </p>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {data?.certifications?.some((cert) => cert.name || cert.title) && (
        <div className="mb-6">
          <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2 text-gray-800">
            {t("professionalresume.certifications")}
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex justify-between text-xs text-gray-700"
              >
                <div>
                  {cert.title && (
                    <span className="italic mr-2 text-gray-600">
                      {cert.title}
                    </span>
                  )}
                  <span className="font-medium">{cert.name}</span>
                </div>
                <span>{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills?.some((skill) => skill.skills) && (
        <div className="mb-6">
          <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2 text-gray-800">
            {t("professionalresume.skills")}
          </h2>
          <div className="space-y-2">
            {data.skills.map((skill, index) =>
              skill.skills ? (
                <div key={index}>
                  <h3
                    className="text-sm font-semibold text-gray-700"
                    data-field={`skills.category`}
                    data-index={index.toString()}
                    {...(editMode ? editableProps : {})}
                  >
                    {skill.category}
                  </h3>
                  <p
                    className="text-xs text-gray-700"
                    data-field={`skills.skills`}
                    data-index={index.toString()}
                    {...(editMode ? editableProps : {})}
                  >
                    {skill.skills}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {data?.customSections && data.customSections.length > 0 && (
        <div className="mb-6">
          {data.customSections.map((section, index) =>
            section.content ? (
              <div key={index} className="mb-4">
                <h2
                  className="text-base font-semibold border-b border-gray-300 pb-1 mb-2 text-gray-800"
                  data-field={`customSections.title`}
                  data-index={index.toString()}
                  {...(editMode ? editableProps : {})}
                >
                  {section.title}
                </h2>
                <p
                  className="text-xs text-gray-700"
                  data-field={`customSections.content`}
                  data-index={index.toString()}
                  {...(editMode ? editableProps : {})}
                >
                  {section.content}
                </p>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessionalResumeTemplate;
