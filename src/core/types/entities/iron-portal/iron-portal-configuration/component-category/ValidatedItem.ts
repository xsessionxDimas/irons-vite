export type ValidatedItem = {
    type: string,
    sequential: number,
    operator: string,
    valueMin: number,
    valueMax: number,
    uom: string,
    category: string,
    categoryDesc: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
