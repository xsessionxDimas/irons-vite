export type ComponentIntervention = {
    id: string,
    equipment: string,
    equipmentDesc: string,
    sampleStatus?: string,
    componentDescription: string,
    sapWorkOrder: number | string,
    estimationCompletionDate: string
}
