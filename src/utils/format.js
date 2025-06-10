// src/utils/formatters.js

/**
 * Gets the user's locale from the browser, falling back to 'en-US'.
 */
export function getUserLocale() {
  return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Formats a Date object according to the user's locale.
 * @param {Date|string|number} date - The date to format.
 * @param {Object} options - Intl.DateTimeFormat options.
 * @param {string} [locale] - Override locale (optional).
 * @returns {string} - Formatted date string.
 */
export function formatDate(date, options = {}, locale) {
  const userLocale = locale || getUserLocale();
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(userLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * Formats a time according to the user's locale.
 * @param {Date|string|number} date - The date/time to format.
 * @param {Object} options - Intl.DateTimeFormat options.
 * @param {string} [locale] - Override locale (optional).
 * @returns {string} - Formatted time string.
 */
export function formatTime(date, options = {}, locale) {
  const userLocale = locale || getUserLocale();
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(userLocale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options,
  }).format(dateObj);
}

/**
 * Formats a number as currency according to the user's locale.
 * @param {number} amount - The amount to format.
 * @param {string} currency - The currency code, e.g. 'USD', 'EUR'.
 * @param {Object} options - Intl.NumberFormat options.
 * @param {string} [locale] - Override locale (optional).
 * @returns {string} - Formatted currency string.
 */
export function formatCurrency(amount, currency = 'USD', options = {}, locale) {
  const userLocale = locale || getUserLocale();
  return new Intl.NumberFormat(userLocale, {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
}