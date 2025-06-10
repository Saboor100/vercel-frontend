import React from "react";
import { ResumeData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface ExecutiveResumeTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const ExecutiveResumeTemplate: React.FC<ExecutiveResumeTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();
  // console.log("data", data);

  return (
    <div className="font-serif p-4  mx-auto text-xs bg-white shadow-md rounded-md">
      {/* Header with name and executive styling */}
      <div className="bg-gray-900 text-white pb-4 pl-4 pr-4 pt-2 mb-2 ">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-3xl text-white font-bold tracking-tight mb-1"
              style={{
                color: "white",
                background: "transparent",
                outline: "none",
                cursor: editMode ? "text" : "default",
              }}
              data-field="name"
              {...(editMode ? editableProps : {})}
            >
              {data.personalInfo.name || ""}
            </h1>

            <div className="flex flex-wrap gap-3 text-gray-300 text-xs">
              {data.personalInfo.email && (
                <span>{data.personalInfo.email}</span>
              )}
              {data.personalInfo.phone && (
                <span>{data.personalInfo.phone}</span>
              )}
              {data.personalInfo.location && (
                <span>{data.personalInfo.location}</span>
              )}
              {data.personalInfo.linkedin && (
                <span>{data.personalInfo.linkedin}</span>
              )}
            </div>
          </div>

          {data.personalInfo.photo ? (
            <img
              src={data.personalInfo.photo}
              alt={data.personalInfo.name}
              className="w-full max-w-[100px] h-auto object-cover rounded-full border-2 border-gray-300"
            />
          ) : null}
        </div>
      </div>

      {/* Summary Section */}
      {data.summary && (
        <div className=" mb-6">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
            {t("executiveResume.summary")}
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

      {/* Experience Section */}
      {data.experience &&
        data.experience.length > 0 &&
        data.experience.some((exp) => exp.company || exp.position) && (
          <div className=" mb-6">
            <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
              {t("executiveResume.experience")}
            </h2>
            {data.experience
              .filter((exp) => exp.company || exp.position)
              .map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xs font-bold ">{exp.position || ""}</h3>
                    <span className="text-xs text-gray-600 font-medium">
                      {exp.date || ""}
                    </span>
                  </div>
                  <h4 className="text-xs ">{exp.company || ""}</h4>
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
          <div className=" mb-6">
            <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
              {t("executiveResume.education")}
            </h2>
            {data.education
              .filter((edu) => edu.institution || edu.degree)
              .map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline ">
                    <h3 className="text-xs font-bold ">{edu.degree || ""}</h3>
                    <span className="text-xs text-gray-600 font-medium">
                      {edu.date || ""}
                    </span>
                  </div>
                  <h4 className="text-xs ">{edu.institution || ""}</h4>
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
          <div className=" mb-6">
            <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
              {t("executiveResume.projects")}
            </h2>
            {data.projects
              .filter((project) => project.name)
              .map((project, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline ">
                    <h3 className="text-xs font-bold ">{project.name}</h3>
                    <span className="text-xs text-gray-600 font-medium">
                      {project.date || ""}
                    </span>
                  </div>
                  {project.technologies && (
                    <h4 className="text-xs ">{project.technologies}</h4>
                  )}
                  {project.description && (
                    <p className="text-xs mt-1 space-y-0.5 break-words">
                      {project.description}
                    </p>
                  )}
                  {project.link && (
                    <div className="text-xs text-gray-700 underline mt-1 inline-block">
                      {project.link}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

      {/* Skills Section */}
      {data.skills &&
        data.skills.length > 0 &&
        data.skills.some((skill) => skill.skills) && (
          <div className=" mb-6">
            <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
              {t("executiveResume.skills")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.skills
                .filter((skillCategory) => skillCategory.skills)
                .map((skillCategory, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-xs font-bold mb-2">
                      {skillCategory.category}
                    </h3>
                    <ul className="list-disc pl-2">
                      {skillCategory.skills.split(",").map((skill, index) => (
                        <li key={index} className="text-xs">
                          {skill.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <div className=" mb-6">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
            {t("executiveResume.languages")}
          </h2>
          <div className="flex flex-wrap gap-8">
            {data.languages.map((lang, index) => (
              <div key={index} className="flex items-center">
                <span className="font-medium mr-2">{lang.language}:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-6 mx-px ${
                        i < lang.proficiency ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {data.certifications &&
        data.certifications.length > 0 &&
        data.certifications.some((cert) => cert.name) && (
          <div className=" mb-6">
            <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
              {t("executiveResume.certifications")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications
                .filter((cert) => cert.name)
                .map((cert, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-xs font-medium">
                      {cert.title && typeof cert.title === "string"
                        ? `${cert.title}: ${cert.name}`
                        : cert.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {cert.date || ""}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Interests Section */}
      {data.interests && data.interests.length > 0 && (
        <div className=" mb-6">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
            {t("executiveResume.interests")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-xs"
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
                <div key={index} className=" mb-6">
                  <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-1 mb-1">
                    {section.title.toUpperCase()}
                  </h2>
                  <p className="text-xs">{section.content}</p>
                </div>
              ))}
          </>
        )}
    </div>
  );
};

export default ExecutiveResumeTemplate;
