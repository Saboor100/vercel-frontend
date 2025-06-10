import React from "react";
import { ResumeData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface ProfessionalPurpleTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const ProfessionalPurpleTemplate: React.FC<ProfessionalPurpleTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-sans p-0 max-w-[800px] mx-auto flex flex-col bg-white min-h-screen">
      {/* Header with profile image and name */}
      <div className="flex items-start p-6 gap-6">
        {data.personalInfo.photo ? (
          <img
            src={data.personalInfo.photo}
            alt={data.personalInfo.name}
            className="rounded-full w-full max-w-[100px] h-auto object-cover border-4 border-white"
          />
        ) : (
          <div className="w-24 h-24 bg-purple-100 flex items-center justify-center rounded">
            <span className="text-2xl font-bold text-purple-700">
              {data.personalInfo.name ? data.personalInfo.name.charAt(0) : ""}
            </span>
          </div>
        )}

        <div>
          <h1
            className="text-xl font-bold text-purple-800 mb-2"
            data-field="name"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.name || ""}
          </h1>

          <p
            className="text-xs mt-1 space-y-0.5 break-words"
            data-field="summary"
            {...(editMode ? editableProps : {})}
          >
            {data.summary || ""}
          </p>
        </div>
      </div>

      <div className="flex">
        {/* Main content area */}
        <div className="w-3/5 p-6 h-full">
          {/* Experience Section */}
          {data.experience &&
            data.experience.length > 0 &&
            data.experience.some((exp) => exp.company || exp.position) && (
              <div className="mb-8">
                <h2
                  className="text-xl text-purple-800 font-bold mb-4"
                  {...(editMode ? editableProps : {})}
                >
                  {t("professionalPurple.experience")}
                </h2>
                {data.experience
                  .filter((exp) => exp.company || exp.position)
                  .map((exp, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3
                            className="text-base font-semibold"
                            {...(editMode ? editableProps : {})}
                          >
                            {exp.position || ""}
                          </h3>
                          <h4
                            className="text-sm text-purple-700"
                            {...(editMode ? editableProps : {})}
                          >
                            {exp.company || ""}
                          </h4>
                        </div>
                        <span
                          className="text-sm"
                          {...(editMode ? editableProps : {})}
                        >
                          {exp.date || ""}
                        </span>
                      </div>

                      {exp.description && (
                        <ul className="text-xs mt-1 space-y-0.5 break-words">
                          {exp.description.split("\n").map((item, i) => (
                            <li key={i} {...(editMode ? editableProps : {})}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            )}

          {/* Education Section */}
          {data.education &&
            data.education.length > 0 &&
            data.education.some((edu) => edu.institution || edu.degree) && (
              <div className="mb-8">
                <h2
                  className="text-xl text-purple-800 font-bold mb-4"
                  {...(editMode ? editableProps : {})}
                >
                  {t("professionalPurple.education")}
                </h2>
                {data.education
                  .filter((edu) => edu.institution || edu.degree)
                  .map((edu, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3
                            className="font-semibold"
                            {...(editMode ? editableProps : {})}
                          >
                            {edu.degree || ""}
                          </h3>
                          <h4
                            className="text-sm text-purple-700"
                            {...(editMode ? editableProps : {})}
                          >
                            {edu.institution || ""}
                          </h4>
                        </div>
                        <span
                          className="text-sm"
                          {...(editMode ? editableProps : {})}
                        >
                          {edu.date || ""}
                        </span>
                      </div>
                      {edu.description && (
                        <p
                          className="text-xs mt-1 space-y-0.5 break-words"
                          {...(editMode ? editableProps : {})}
                        >
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
              <div className="mb-8">
                <h2
                  className="text-xl text-purple-800 font-bold mb-4"
                  {...(editMode ? editableProps : {})}
                >
                  {t("professionalPurple.projects")}
                </h2>
                {data.projects
                  .filter((project) => project.name)
                  .map((project, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3
                            className="font-semibold"
                            {...(editMode ? editableProps : {})}
                          >
                            {project.name}
                          </h3>
                          {project.technologies && (
                            <h4
                              className="text-sm text-purple-700"
                              {...(editMode ? editableProps : {})}
                            >
                              {project.technologies}
                            </h4>
                          )}
                        </div>
                        <span
                          className="text-sm"
                          {...(editMode ? editableProps : {})}
                        >
                          {project.date || ""}
                        </span>
                      </div>
                      {project.description && (
                        <p
                          className="text-xs mt-1 space-y-0.5 break-words"
                          {...(editMode ? editableProps : {})}
                        >
                          {project.description}
                        </p>
                      )}
                      {project.link && (
                        <div
                          className="text-sm text-purple-700 mt-1 inline-block"
                          {...(editMode ? editableProps : {})}
                        >
                          {project.link}
                        </div>
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
                  <div key={index} className="mb-8">
                    <h2
                      className="text-xl text-purple-800 font-bold mb-4"
                      {...(editMode ? editableProps : {})}
                    >
                      {section.title}
                    </h2>
                    <p className="text-sm" {...(editMode ? editableProps : {})}>
                      {section.content}
                    </p>
                  </div>
                ))}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className=" bg-purple-50 p-2 h-full">
          <div className="mb-8">
            <h2
              className="text-xl text-purple-800 font-bold mb-4"
              {...(editMode ? editableProps : {})}
            >
              {t("professionalPurple.personalInfo")}
            </h2>
            <div className="space-y-2">
              <p className="text-sm flex items-start">
                <span className="inline-block w-5 text-purple-600">👤</span>
                <span {...(editMode ? editableProps : {})}>
                  {data.personalInfo.name}
                </span>
              </p>
              {data.personalInfo.email && (
                <p className="flex flex-row">
                  <span className=" ">✉️</span>
                  <span
                    className="text-xs mt-1 space-y-0.5 break-words"
                    {...(editMode ? editableProps : {})}
                  >
                    {data.personalInfo.email}
                  </span>
                </p>
              )}
              {data.personalInfo.phone && (
                <p className="text-sm flex items-start">
                  <span className="inline-block w-5 text-purple-600">📱</span>
                  <span {...(editMode ? editableProps : {})}>
                    {data.personalInfo.phone}
                  </span>
                </p>
              )}
              {data.personalInfo.location && (
                <p className="text-sm flex items-start">
                  <span className="inline-block w-5 text-purple-600">🏠</span>
                  <span {...(editMode ? editableProps : {})}>
                    {data.personalInfo.location}
                  </span>
                </p>
              )}
              {data.personalInfo.linkedin && (
                <p className="text-sm flex items-start">
                  <span className="inline-block w-5 text-purple-600">🔗</span>
                  <span {...(editMode ? editableProps : {})}>
                    {data.personalInfo.linkedin}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills &&
            data.skills.length > 0 &&
            data.skills.some((skill) => skill.skills) && (
              <div className="mb-8">
                <h2
                  className="text-xl text-purple-800 font-bold mb-4"
                  {...(editMode ? editableProps : {})}
                >
                  {t("professionalPurple.skills")}
                </h2>
                {data.skills
                  .filter((skill) => skill.skills)
                  .map((skill, index) => (
                    <div key={index} className="mb-4">
                      <h3
                        className="font-semibold text-purple-700 mb-2"
                        {...(editMode ? editableProps : {})}
                      >
                        {skill.category}
                      </h3>
                      <div className="space-y-2">
                        {skill.skills.split(",").map((s, i) => {
                          const level = Math.min((i % 5) + 1, 5);
                          return (
                            <div key={i} className="flex items-center">
                              <span
                                className="flex-grow text-sm"
                                {...(editMode ? editableProps : {})}
                              >
                                {s.trim()}
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, j) => (
                                  <div
                                    key={j}
                                    className="w-3 h-3 rounded-full mx-0.5 "
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-8">
              <h2
                className="text-xl text-purple-800 font-bold mb-4"
                {...(editMode ? editableProps : {})}
              >
                {t("professionalPurple.languages")}
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex items-center">
                    <span
                      className="flex-grow text-sm"
                      {...(editMode ? editableProps : {})}
                    >
                      {lang.language}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full mx-0.5 ${
                            i < lang.proficiency
                              ? "bg-purple-400"
                              : "bg-purple-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications &&
            data.certifications.length > 0 &&
            data.certifications.some((cert) => cert.name) && (
              <div className="mb-8">
                <h2
                  className="text-xl text-purple-800 font-bold mb-4"
                  {...(editMode ? editableProps : {})}
                >
                  {t("professionalPurple.certifications")}
                </h2>
                <div className="space-y-2">
                  {data.certifications
                    .filter((cert) => cert.name)
                    .map((cert, index) => (
                      <div key={index} className="flex justify-between">
                        <span
                          className="text-sm"
                          {...(editMode ? editableProps : {})}
                        >
                          {cert.title && typeof cert.title === "string"
                            ? `${cert.title}: ${cert.name}`
                            : cert.name}
                        </span>
                        <span
                          className="text-sm text-gray-500"
                          {...(editMode ? editableProps : {})}
                        >
                          {cert.date || ""}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Interests */}
          {data.interests && data.interests.length > 0 && (
            <div className="mb-8">
              <h2
                className="text-xl text-purple-800 font-bold mb-4"
                {...(editMode ? editableProps : {})}
              >
                {t("professionalPurple.interests")}
              </h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {data.interests.map((interest, index) => (
                  <li key={index} {...(editMode ? editableProps : {})}>
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPurpleTemplate;
