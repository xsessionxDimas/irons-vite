export type ValidatedItem = {
    site: string,
    equipmentModel:string,
    equipmentNumber: string,
    component: string,
    hoCycleTarget: string,
    siteCycleTarget: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
