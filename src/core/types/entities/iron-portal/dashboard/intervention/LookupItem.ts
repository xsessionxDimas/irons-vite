type SiteLookup = {
    siteId: string[],
    siteCode: string[],
    siteDescription: string[]
};

export type LookupItem1 = {
    site: SiteLookup,
    equipmentModel: string[],
    equipmentNumber: string[]
};

export type LookupItem2 = {
    component: string[]
    componentHours: string[],
    conditionRatingDate: string[],
    conditionRatingSmu: string[],
    interventionCodeId: string[],
    interventionReason: string[],
    keyPbi: string[]
}

export type HeaderListItem = {
    equipmentId:string,
    equipmentNumber:string,
    interventionCode:string,
    workOrder:string,
    model:string,
    modelId:string,
    brand:string,
    status:string,
    intervention:string,
    keyPbi:string,
    interventionDate: string,
    componentGroup: string,
}
