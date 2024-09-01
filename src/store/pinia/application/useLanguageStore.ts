import { GET_LANGUAGE } from "./newUrls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { LocaleMessages, VueMessageType } from "vue-i18n";
import { Language } from "@/core/types/entities/Language";
import { ExtractLanguage } from "@/core/helpers/language-extractor";
import id from "@/localization/lang/id";
import en from "@/localization/lang/en";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useLanguageStore = defineStore({
  id: "language",
  state: () => {
    return {
      stateDictionary: null as LocaleMessages<VueMessageType> | null,
      stateIsDictionarySet: false
    }
  },
  getters: {
    dictionary: (state) => {
      return state.stateDictionary;
    },
    isDictionarySet: (state) => {
      return state.stateIsDictionarySet;
    }
  },
  actions: {
    async downloadLanguage(lang: string) {
      const params = { lang: lang, ver: 'v1' };
      try {
        const response: AxiosResponse<ApiResponse<Language>> = await ApiService.get(GET_LANGUAGE, "", new URLSearchParams(params).toString());
        const messages = ExtractLanguage(response.data.result.content) as any;
        if (lang == "ID") {
          messages.routerName = id.routerName;
          messages.sidebarMenu = id.sidebarMenu;
        } else {
          messages.routerName = en.routerName;
          messages.sidebarMenu = en.sidebarMenu;
        }
        this.stateDictionary = messages;
        this.stateIsDictionarySet = true;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    }
  }
})
