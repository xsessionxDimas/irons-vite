export type UpsertItem = {
    cbmThresholdId: number
    cbmType: string
    site?: string
    equipmentModel: string
    component: string
    parameterFrom: string
    parameterTo: string
    registerNumber: string
    severityLevel: string
    uomFrom: string
    uomTo: string
    uomConvertRatio: string
    isRequiredThreshold: boolean
    thresholdList: Array<ThresholdItem>
    startDate: string
    endDate: string
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
