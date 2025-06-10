import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, PenLine, UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";

const NAV_ITEMS = [
  { to: "/", icon: <Home size={22} />, labelKey: "navbar.home" },
  { to: "/resume", icon: <FileText size={22} />, labelKey: "navbar.resume" },
  {
    to: "/cover-letter",
    icon: <PenLine size={22} />,
    labelKey: "navbar.coverLetter",
  },
  { to: "/settings", icon: <UserCog size={22} />, labelKey: "navbar.settings" }, // New!
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-md md:hidden z-50">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center justify-center text-xs transition-colors duration-200 ${
            pathname === item.to
              ? "text-[#E67912] font-bold"
              : "text-gray-500 hover:text-[#E67912]"
          }`}
        >
          {item.icon}
          <span className="mt-1">{t(item.labelKey)}</span>
        </Link>
      ))}
    </nav>
  );
}
