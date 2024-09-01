import { defineStore } from 'pinia';
import objectPath from 'object-path';
import merge from 'deepmerge';
import layoutConfig from '../../core/config/Config';
import { Mutations } from '../../store/enums/StoreEnums';
import LayoutConfigTypes from '../../core/config/LayoutConfigTypes';

interface StoreInfo {
  config: LayoutConfigTypes;
  initial: LayoutConfigTypes;
}

export const useConfigStore = defineStore('config', {
  state: (): StoreInfo => ({
    config: layoutConfig,
    initial: layoutConfig
  }),
  getters: {
    layoutConfig: (state) => {
      return (path: string, defaultValue: any) => {
        return objectPath.get(state.config, path, defaultValue);
      };
    }
  },
  actions: {
    [Mutations.SET_LAYOUT_CONFIG](payload: LayoutConfigTypes): void {
      this.config = payload;
    },
    [Mutations.RESET_LAYOUT_CONFIG](): void {
      this.config = Object.assign({}, this.initial);
    },
    [Mutations.OVERRIDE_LAYOUT_CONFIG](): void {
      this.config = this.initial = Object.assign(
        {},
        this.initial,
        JSON.parse(window.localStorage.getItem('config') || '{}')
      );
    },
    [Mutations.OVERRIDE_PAGE_LAYOUT_CONFIG](payload: LayoutConfigTypes): void {
      this.config = merge(this.config, payload);
    }
  }
});