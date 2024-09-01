import { ViewDefectFormDataResponse } from "./ViewDefectFormDataResponse";

export type NADetail = {
    type: string,
    reason: string,
    title: string,
    interventionId: string
}
export interface ResponseDefectNADetail extends ViewDefectFormDataResponse {
   detail: NADetail
}
