import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTranslation } from "react-i18next";
import "./i18n";

// Pages
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ContactPage from "@/pages/ContactPage";
import PlansPage from "@/pages/PlansPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import PaymentCancelPage from "@/pages/PaymentCancelPage";
import UserSettingsPage from "@/pages/UserSettingsPage";
import ResumePage from "@/pages/ResumePage";
import CoverLetterPage from "@/pages/CoverLetterPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/NotFound";

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: "en" | "fr") => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />

        {/* Protected Routes */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/settings" element={<UserSettingsPage />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/cover-letter" element={<CoverLetterPage />} />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
      <SonnerToaster position="top-right" />
    </>
  );
}

export default App;
