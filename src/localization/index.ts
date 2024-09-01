import { createI18n } from "vue-i18n";
import id from "./lang/id/index";
import en from "./lang/en/index";

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem("lang")
    ? (localStorage.getItem("lang") as string)
    : "en",
  fallbackLocale: localStorage.getItem("lang")
    ? (localStorage.getItem("lang") as string)
    : "en",
  messages: {
    en,
    id,
  },
});
