export type ValidatedItem = {
    cluster: string,
    sampleCount : string,
    sampleWeight: string,
    cautionLimit: string,
    criticalLimit: string,
    summaryWeight: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
export type ValidatedItemSpecific = {
    cbmGroup: string,
    component: string,
    // parameter: string,
    cluster: string,
    sampleCount : string,
    sampleWeight: string,
    cautionLimit: string,
    criticalLimit: string,
    summaryWeight: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
