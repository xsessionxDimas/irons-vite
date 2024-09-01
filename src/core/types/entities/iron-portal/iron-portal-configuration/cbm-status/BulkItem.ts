export type BulkItem = {
    cbmStatusId: number,
    cluster: string,
    sampleCount : string,
    sampleWeight: string,
    cautionLimit: string,
    criticalLimit: string,
    summaryWeight: string,
    startDate: string,
    endDate: string,
}
export type BulkItemSpecific = {
    cbmStatusId: number,
    cbmGroup: string,
    component: string,
    // parameter: string,
    sampleCount : string,
    sampleWeight: string,
    cautionLimit: string,
    criticalLimit: string,
    summaryWeight: string,
    startDate: string,
    endDate: string,
}
