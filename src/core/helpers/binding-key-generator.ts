
import {
  Task,
  TaskRatingEnum
} from "../types/entities/dma/e-form/Task";
import {
  Task as InterventionTask
} from "../types/entities/dma/component-intervention/Task"
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import { Item } from "../types/entities/dma/e-form/Item";

const cbmTypes = ['CBM', 'NORMAL']
const ratingTypes = ['AUTOMATIC', 'AUTOMATIC_PREVIOUS_GROUP']

export const bindingKeyGeneratorServiceSheet = (task: Task) => {
  let bindingKey = task.key
  if (cbmTypes.includes(task.category) && task.rating == 'CALIBRATION') {
    if (!task.groupTaskId) {
      const prevTask = findPreviousOrNextTaskByKey(task.key)
      bindingKey = prevTask?.groupTaskId as string
    } else {
      bindingKey = task.groupTaskId as string
    }
  }
  if (cbmTypes.includes(task.category) && task.rating == 'AUTOMATIC_PREVIOUS') {
    // cari kalau dia ada dropdown tool
    const dropDownToolItem = task.items.find((item) => {
      return item.categoryItemType == "dropdownTool" || item.categoryItemType == "dropdownToolDisc"
    })
    // cek kalau kondisi atas n dia bukan oil cooled
    if (dropDownToolItem && (!task.parentGroupTaskId || task.childGroupTaskId)) {
      bindingKey = task.key as string
    } else {
      bindingKey = task.groupTaskId as string
    }
  }
  if (cbmTypes.includes(task.category) && task.showParameter == 'cylinderHeightNeedAdjustment') {
    bindingKey = task.groupTaskId as string
  }
  if (task.items.find((f) => {
    return f.categoryItemType == 'resultParamRating'
  })) {
    bindingKey = task.groupTaskId as string
  }
  if (task.items.find((f) => {
    return f.category == 'cbmCalculateAvg'
  })) {
    const item = task.items.find((f) => {
      return f.category == 'cbmCalculateAvg'
    }) as Item
    const targetTask = findTaskByItemKey(item.targetCalculateKeyId as string)
    bindingKey = targetTask?.groupTaskId as string
  }
  if (task.items.find((f) => {
    return f.categoryItemType == 'dropdownToolGroup'
  })) {
    if (!task.groupTaskId) {
      const nextTask = findPreviousOrNextTaskByKey(task.key, true)
      bindingKey = nextTask?.groupTaskId as string
    } else {
      bindingKey = task.groupTaskId as string
    }
  }
  if (task.mappingToolGroup) {
    bindingKey = task.groupTaskId as string
  }
  if (task.parentGroupTaskId) {
    bindingKey = task.parentGroupTaskId as string
  }
  if (task.childGroupTaskId) {
    bindingKey = task.childGroupTaskId as string
  }
  // OIL_COOLED and CALIPER rating TYPE
  if (task.showParameter) {
    if (task.rating == TaskRatingEnum.OIL_COOLED || task.rating == TaskRatingEnum.CALIPER) {
      if (task.groupTaskId) {
        bindingKey = task.groupTaskId;
      }
    }
  }
  return bindingKey
}

const findTaskByItemKey = (key: string) => {
  const store = useEFormStore()
  let taskResult: Task | undefined
  store.stateServiceSheets.forEach((subGroup) => {
    subGroup.subGroup.forEach((subGroup) => {
      subGroup.taskGroup.forEach((taskGroup) => {
        taskGroup.task.forEach((task) => {
          task.items.forEach((item) => {
            if (item.key == key) {
              taskResult = task
              return
            }
          })
        })
      })
    })
  })
  return taskResult
}
const findPreviousOrNextTaskByKey = (key: string, isNext = false) => {
  const store = useEFormStore()
  let taskResult: Task | undefined
  store.stateServiceSheets.forEach((subGroup) => {
    subGroup.subGroup.forEach((subGroup) => {
      subGroup.taskGroup.forEach((taskGroup) => {
        taskGroup.task.forEach((task, index) => {
          if (task.key == key) {
            const targetIndex = isNext ? index + 2 : index - 1
            taskResult = taskGroup.task[targetIndex]
            return
          }
        })
      })
    })
  })
  return taskResult
}


export const bindingKeyGeneratorIntervention = (task: InterventionTask) => {
  let bindingKey = ''
  if (cbmTypes.includes(task.category) && ratingTypes.includes(task.rating)) {
    bindingKey = task.key
  }
  if (task.items.find((f) => {
    return f.categoryItemType == 'resultParamRating'
  })) {
    bindingKey = task.groupTaskId as string
  }
  return bindingKey
}
