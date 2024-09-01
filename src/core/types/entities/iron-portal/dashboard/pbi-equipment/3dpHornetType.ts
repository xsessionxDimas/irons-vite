// post 3dp hornet
export type UpsertItemType = {
    site: string
    model: string
    equipment: string
    component: string[]
    sensor: number[]
    isCheckAllSensor: boolean
}

// response 3dp hornet sensor data
export type SensorDataType = {
    sensorId: number
    siteId: string
    site: string
    modelId: number
    model: string
    equipmentId: number
    equipment: string
    componentId: number
    component: string
    componentName: string
    componentCode: string
    sensorParameter: string
    occurence: string
    aggregate: string
    uom: string
    value: string
    rating: string
    cautionThreshold: string
    criticalThreshold: string
    isCheck: boolean
}

export type LookupDataType = {
    site: {
        siteId: string[]
        siteCode: string[]
        siteDescription: string[]
    }
    model: {
        equipmentModel: string[]
        equipmentModelDescription: string[]
        brand: string[]
    }
    equipment: {
        equipmentNumber: string[]
        equipmentNumberDescription: string[]
        serialNumber: string[]
        level: string[]
    }
    component: {
        component: string[]
        componentDescription: string[]
        level: string[]
        levelDescription: string[]
    }
}
