import { Style } from './Style'

export interface IBasicItem {
    key: string,
    itemType: string | undefined
    itemValue: string | undefined,
    value: string,
    style: Style | undefined,
}
