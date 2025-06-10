import React from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  Sparkles,
  FileText,
  Zap,
  Search,
  FileCheck,
} from "lucide-react";

const features = [
  { key: "aiPoweredContent", icon: Sparkles },
  { key: "atsOptimized", icon: CheckCircle },
  { key: "professionalTemplates", icon: FileText },
  { key: "instantGeneration", icon: Zap },
  { key: "keywordOptimization", icon: Search },
  { key: "exportToPDF", icon: FileCheck },
];

const Features = () => {
  const { t } = useTranslation();

  // Map keys for translation instead of hardcoded strings
  const features = [
    {
      name: t("features.aiPoweredContent.name"),
      description: t("features.aiPoweredContent.description"),
      icon: Sparkles,
    },
    {
      name: t("features.atsOptimized.name"),
      description: t("features.atsOptimized.description"),
      icon: CheckCircle,
    },
    {
      name: t("features.professionalTemplates.name"),
      description: t("features.professionalTemplates.description"),
      icon: FileText,
    },
    {
      name: t("features.instantGeneration.name"),
      description: t("features.instantGeneration.description"),
      icon: Zap,
    },
    {
      name: t("features.keywordOptimization.name"),
      description: t("features.keywordOptimization.description"),
      icon: Search,
    },
    {
      name: t("features.exportToPDF.name"),
      description: t("features.exportToPDF.description"),
      icon: FileCheck,
    },
  ];

  return (
    <div className="py-24 sm:py-32 bg-secondary/50">
      <div className="container-xl">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#E67912]">
            {t("features.title")}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("features.subtitle")}
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t("features.description")}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E67912]">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
