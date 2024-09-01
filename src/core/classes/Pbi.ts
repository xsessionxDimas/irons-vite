import { PbiConfig } from "../../core/types/entities/PbiConfig";
import ApiService from "../../core/services/ApiService";
import { Actions as ErrorActions } from "../../store/enums/ErrorHandleEnum";
import { AxiosRequestConfig } from "axios";
import { useAuthenticationStore } from '../../store/pinia/application/useAuthenticationStore'
import { useErrorHandleStore } from '../../store/templates/useErrorStore'

export default class Pbi {
  private pbiConfig: PbiConfig;
  private static baseUrl = ``;
  private static isCompleteUrl = false;

  private store = useAuthenticationStore()
  private static errorStore = useErrorHandleStore()

  constructor(pbiConfig: PbiConfig) {
    this.pbiConfig = pbiConfig;
  }

  // start: GETTER ======================
  getPbiConfig() {
    return this.pbiConfig;
  }
  // end: GETTER ========================

  // start: SETTER ======================
  setPbiConfig(pbiConfig: PbiConfig) {
    this.pbiConfig = pbiConfig;
  }

  setPbiUrl(url: string) {
    Pbi.baseUrl = url;
  }

  setPbiIsCompleteUrl(status: boolean) {
    Pbi.isCompleteUrl = status;
  }
  // end: SETTER ========================

  getApiPbiConfig(payload) {
    const pbiReportName = payload.reportName;
    const publicPbiReportName = `${payload.workspaceId}/${payload.reportId}`;
    const getPbiApiUrl = `${Pbi.baseUrl}/api/embed_info/${pbiReportName}?ver=v1`;
    const getPublicPbiApiUrl = `${Pbi.baseUrl}/api/embed_info/${publicPbiReportName}?ver=v1`;

    return new Promise<void>((resolve, reject) => {
      if (!payload.isPublic) {
        ApiService.get(getPbiApiUrl)
          .then(({ data }) => {
            if (data.statusCode === 200) {
              const resData = data.result.content as PbiConfig;
              this.pbiConfig = resData;
              resolve();
            } else {
              Pbi.callErrorAction(payload, data);
            }
          })
          .catch(({ response }) => {
            console.log("response ERROR PBI")
            console.log(response)
            reject();
            Pbi.callErrorAction(payload, response.data);
          });
      } else {
        ApiService.publicGet(getPublicPbiApiUrl)
          .then(({ data }) => {
            if (data.statusCode === 200) {
              const resData = data.result.content as PbiConfig;
              this.pbiConfig = resData;
              resolve();
            } else {
              Pbi.callErrorAction(payload, data);
            }
          })
          .catch(({ response }) => {
            reject();
            Pbi.callErrorAction(payload, response.data);
          });
      }
    });
  }

  postApiPbiConfig(payload) {
    if (this.store.user.email) {
      return new Promise<void>((resolve, reject) => {
        ApiService.post(
          Pbi.isCompleteUrl ? Pbi.baseUrl : `${Pbi.baseUrl}/api/embed_info/?ver=v1`,
          {
            "reportName": payload.reportName,
            "email": this.store.user.email
          } as AxiosRequestConfig
        )
          .then(({ data }) => {
            if (data.statusCode === 200) {
              const resData = data.result.content as PbiConfig;
              this.pbiConfig = resData;
              resolve();
            } else {
              Pbi.callErrorAction(payload, data);
            }
          })
          .catch(({ response }) => {
            reject();
            Pbi.callErrorAction(payload, response.data);
          });
      });
    }
  }

  private static callErrorAction(payload, response) {
    let errMessage = "";
    if ('message' in response) {
      errMessage = response.message;
    } else {
      const resultMessage = response.result.message;
      const resultContent = response.result.content;
      errMessage = resultMessage ? resultMessage : resultContent;
    }
    this.errorStore[ErrorActions.UPDATE_ERROR_TO_PAGE]({
      page: payload.pageName,
      type: "unhandledError",
      name: `get-${payload.pageName}-PbiEmbed`,
      message: `${response.statusCode} - ${errMessage}`,
    });
  }
}
