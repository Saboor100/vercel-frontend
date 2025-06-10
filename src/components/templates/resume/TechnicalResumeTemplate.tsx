import React from "react";
import { ResumeData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface TechnicalResumeTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const TechnicalResumeTemplate: React.FC<TechnicalResumeTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-sans p-0 max-w-[800px] mx-auto bg-white">
      {/* Header with name and indigo styling */}
      <div className="bg-indigo-700 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="text-2xl font-bold mb-1 text-white"
              data-field="name"
              {...(editMode ? editableProps : {})}
            >
              {data.personalInfo.name || ""}
            </h1>
            <div className=" grid-cols-2 gap-2 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-center">
                  <span>✉️</span>
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center">
                  <span>📞</span>
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center">
                  <span>📍</span>
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center">
                  <span>🔗</span>
                  <span>{data.personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>
          {data.personalInfo.photo ? (
            <img
              src={data.personalInfo.photo}
              alt={data.personalInfo.name}
              className="w-full max-w-[100px] h-auto  object-cover rounded-full border-4 border-indigo-200"
            />
          ) : null}
        </div>
      </div>

      {/* Summary Section */}
      {data.summary && (
        <div className="p-6 bg-indigo-50">
          <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-200 pb-1 mb-2">
            {t("technicalResume.summary")}
          </h2>
          <p
            className="text-sm"
            data-field="summary"
            {...(editMode ? editableProps : {})}
          >
            {data.summary}
          </p>
        </div>
      )}

      {/* Two-column layout for main content */}
      <div className="flex flex-col md:flex-row">
        {/* Left column */}
        <div className="w-full md:w-8/12 p-6">
          {/* Technical Skills Section - Highlighted */}
          {data.skills &&
            data.skills.length > 0 &&
            data.skills.some((skill) => skill.skills) && (
              <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-300 pb-1 mb-3">
                  {t("technicalResume.skills")}
                </h2>
                {data.skills
                  .filter((skillCategory) => skillCategory.skills)
                  .map((skillCategory, categoryIndex) => (
                    <div key={categoryIndex} className="mb-3 last:mb-0">
                      <h3 className="text-sm font-bold text-indigo-700 mb-2">
                        {skillCategory.category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skillCategory.skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

          {/* Experience Section */}
          {data.experience &&
            data.experience.length > 0 &&
            data.experience.some((exp) => exp.company || exp.position) && (
              <div className="mb-6">
                <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-300 pb-1 mb-3">
                  {t("technicalResume.experience")}
                </h2>
                {data.experience
                  .filter((exp) => exp.company || exp.position)
                  .map((exp, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-sm">
                          {exp.position || ""}
                        </h3>
                        <span className="text-xs text-gray-600">
                          {exp.date || ""}
                        </span>
                      </div>
                      <h4 className="text-sm text-indigo-700 mb-1">
                        {exp.company || ""}
                      </h4>
                      {exp.description && (
                        <div className="text-xs mt-1 space-y-0.5 break-words">
                          <ul className="list-disc pl-5 space-y-1">
                            {exp.description.split("\n").map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

          {/* Projects Section */}
          {data.projects &&
            data.projects.length > 0 &&
            data.projects.some((project) => project.name) && (
              <div className="mb-6">
                <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-300 pb-1 mb-3">
                  {t("technicalResume.projects")}
                </h2>
                {data.projects
                  .filter((project) => project.name)
                  .map((project, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-sm">{project.name}</h3>
                        <span className="text-xs text-gray-600">
                          {project.date || ""}
                        </span>
                      </div>
                      {project.technologies && (
                        <div className="mb-1 flex flex-wrap gap-1">
                          {project.technologies.split(",").map((tech, i) => (
                            <span
                              key={i}
                              className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 text-xs rounded"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.description && (
                        <p className="text-xs mt-1 space-y-0.5 break-words">
                          {project.description}
                        </p>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          {project.link}
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            )}
        </div>

        {/* Right column */}
        <div className="w-full md:w-4/12 bg-gray-50 p-6">
          {/* Education Section */}
          {data.education &&
            data.education.length > 0 &&
            data.education.some((edu) => edu.institution || edu.degree) && (
              <div className="mb-6">
                <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-300 pb-1 mb-3">
                  {t("technicalResume.education")}
                </h2>
                {data.education
                  .filter((edu) => edu.institution || edu.degree)
                  .map((edu, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="mb-1">
                        <h3 className="font-bold text-sm">
                          {edu.degree || ""}
                        </h3>
                        <h4 className="text-xs">{edu.institution || ""}</h4>
                        <div className="text-xs text-gray-600">
                          {edu.date || ""}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-xs mt-1 space-y-0.5 break-words">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}

          {/* Certifications Section */}
          {data.certifications &&
            data.certifications.length > 0 &&
            data.certifications.some((cert) => cert.name) && (
              <div className="mb-6">
                <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-300 pb-1 mb-3">
                  {t("technicalResume.certifications")}
                </h2>
                {data.certifications
                  .filter((cert) => cert.name)
                  .map((cert, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="font-bold text-xs">
                        {cert.title && typeof cert.title === "string"
                          ? `${cert.title}`
                          : ""}
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs">{cert.name}</span>
                        <span className="text-xs text-gray-600">
                          {cert.date || ""}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

          {/* Languages Section */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-300 pb-1 mb-3">
                {t("technicalResume.languages")}
              </h2>
              {data.languages.map((lang, index) => (
                <div key={index} className="mb-2 last:mb-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">{lang.language}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 mx-0.5 rounded-full ${
                            i < lang.proficiency
                              ? "bg-indigo-600"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interests Section */}
          {data.interests && data.interests.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-300 pb-1 mb-3">
                {t("technicalResume.interests")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {data.customSections &&
            data.customSections.length > 0 &&
            data.customSections.some(
              (section) => section.title && section.content
            ) && (
              <>
                {data.customSections
                  .filter((section) => section.title && section.content)
                  .map((section, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h2 className="text-base font-bold text-indigo-800 border-b border-indigo-300 pb-1 mb-3">
                        {section.title.toUpperCase()}
                      </h2>
                      <p className="text-xs">{section.content}</p>
                    </div>
                  ))}
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalResumeTemplate;
