import type { App, ObjectDirective, Plugin } from 'vue';
import _ElTableInfiniteScrollBackwardSupport from './el-table-infinite-scroll';

/**
 * hotfix for element plus version 1.x beta (maybe)
 *
 */
const ElTableInfiniteScrollBackwardSupport: ObjectDirective & Plugin = Object.assign(
  _ElTableInfiniteScrollBackwardSupport,
  {
    install: (vue: App) => {
      vue.directive('el-table-infinite-scroll', ElTableInfiniteScrollBackwardSupport);
    },
  }
);

export default ElTableInfiniteScrollBackwardSupport;
