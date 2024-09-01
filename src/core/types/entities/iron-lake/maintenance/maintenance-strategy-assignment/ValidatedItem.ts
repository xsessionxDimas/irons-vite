export type ValidatedItem = {
    maintenanceStrategyParId: string,
    maintenanceStrategyChdId: string,
    startDate: Date
    endDate: Date
    isValid: boolean,
    validationReason: string
}
