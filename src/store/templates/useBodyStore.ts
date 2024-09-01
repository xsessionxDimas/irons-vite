import { defineStore } from 'pinia';
import { Actions, Mutations } from "../enums/StoreEnums";

export interface StoreInfo {
  classes: {
    header?: Array<string>;
    headerContainer?: Array<string>;
    headerMobile?: Array<string>;
    headerMenu?: Array<string>;
    aside?: Array<string>;
    asideMenu?: Array<string>;
    asideToggle?: Array<string>;
    toolbar?: Array<string>;
    toolbarContainer?: Array<string>;
    content?: Array<string>;
    contentContainer?: Array<string>;
    footerContainer?: Array<string>;
    sidebar?: Array<string>;
    pageTitle?: Array<string>;
  };
}

export const useBodyStore = defineStore('body', {
  state: () => ({
    classes: {} as StoreInfo['classes']
  }),
  actions: {
    [Actions.ADD_BODY_CLASSNAME](className: string) {
      document.body.classList.add(className);
    },
    [Actions.REMOVE_BODY_CLASSNAME](className: string) {
      document.body.classList.remove(className);
    },
    [Actions.ADD_BODY_ATTRIBUTE](payload: { qulifiedName: string, value: string }) {
      const { qulifiedName, value } = payload;
      document.body.setAttribute(qulifiedName, value);
    },
    [Actions.REMOVE_BODY_ATTRIBUTE](payload: { qulifiedName: string }) {
      const { qulifiedName } = payload;
      document.body.removeAttribute(qulifiedName);
    },
    [Actions.ADD_CLASSNAME](payload: { position: keyof StoreInfo['classes'], className: string }) {
      this[Mutations.SET_CLASSNAME_BY_POSITION](payload);
    },
    [Mutations.SET_CLASSNAME_BY_POSITION](payload: { position: keyof StoreInfo['classes'], className: string }) {
      const { position, className } = payload;
      if (!this.classes[position]) {
        this.classes[position] = [];
      }
      this.classes[position].push(className);
    }
  }
});