export type Item = {
    key: string,
    itemType: string,
    value: string,
    categoryItemType?: string,
    valueItemType?: string | undefined,
    caption?: string,
    itemValue?: string,
    valueType?: string
    customValidation?: string,
    isTaskValue?: boolean,
    updatedBy?: string,
    updatedDate?: string
    style: any
}
