import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { paymentApi } from "@/services/apiClient";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const POLL_INTERVAL = 3000; // 3 seconds
const MAX_ATTEMPTS = 10; // Poll up to 10 times (30 seconds)

const PaymentSuccessPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const { refreshUserData } = useFirebaseAuth();

  useEffect(() => {
    let attempts = 0;
    let timeoutId: NodeJS.Timeout;

    const hasVerified = sessionStorage.getItem(`payment_verified_${sessionId}`);
    if (hasVerified) {
      setVerified(true);
      setPlan(sessionStorage.getItem(`payment_plan_${sessionId}`));
      setLoading(false);
      return;
    }

    const pollVerifyPayment = async () => {
      if (!sessionId) {
        toast.error(t("payment_success.toast.missing_session"));
        setLoading(false);
        return;
      }
      try {
        const result = await paymentApi.verifyPaymentSuccess(sessionId);
        if (result.success && result.data?.paid) {
          setPlan(result.data.plan);
          setVerified(true);
          sessionStorage.setItem(`payment_verified_${sessionId}`, "true");
          sessionStorage.setItem(`payment_plan_${sessionId}`, result.data.plan);
          await refreshUserData();
          toast.success(t("payment_success.toast.success_title"), {
            description: t("payment_success.toast.success_description", {
              plan: result.data.plan,
            }),
          });
          setLoading(false);
        } else {
          attempts++;
          if (attempts < MAX_ATTEMPTS) {
            timeoutId = setTimeout(pollVerifyPayment, POLL_INTERVAL);
          } else {
            toast.error(t("payment_success.toast.failed_title"), {
              description: t("payment_success.toast.failed_description"),
            });
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        attempts++;
        if (attempts < MAX_ATTEMPTS) {
          timeoutId = setTimeout(pollVerifyPayment, POLL_INTERVAL);
        } else {
          toast.error(t("payment_success.toast.error_title"), {
            description: t("payment_success.toast.error_description"),
          });
          setLoading(false);
        }
      }
    };

    if (!hasVerified) {
      pollVerifyPayment();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sessionId, refreshUserData, t]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-medium text-center">
              {t("payment_success.loading_title")}
            </h2>
            <p className="text-muted-foreground text-center mt-2">
              {t("payment_success.loading_description")}
            </p>
          </div>
        ) : verified ? (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              {t("payment_success.success_title")}
            </h1>
            {plan && (
              <p className="text-lg text-center mb-6">
                {t("payment_success.plan_message", {
                  plan: plan.charAt(0).toUpperCase() + plan.slice(1),
                })}
              </p>
            )}
            <p className="text-muted-foreground text-center mb-8">
              {t("payment_success.thank_you")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  {t("payment_success.back_to_home")}
                </Link>
              </Button>
              <Button className="flex-1">
                <Link to="/resume">{t("payment_success.continue")}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              {/* You can add an error icon here if you have one */}
            </div>
            <h1 className="text-2xl font-bold text-center mb-2 text-red-600">
              {t("payment_success.failed_title")}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {t("payment_success.failed_description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  {t("payment_success.back_to_home")}
                </Link>
              </Button>
              <Button
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                {t("payment_success.retry")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
