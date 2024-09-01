import { ComponentItem } from "./ComponentItem"

export type AdditionalTaskUpsertItem = {
    additionalTaskId: number
    sequence: number
    recAction: string
    executed: boolean | null
    actualInterventionDate: string
    interventionStatus: string
    condition: string | null
    detailedInformation: string | null
    isActive: boolean
    isDeleted: boolean
    uom: string
    typeTaskId: number
    typeTask: string
    listComponent: ComponentListItem[]
}

export type ComponentListItem = {
    componentName: string
    isDeleted: boolean
}

export type InterventionChecksItem = {
    interventionDetailId: number
    interventionDetailSourceId: number
    sequence: number
    isMandatory: boolean
    keyPbi: string
    isActive: boolean
}

export type UpsertItem = {
    employeeName: string
    employeeId: string
    interventionHeaderId: number
    interventionHeaderSourceId: number
    isRevise: boolean
    site: string
    equipmentModel: string
    equipmentNumber: string
    interventionCodeId: string
    interventionReason: string
    conditionRatingSmu: number
    conditionRatingDate: string
    interventionStatus: string
    interventionDiagnostic: string
    followUpPriority: string
    estimationCompletionDate: string
    workOrder: string
    additionalTask: AdditionalTaskUpsertItem[]
    keyPbi: string
    interventionChecks: InterventionChecksItem[]
    componentAffected: ComponentItem[]
    declineReason: string
    isDma: boolean
}
