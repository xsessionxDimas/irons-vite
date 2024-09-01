import { Audit } from './Audit'
import { Style } from './Style'

export interface DetailTaskItem {
    key: string,
    categoryItemType: string | undefined,
    itemType: string,
    valueItemType: string | undefined,
    caption: string | undefined,
    itemValue: string | undefined,
    valueType: string | undefined,
    value: string,
    style: Style | undefined,
    customValidation: string | undefined,
    updatedBy: string | Audit | undefined,
    updatedDate: string | undefined,
    disabledByItemKey?: string
}
