export type ValidatedItem = {
    componentType: string,
    componentTypeDescription: string,
    startDate: Date
    endDate: Date
    isActive: boolean,
    isValid: boolean,
    validationReason: string
}
