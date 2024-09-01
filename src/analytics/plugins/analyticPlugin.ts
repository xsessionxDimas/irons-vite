import { App, reactive } from "vue";
import getAnalyticsProvider from "@btech/analytics-wrapper";
import {
  AnalyticApiOptions
} from "@btech/analytics-wrapper/lib/esm/contract/analyticApiOptions";

export const analyticsPlugin = {
  install: (app: App) => {
    const {
      VITE_APP_POSTHOG_API_ADDRESS,
      VITE_APP_POSTHOG_API_KEY
    } = import.meta.env;
    if (!VITE_APP_POSTHOG_API_ADDRESS || !VITE_APP_POSTHOG_API_KEY) {
      throw Error("PostHog env need to be defined by");
    }
    const analyticsOption: AnalyticApiOptions = {
      productCode: 'IRONS',
      providerCode: "POSTHOG",
      token: VITE_APP_POSTHOG_API_KEY,
      config: {
        api_host: VITE_APP_POSTHOG_API_ADDRESS,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
      },
    }
    const provider = getAnalyticsProvider(analyticsOption);

    app.config.globalProperties.$analytic = reactive({
      type: "posthog",
      provider: provider,
    });
    app.config.globalProperties[`$analytic_${analyticsOption.productCode}`] = reactive({
      type: "posthog",
      provider: provider,
    });;
  },
};
