export type ValidatedItem = {
    componentLubricantId: number,
    component: string,
    recomLubri: string,
    value: string,
    uom: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string,
}
