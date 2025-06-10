import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// Maps i18n languages to real locales
const languageToLocale = {
  en: "en-US",
  fr: "fr-FR",
  // Add more mappings if needed
};

function getLocaleFromI18n(i18n) {
  const lang = i18n.language?.split("-")[0] || "en";
  return languageToLocale[lang] || "en-US";
}

function formatCurrency(amount, currency = "USD", locale) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `${amount} ${currency}`;
  }
}

function formatDate(date, options = {}, locale) {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(d);
}

function formatTime(date, options = {}, locale) {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(d);
}

const useLocalizedFormats = () => {
  const { i18n } = useTranslation();
  const locale = getLocaleFromI18n(i18n);

  const getFormattedCurrency = useMemo(
    () => (amount, currency) => formatCurrency(amount, currency, locale),
    [locale]
  );

  const getFormattedDate = useMemo(
    () => (date, options) => formatDate(date, options, locale),
    [locale]
  );

  const getFormattedTime = useMemo(
    () => (date, options) => formatTime(date, options, locale),
    [locale]
  );

  return {
    locale,
    getFormattedCurrency,
    getFormattedDate,
    getFormattedTime,
  };
};

export default useLocalizedFormats;