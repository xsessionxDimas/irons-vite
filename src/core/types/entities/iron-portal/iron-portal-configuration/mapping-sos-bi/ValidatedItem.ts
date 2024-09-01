export type ValidatedItem = {
    equipmentModel: string,
    component: string,
    element: string,
    rating: string,
    operatorMin: string,
    valueMin: string,
    operatorMax: string,
    valueMax: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string
}
