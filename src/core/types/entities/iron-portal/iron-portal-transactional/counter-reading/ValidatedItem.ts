export type ValidatedItem = {
    site: string,
    equipmentModel: string,
    equipmentNumber: string,
    component: string,
    smu: string,
    counterReading: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
