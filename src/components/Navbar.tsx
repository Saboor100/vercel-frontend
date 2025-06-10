import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, UserCog, Globe } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { toast } from "sonner";
import { auth } from "@/services/firebase";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Logo from "../Assets/images/FlacroncvLogo.png";
import { useTranslation } from "react-i18next";
import { BottomNav } from "./ui/BottomNav";

const NAV_LINKS = [
  { to: "/", labelKey: "navbar.home" },
  { to: "/resume", labelKey: "navbar.resume" },
  { to: "/cover-letter", labelKey: "navbar.coverLetter" },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success(t("navbar.logoutSuccess"));
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("navbar.logoutError"));
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="w-full py-2 border-b border-border bg-background shadow-sm">
      <div
        className="container-xl relative flex items-center justify-between px-2 sm:px-4"
        style={{ minHeight: "60px" }}
      >
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0 min-w-[48px]">
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-md"
              alt="FLACRONCV Logo"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium transition-colors relative px-2 pb-1
                  ${
                    isActive
                      ? "text-[#E67912] font-bold after:content-[''] after:block after:h-[3px] after:rounded-full after:bg-[#E67912] after:w-full after:absolute after:bottom-0 after:left-0"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
                style={{ border: "none" }}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth + Language (always visible, responsive layout) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-[#E67912] border-[#E67912] px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-[#E67912] hover:text-white"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block">
                    {user.email?.split("@")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 sm:w-56">
                <DropdownMenuItem className="p-0">
                  <Link
                    to="/settings"
                    className="flex items-center w-full px-3 py-2 hover:bg-[#E67912] hover:text-white transition-colors"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    {t("navbar.settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="p-0">
                  <button className="flex items-center w-full px-3 py-2 hover:bg-[#E67912] hover:text-white transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("navbar.logout")}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm hover:bg-[#E67912] hover:text-white transition-colors flex items-center gap-1"
              >
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden xs:inline">{t("navbar.login")}</span>
                </Link>
              </Button>
              <Button
                asChild
                className="bg-[#E67912] hover:bg-[#E67912] hover:text-white transition-colors px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm flex items-center gap-1"
              >
                <Link to="/register">
                  <User className="h-4 w-4" />
                  <span className="hidden xs:inline">
                    {t("navbar.register")}
                  </span>
                </Link>
              </Button>
            </>
          )}

          {/* Language Switcher */}
          <div className="flex gap-1 sm:gap-2 items-center ml-1">
            <Globe className="h-4 w-4 text-[#E67912] hidden xs:inline" />
            <button
              onClick={() => changeLanguage("en")}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors duration-150 ${
                i18n.language === "en"
                  ? "bg-[#E67912] text-white shadow"
                  : "bg-white text-[#E67912] border border-[#E67912] hover:bg-[#ffe4cc]"
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage("fr")}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors duration-150 ${
                i18n.language === "fr"
                  ? "bg-[#E67912] text-white shadow"
                  : "bg-white text-[#E67912] border border-[#E67912] hover:bg-[#ffe4cc]"
              }`}
              aria-label="Changer en français"
            >
              FR
            </button>
          </div>
        </div>
      </div>
      {/* Bottom navigation for mobile */}
      <BottomNav />
    </header>
  );
};

export default Navbar;
