import { Detail } from '@/core/types/intervention/Detail'
import {
  every,
  floor,
  isUndefined,
  map
} from 'lodash'

export const checkIsAdditionalTask = (description) => {
  if (description) {
    const desc = description.split(";")
    const isAdditional = desc.length == 4 && desc[3]
    return isAdditional == "1"
  }
  return false
}

// Custom function to check array equality based on a specific key
export function isEqualOnKey<T>(array1: T[], array2: T[], keyToCompare: keyof T): boolean {
  // Check if the arrays have the same length
  if (array1.length !== array2.length) {
    return false;
  }

  // Create a set of keys from the first array
  const keySet = new Set(map(array1, (obj) => {
    return obj[keyToCompare]
  }));

  // Check if each key in the second array is present in the set
  return every(array2, (obj) => {
    return keySet.has(obj[keyToCompare])
  });
}

export const getPercentageTaskProgressAllTabIntervention = (groups: Detail[]) => {
  let totalTask = 0
  let totalDoneTask = 0
  groups.forEach((selected) => {
    selected.tasks.forEach((taskGroup) => {
      const task = taskGroup.tasks.filter((val) => {
        return !isUndefined(val.taskValue)
      })
      totalTask = totalTask + task.length

      task.forEach((val) => {
        if (val.taskValue) {
          totalDoneTask = totalDoneTask + 1
        }
      })
    })
  })
  if (totalTask == 0) {
    return 100
  }
  return floor((totalDoneTask / totalTask) * 100)
};
