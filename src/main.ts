import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import ApiService from "./core/services/ApiService.ts";
import { initInlineSvg } from "./core/plugins/inline-svg";
import { initVeeValidate } from "./core/plugins/vee-validate";
import { createPinia } from "pinia";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ClickAnalyticsPlugin } from "@microsoft/applicationinsights-clickanalytics-js";
import { msalInstance } from "./msal/authConfig.ts";
import { AuthenticationResult, EventType } from "@azure/msal-browser";
import { decodeToken } from "./core/helpers/token-decoder"
import { db } from "./database/schema/DexieSchema"
import { addRecord, clearRecords } from "./database/schema/DatabaseWrapper"
import { msalPlugin } from "./msal/plugins/msalPlugin"
import { analyticsPlugin } from "./analytics/plugins/analyticPlugin"
import { i18n } from "./localization/index"
import NwImg from 'nw-img-vue'
import store from "./store"


import "./core/plugins/keenthemes"
import "./core/plugins/prismjs"

const clickPluginInstance = new ClickAnalyticsPlugin();
// Click Analytics configuration
const clickPluginConfig = {
  autoCapture: true
};

// Application Insights Configuration
const configObj = {
    connectionString: "InstrumentationKey=13cb9532-81ae-4484-a6ea-a0dd368da284;IngestionEndpoint=https://australiaeast-1.in.applicationinsights.azure.com/;LiveEndpoint=https://australiaeast.livediagnostics.monitor.azure.com/",
    // Alternatively, you can pass in the instrumentation key,
    // but support for instrumentation key ingestion will end on March 31, 2025.
    // instrumentationKey: "13cb9532-81ae-4484-a6ea-a0dd368da284",
    extensions: [clickPluginInstance],
    extensionConfig: {
      [clickPluginInstance.identifier]: clickPluginConfig
    },
  };

export const appInsights = new ApplicationInsights({
  config: configObj,
  queue: [],
});

appInsights.loadAppInsights();
appInsights.addTelemetryInitializer((envelope) => {
  envelope.tags!["ai.cloud.role"] = "BUMA AU Front end Web";
  envelope.tags!["ai.cloud.roleInstance"] = "BUMA AU Front end Web";
});

const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}
msalInstance.addEventCallback(async (event) => {
  if ((event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
    //
    const decode = decodeToken(payload.accessToken)
    await clearRecords(db, 'validTokenNew')
    await addRecord(db, 'validTokenNew', {
      token: payload.accessToken,
      expired: decode.exp,
      lastUpdated: Math.trunc(new Date().getTime() / 1000),
      expiredDate: payload.expiresOn as Date,
      lastUpdatedDate: new Date()
    })
  }
});

const app = createApp(App);
app.use(createPinia());
app.use(store);
app.use(router);
app.use(msalPlugin, msalInstance);
app.use(analyticsPlugin);
app.use(ElementPlus, {});
app.use(NwImg);
ApiService.init(app);
initInlineSvg(app);
initVeeValidate();
app.use(i18n);

// make app available to all
store.registerModule('app', {
  getters: {
    getApp: () => {
      return app;
    }
  }
})

app.mount("#app");