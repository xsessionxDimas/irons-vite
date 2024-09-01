export type Option = {
  value: string,
  label: string,
  icon?: string,
  labelPlain?: string,
  status?: string,
  progress?: string | number | undefined
  workOrder?: string
}

export type OptionIronlake = {
  label: string,
  value: number | string
}