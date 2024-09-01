
type EquipmentModel = {
    equipmentModel: string[],
    brand: string[],
    equipmentModelDescription: string[],
}

export type LookupItem = {
    cbmComplianceGapThresholdId: number,
    cbmType: string[],
    equipmentModel : EquipmentModel,
    component: string[],
    valueThreshold: string[],
};
