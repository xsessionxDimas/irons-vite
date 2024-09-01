export type ListItem = {
    cbmStatusId: number,
    cluster: string,
    sampleCount : string,
    sampleWeight: string,
    cautionLimit: string,
    criticalLimit: string,
    summaryWeight: string,
    startDate: string,
    endDate: string,
    isActive: number,
    createdOn: Date,
    createdBy: string,
    changedOn: Date,
    changedBy: string
}
export type ListItemSpecific = {
    cbmStatusId: number,
    cbmGroup: string,
    component: string,
    parameter: string,
    cluster: string,
    sampleCount : string,
    sampleWeight: string,
    cautionLimit: string,
    criticalLimit: string,
    summaryWeight: string,
    startDate: string,
    endDate: string,
    isActive: number,
    createdOn: Date,
    createdBy: string,
    changedOn: Date,
    changedBy: string
}
