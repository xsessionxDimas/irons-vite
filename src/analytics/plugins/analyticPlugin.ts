import { App, reactive } from "vue";
import getAnalyticsProvider from "btech-analytics-wrapper";

export const analyticsPlugin = {
  install: (app: App) => {
    const provider = getAnalyticsProvider("IRONS", "Posthog", {
      key: import.meta.env.VITE_APP_POSTHOG_API_KEY,
      address: import.meta.env.VITE_APP_POSTHOG_API_ADDRESS,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
    });

    app.config.globalProperties.$analytic = reactive({
      type: "posthog",
      provider: provider,
    });
  },
};
