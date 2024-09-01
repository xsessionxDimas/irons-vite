export type AdditionalTaskItem = {
    additionalTaskId: number,
    sequence: number,
    recAction: string,
    executed: boolean | null,
    actualInterventionDate: string,
    interventionStatus: string,
    condition: string | null,
    detailedInformation: string | null,
    taskKey: string,
    psType: string,
    interventionIdCosmos: string,
    images:string[],
    typeTaskId: number,
    uom: string,
    isActive: boolean,
    isDeleted: boolean,
    typeTask: string,
    componentId: string,
    listComponent: ComponentItemAdditionalTask[],
}

export type ComponentItemAdditionalTask = {
    componentName: string,
    isDeleted: boolean
}
