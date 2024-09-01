export type ValidatedItem = {
    mdEquipmentCharacteristicValueId: number,
    equipment: string,
    characteristicType: string,
    characteristicValue: string,
    startDate: string,
    endDate: string,
    isActive: boolean,
    isValid: boolean,
    validationReason: string
}
