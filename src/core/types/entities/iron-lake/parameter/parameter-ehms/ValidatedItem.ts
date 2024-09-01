export type ValidatedItem = {
    componentId: string,
    cbmGroup: string,
    cbmArea: string,
    cbmParameterId: string,
    model: string,
    psType: string,
    taskNumber: string,
    detailNumber: string,
    cbmParameter: string,
    parameter: string,
    typeParameterId: string
    valueMin: string,
    valueMax: string,
    uom: string,
    statusConverter: string,
    statusConverterDescription: string,
    status: string,
    statusDescription: string
    startDate: string
    endDate: string
    isValid: boolean,
    validationReason: string
    isActive: boolean
}
