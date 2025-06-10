import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { paymentApi } from "@/services/apiClient";
import { toast } from "sonner";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import useLocalizedFormats from "@/hooks/useLocalizedFormats";

interface PlanInfo {
  id: string;
  name: string;
  amount: number;
  currency: string;
}

interface PlansData {
  basic: PlanInfo;
  pro: PlanInfo;
}

const SubscriptionPlans = () => {
  const { t, i18n } = useTranslation();
  const { getFormattedCurrency, getFormattedDate, getFormattedTime, locale } =
    useLocalizedFormats();

  const isFrench = i18n.language.startsWith("fr");

  const [plans, setPlans] = useState<PlansData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const { user } = useFirebaseAuth();

  // --- NEW: Add currency state, default to USD or based on locale ---
  const [currency, setCurrency] = useState(isFrench ? "EUR" : "USD");

  // --- UPDATED: Fetch plans with selected currency ---
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const result = await paymentApi.getPlans(currency); // pass currency!
        if (result.success && result.data) {
          setPlans(result.data as PlansData);
        } else {
          toast.error(t("errors.loadPlans"));
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error(t("errors.loadPlans"));
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [t, currency]); // <-- add currency so it refetches when changed

  // --- UPDATED: Pass currency to checkout session ---
  const handleSubscribe = async (plan: "basic" | "pro") => {
    if (!user) {
      toast.error(t("errors.loginToSubscribe"));
      return;
    }

    setSubscribing(plan);
    try {
      const result = await paymentApi.createCheckoutSession(plan, currency); // pass currency!
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.error(t("errors.checkoutSession"));
      }
    } catch (error) {
      console.error(`Error subscribing to ${plan} plan:`, error);
      toast.error(t("errors.subscriptionFailed", { plan }));
    } finally {
      setSubscribing(null);
    }
  };

  // --- FIXED: Robust subscription checker ---
  const hasSubscription = (planName: string): boolean => {
    if (
      !user?.subscription ||
      !user.subscription.status ||
      !user.subscription.plan
    )
      return false;
    // Normalize for case, spaces, and allow for "basic", "basic plan", etc.
    const normalizedUserPlan = user.subscription.plan
      .toLowerCase()
      .replace(/\s+/g, "");
    const normalizedPlanName = planName.toLowerCase().replace(/\s+/g, "");
    return (
      user.subscription.status === "active" &&
      (normalizedUserPlan === normalizedPlanName ||
        normalizedUserPlan.includes(normalizedPlanName))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">{t("errors.unableToLoadPlans")}</p>
      </div>
    );
  }

  return (
    <div>
      {/* --- NEW: Currency Selector --- */}
      <div className="flex justify-end mb-4">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <Card className="flex flex-col border-2 relative">
          <CardHeader>
            <CardTitle className="text-xl">{t("plans.basic.title")}</CardTitle>
            <CardDescription>{t("plans.basic.description")}</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                {getFormattedCurrency(
                  plans.basic.amount / 100,
                  isFrench ? "EUR" : plans.basic.currency
                )}
              </span>
              <span className="text-muted-foreground ml-1">
                {t("plans.basic.paymentType")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("plans.basic.features.templates")}</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("plans.basic.features.downloads")}</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("plans.basic.features.storage")}</span>
              </li>
            </ul>
            {/* Example of localized date/time display if needed */}
            {/* <div className="mt-4 text-sm text-gray-500">
              {t("plans.lastUpdated")}: {getFormattedDate(new Date())} {getFormattedTime(new Date())}
            </div> */}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubscribe("basic")}
              disabled={
                hasSubscription("basic") ||
                hasSubscription("pro") ||
                subscribing !== null
              }
            >
              {subscribing === "basic" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("buttons.processing")}
                </>
              ) : hasSubscription("basic") || hasSubscription("pro") ? (
                t("buttons.currentPlan")
              ) : (
                t("buttons.subscribeNow")
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col border-2 border-primary relative">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
            {t("plans.pro.recommended")}
          </div>
          <CardHeader>
            <CardTitle className="text-xl">{t("plans.pro.title")}</CardTitle>
            <CardDescription>{t("plans.pro.description")}</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                {getFormattedCurrency(
                  plans.pro.amount / 100,
                  isFrench ? "EUR" : plans.pro.currency
                )}
              </span>
              <span className="text-muted-foreground ml-1">
                {t("plans.pro.paymentType")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("plans.pro.features.basic")}</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("plans.pro.features.premiumTemplates")}</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("plans.pro.features.aiResume")}</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("plans.pro.features.aiCoverLetter")}</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span>{t("plans.pro.features.linkedin")}</span>
              </li>
            </ul>
            {/* Example of localized date/time display if needed */}
            {/* <div className="mt-4 text-sm text-gray-500">
              {t("plans.lastUpdated")}: {getFormattedDate(new Date())} {getFormattedTime(new Date())}
            </div> */}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={hasSubscription("pro") ? "outline" : "default"}
              onClick={() => handleSubscribe("pro")}
              disabled={hasSubscription("pro") || subscribing !== null}
            >
              {subscribing === "pro" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("buttons.processing")}
                </>
              ) : hasSubscription("pro") ? (
                t("buttons.currentPlan")
              ) : (
                t("buttons.subscribeNow")
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
