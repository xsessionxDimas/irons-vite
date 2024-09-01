export type UpsertItem = {
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

export type ClusterData = {
    index: number,
    cluster: string,
    sampleCount : string,
    sampleWeight: string,
    cautionLimit: string,
    criticalLimit: string,
    summaryWeight: string,
}

export type UpsertItemSpecific = {
    [x: string]: any
    cbmStatusId: number,
    cbmGroup: string,
    component: string,
    parameter: string,
    clusterData: ClusterData[],
    startDate: string,
    endDate: string,
}

export type UpdateSpecific = {
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
}
