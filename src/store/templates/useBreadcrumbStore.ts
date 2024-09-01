import { defineStore } from 'pinia';
import { Actions, Mutations } from "../enums/StoreEnums";

interface Breadcrumb {
  title: string;
  pageBreadcrumbPath: Array<string>;
}

interface StoreInfo {
  breadcrumbs: Breadcrumb;
}

export const useBreadcrumbsStore = defineStore('breadcrumbs', {
  state: () => ({
    breadcrumbs: {} as Breadcrumb
  }),
  getters: {
    /**
     * Get breadcrumb object for current page
     * @returns object
     */
    getBreadcrumbs(state): Breadcrumb {
      return state.breadcrumbs;
    },
    /**
     * Get breadcrumb array for current page
     * @returns object
     */
    pageBreadcrumbPath(state): Array<string> {
      if (!state.breadcrumbs) return [];
      return state.breadcrumbs.pageBreadcrumbPath;
    },
    /**
     * Get current page title
     * @returns string
     */
    pageTitle(state): string {
      if (!state.breadcrumbs) return "";
      return state.breadcrumbs.title;
    }
  },
  actions: {
    [Mutations.SET_BREADCRUMB_MUTATION](payload) {
      if (!payload || typeof (payload) === "undefined") return;
      this.breadcrumbs = payload;
    },
    [Actions.SET_BREADCRUMB_ACTION](payload) {
      this[Mutations.SET_BREADCRUMB_MUTATION](payload);
    }
  }
});