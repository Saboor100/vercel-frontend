import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-4  hover:bg-[#fb9d44] hover:text-white"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("terms.backToHome")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{t("terms.title")}</h1>
        </div>

        <div className="prose max-w-none">
          <h2>{t("terms.introduction.title")}</h2>
          <p>{t("terms.introduction.content")}</p>

          <h2>{t("terms.license.title")}</h2>
          <p>{t("terms.license.content")}</p>
          <ul>
            <li>{t("terms.license.list.1")}</li>
            <li>{t("terms.license.list.2")}</li>
            <li>{t("terms.license.list.3")}</li>
            <li>{t("terms.license.list.4")}</li>
            <li>{t("terms.license.list.5")}</li>
          </ul>

          <h2>{t("terms.disclaimer.title")}</h2>
          <p>{t("terms.disclaimer.content")}</p>

          <h2>{t("terms.limitations.title")}</h2>
          <p>{t("terms.limitations.content")}</p>

          <h2>{t("terms.subscriptions.title")}</h2>
          <p>{t("terms.subscriptions.content")}</p>

          <h2>{t("terms.privacy.title")}</h2>
          <p>
            {t("terms.privacy.content")}{" "}
            <Link to="/privacy" className="text-[#E67912] hover:underline">
              {t("terms.privacy.link")}
            </Link>
          </p>

          <h2>{t("terms.governingLaw.title")}</h2>
          <p>{t("terms.governingLaw.content")}</p>

          <h2>{t("terms.changes.title")}</h2>
          <p>{t("terms.changes.content")}</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
