export type ListItem = {
    cbmThresholdId: number
    cbmType: string
    equipmentModel: string
    equipmentModelId: number
    component: string
    componentId: number
    parameterFrom: string
    parameterTo: string
    registerNumber: string
    severityLevel: string
    uomFrom: string
    uomToId: string
    uomTo: string
    uomConvertRatio: string
    flagValue: string
    isActive: boolean
    startDate: string
    endDate: string
    createdBy: string
    createdOn: string
    changedBy: string
    changedOn: string
    isRequiredThreshold: boolean | null
    thresholdList: Array<ThresholdItem>
}

export type ThresholdItem = {
    id: number
    idFe: number
    rating: string
    operatorMin: string
    valueMin: string
    operatorMax: string
    valueMax: string
    isActive: boolean
}

export interface ListItemSpecific extends ListItem {
    site: string
} 
