export type LookupInterventionCode = {
    interventionCode: string[],
}

export type LookupTypeTask = {
    typeTask: string[],
}

export type LookupSampleStatus = {
    ratingId: string[],
    rating: string[],
    ratingDescription: string[],
}

export type LookupUom = {
    uom: string[],
}

export type LookupReferenceDocument = {
    referenceDocument: string[],
}

export type LookupItem = {
    cbmType:string[],
    equipmentModel: string[],
    component: string[],
    parameterTo: string[],
    interventionCode: string[],
    recAction: string[],
    sampleStatus: string[],
    sampleStatusId: string[],
    sequence: string[],
    subTask: string[],
    isUom: string[],
    isAutoFill: string[],
    psType: string[],
    taskGroupKey: string[],
    taskKey: string[],
    typeTask: string[],
    uom: string[],
    referenceDocument: [],
};
