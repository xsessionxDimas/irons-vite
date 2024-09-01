export type ValidatedItem = {
    unitNumber: string,
    smuDue: string,
    workOrder: string,
    psType: string,
    dateService: string,
    shift: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string,
    isProcess: boolean
}
