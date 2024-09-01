export type LookupItem = {
    site: {
        siteId: string[],
        siteCode: string[],
        siteDescription: string[],
    },
    equipmentModel: {
        equipmentModel: string[],
        equipmentModelDescription: string[],
        brand: string[],
    },
    equipmentNumber: {
        equipmentNumber: string[],
        equipmentNumberDescription: string[],
        serialNumber: string[],
        level: string[]
    },
    component: {
        component: string[],
        componentDescription: string[],
    },
    replacementSmu: number[],
    frameHours: number[],
};
