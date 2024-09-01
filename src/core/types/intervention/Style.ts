import { Border } from './Border'
import { BorderRadius } from './BorderRadius'

export type Style = {
    width: number,
    border: Border | undefined,
    borderColor: string | undefined
    bgColor: string | undefined,
    fontColor: string | undefined,
    borderRadius: BorderRadius | undefined
    fontWeight: string | undefined,
    textAlign: string | undefined,
    textvAlign: string | undefined,
    placeholder: string | undefined,
    breakPoint: string | undefined,
    potraitBreakPoint: string | undefined
}
