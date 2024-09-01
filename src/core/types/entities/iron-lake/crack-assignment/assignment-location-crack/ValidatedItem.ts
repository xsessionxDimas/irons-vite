export type ValidatedItem = {
    model: string,
    psType: string,
    taskNumberDetailParent: string,
    locationIdParent: string,
    taskNumberDetailChild: string,
    locationIdChild: string,
    startDate: string,
    endDate: string,
    isValid: boolean,
    validationReason: string,
}
