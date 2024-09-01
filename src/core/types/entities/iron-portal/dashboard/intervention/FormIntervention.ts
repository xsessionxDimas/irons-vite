export type FormIntervention = {
    interventionHeaderId: number
    site: string
    equipmentModel: string
    equipmentNumberId: number
    equipmentNumber: string
    componentId: number
    component: string
    componentHours: string
    interventionReason: string
    conditionRatingSmu: string
    conditionRatingDate: string
    interventionCodeId: string
    interventionHeaderSourceId: number
    interventionExecutionId: number
    interventionStatus: string
    interventionDiagnostic: string
    interventionCosmosId: string
    followUp: string
    uomId: string
    followUpPriority: string
    estimationCompletionDate: string
    workOrder: string
    userRevise: boolean
    keyPbi: string
    declineReason: string
    hmOffset: string
    frameHours: string
    additionalInformation
    genericDefect: boolean
    canEditComponent: boolean
    showConditionRatingDate: string
    isParameterUpdate: boolean
    defectStatusId: number | null
    interventionExecutionBy: string | null
    executionDateTime: string | null
    approveReason: string
    smuSap: number
    statusIP: {
      name: string
      date: string
      status: string
    }
    statusIF : {
      name: string
      date: string
      status: string
    }
    approvedBy: string
    approveDate: string
    reviseReason: string
    declinedBy: string
    declinedDate: string
    acceptedby: string
    accepteddate: string
    declinedPortalBy: string
    declinedPortalDate: string
}

export type ResponseAdditionalSensorData = {
    keyPbi: string
    sensors: [
      {
        id: number
        interventionReason: string
      }
    ]
}

export type AdditionalSensorData = {
    id: number
    interventionReason: string
    isCheck: boolean
}

export type PayloadAdditionalSensorData = {
    id: number
    isCheck: boolean
}
