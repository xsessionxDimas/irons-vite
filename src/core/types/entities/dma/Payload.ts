export type Payload = {
    id: string,
    updateParams: Array<UpdateParams>,
    employee: Employee,
    localStatus: string
}
export type UpdateParams = {
    keyValue: string,
    propertyParams: Array<PropertyParams>
}
export type PropertyParams = {
    propertyName: string,
    propertyValue: string | string[]
}
export type Employee = {
    id: string,
    name: string
}
