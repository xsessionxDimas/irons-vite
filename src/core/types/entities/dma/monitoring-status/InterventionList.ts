export type InterventionList = {
  id: string
  key: string
  siteId: string
  sitedesc: string
  trInterventionHeaderId: string
  equipment: string
  equipmentId: string
  equipmentDesc: string
  equipmentModel: string
  equipmentBrand: string
  equipmentGroup: string
  componentId: string
  componentCode: string
  componentDescription: string,
  sampleType: string
  interventionCode: string
  interventionReason: string
  sampleDate: string
  sampleStatusId: string
  sampleStatus: string
  smu: string
  smuDue: string
  componentHm: string
  mdInterventionStatusId: string
  interventionStatus: string
  interventionStatusDesc: string
  interventionDiagnosis: string
  sapWorkOrder: string
  statusDatetime: string
  interventionExecutionId: string
  interventionExecution: string
  interventionExecutionBy: string
  cautionRatingDate: string
  followUpPriority: string
  followUpPriorityUomId: string
  followUpPriorityUom: string
  keyPbi: string
  estimationCompletionDate: string
  isPendingSync?: boolean
  isDownload?: string,
  componentSystem?: string
}
