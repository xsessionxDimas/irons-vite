import { Border } from "./Border"
import { BorderRadius } from "./BorderRadius"

export type Style = {
  width: number,
  border?: Border,
  bgColor: string,
  fontColor: string,
  textAlign: string,
  breakPoint: string,
  potraitBreakPoint?: string,
  borderRadius?: BorderRadius,
  visibility?: string,
  fontWeight?: string,
  suffix?: string,
  placeholder?: string,
  textvAlign?: string
}
