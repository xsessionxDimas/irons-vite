export type CBMMapping = {
  model: string,
  psType: string,
  detail: CBMMappingDetail[]
}

export type CBMMappingDetail = {
  taskKey: string,
  taskNumber: string,
  detailNumber: string,
  operatorMin: string,
  operatorMax: string,
  minValue: number,
  minValueComplete: string,
  maxValue: number,
  maxValueComplete: string,
  cbmRating: string,
  cbmType: string,
  uom: string
}
