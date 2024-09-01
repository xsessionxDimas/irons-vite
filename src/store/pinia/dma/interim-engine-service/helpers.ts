import { ListItem } from "@/core/types/entities/dma/e-form/cbm/list"
import { CBMMappingDetail } from "@/core/types/intervention/CBMMapping";

export const checkMinValue = (formula: ListItem | CBMMappingDetail, value) => {
  let checkMin
  switch (formula.operatorMin) {
    case '=':
      checkMin = Number(value) == formula.minValue
      break;
    case '<':
      checkMin = Number(value) < formula.minValue
      break;
    case '>':
      checkMin = Number(value) > formula.minValue
      break;
    case '<>':
      checkMin = Number(value) >= formula.minValue
      break;
    case '>=':
      checkMin = Number(value) >= formula.minValue
      break;
    case '<=':
      checkMin = Number(value) <= formula.minValue
      break;
  }
  return checkMin
}

export const checkMaxValue = (formula: ListItem | CBMMappingDetail, value) => {
  let checkMax
  switch (formula.operatorMax) {
    case '=':
      checkMax = Number(value) == formula.maxValue
      break;
    case '<':
      checkMax = Number(value) < formula.maxValue
      break;
    case '>':
      checkMax = Number(value) > formula.maxValue
      break;
    case '<>':
      checkMax = Number(value) <= formula.maxValue
      break;
    case '>=':
      checkMax = Number(value) >= formula.maxValue
      break;
    case '<=':
      checkMax = Number(value) <= formula.maxValue
      break;
  }
  return checkMax
}

export const checkRating = (checkMin: boolean, checkMax: boolean, formula: ListItem | CBMMappingDetail) => {
  let rating = ''
  const operatorMin = formula.operatorMin
  const operatorMax = formula.operatorMax

  // case >= 9 to <= 100 (but we already use <> as agreed operator)
  const betweenCondition = operatorMin == '<>'
  // case > 9 to <= 100
  const betweenMoreThanMinOperator = operatorMin == '>' && operatorMax == '<='
  // case >= 9 to < 100
  const betweenLessThanMaxOperator = operatorMin == '>=' && operatorMax == '<'
  // case > 9 to < 100
  const betweenMoreThanMinLessThanMaxOperator = operatorMin == '>' && operatorMax == '<'

  if (betweenCondition || betweenMoreThanMinOperator || betweenLessThanMaxOperator || betweenMoreThanMinLessThanMaxOperator) {
    if (checkMin && checkMax) {
      rating = formula.cbmRating
    }
  } else {
    if (checkMin || checkMax) {
      rating = formula.cbmRating
    }
  }
  return rating
}

export const checkMinValueNew = (formula: CBMMappingDetail, value: string) => {
  let checkMin = false
  switch (formula.operatorMin) {
    case '=':
      checkMin = Number(value) == formula.minValue
      break;
    case '<':
      checkMin = Number(value) < formula.minValue
      break;
    case '>':
      checkMin = Number(value) > formula.minValue
      break;
    case '<>':
      checkMin = Number(value) >= formula.minValue
      break;
    case '>=':
      checkMin = Number(value) >= formula.minValue
      break;
    case '<=':
      checkMin = Number(value) <= formula.minValue
      break;
  }
  return checkMin
}

export const checkMaxValueNew = (formula: CBMMappingDetail, value: string) => {
  let checkMax = false
  switch (formula.operatorMax) {
    case '=':
      checkMax = Number(value) == formula.maxValue
      break;
    case '<':
      checkMax = Number(value) < formula.maxValue
      break;
    case '>':
      checkMax = Number(value) > formula.maxValue
      break;
    case '<>':
      checkMax = Number(value) <= formula.maxValue
      break;
    case '>=':
      checkMax = Number(value) >= formula.maxValue
      break;
    case '<=':
      checkMax = Number(value) <= formula.maxValue
      break;
  }
  return checkMax
}

export const checkRatingNew = (checkMin: boolean, checkMax: boolean, formula: CBMMappingDetail) => {
  let rating = ''
  const operatorMin = formula.operatorMin
  const operatorMax = formula.operatorMax

  // case >= 9 to <= 100 (but we already use <> as agreed operator)
  const betweenCondition = operatorMin == '<>'
  // case > 9 to <= 100
  const betweenMoreThanMinOperator = operatorMin == '>' && operatorMax == '<='
  // case >= 9 to < 100
  const betweenLessThanMaxOperator = operatorMin == '>=' && operatorMax == '<'
  // case > 9 to < 100
  const betweenMoreThanMinLessThanMaxOperator = operatorMin == '>' && operatorMax == '<'

  if (betweenCondition || betweenMoreThanMinOperator || betweenLessThanMaxOperator || betweenMoreThanMinLessThanMaxOperator) {
    if (checkMin && checkMax) {
      rating = formula.cbmRating
    }
  } else {
    if (checkMin || checkMax) {
      rating = formula.cbmRating
    }
  }
  return rating
}

