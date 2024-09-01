import { Language } from "@/core/types/entities/Language";

const ExtractLanguage = (packages: Array<Language>): unknown => {
  const dictionary = {};
  packages.forEach((item) => {
    dictionary[item.Code] = item.Lang;
  });
  return dictionary;
};

export { ExtractLanguage };
