import { Audit } from "./Audit"

export type FitterLog = {
    employee: Audit,
    timeLoggedIn: string[],
    shift: string,
    isIHaveReadChecked: boolean,
    riskPhotos: string[]
}
