import React from "react";
import { ResumeData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface ElegantResumeTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const ElegantResumeTemplate: React.FC<ElegantResumeTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-serif p-2 max-w-[800px] mx-auto bg-white">
      {/* Header with elegant styling */}
      <div className="text-center mb-2 border-b-2 border-amber-700 pb-6">
        {/* Profile photo */}
        <div className="mb-2 flex justify-center">
          {data.personalInfo.photo ? (
            <img
              src={data.personalInfo.photo}
              alt={data.personalInfo.name}
              className="rounded-full w-full max-w-[100px] h-auto object-cover border-4 border-white"
            />
          ) : (
            <div className="rounded-full w-24 h-24 bg-slate-600 flex items-center justify-center text-xl font-bold">
              {data.personalInfo.name.charAt(0)}
            </div>
          )}
        </div>
        <h1
          className="text-3xl font-bold mb-2 text-amber-800"
          data-field="name"
          {...(editMode ? editableProps : {})}
        >
          {data.personalInfo.name || ""}
        </h1>

        <div className="flex justify-center flex-wrap gap-x-6 text-sm">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
          {data.personalInfo.linkedin && (
            <span>{data.personalInfo.linkedin}</span>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {data.summary && (
        <div className="mb-2">
          <h2 className="text-sm font-semibold text-amber-800 text-center mb-3">
            {t("elegantResume.profile")}
          </h2>
          <p
            className="text-sm leading-relaxed text-center italic border-l-4 border-r-4 border-amber-100 px-8"
            data-field="summary"
            {...(editMode ? editableProps : {})}
          >
            {data.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-2">
          {/* Experience Section */}
          {data.experience &&
            data.experience.length > 0 &&
            data.experience.some((exp) => exp.company || exp.position) && (
              <div className="mb-2">
                <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-300 pb-1 mb-2">
                  {t("elegantResume.experience")}
                </h2>
                {data.experience
                  .filter((exp) => exp.company || exp.position)
                  .map((exp, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-amber-900">
                          {exp.position || ""}
                        </h3>
                        <span className="text-sm text-gray-600 italic">
                          {exp.date || ""}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium mb-2">
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

          {/* Education Section */}
          {data.education &&
            data.education.length > 0 &&
            data.education.some((edu) => edu.institution || edu.degree) && (
              <div className="mb-2">
                <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-300 pb-1 mb-2">
                  {t("elegantResume.education")}
                </h2>
                {data.education
                  .filter((edu) => edu.institution || edu.degree)
                  .map((edu, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-amber-900">
                          {edu.degree || ""}
                        </h3>
                        <span className="text-sm text-gray-600 italic">
                          {edu.date || ""}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium mb-2">
                        {edu.institution || ""}
                      </h4>

                      {edu.description && (
                        <p className="text-xs mt-1 space-y-0.5 break-words">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}

          {/* Projects Section */}
          {data.projects &&
            data.projects.length > 0 &&
            data.projects.some((project) => project.name) && (
              <div className="mb-2">
                <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-300 pb-1 mb-2">
                  {t("elegantResume.projects")}
                </h2>
                {data.projects
                  .filter((project) => project.name)
                  .map((project, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-amber-900">
                          {project.name}
                        </h3>
                        <span className="text-sm text-gray-600 italic">
                          {project.date || ""}
                        </span>
                      </div>

                      {project.technologies && (
                        <p className="text-sm mb-2 italic">
                          {project.technologies}
                        </p>
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
                          className="text-sm text-amber-700 hover:underline"
                        >
                          {project.link}
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            )}

          {/* Custom Sections - First Half */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections
                .slice(0, Math.ceil(data.customSections.length / 2))
                .filter((section) => section.title && section.content)
                .map((section, index) => (
                  <div key={index} className="mb-2">
                    <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-300 pb-1 mb-2">
                      {section.title.toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-700">{section.content}</p>
                  </div>
                ))}
            </>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Skills Section */}
          {data.skills &&
            data.skills.length > 0 &&
            data.skills.some((skill) => skill.skills) && (
              <div className="bg-amber-50 p-2 rounded-lg">
                <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-200 pb-1 mb-2">
                  {t("elegantResume.skills")}
                </h2>
                {data.skills
                  .filter((skillCategory) => skillCategory.skills)
                  .map((skillCategory, categoryIndex) => (
                    <div key={categoryIndex} className="mb-3">
                      <h3 className="font-medium text-amber-800 mb-2">
                        {skillCategory.category}
                      </h3>
                      <div className="text-sm">
                        {skillCategory.skills
                          .split(",")
                          .map((skill, index, array) => (
                            <span key={index}>
                              {skill.trim()}
                              {index < array.length - 1 ? " • " : ""}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

          {/* Certifications Section */}
          {data.certifications &&
            data.certifications.length > 0 &&
            data.certifications.some((cert) => cert.name) && (
              <div className="bg-amber-50 p-2 rounded-lg">
                <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-200 pb-1  mb-2">
                  {t("elegantResume.certifications")}
                </h2>
                {data.certifications
                  .filter((cert) => cert.name)
                  .map((cert, index) => (
                    <div key={index} className="mb-2">
                      <div className="text-sm font-medium text-amber-900">
                        {cert.title && typeof cert.title === "string"
                          ? `${cert.title}`
                          : ""}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{cert.name}</span>
                        <span className="text-gray-600">{cert.date || ""}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

          {/* Languages Section */}
          {data.languages && data.languages.length > 0 && (
            <div className="bg-amber-50 p-2 rounded-lg">
              <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-200 pb-1 mb-2">
                {t("elegantResume.languages")}
              </h2>
              {data.languages.map((lang, index) => (
                <div
                  key={index}
                  className="mb-2 flex justify-between items-center"
                >
                  <span className="text-sm">{lang.language}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 mx-0.5 rounded-full ${
                          i < lang.proficiency ? "bg-amber-600" : "bg-amber-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interests Section */}
          {data.interests && data.interests.length > 0 && (
            <div className="bg-amber-50 p-2 rounded-lg">
              <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-200 pb-1 mb-2">
                {t("elegantResume.interests")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections - Second Half */}
          {data.customSections && data.customSections.length > 0 && (
            <>
              {data.customSections
                .slice(Math.ceil(data.customSections.length / 2))
                .filter((section) => section.title && section.content)
                .map((section, index) => (
                  <div key={index} className="bg-amber-50 p-2 rounded-lg">
                    <h2 className="text-sm font-semibold text-amber-800 border-b border-amber-200 pb-1 mb-2">
                      {section.title.toUpperCase()}
                    </h2>
                    <p className="text-sm">{section.content}</p>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElegantResumeTemplate;
