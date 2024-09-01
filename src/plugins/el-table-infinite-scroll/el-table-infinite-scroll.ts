import type { ObjectDirective } from 'vue';
import { ElInfiniteScroll } from 'element-plus';
import { syncOptions } from './utils';

const log_title = '[el-table-infinite-scroll]: ';
const table_class_container = '.el-table__body-wrapper';

const ElTableInfiniteScroll: ObjectDirective = {
  // MOUNTED HOOK
  mounted(el, binding, VNode, oldVNode) {
    const scrollElem: HTMLElement = el.querySelector(table_class_container);

    if (!scrollElem) {
      throw new Error(
        `${log_title}${table_class_container} element not found.`
      );
    }

    scrollElem.style.overflowY = 'auto';

    // after render
    setTimeout(() => {
      if (!el.style.height) {
        scrollElem.style.height = '400px';
        console.warn(
          `${log_title}el-table height required, otherwise will set scrollbar default height: 400px`
        );
      }

      syncOptions(el, scrollElem);

      // use `ElInfiniteScroll`
      (
        ElInfiniteScroll.mounted as Exclude<
          ObjectDirective['mounted'],
          undefined
        >
      )(scrollElem, binding, VNode, oldVNode);
    }, 0);
  },

  // UPDATE HOOK
  updated(el) {
    syncOptions(el, el.querySelector(table_class_container));
  },

  // UNMOUNTED HOOK
  unmounted(el, ...args) {
    const scrollElem: HTMLElement = el.querySelector(table_class_container);
    (
      ElInfiniteScroll.unmounted as Exclude<
        ObjectDirective['unmounted'],
        undefined
      >
    )(scrollElem, ...args);
  },
};

export default ElTableInfiniteScroll;
