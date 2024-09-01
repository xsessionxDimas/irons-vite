export type ValidatedItem = {
    site: string,
    equipmentModel: string,
    equipmentModelId: string,
    component: string,
    componentId: number,
    compartId: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
