import { defineStore } from 'pinia';
import { Mutations, Actions } from "@/store/enums/PbiEmbeddedEnums";
import { PbiConfig } from "@/core/types/entities/PbiConfig";
import Pbi from "@/core/classes/Pbi";

interface PbiEmbeddedState {
  pbiConfig: PbiConfig;
  pbi: Pbi;
  loading: boolean;
  firstInit: boolean;
  date: any;
}

export const usePbiEmbeddedStore = defineStore('pbiEmbedded', {
  state: (): PbiEmbeddedState => ({
    pbiConfig: {
      type: "",
      embedReport: [
        {
          reportId: "",
          reportName: "",
          embedUrl: "",
        },
      ],
      embedToken: {
        token: "",
        tokenId: "",
        expiration: "",
      },
    },
    pbi: new Pbi({
      type: "",
      embedReport: [
        {
          reportId: "",
          reportName: "",
          embedUrl: "",
        },
      ],
      embedToken: {
        token: "",
        tokenId: "",
        expiration: "",
      },
    }),
    loading: false,
    firstInit: true,
    date: null,
  }),
  getters: {
    getPbiReportComponent: (state) => state.firstInit,
    getDashboardConfigPbi: (state) => state.pbi.getPbiConfig(),
    getIsDashboardConfigLoading: (state) => state.loading,
    getPbiSelectedDate: (state) => state.date,
  },
  actions: {
    [Mutations.SET_FIRST_INIT](data: boolean) {
      this.firstInit = data;
    },
    [Mutations.SET_PBI_CONFIG](data: PbiConfig) {
      this.pbi.setPbiConfig(data);
    },
    [Mutations.SET_LOADING](state: boolean) {
      this.loading = state;
    },
    [Mutations.SET_PBI_URL](url: string) {
      this.pbi.setPbiUrl(url);
    },
    [Mutations.SET_IS_PBI_URL_COMPLETE_URL]() {
      this.pbi.setPbiIsCompleteUrl(true);
    },
    [Mutations.SET_DATE_FILTER](payload: any) {
      this.date = payload;
    },
    async [Actions.GET_PBI_CONFIG](payload: any) {
      await this.pbi.getApiPbiConfig(payload);
      this[Mutations.SET_LOADING](false);
    },
    async [Actions.POST_PBI_CONFIG](payload: any) {
      await this.pbi.postApiPbiConfig(payload);
      this[Mutations.SET_LOADING](false);
    }
  }
});