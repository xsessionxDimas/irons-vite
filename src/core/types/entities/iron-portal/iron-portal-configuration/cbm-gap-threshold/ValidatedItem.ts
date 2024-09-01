export type ValidatedItem = {
    cbmType: string,
    equipmentModel : string,
    component: string,
    valueThreshold: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
