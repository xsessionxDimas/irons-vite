export type LookupItem = {
    equipmentModel: {
        equipmentModel: string[],
        equipmentModelDescription: string[],
        brand: string[]
    },
    component: {
        component: string[],
        componentDescription: string[]
    },
    componentType: {
        componentType: string[],
        componentTypeDescription: string[]
    },
    maxRiskRank: string[],
    revisedRank: string[],
    overallRisk: string[],
    failureTiming: string[],
    systemImpact: string[],
    opsImpact: string[],
    supplyRisk: string[],
    failureCost: string[],
    comments: string[],
    site: string[],
    oemInterval: string[],
    bumaAuTarget: string[],
    componentWeight: string[],
};

export type RatingLookup = {
    ratingCode: string[]
}

export type LookupAddItem = {
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
    component: {
        component: string[],
        componentDescription: string[],
    },
};
