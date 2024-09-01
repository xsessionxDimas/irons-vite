export interface InterventionForm {
    id: string,
    key: string,
    siteId: string,
    sitedesc: string,
    trInterventionHeaderId: string,
    interventionNumber: string,
    equipment: string,
    equipmentDesc: string,
    componentCode: string,
    equipmentBrand: string,
    equipmentGroup: string,
    equipmentModel: string,
    sampleType: string,
    interventionCode: string,
    interventionReason: string,
    sampleDate: string,
    sampleStatus?: string,
    smu: string,
    componentHm: string,
    mdInterventionStatusId: string,
    interventionStatus: string,
    interventionStatusDesc: string,
    interventionDiagnosis: string,
    sapWorkOrder: string,
    statusDatetime: string | null,
    interventionExecutionId: string,
    interventionExecution: string,
    interventionExecutionBy: string,
    followUpPriority: string,
    followUpPriorityUomId: string,
    cautionRatingDate: string,
    followUpPriorityUom: string,
    keyPbi: string,
    estimationCompletionDate: string | null,
    log: [{
        employee: {
            id: string,
            name: string
        },
        isIHaveReadChecked: boolean,
        riskPhotos: string[],
        shift: string,
        timeLoggedIn: string
    }] | null,
    riskAssesment: [
        {
            key: string,
            taskType: string,
            caption: string,
            itemValue: string,
            value: string,
            valueType: string,
            style: {
                width: number,
                borderColor: string,
                bgColor: string,
                fontColor: string,
                textAlign: string
            },
            category: string
        }
    ],
    safetyPrecaution: [
        {
            key: string,
            taskType: string,
            isActive: boolean,
            isDeleted: boolean,
            updatedBy: string,
            header: string,
            description: string,
            category: string,
            rating: string,
            items: [
                {
                    key: string,
                    itemType: string,
                    caption: string,
                    itemValue: string,
                    value: number,
                    valueType: string,
                    style: {
                        width: number,
                        borderColor: string,
                        bgColor: string,
                        fontColor: string,
                        textAlign: string,
                        breakPoint: number
                    }
                }
            ]
        }
    ]
    interventionSMU: number | null,
    details: [
        {
            key: string,
            name: string,
            task: [
                {
                    key: string,
                    seqId: number,
                    taskType: string,
                    isActive: boolean,
                    isDeleted: boolean,
                    updatedBy: string | {
                        name: string,
                        id: string
                    },
                    header: string,
                    description: string,
                    category: string,
                    rating: string,
                    updatedDate: string,
                    groupTaskId: string,
                    items: [
                        {
                            key: string,
                            itemType: string,
                            value: string,
                            style: {
                                width: number,
                                border: {
                                    top: string,
                                    right: string,
                                    bottom: string,
                                    left: string
                                },
                                bgColor: string,
                                fontColor: string,
                                borderRadius: {
                                    topRight: string,
                                    bottomRight: string,
                                    topLeft: string,
                                    bottomLeft: string
                                },
                                fontWeight: string,
                                textAlign: string,
                                breakPoint: string,
                                potraitBreakPoint: string
                            }
                        }
                    ]
                }
            ]
        }
    ],
    isLocalSync: boolean
}
