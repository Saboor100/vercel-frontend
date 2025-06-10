import React from "react";
import { ResumeData } from "@/types/documents";
import { useTranslation } from "react-i18next";

interface ProfessionalModernTemplateProps {
  data: ResumeData;
  editMode?: boolean;
  editableProps?: React.HTMLAttributes<HTMLElement>;
}

const ProfessionalModernTemplate: React.FC<ProfessionalModernTemplateProps> = ({
  data,
  editMode = false,
  editableProps = {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="font-serif text-[9px] print:text-[8pt] leading-tight p-0 max-w-[800px] mx-auto print:p-4">
      {/* Header */}
      <div className="pb-2 border-b border-purple-700">
        <div className="flex justify-between items-start px-6 pt-4">
          <h1
            className="text-3xl font-bold text-purple-900 uppercase tracking-wider"
            data-field="name"
            {...(editMode ? editableProps : {})}
          >
            {data.personalInfo.name || ""}
          </h1>

          {data.personalInfo.photo ? (
            <img
              src={data.personalInfo.photo}
              alt={data.personalInfo.name}
              className="rounded-full w-full max-w-[100px] h-auto object-cover border-4 border-white"
            />
          ) : (
            <div className="w-20 h-20 bg-purple-100 flex items-center justify-center rounded">
              <span className="text-xl font-bold text-purple-700">
                {data.personalInfo.name?.charAt(0).toUpperCase() || ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <section className="bg-purple-100 py-2 px-6 mb-4 text-[9px]">
        <h2 className="text-xs font-bold text-purple-900 uppercase mb-1">
          {t("professionalModern.personalInfo")}
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {data.personalInfo.location && (
            <div>{data.personalInfo.location}</div>
          )}
          {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo.linkedin && (
            <div>{data.personalInfo.linkedin}</div>
          )}
        </div>
      </section>

      {/* Section Template */}
      {data.summary && (
        <Section title={t("professionalModern.profile")}>
          <div
            className="text-[9px] space-y-1"
            data-field="summary"
            {...(editMode ? editableProps : {})}
            style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
          >
            {data.summary.split(/(?<=[.?!])\s+/).map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </Section>
      )}

      {data.experience?.some((exp) => exp.company || exp.position) && (
        <Section title={t("professionalModern.experience")}>
          {data.experience
            .filter((exp) => exp.company || exp.position)
            .map((exp, idx) => (
              <Entry
                key={idx}
                title={`${exp.position || ""} • ${exp.company || ""}`}
                date={exp.date}
                description={exp.description}
              />
            ))}
        </Section>
      )}

      {data.education?.some((edu) => edu.institution || edu.degree) && (
        <Section title={t("professionalModern.education")}>
          {data.education
            .filter((edu) => edu.institution || edu.degree)
            .map((edu, idx) => (
              <Entry
                key={idx}
                title={`${edu.degree || ""} • ${edu.institution || ""}`}
                date={edu.date}
                description={edu.description}
              />
            ))}
        </Section>
      )}

      {data.projects?.some((proj) => proj.name) && (
        <Section title={t("professionalModern.projects")}>
          {data.projects
            .filter((proj) => proj.name)
            .map((proj, idx) => (
              <Entry
                key={idx}
                title={
                  <>
                    {proj.name}
                    {proj.technologies && (
                      <span className="font-normal text-purple-700">
                        {" "}
                        • {proj.technologies}
                      </span>
                    )}
                  </>
                }
                date={proj.date}
                description={
                  <>
                    {proj.description && (
                      <p className="mb-1">{proj.description}</p>
                    )}
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 underline"
                      >
                        {proj.link}
                      </a>
                    )}
                  </>
                }
              />
            ))}
        </Section>
      )}

      {data.skills?.some((skill) => skill.skills) && (
        <Section title={t("professionalModern.skills")}>
          <div className="flex flex-col gap-3">
            {data.skills.map((category, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-semibold mb-1">
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.split(",").map((skill, i) => (
                    <SkillItem key={i} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.languages?.length > 0 && (
        <Section title={t("professionalModern.languages")}>
          <div className="space-y-1">
            {data.languages.map((lang, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-[9px]">{lang.language}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 mx-0.5 rounded-full ${
                        i < lang.proficiency ? "bg-purple-800" : "bg-purple-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.certifications?.some((cert) => cert.name) && (
        <Section title={t("professionalModern.certifications")}>
          <div className="space-y-1">
            {data.certifications.map((cert, idx) => (
              <div key={idx} className="flex justify-between text-[9px]">
                <span>
                  {cert.title && typeof cert.title === "string"
                    ? `${cert.title}: ${cert.name}`
                    : cert.name}
                </span>
                <span>{cert.date || ""}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.interests?.length > 0 && (
        <Section title={t("professionalModern.interests")}>
          <div className="flex flex-wrap gap-3">
            {data.interests.map((interest, idx) => (
              <SkillItem key={idx} skill={interest} />
            ))}
          </div>
        </Section>
      )}

      {data.customSections?.length > 0 &&
        data.customSections
          .filter((section) => section.title && section.content)
          .map((section, idx) => (
            <Section key={idx} title={section.title}>
              <div className="text-[9px] space-y-1">
                {section.content.split(/(?<=[.?!])\s+/).map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </Section>
          ))}
    </div>
  );
};

// Section Component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="px-6 mb-4">
    <h2
      className="text-xs font-bold text-purple-900 bg-purple-100 px-2 uppercase mb-2"
      style={{
        height: "24px", // background height
        lineHeight: "14px", // text sits slightly higher than center
        paddingTop: "1px", // optional fine-tune
      }}
    >
      {title}
    </h2>
    {children}
  </section>
);

// Entry Component
const Entry: React.FC<{
  title: React.ReactNode;
  date?: string;
  description?: React.ReactNode;
}> = ({ title, date, description }) => (
  <div className="mb-4">
    <div className="flex justify-between items-baseline mb-0.5">
      <h3 className="font-bold text-xs">{title}</h3>
      {date && <span className="text-[8px] text-gray-600">{date}</span>}
    </div>
    {description && (
      <div className="ml-3 text-[9px] space-y-1">
        {typeof description === "string"
          ? description
              .split(/(?<=[.?!])\s+/)
              .map((line, idx) => <p key={idx}>{line}</p>)
          : description}
      </div>
    )}
  </div>
);

// Skill Item Component
const SkillItem: React.FC<{ skill: string }> = ({ skill }) => (
  <div className="flex items-center gap-1">
    <span className="w-2 h-2 bg-purple-800 rounded-full" />
    <span className="text-[9px]">{skill.trim()}</span>
  </div>
);

export default ProfessionalModernTemplate;
