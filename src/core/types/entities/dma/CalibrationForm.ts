import { General } from "./e-form/general/General"
import { Group } from "./e-form/group"

export type CalibrationForm = {
    id?: string,
    header: General,
    detail: Group
}