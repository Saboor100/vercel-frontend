import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-4 hover:bg-[#fb9d44] hover:text-white"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4 " />
              {t("privacy.backToHome")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{t("privacy.title")}</h1>
        </div>

        <div className="prose max-w-none">
          <h2>{t("privacy.intro.title")}</h2>
          <p>{t("privacy.intro.text")}</p>

          <h2>{t("privacy.info.title")}</h2>
          <p>{t("privacy.info.text")}</p>

          <h3>{t("privacy.info.personal.title")}</h3>
          <p>{t("privacy.info.personal.text")}</p>
          <ul>
            <li>{t("privacy.info.personal.items.name")}</li>
            <li>{t("privacy.info.personal.items.email")}</li>
            <li>{t("privacy.info.personal.items.phone")}</li>
            <li>{t("privacy.info.personal.items.resume")}</li>
            <li>{t("privacy.info.personal.items.payment")}</li>
            <li>{t("privacy.info.personal.items.photo")}</li>
          </ul>

          <h3>{t("privacy.info.usage.title")}</h3>
          <p>{t("privacy.info.usage.text")}</p>
          <ul>
            <li>{t("privacy.info.usage.items.ip")}</li>
            <li>{t("privacy.info.usage.items.browserType")}</li>
            <li>{t("privacy.info.usage.items.browserVersion")}</li>
            <li>{t("privacy.info.usage.items.pagesVisited")}</li>
            <li>{t("privacy.info.usage.items.visitTime")}</li>
            <li>{t("privacy.info.usage.items.timeSpent")}</li>
            <li>{t("privacy.info.usage.items.diagnostics")}</li>
          </ul>

          <h2>{t("privacy.usage.title")}</h2>
          <p>{t("privacy.usage.text")}</p>
          <ul>
            <li>{t("privacy.usage.items.service")}</li>
            <li>{t("privacy.usage.items.payments")}</li>
            <li>{t("privacy.usage.items.notices")}</li>
            <li>{t("privacy.usage.items.feedback")}</li>
            <li>{t("privacy.usage.items.development")}</li>
            <li>{t("privacy.usage.items.monitoring")}</li>
            <li>{t("privacy.usage.items.fraud")}</li>
          </ul>

          <h2>{t("privacy.sharing.title")}</h2>
          <p>{t("privacy.sharing.text")}</p>
          <ul>
            <li>{t("privacy.sharing.items.providers")}</li>
            <li>{t("privacy.sharing.items.legal")}</li>
            <li>{t("privacy.sharing.items.defense")}</li>
            <li>{t("privacy.sharing.items.consent")}</li>
          </ul>

          <h2>{t("privacy.security.title")}</h2>
          <p>{t("privacy.security.text")}</p>

          <h2>{t("privacy.rights.title")}</h2>
          <p>{t("privacy.rights.text")}</p>
          <ul>
            <li>{t("privacy.rights.items.access")}</li>
            <li>{t("privacy.rights.items.rectify")}</li>
            <li>{t("privacy.rights.items.erase")}</li>
            <li>{t("privacy.rights.items.restrict")}</li>
            <li>{t("privacy.rights.items.portability")}</li>
            <li>{t("privacy.rights.items.object")}</li>
          </ul>

          <h2>{t("privacy.contact.title")}</h2>
          <p>
            {t("privacy.contact.text")}{" "}
            <Link to="/contact" className="text-[#E67912] hover:underline">
              {t("privacy.contact.link")}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
