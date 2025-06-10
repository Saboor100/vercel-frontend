import React from "react";
import Navbar from "@/components/Navbar";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useTranslation } from "react-i18next";

const PlansPage = () => {
  const { user } = useFirebaseAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">{t("plansPage.title")}</h1>
            <p className="text-lg text-muted-foreground">
              {t("plansPage.subtitle")}
            </p>
          </div>

          {!user && (
            <Alert className="mb-6 max-w-2xl mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t("plansPage.notLoggedInTitle")}</AlertTitle>
              <AlertDescription>
                {t("plansPage.notLoggedInDescription")}
              </AlertDescription>
            </Alert>
          )}

          <SubscriptionPlans />

          <div className="mt-12 text-center text-sm text-muted-foreground max-w-xl mx-auto">
            <p>{t("plansPage.footerNote")}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlansPage;
