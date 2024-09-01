import { appInsights } from "@/main";

export const sendCustomEvent = (name: string, customProperty) => {
  appInsights.trackEvent({
    name: name,
    properties: customProperty
  });
  appInsights.flush()
}
