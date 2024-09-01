export type ListItem = {
    equipmentNumberId: number,
    equipmentNumber: string,
    equipmentNumberDescription: string,
    level: string
    serialNumber: string,
    startDate: string
    endDate: string
    isActive: boolean,
    createdOn: Date,
    createdBy: string,
    changedOn: Date,
    changedBy: string
    ownership?: string
}
