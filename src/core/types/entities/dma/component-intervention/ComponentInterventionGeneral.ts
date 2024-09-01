import { Audit } from "@/core/types/intervention/Audit"
import { Component } from "@/core/types/intervention/Component"

export type ComponentInterventionGeneral = {
    id: string,
    key: string,
    siteId: string,
    sitedesc: string,
    trInterventionHeaderId: string,
    interventionNumber: string,
    equipmentId: string,
    equipment: string,
    equipmentDesc: string,
    equipmentBrand: string,
    equipmentGroup: string,
    equipmentModel: string,
    componentId: string,
    componentCode: string,
    componentDescription: string,
    sampleType: string,
    interventionCode: string,
    interventionReason: string,
    sampleDate: string,
    sampleStatus?: string,
    sampleStatudId?: string | null,
    smu: string,
    smuDue: string,
    componentHm: string,
    components?: Component[] | null,
    mdInterventionStatusId: string,
    interventionStatus: string,
    interventionStatusDesc: string,
    interventionDiagnosis: string,
    sapWorkOrder: string,
    statusDatetime: string | null,
    interventionExecutionId: string,
    interventionExecution: string,
    interventionExecutionBy: string,
    cautionRatingDate: string,
    followUpPriority: string,
    followUpPriorityUomId: string,
    followUpPriorityUom: string,
    keyPbi: string,
    additionalInformation: string,
    estimationCompletionDate: string | null,
    log: any | null
    riskAssesment: any[]
    safetyPrecaution: any[]
    imageEquipment: any[] | null | string
    serviceStart: string,
    serviceEnd: string,
    interventionSMU: number | string | null
    statusHistory: any,
    supervisor: any,
    isLocalSync: string,
    defectStatus: string,
    dayShift: string,
    servicePersonnels?: any[],
    hmOffset?: string,

    smuBy?: Audit,
    smuDate?: string
}
