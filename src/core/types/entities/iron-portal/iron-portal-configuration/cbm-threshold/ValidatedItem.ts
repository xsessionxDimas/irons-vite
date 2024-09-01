export type ValidatedItem = {
    cbmThresholdId: number,
    cbmType: string,
    equipmentModel: string,
    component: string,
    parameterFrom: string,
    parameterTo: string,
    registerNumber: string,
    severityLevel: string,
    uomFrom: string,
    uomTo: string,
    uomConvertRatio: string,
    rating: string,
    operatorMin: string,
    valueMin: string,
    operatorMax: string,
    valueMax: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}

export interface ValidatedItemSpecific extends ValidatedItem {
    site: string,
}
