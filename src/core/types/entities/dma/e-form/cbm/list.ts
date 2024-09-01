export type ListItem = {
  taskNumber: number | string
  detailNumber: string
  operatorMin: string
  minValue: number
  minValueComplete: string
  operatorMax: string
  maxValue: number
  maxValueComplete: string
  cbmRating: string,
  uom: any,
  cbmType: any,
  taskKey: any
}

export const CBMTypeEnum = {
  CBM: "CBM",
  CBM_BRAKE_PACK_PERCENTAGE: "CBM_BRAKE_PACK_PERCENTAGE",
  BIRRANA: "BIRRANA",
  CAT_GAUGE: "CAT_GAUGE"
};

export const CBMRatingEnum = {
  A: "A",
  B: "B",
  C: "C",
  X: "X",
};
