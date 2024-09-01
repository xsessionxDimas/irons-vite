import { string } from "yup";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FilterData = {
    cbmType: string
    cbmTypeTo: string
    site: string
    siteTo: string
    equipmentModel: string
    equipmentModelTo: string
    component: string
    componentTo: string
    parameterFrom: string
    parameterFromTo: string
    parameterTo: string
    parameterToTo: string
    registerNumber: string
    registerNumberTo: string
    severityLevel: string
    severityLevelTo: string
    uomFrom: string
    uomFromTo: string
    uomTo: string
    uomToTo: string
    uomConvertRatio: string
    uomConvertRatioTo: string
    startDate: string
    startDateTo: string
    endDate: string
    endDateTo: string
    page: number
    pageSize: number
    order: string
    ver: string
}
