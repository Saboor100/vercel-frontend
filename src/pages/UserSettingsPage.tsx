import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, AlertTriangle, UserCog, UserX } from "lucide-react";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { paymentApi } from "@/services/apiClient";
import { toast } from "sonner";
import { deleteUser } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useTranslation } from "react-i18next";

const UserSettingsPage = () => {
  const { t } = useTranslation();
  const { user, refreshUserData } = useFirebaseAuth();
  const [showUnsubscribeDialog, setShowUnsubscribeDialog] = useState(false);
  const [unsubscribeLoading, setUnsubscribeLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const navigate = useNavigate();

  const handleUnsubscribe = async () => {
    if (!user) return;

    setUnsubscribeLoading(true);

    try {
      // Call the API to unsubscribe
      const result = await paymentApi.unsubscribe();

      if (result.success) {
        // Refresh user data to update subscription status
        await refreshUserData();

        toast.success(t("userSettings.unsubscribeSuccess"), {
          description: t("userSettings.unsubscribeDescription"),
        });

        setShowUnsubscribeDialog(false);
      } else {
        toast.error(t("userSettings.unsubscribeFail"), {
          description:
            result.message || t("userSettings.unsubscribeFailDescription"),
        });
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast.error(t("userSettings.error"), {
        description: t("userSettings.tryAgain"),
      });
    } finally {
      setUnsubscribeLoading(false);
    }
  };

  // Helper function to get plan name display
  const getPlanDisplay = () => {
    if (!user?.subscription) return t("userSettings.noActiveSubscription");
    const plan = user.subscription.plan;
    return plan
      ? `${plan.charAt(0).toUpperCase()}${plan.slice(1)} ${t(
          "userSettings.plan"
        )}`
      : t("userSettings.noActiveSubscription");
  };

  // Helper function to get plan description
  const getPlanDescription = () => {
    if (!user?.subscription) return "";
    const plan = user.subscription.plan;

    if (plan === "basic") {
      return t("userSettings.basicPlanDesc");
    } else if (plan === "pro") {
      return t("userSettings.proPlanDesc");
    } else {
      return t("userSettings.freePlanDesc");
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;

    setDeleteLoading(true);
    try {
      await deleteUser(auth.currentUser);
      toast.success(t("userSettings.accountDeleted"), {
        description: t("userSettings.accountDeletedDesc"),
      });
      navigate("/"); // or redirect to a goodbye page
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast.error(t("userSettings.deletionFailed"), {
        description: error.message || t("userSettings.deletionFailedDesc"),
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserCog className="h-6 w-6 text-[#E67912]" />
              {t("userSettings.accountSettings")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("userSettings.manageAccount")}
            </p>
          </div>

          <div className="space-y-6">
            {/* Subscription Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#E67912]" />
                  {t("userSettings.subscription")}
                </CardTitle>
                <CardDescription>
                  {t("userSettings.manageSubscription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-1">
                      {t("userSettings.currentPlan")}
                    </h3>
                    <p className="text-lg">{getPlanDisplay()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getPlanDescription()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                {user?.subscription && user.subscription.plan !== "free" ? (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-[#E67912] hover:bg-[#fb9d44] text-white"
                    onClick={() => setShowUnsubscribeDialog(true)}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    {t("userSettings.cancelSubscription")}
                  </Button>
                ) : (
                  <Button
                    className="w-full sm:w-auto bg-[#E67912] hover:bg-[#fb9d44] text-white"
                    onClick={() => navigate("/plans")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t("userSettings.subscribeNow")}
                  </Button>
                )}
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-red-500" />
                  {t("userSettings.dangerZone")}
                </CardTitle>
                <CardDescription>
                  {t("userSettings.deleteAccountPermanent")}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  {t("userSettings.deleteAccount")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Unsubscribe Dialog */}
      <Dialog
        open={showUnsubscribeDialog}
        onOpenChange={setShowUnsubscribeDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t("userSettings.cancelSubscription")}
            </DialogTitle>
            <DialogDescription>
              {t("userSettings.unsubscribeConfirm")}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
            <p className="text-sm text-amber-800">
              {t("userSettings.unsubscribeLossIntro")}
            </p>
            <ul className="list-disc list-inside text-sm text-amber-800 mt-2">
              {user?.subscription?.plan === "pro" && (
                <li>{t("userSettings.unsubscribeAiEnhancements")}</li>
              )}
              <li>{t("userSettings.unsubscribePremiumTemplates")}</li>
              <li>{t("userSettings.unsubscribeAdvancedFormatting")}</li>
              {user?.subscription?.plan === "pro" && (
                <li>{t("userSettings.unsubscribeLinkedin")}</li>
              )}
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnsubscribeDialog(false)}
              disabled={unsubscribeLoading}
            >
              {t("userSettings.keepSubscription")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnsubscribe}
              disabled={unsubscribeLoading}
            >
              {unsubscribeLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("userSettings.processing")}
                </>
              ) : (
                t("userSettings.cancelSubscription")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {t("userSettings.confirmAccountDeletion")}
            </DialogTitle>
            <DialogDescription>
              {t("userSettings.deleteAccountConfirm")}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
            <p className="text-sm text-red-800">
              {t("userSettings.deleteAccountWarning")}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteLoading}
            >
              {t("userSettings.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("userSettings.deleting")}
                </>
              ) : (
                t("userSettings.deleteAccount")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSettingsPage;
