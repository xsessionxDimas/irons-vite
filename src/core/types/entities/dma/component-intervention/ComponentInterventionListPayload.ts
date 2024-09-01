export type ComponentInterventionListPayload = {
    siteId: string
    sitedesc: string
    trInterventionHeaderId: number | string
    equipmentId: number | string
    equipment: string
    equipmentDesc: string
    equipmentModel: string
    equipmentBrand: string
    equipmentGroup: string
    componentId: number | string
    componentCode: string
    componentDescription: string
    sampleType: string
    interventionCode: string
    interventionReason: string
    sampleDate: string
    sampleStatusId: number | string
    sampleStatus: string
    smu: string
    smuDue: string
    componentHm: string
    mdInterventionStatusId: number | string
    interventionStatus: string
    interventionStatusDesc: string
    interventionDiagnosis: string
    sapWorkOrder: number | string
    statusDatetime: string
    interventionExecutionId: number | string
    interventionExecution: string
    interventionExecutionBy: string
    cautionRatingDate: null | string
    followUpPriority: number | string
    followUpPriorityUomId: number | string
    followUpPriorityUom: string
    keyPbi: string
    estimationCompletionDate: string
    headerChangedOn: string,
    progress?: string,
    componentSystem?: string
}
