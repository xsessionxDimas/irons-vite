export type LookupItem = {
    maintenancePlant: string[],
    maintenancePlantDescription: string[]
    customer: string[]
};

export type CustomerAssignmentMaintenancePlantLookup = {
    maintenancePlantId: number,
    maintenancePlant: string,
    maintenancePlantDescription: string,
}

export type CustomerAssignmentCustomerLookup = {
    customerId: number,
    customer: string,
    customerDescription: string
}
