import { IBasicDefect } from "./IBasicDefect";
import { ViewDefectFormDataResponse } from "./ViewDefectFormDataResponse";

export interface IDefectNoDetail extends IBasicDefect {
    description: string,
    actions: string
}
export interface ResponseDefectNoDetail extends ViewDefectFormDataResponse {
    detail: IDefectNoDetail
}
