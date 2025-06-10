import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  BadgeCheck,
  Code,
  Layers,
  UserCircle2,
  Linkedin,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import useLocalizedFormats from "@/hooks/useLocalizedFormats";

const Hero = () => {
  const { t, i18n } = useTranslation();
  const { getFormattedDate } = useLocalizedFormats();
  const sampleDate = new Date("2024-09-01");

  return (
    <div className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-[#fff7ed] via-white to-white">
      <div className="container-xl">
        {/* Hero Text */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#E67912] to-[#FFB265]">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t("hero.description")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#E67912] hover:bg-[#fb9d44] text-white shadow-md hover:shadow-lg transition"
            >
              <Link to="/resume">{t("hero.createResume")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-[#E67912] border-[#E67912] hover:bg-[#E67912] hover:text-white shadow-sm hover:shadow-md transition"
            >
              <Link to="/cover-letter">{t("hero.writeCoverLetter")}</Link>
            </Button>
          </div>
        </div>

        {/* Resume Preview Box */}
        <div className="mt-20 flex justify-center px-4">
          <div className="w-full max-w-4xl rounded-3xl bg-white shadow-xl ring-1 ring-border p-10 transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
            {/* Header */}
            <div className="mb-8 border-b pb-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {t("hero.resume.name")}
              </h2>
              <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {t("hero.resume.email")}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {t("hero.resume.phone")}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {t("hero.resume.location")}
                </span>
                <span className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" /> {t("hero.resume.linkedin")}
                </span>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 text-gray-700">
              <Section
                title={t("hero.resume.summary.title")}
                icon={<UserCircle2 className="w-5 h-5 text-[#E67912]" />}
              >
                <p className="text-sm leading-relaxed">
                  {t("hero.resume.summary.content")}
                </p>
              </Section>

              <Section
                title={t("hero.resume.education.title")}
                icon={<GraduationCap className="w-5 h-5 text-[#E67912]" />}
              >
                <p className="text-sm font-medium">
                  {t("hero.resume.education.university")}
                </p>
                <p className="text-sm">
                  {t("hero.resume.education.degree")} —{" "}
                  {getFormattedDate(sampleDate, i18n.language)}
                </p>
                <p className="text-xs text-gray-500">
                  {t("hero.resume.education.details")}
                </p>
              </Section>

              <Section
                title={t("hero.resume.experience.title")}
                icon={<Briefcase className="w-5 h-5 text-[#E67912]" />}
              >
                <p className="text-sm font-medium">
                  {t("hero.resume.experience.position")}
                </p>
                <p className="text-sm">
                  {getFormattedDate(sampleDate, i18n.language)} –{" "}
                  {t("hero.resume.experience.current")}
                </p>
                <p className="text-xs mt-1">
                  {t("hero.resume.experience.details")}
                </p>
              </Section>

              <Section
                title={t("hero.resume.projects.title")}
                icon={<Code className="w-5 h-5 text-[#E67912]" />}
              >
                <p className="text-sm font-medium">
                  {t("hero.resume.projects.projectName")}
                </p>
                <div className="flex flex-wrap gap-2 mt-1 text-xs">
                  {["React", "Node.js", "MongoDB"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-[#FFEDDB] text-[#E67912] rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Section>

              <Section
                title={t("hero.resume.certifications.title")}
                icon={<BadgeCheck className="w-5 h-5 text-[#E67912]" />}
              >
                <p className="text-sm">
                  {t("hero.resume.certifications.cert")}
                </p>
              </Section>

              <Section
                title={t("hero.resume.skills.title")}
                icon={<Layers className="w-5 h-5 text-[#E67912]" />}
              >
                <ul className="list-disc list-inside text-sm">
                  <li>{t("hero.resume.skills.item1")}</li>
                  <li>{t("hero.resume.skills.item2")}</li>
                </ul>
              </Section>

              <Section
                title={t("hero.resume.custom.title")}
                icon={<PlusCircle className="w-5 h-5 text-[#E67912]" />}
              >
                <p className="text-sm">{t("hero.resume.custom.content")}</p>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <h3 className="text-md font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="ml-6">{children}</div>
  </div>
);

export default Hero;
