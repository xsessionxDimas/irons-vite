export type LookupItem = {
    equipmentNumber: string[],
    equipmentNumberDescription: string[]
    level: string[],
    levelDescription: string[]
    serialNumber: string[]
};

export type levelLookupItem = {
    levelId: number,
    level: string,
    levelDescription: string
}

export type LevelFilter = {
    level: string,
    levelDescription: string
}
