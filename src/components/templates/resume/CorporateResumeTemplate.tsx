import React from "react";
import { ResumeData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface CorporateResumeTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const CorporateResumeTemplate: React.FC<CorporateResumeTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-serif p-0 max-w-[800px] mx-auto text-[10px] print:text-[9pt]">
      {/* Header with corporate blue styling */}
      <div className="bg-blue-800 text-white p-4 ">
        <div className="flex justify-between items-center">
          <div>
            <h1
              className="text-2xl font-bold mb-1 text-white"
              data-field="name"
              {...(editMode ? editableProps : {})}
            >
              {data.personalInfo.name || ""}
            </h1>

            <div className="text-blue-100">
              {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
              {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
              {data.personalInfo.location && (
                <div>{data.personalInfo.location}</div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {data.personalInfo.linkedin && (
              <div className="bg-white text-blue-800 font-medium px-3 py-1 rounded-md text-sm">
                {data.personalInfo.linkedin}
              </div>
            )}

            {data.personalInfo.photo && (
              <img
                src={data.personalInfo.photo}
                alt={data.personalInfo.name}
                className="rounded-full w-full max-w-[100px] h-auto object-cover border-4 border-white ml-4 mr-4"
              />
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Summary Section */}
        {data.summary && (
          <div className="mb-4">
            <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              {t("corporateResume.professionalSummary")}
            </h2>
            <p
              className="leading-relaxed"
              data-field="summary"
              {...(editMode ? editableProps : {})}
            >
              {data.summary}
            </p>
          </div>
        )}

        {/* Experience Section */}
        {data.experience &&
          data.experience.length > 0 &&
          data.experience.some((exp) => exp.company || exp.position) && (
            <div className="mb-4">
              <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-4">
                {t("corporateResume.professionalExperience")}
              </h2>
              {data.experience
                .filter((exp) => exp.company || exp.position)
                .map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold">{exp.position || ""}</h3>
                      <span className="text-xs text-gray-600 font-medium">
                        {exp.date || ""}
                      </span>
                    </div>
                    <h4 className="text-blue-800 font-semibold mb-2">
                      {exp.company || ""}
                    </h4>

                    {exp.description && (
                      <div>
                        <ul className="text-xs mt-1 space-y-0.5 break-words">
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
            <div className="mb-4">
              <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-4">
                {t("corporateResume.education")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.education
                  .filter((edu) => edu.institution || edu.degree)
                  .map((edu, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-md">
                      <h3 className="font-bold">{edu.degree || ""}</h3>
                      <h4 className="text-blue-800 font-medium">
                        {edu.institution || ""}
                      </h4>
                      <div className=" text-gray-600 mt-1 mb-2 text-xs">
                        {edu.date || ""}
                      </div>

                      {edu.description && (
                        <p className="text-xs mt-1 space-y-0.5 break-words">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Skills Section */}
        {data.skills &&
          data.skills.length > 0 &&
          data.skills.some((skill) => skill.skills) && (
            <div className="mb-4">
              <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-4">
                {t("corporateResume.keyCompetencies")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.skills
                  .filter((skillCategory) => skillCategory.skills)
                  .map((skillCategory, categoryIndex) => (
                    <div
                      key={categoryIndex}
                      className="bg-blue-50 p-4 rounded-md"
                    >
                      <h3 className="font-bold text-blue-800 mb-2">
                        {skillCategory.category}
                      </h3>
                      <div className="flex flex-wrap ">
                        {skillCategory.skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="bg-white border border-blue-200 text-blue-800 px-2 py-1 "
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Projects Section */}
        {data.projects &&
          data.projects.length > 0 &&
          data.projects.some((project) => project.name) && (
            <div className="mb-4">
              <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-4">
                {t("corporateResume.keyProjects")}
              </h2>
              {data.projects
                .filter((project) => project.name)
                .map((project, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold">{project.name}</h3>
                      <span className="text-xs text-gray-600 font-medium">
                        {project.date || ""}
                      </span>
                    </div>

                    {project.technologies && (
                      <p className="text-blue-800 font-medium mb-2">
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
                        className="hover:underline text-xs"
                      >
                        {project.link}
                      </a>
                    )}
                  </div>
                ))}
            </div>
          )}

        {/* Two-column layout for remaining sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Certifications Section */}
            {data.certifications &&
              data.certifications.length > 0 &&
              data.certifications.some((cert) => cert.name) && (
                <div className="mb-4">
                  <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
                    {t("corporateResume.certifications")}
                  </h2>
                  <div className="bg-blue-50 p-4 rounded-md">
                    {data.certifications
                      .filter((cert) => cert.name)
                      .map((cert, index) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {cert.title && typeof cert.title === "string"
                                ? `${cert.title}: ${cert.name}`
                                : cert.name}
                            </span>
                            <span className="text-xs text-gray-600">
                              {cert.date || ""}
                            </span>
                          </div>
                        </div>
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
                      <div key={index} className="mb-4">
                        <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
                          {section.title.toUpperCase()}
                        </h2>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <p>{section.content}</p>
                        </div>
                      </div>
                    ))}
                </>
              )}
            {/* Languages Section */}
            {data.languages && data.languages.length > 0 && (
              <div className="mb-4">
                <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
                  {t("corporateResume.languages")}
                </h2>
                <div className="bg-blue-50 p-4 rounded-md">
                  {data.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="mb-3 last:mb-0 flex justify-between items-center"
                    >
                      <span className="font-medium">{lang.language}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-2 mx-0.5 ${
                              i < lang.proficiency
                                ? "bg-blue-700"
                                : "bg-blue-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            {/* Interests Section */}
            {data.interests && data.interests.length > 0 && (
              <div className="mb-4">
                <h2 className="text-base font-bold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
                  {t("corporateResume.interests")}
                </h2>
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    {data.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-white border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateResumeTemplate;
