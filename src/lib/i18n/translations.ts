
import { enUS } from "date-fns/locale";

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "de"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

type DateLocale = {
  [key in Locale]: Locale extends "en" ? typeof enUS : typeof enUS;
};

export const dateLocales: DateLocale = {
  en: enUS,
  de: enUS,
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
};

export const translations = {
  en: {
    app: {
      name: "Hospitify 360",
      description: "Hotel Management System",
      online: "Online",
      offline: "Offline"
    },
    nav: {
      dashboard: "Dashboard",
      rooms: "Rooms",
      guests: "Guests",
      bookings: "Bookings",
      tasks: "Tasks",
      inventory: "Inventory",
      scheduling: "Scheduling",
      reports: "Reports",
      settings: "Settings",
      users: "Users",
      billing: "Billing",
      guestExperience: "Guest Experience",
    },
    auth: {
      logout: "Log out"
    },
    common: {
      notification: "Notification"
    }
  },
  de: {
    app: {
      name: "Hospitify 360",
      description: "Hotel Management System",
      online: "Online",
      offline: "Offline"
    },
    nav: {
      dashboard: "Dashboard",
      rooms: "Zimmer",
      guests: "Gäste",
      bookings: "Buchungen",
      tasks: "Aufgaben",
      inventory: "Inventar",
      scheduling: "Planung",
      reports: "Berichte",
      settings: "Einstellungen",
      users: "Benutzer",
      billing: "Abrechnung",
      guestExperience: "Gästeerlebnis",
    },
    auth: {
      logout: "Abmelden"
    },
    common: {
      notification: "Benachrichtigung"
    }
  },
};
