export type ValidatedItem = {
    maintenanceStrategyId: string,
    strategyCategory: string,
    strategyPackage: string,
    budgetLife: string,
    uom: string,
    startDate: Date
    endDate: Date
    isActive: boolean,
    isValid: boolean,
    validationReason: string
}
