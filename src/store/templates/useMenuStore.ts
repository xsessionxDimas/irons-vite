import { defineStore } from 'pinia';
import { i18n } from '../../localization/index';
import { Mutations, Actions } from "../../store/enums/StoreEnums";

const { t } = i18n.global;

interface MenuInfo {
  menu: Array<unknown>;
  page: string;
  isSideActive: boolean;
  lang: string;
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuInfo => ({
    menu: [],
    page: t("sidebarMenu.todolist"), // landing page after login
    isSideActive: true,
    lang: 'en'
  }),
  getters: {
    getPage: (state) => state.page,
    getMenuList: (state) => state.menu,
    getIsSideActive: (state) => state.isSideActive,
    getLang: (state) => state.lang
  },
  actions: {
    [Mutations.SET_LANG](newLang: string) {
      this.lang = newLang;
    },
    [Mutations.SET_ACTIVE_PAGE](newPage: string) {
      this.page = newPage;
    },
    [Mutations.SET_MENU_LIST](menuList: Array<unknown>) {
      this.menu = menuList;
    },
    [Mutations.RESET_MENU_LIST]() {
      this.menu = [];
    },
    [Mutations.SET_IS_SIDE_ACTIVE](status: boolean) {
      this.isSideActive = status;
    },
    [Actions.ACTIVE_PAGE](newPage: string) {
      this[Mutations.SET_ACTIVE_PAGE](newPage);
    },
    [Actions.SET_IS_SIDE_ACTIVE](status: boolean) {
      this[Mutations.SET_IS_SIDE_ACTIVE](status);
    }
  }
});