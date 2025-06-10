import React from "react";
import { ResumeData } from "@/types/documents";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

interface MinimalistResumeTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const MinimalistResumeTemplate: React.FC<MinimalistResumeTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-sans p-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-200 pb-6 mb-8 gap-4">
        <div>
          <h1
            className="text-3xl font-light tracking-wide text-gray-800 mb-2"
            data-field="name"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.name || t("minimalistResume.yourName")}
          </h1>
          <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
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
              <a
                href={`https://${data.personalInfo.linkedin.replace(
                  "https://",
                  ""
                )}`}
                className="text-gray-600 hover:text-gray-900"
                data-field="linkedin"
                {...(editMode ? { ...editableProps, href: undefined } : {})}
              >
                {data.personalInfo.linkedin
                  .replace("https://www.linkedin.com/in/", "")
                  .replace("https://linkedin.com/in/", "")}
              </a>
            )}
          </div>
        </div>

        {data.personalInfo.photo && (
          <Avatar className="rounded-full w-full max-w-[100px] h-auto  border border-gray-200">
            <AvatarImage
              src={data.personalInfo.photo}
              alt={data.personalInfo.name}
            />
            <AvatarFallback>
              {data.personalInfo.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {data.summary && (
        <div className="mb-10">
          <p
            className="text-gray-700 leading-relaxed"
            data-field="summary"
            {...(editMode ? editableProps : {})}
          >
            {data.summary}
          </p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-normal tracking-wide text-gray-800 mb-4 uppercase">
            {t("minimalistResume.experience")}
          </h2>
          {data.experience.map((exp, index) =>
            exp.company || exp.position ? (
              <div key={index} className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3
                    className="text-md font-medium"
                    data-field={`experience.position`}
                    data-index={index.toString()}
                    {...(editMode ? editableProps : {})}
                  >
                    {exp.position || t("minimalistResume.position")}
                  </h3>
                  <span
                    className="text-sm text-gray-500"
                    data-field={`experience.date`}
                    data-index={index.toString()}
                    {...(editMode ? editableProps : {})}
                  >
                    {exp.date || t("minimalistResume.date")}
                  </span>
                </div>
                <h4
                  className="text-sm text-gray-600 mb-2"
                  data-field={`experience.company`}
                  data-index={index.toString()}
                  {...(editMode ? editableProps : {})}
                >
                  {exp.company || t("minimalistResume.company")}
                </h4>
                {exp.description && (
                  <p
                    className="text-xs mt-1 space-y-0.5 break-words"
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
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-normal tracking-wide text-gray-800 mb-4 uppercase">
            {t("minimalistResume.projects")}
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <h3 className="text-md font-medium">
                  {project.name || t("minimalistResume.projectName")}
                </h3>
                {project.date && (
                  <span className="text-sm text-gray-500">{project.date}</span>
                )}
              </div>
              {project.technologies && (
                <p className="text-sm text-gray-600 mb-1">
                  {project.technologies}
                </p>
              )}
              {project.description && (
                <p className="text-xs mt-1 space-y-0.5 break-words">
                  {project.description}
                </p>
              )}
              {project.link && (
                <div className="text-sm text-gray-600 hover:text-gray-900 mt-1 inline-block">
                  {project.link}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-normal tracking-wide text-gray-800 mb-4 uppercase">
            {t("minimalistResume.education")}
          </h2>
          {data.education.map((edu, index) =>
            edu.institution || edu.degree ? (
              <div key={index} className="mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3
                    className="text-md font-medium"
                    data-field={`education.degree`}
                    data-index={index.toString()}
                    {...(editMode ? editableProps : {})}
                  >
                    {edu.degree || t("minimalistResume.degree")}
                  </h3>
                  <span
                    className="text-sm text-gray-500"
                    data-field={`education.date`}
                    data-index={index.toString()}
                    {...(editMode ? editableProps : {})}
                  >
                    {edu.date || t("minimalistResume.date")}
                  </span>
                </div>
                <h4
                  className="text-sm text-gray-600 mb-1"
                  data-field={`education.institution`}
                  data-index={index.toString()}
                  {...(editMode ? editableProps : {})}
                >
                  {edu.institution || t("minimalistResume.institution")}
                </h4>
                {edu.description && (
                  <p
                    className="text-xs mt-1 space-y-0.5 break-words"
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
      )}

      {data.skills && data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-normal tracking-wide text-gray-800 mb-4 uppercase">
            {t("minimalistResume.skills")}
          </h2>
          {data.skills.map((skill, index) =>
            skill.skills ? (
              <div key={index} className="mb-3">
                <h3
                  className="text-md font-medium mb-2"
                  data-field={`skills.category`}
                  data-index={index.toString()}
                  {...(editMode ? editableProps : {})}
                >
                  {skill.category}
                </h3>
                <p
                  className="text-sm text-gray-700"
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
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-normal tracking-wide text-gray-800 mb-4 uppercase">
            {t("minimalistResume.languages")}
          </h2>
          <div className="flex flex-wrap gap-6">
            {data.languages.map((lang, index) => (
              <div key={index}>
                <p className="text-md font-medium mb-1">{lang.language}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full mr-1 ${
                        i < lang.proficiency ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interests Section */}
      {data.interests && data.interests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-normal tracking-wide text-gray-800 mb-4 uppercase">
            {t("minimalistResume.interests")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <>
          {data.customSections.map((section, index) => (
            <div key={index} className="mt-8">
              <h2 className="text-lg font-normal tracking-wide text-gray-800 mb-4 uppercase">
                {section.title}
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MinimalistResumeTemplate;
