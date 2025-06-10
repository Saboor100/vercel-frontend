import React from "react";
import { ResumeData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface CreativeResumeTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const CreativeResumeTemplate: React.FC<CreativeResumeTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-sans p-2 mx-auto">
      <div className="bg-purple-500 text-white p-8 rounded-lg mb-8">
        <div className="flex justify-center items-center">
          {data.personalInfo.photo ? (
            <img
              src={data.personalInfo.photo}
              alt={data.personalInfo.name}
              className="w-full max-w-[100px] h-auto object-cover rounded"
            />
          ) : (
            <div className="w-24 h-24 bg-purple-100 flex items-center justify-center rounded">
              <span className="text-2xl font-bold text-purple-700 ">
                {data.personalInfo.name ? data.personalInfo.name.charAt(0) : ""}
              </span>
            </div>
          )}
        </div>

        <h1
          className="text-4xl font-bold mb-2 text-white flex justify-center items-center"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || t("creativeResume.yourName")}
        </h1>

        <div className="flex flex-wrap gap-4 text-purple-100  justify-center items-center">
          {data.personalInfo.email && (
            <a
              href={`mailto:${data.personalInfo.email}`}
              className="hover:text-white"
              data-field="email"
              {...(editMode ? { ...editableProps, href: undefined } : {})}
            >
              {data.personalInfo.email}
            </a>
          )}
          {data.personalInfo.phone && (
            <span data-field="phone" {...(editMode ? editableProps : {})}>
              {data.personalInfo.phone}
            </span>
          )}
          {data.personalInfo.location && (
            <span data-field="location" {...(editMode ? editableProps : {})}>
              {data.personalInfo.location}
            </span>
          )}
          {data.personalInfo.linkedin && (
            <a
              href={`https://${data.personalInfo.linkedin.replace(
                "https://",
                ""
              )}`}
              className="hover:text-white"
              data-field="linkedin"
              {...(editMode ? { ...editableProps, href: undefined } : {})}
            >
              {data.personalInfo.linkedin}
            </a>
          )}
        </div>
      </div>

      {data.summary && (
        <div className="mb-2 bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
          <h2 className="text-md font-bold text-purple-700 mb-3">
            {t("creativeResume.aboutMe")}
          </h2>
          <p
            className="text-xs mt-1 space-y-0.5 break-words"
            data-field="summary"
            {...(editMode ? editableProps : {})}
          >
            {data.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {data.experience?.length > 0 && (
            <div className="mb-2">
              <h2 className="text-md font-bold text-purple-700 mb-2 flex items-center">
                <span className="bg-purple-500 w-8 h-8 rounded-full mr-2"></span>
                {t("creativeResume.workExperience")}
              </h2>
              {data.experience.map((exp, index) =>
                exp.company || exp.position ? (
                  <div
                    key={index}
                    className="mb-6 relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-purple-400 before:rounded-full"
                  >
                    <h3 className="text-md font-bold">
                      {exp.position || t("creativeResume.position")}
                    </h3>
                    <div className="flex justify-between">
                      <h4 className="text-purple-600 font-normal text-xs">
                        {exp.company || t("creativeResume.company")}
                      </h4>
                      <span className="text-xs text-gray-500 italic">
                        {exp.date || t("creativeResume.date")}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs mt-1 break-words">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ) : null
              )}
            </div>
          )}

          {data.projects?.length > 0 && (
            <div className="mb-2">
              <h2 className="text-md font-bold text-purple-700 mb-2 flex items-center">
                <span className="bg-purple-500 w-8 h-8 rounded-full mr-2"></span>
                {t("creativeResume.projects")}
              </h2>
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className="mb-6 relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-purple-400 before:rounded-full"
                >
                  <h3 className="text-md font-bold">
                    {project.name || t("creativeResume.projectName")}
                  </h3>
                  <div className="flex justify-between">
                    {project.technologies && (
                      <h5 className="text-purple-600 font-normal text-xs">
                        {project.technologies}
                      </h5>
                    )}
                    {project.date && (
                      <span className="text-sm text-gray-500 italic">
                        {project.date}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs mt-1 break-words">
                      {project.description}
                    </p>
                  )}
                  {project.link && (
                    <div className="mt-1 text-purple-600 hover:text-purple-800 text-xs inline-flex items-center">
                      {project.link}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {data.education?.length > 0 && (
            <div className="mb-2">
              <h2 className="text-md font-bold text-purple-700 mb-2 flex items-center">
                <span className="bg-purple-500 w-8 h-8 rounded-full mr-2"></span>
                {t("creativeResume.education")}
              </h2>
              {data.education.map((edu, index) =>
                edu.institution || edu.degree ? (
                  <div
                    key={index}
                    className="mb-6 relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-purple-400 before:rounded-full"
                  >
                    <h3 className="text-xs font-bold">
                      {edu.degree || t("creativeResume.degree")}
                    </h3>
                    <div className="flex justify-between">
                      <h5 className="text-purple-600 font-normal text-xs">
                        {edu.institution || t("creativeResume.institution")}
                      </h5>
                      <span className="text-sm text-gray-500 italic">
                        {edu.date || t("creativeResume.date")}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="text-xs mt-1 break-words">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ) : null
              )}
            </div>
          )}

          {data.certifications?.length > 0 && (
            <div className="mb-2">
              <h2 className="text-md font-bold text-purple-700 mb-2 flex items-center">
                <span className="bg-purple-500 w-8 h-8 rounded-full mr-2"></span>
                {t("creativeResume.certifications")}
              </h2>
              {data.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="mb-2 relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-purple-400 before:rounded-full"
                >
                  <div className="flex justify-between">
                    <h3 className="text-sm font-bold">{cert.name}</h3>
                    <span className="text-sm text-gray-500 italic">
                      {cert.date}
                    </span>
                  </div>
                  {cert.title && (
                    <p className="text-purple-600 font-normal text-xs">
                      {cert.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom Section */}
          {data.customSections && data.customSections.length > 0 && (
            <div className="mb-2">
              {data.customSections.map((section, index) =>
                section.title && section.content ? (
                  <div key={index}>
                    <h2 className="text-md font-bold text-purple-700 mb-2 flex items-center">
                      <span className="bg-purple-500 w-8 h-8 rounded-full mr-2"></span>
                      {section.title}
                    </h2>
                    <div className="mb-6 relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-purple-400 before:rounded-full">
                      <p className="text-xs font-bold">{section.content}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {data.skills?.length > 0 && (
            <div className="bg-purple-50 p-6 rounded-lg mb-8">
              <h2 className="text-md font-bold text-purple-700 mb-2 flex items-center">
                <span className="bg-purple-500 w-8 h-8 rounded-full mr-2"></span>
                {t("creativeResume.skills")}
              </h2>
              {data.skills.map((skill, index) =>
                skill.skills ? (
                  <div key={index} className="mb-2">
                    <h3 className="text-sm font-bold mb-2">{skill.category}</h3>
                    <div>
                      {skill.skills.split(",").map((s, i) => (
                        <span
                          key={i}
                          className="inline-block  text-purple-800 rounded-full px-2 py-0 text-sm mr-1 mb-2"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          {data.languages?.length > 0 && (
            <div className="bg-purple-50 p-6 rounded-lg mb-8">
              <h2 className="text-md font-bold text-purple-700 mb-2 flex items-center">
                <span className="bg-purple-500 w-8 h-8 rounded-full mr-2"></span>
                {t("creativeResume.languages")}
              </h2>
              {data.languages.map((lang, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-normal">{lang.language}</h3>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(lang.proficiency * 20, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.interests?.length > 0 && (
            <div className="bg-purple-50 p-6 rounded-lg mb-8">
              <h2 className="text-md font-bold text-purple-700 mb-2 flex items-center">
                <span className="bg-purple-500 w-8 h-8 rounded-full mr-2"></span>
                {t("creativeResume.interests")}
              </h2>
              <ul className="list-disc list-inside text-sm">
                {data.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeResumeTemplate;
