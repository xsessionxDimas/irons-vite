export type ValidatedItem = {
    shift: string,
    startHour: string
    startHourType: string
    endHour: string
    endHourType: string
    startDate: Date
    endDate: Date
    isActive: boolean,
    isValid: boolean,
    validationReason: string
}
