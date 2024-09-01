
export type LookupItem = {
    cbmType: string[]
    site: LookupSite[]
    equipmentModel: string[]
    component: string[]
    parameterFrom: string[]
    parameterTo: string[]
    registerNumber: string[]
    severityLevel: string[]
    uomFrom: string[]
    uomTo: string[]
    uomConvertRatio: string[]
    rating: LookupRating[]
    operatorMin: string[]
    valueMin: string[]
    operatorMax: string[]
    valueMax: string[]
};

export type LookupRating = {
    rating: string[]
    ratingDescription: string[]
}

export type LookupUom = {
    uom: string[],
}

export type LookupSite = {
    siteDescription: string[]
    siteId: string[]
    siteCode: string[]
}
