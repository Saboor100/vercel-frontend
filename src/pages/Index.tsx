import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />

        <section className="py-16 sm:py-24 bg-white">
          <div className="container-xl">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("home.readyTitle")}
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t("home.readyDescription")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#E67912] hover:bg-[#fb9d44] hover:text-white"
                >
                  <Link to="/resume">{t("home.createResume")}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="sm:mt-0 mt-4 text-[#E67912] hover:bg-[#e88f3c] hover:text-white border-[#E67912]"
                >
                  <Link to="/cover-letter">{t("home.writeCoverLetter")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t bg-muted/40">
          <div className="container-xl py-12 pb-24 md:pb-12">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} FLACRONCV.{" "}
                  {t("home.rights")}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-center">
                <a
                  href="terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("home.terms")}
                </a>
                <a
                  href="privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("home.privacy")}
                </a>
                <a
                  href="contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t("home.contact")}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
