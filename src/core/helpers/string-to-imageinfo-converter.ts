import { orderBy } from 'lodash'
import { ImageInfo } from '../types/entities/dma/ImageInfo'
import { RiskAssesmentValue } from '../types/entities/dma/RiskAssesmentValue'

export const stringToImageInfoConvert = (oldValues: string | string[] | ImageInfo[] | undefined) => {
  if (!oldValues || typeof oldValues === 'string') {
    return [] as ImageInfo[]
  }
  const convertedValue = [] as ImageInfo[]
  oldValues.forEach((img: string | ImageInfo) => {
    if (typeof img === 'string') {
      convertedValue.push({
        filename: img,
        description: img.split('%5E')[1] ?? ''
      })
    } else {
      convertedValue.push(img)
    }
  })
  return convertedValue.filter((value, index, self) => {
    return index === self.findIndex((t) => {
      return t.filename === value.filename && t.description === value.description
    })
  })
}
export const riskAssesmentValueConverter = (oldValues: RiskAssesmentValue[]) => {
  if (!oldValues) {
    return [] as RiskAssesmentValue[]
  }
  const convertedValue = [] as RiskAssesmentValue[]
  oldValues.forEach((data) => {
    if (typeof data.image == 'string') {
      data.image = {
        filename: data.image,
        description: data.image.includes('^') ? data.image.split('^')[1] : ''
      }
    }
    convertedValue.push(data)
  })
  return convertedValue
}
export const sortRiskAssesmentValue = (data: RiskAssesmentValue[]) => {
  return orderBy(data, [
    (row) => {
      return row.updatedBy.name
    },
    (row) => {
      return row.updatedDate
    }
  ], ['asc', 'desc'])
}
