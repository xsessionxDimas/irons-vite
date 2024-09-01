import { defineStore } from 'pinia';
import { Actions, Mutations } from "../enums/PageEnum";
import { i18n } from '@/localization/index';

const { t } = i18n.global;

interface PageInfo {
  pages: Record<string, any>;
  currentModule: string;
  props: Record<string, any>;
  tempPage: string;
  tempProps: any;
}

export const usePageStore = defineStore('page', {
  state: (): PageInfo => ({
    pages: {},
    currentModule: '',
    props: {},
    tempPage: '',
    tempProps: null
  }),
  getters: {
    getPages: (state) => state.pages[state.currentModule],
    getProps: (state) => state.props[state.currentModule]
  },
  actions: {
    [Mutations.SET_PAGE](page: any) {
      this.pages[this.currentModule] = page;
    },
    [Mutations.SET_PROPS](props: any) {
      this.props[this.currentModule] = props;
    },
    [Mutations.SET_TEMP_PAGE](page: string) {
      this.tempPage = page;
    },
    [Mutations.SET_TEMP_PROPS](props: any) {
      this.tempProps = props;
    },
    [Mutations.SET_CURRENT_MODULE](payload: { module: string, initialPage: string }) {
      this.currentModule = payload.module;

      if (this.tempPage || this.tempProps) {
        this.pages[payload.module] = this.tempPage;
        this.props[payload.module] = this.tempProps;
        this.tempPage = '';
        this.tempProps = null;
      } else {
        this.pages[payload.module] = payload.initialPage;
      }
    },
    async [Actions.UPDATE_PAGE](payload: { page: string, props: any }) {
      this[Mutations.SET_PAGE](payload.page);
      this[Mutations.SET_PROPS](payload.props);
    },
    async [Actions.UPDATE_MODULE](payload: { page: string, props: any }) {
      this[Mutations.SET_TEMP_PAGE](payload.page);
      this[Mutations.SET_TEMP_PROPS](payload.props);
    }
  }
});