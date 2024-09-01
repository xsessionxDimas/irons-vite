import {
  App,
  AppContext,
  getCurrentInstance,
  toRefs
} from 'vue';
import {
  AnalyticApiAbstract
} from '@btech/analytics-wrapper/lib/esm/contract/analyticApiAbstract';
import {
  AnalyticApiOptions
} from '@btech/analytics-wrapper/lib/esm/contract/analyticApiOptions';
import DefaultCredential from '@btech/analytics-wrapper/lib/esm/contract/defaultCredential';

import store from '../../store'

type AnalyticProvider = {
  type: string;
  provider: AnalyticApiAbstract<AnalyticApiOptions, DefaultCredential, unknown>;
};

type ProductType = AnalyticApiOptions extends {productCode: infer Y} ? Y : never
type AnalyticProductType = `$analytic_${ProductType}`;

function getDynamicAnalyticProductApi(
  instance: App | AppContext,
  dynamicAnalyticProduct: AnalyticProductType,
) {
  let typeRef;
  let providerRef;

  if (dynamicAnalyticProduct in instance.config.globalProperties) {
    const { type, provider } = toRefs(
      instance.config.globalProperties[dynamicAnalyticProduct],
    );
    typeRef = type.value;
    providerRef = provider.value;
  } else {
    throw `${dynamicAnalyticProduct} is not registered in globalProperties`;
  }

  return { typeRef, providerRef };
}

export function useAnalyticApi(
  productAnalyticCode: ProductType = 'IRONS',
) {
  let appInstance = store.getters?.getApp;

  if (!appInstance) {
    appInstance = getCurrentInstance()?.appContext;
    if (!appInstance) {
      throw "useAnalyticApi() cannot be called outside the setup() function of a component";
    }
  }

  const dynamicAnalyticProduct: AnalyticProductType = `$analytic_${productAnalyticCode}` as AnalyticProductType;
  const { typeRef, providerRef } = getDynamicAnalyticProductApi(
    appInstance,
    dynamicAnalyticProduct,
  );

  const api: AnalyticProvider = {
    type: typeRef,
    provider: providerRef,
  };

  return api;
}
