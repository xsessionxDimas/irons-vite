type Site = {
    siteId: string[],
    siteCode: string[],
    siteDescription: string[],
};
type EquipmentModel = {
    equipmentModel: string[],
    brand: string[],
    equipmentModelDescription: string[],
};
type Component = {
    objectType: string[],
    objectTypeDescription: string[],
};

export type LookupItem = {
    site: Site,
    equipmentModel: EquipmentModel,
    component: Component,
    compartId: string[],
};
