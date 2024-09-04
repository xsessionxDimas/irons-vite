import {
  App,
  AppContext,
  getCurrentInstance,
  toRefs
} from "vue";
import {
  AnalyticApiAbstract
} from "btech-analytics-wrapper/lib/esm/contract/analyticApiAbstract";
import store from "../../store"

type analyticProvider = {
  type: string,
  provider: AnalyticApiAbstract
}

export function useAnalyticApi(
  instance: App | AppContext | undefined = undefined
) {
  if (!instance) {
    instance = store.getters.getApp;
    if (!instance) {
      throw "useAnalyticApi() cannot be called outside the setup() function of a component";
    }
  }
  const { type, provider } = toRefs(instance.config.globalProperties.$analytic);

  const api: analyticProvider = {
    type: type.value,
    provider: provider.value
  }

  return api
}
