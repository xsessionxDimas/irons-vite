export type WorkOrder = {
    id: string,
    equipment: string,
    equipmentDesc: string,
    sampleStatus: string,
    componentDescription: string,
    sapWorkOrder: string | number,
    mdInterventionStatusId: string | number,
    interventionStatus: string,
    interventionDiagnosis: string,
    followUpPriority: string | number,
    status?: string,
    headerChangedOn: string,
    estimationCompletionDate: string,
    interventionExecution: string,
    progress?: string | number,
    componentSystem?: string
}
