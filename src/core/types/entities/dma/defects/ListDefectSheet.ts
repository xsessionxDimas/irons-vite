import { Option } from "@/core/types/misc/Option"

export type ListDefectSheet = {
    name: string,
    list: Array<any>,
    options: Option[],
    expand?: boolean,
}
