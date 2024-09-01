export type ValidatedItem = {
    planningPlantId: string,
    planningPlantCode: string,
    planningPlantDescription: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string,
}
