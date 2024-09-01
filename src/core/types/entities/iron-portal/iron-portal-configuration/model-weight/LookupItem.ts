type Site = {
    siteId: string[],
    siteCode: string[],
    siteDescription: string[],
};

type EquipmentModel = {
    equipmentModel: string[],
    brand: string[],
    equipmentModelDescription: string[],
}

export type LookupItem = {
    site: Site,
    equipmentModel: EquipmentModel,
    weight: string[],
    whPerday: string[],
    fuelBurn: string[],
};
