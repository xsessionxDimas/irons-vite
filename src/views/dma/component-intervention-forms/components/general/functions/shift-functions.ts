import {
  dayNightConverter,
  getUTCOffsetTime,
  handleConvertTo24Hrs
} from '@/core/helpers/date-format'
import { isUndefined } from 'lodash'
import {
  ListItem as Shift
} from '@/core/types/entities/administration/organization-unit/shift/ListItem'

export const handleGetShift = (shifList: Shift[], timezone: string) => {
  const currTime = getUTCOffsetTime(timezone)
  // return current shift
  const currShift = shifList.find((shift) => {
    // check if current time is between
    const startShift = shift.startHourType == 'PM' ? handleConvertTo24Hrs(`${shift.startHour}:00`) : `${shift.startHour}:00`
    const endShift = shift.endHourType == 'PM' ? handleConvertTo24Hrs(`${shift.endHour}:00`) : `${shift.endHour}:00`
    if (shift.startHourType == 'PM' && shift.endHourType == 'AM') {
      if (currTime > '12:00:00') {
        if (currTime >= startShift || currTime <= endShift) {
          return shift
        }
      } else {
        if (currTime <= startShift && currTime <= endShift) {
          return shift
        }
      }
    } else {
      if (currTime >= startShift && currTime <= endShift) {
        return shift
      }
    }
  })
  if (isUndefined(currShift)) {
    return dayNightConverter(timezone)
  } else {
    return currShift?.shift.toLowerCase().includes('shift') ? currShift?.shift : `${currShift?.shift} Shift`
  }
}
