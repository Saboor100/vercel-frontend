import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const PaymentCancelPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center">
          <div className="bg-amber-100 p-3 rounded-full mb-4">
            <XCircle className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">
            {t("payment_cancelled.title")}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {t("payment_cancelled.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                {t("payment_cancelled.back_to_home")}
              </Link>
            </Button>
            <Button
              variant="default"
              className="flex items-center justify-center gap-2"
              asChild
            >
              <Link to="/resume">
                <HelpCircle className="h-4 w-4" />
                {t("payment_cancelled.continue_without_subscribing")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
