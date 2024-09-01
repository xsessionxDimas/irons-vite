import {
  useAnalyticApi
} from "@/analytics/api/analyticApi";

export const sendErrorEvent = (product, error) => {
  const analyticService = useAnalyticApi(product);
  if(error.response && error.response.eventMeta) {
    analyticService.provider.eventApiError(
      "application-error",
      error.response.eventMeta.requestId,
      { productCode: product, ...error.response.eventMeta },
    );
  } else {
    analyticService.provider.eventApiError(
      "application-error",
      '',
      { productCode: product, ...error.response },
    );
  }
};
