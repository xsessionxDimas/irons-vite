export type UpsertItem = {
    compCategoryId: number,
    type: string,
    sequential: null | string | number,
    operator: string,
    valueMin: null | string | number,
    valueMax: null | string | number,
    uom: string,
    category: string,
    categoryDesc: string,
    startDate: string,
    endDate: string,
}
