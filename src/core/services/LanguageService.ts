import { AxiosRequestConfig } from "axios";
import {
  LocaleMessageDictionary,
  VueMessageType
} from "vue-i18n";
import { ExtractLanguage } from "@/core/helpers/language-extractor";
import { Language } from "@/core/types/entities/Language";
import { ResponseResult } from "@/core/types/misc/ResponseResult";
import ApiService from "./ApiService";


const API_URLS = {
  get: `${import.meta.env.VITE_APP_BASE_URL_BSPACE}/${import.meta.env.VITE_APP_GENERAL_WEBAPI}/api/generalmasteremployee/GetDataLanguage`,
}

/**
 * @description get language form server
 */
export const getLanguageFromServer = (lang:string): Promise<LocaleMessageDictionary<VueMessageType>> => {
  const payload = {
    withCredentials: true,
    "lang": lang.toUpperCase()
  } as AxiosRequestConfig;
  return new Promise<LocaleMessageDictionary<VueMessageType>>((resolve, reject) => {
    ApiService.post(API_URLS.get, payload)
      .then(({ data }) => {
        const response = data.result as ResponseResult<Array<Language>>;
        const messages = ExtractLanguage(response.content);
        resolve(messages as LocaleMessageDictionary<VueMessageType>);
      })
      .catch(({ response }) => {
        console.log(response);
        reject();
      });
  });
};

export default { getLanguageFromServer }
