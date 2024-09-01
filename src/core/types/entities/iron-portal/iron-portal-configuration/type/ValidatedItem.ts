export type ValidatedItem = {
    type: string,
    typeDescription: string,
    parameter: string,
    parameterDescription: string,
    parameterGroup: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
