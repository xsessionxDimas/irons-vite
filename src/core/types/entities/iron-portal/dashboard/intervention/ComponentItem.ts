type InterventionChecks = {
    interventionDetailSourceId: number
    interventionDetailId: number
}

export type ComponentItem = {
    componentId: number,
    component: string,
    componentDescription: string,
    componentHm: number,
    oemInterval: number,
    percentage: number,
    interventionReason: string[],
    interventionChecks: InterventionChecks[],
    isCheck: boolean,
}

export type UpsertComponentAffected = {
    componentId: number,
    component: string,
    componentDescription: string,
    componentHm: number,
    oemInterval: number,
    percentage: number,
    isCheck: boolean,
    isDma: boolean,
}
