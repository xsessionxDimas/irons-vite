export type ValidatedItem = {
    maintenancePlantKeyId: number,
    maintenancePlantId: string,
    maintenancePlantDescription: string,
    maintenancePlantCode: string,
    startDate: string,
    endDate: string,
    isActive: boolean,
    isValid: boolean,
    validationReason: string
}
