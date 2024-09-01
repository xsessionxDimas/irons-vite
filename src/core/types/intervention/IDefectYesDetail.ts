import { IBasicDefect } from "./IBasicDefect";
import { ViewDefectFormDataResponse } from "./ViewDefectFormDataResponse";

export interface IDefectYesDetail extends IBasicDefect {
    plannedDuration: string,
    instruction: string,
    priority: string,
    parts: string,
    labours: string,
    resources: string,
    symptoms: string,
    causes: string,
    isNeed30Minutes?: boolean
}

export interface ResponseDefectYesDetail extends ViewDefectFormDataResponse {
    detail: IDefectYesDetail
}
