<template>
  <template v-if="showTask">
    <div class="row w-100" :class="[paddingTopTable, isTaskValue]" :style="[generalStyle, taskCustomStyle]">
      <template v-for="item in props.task.items" :key="item.key">
        <Image v-if="item.itemType === 'image'" :item="item" :task="task"/>
        <Label v-if="item.itemType === 'label'" :item="item" :task="task"/>
        <Dropdown v-if="item.itemType === 'dropDown'" :item="item" :task="task"/>
        <Input v-if="item.itemType === 'input'" :item="item" :task="task" />
        <SmallCamera v-if="item.itemType === 'smallCamera'" :item="item" :task="task"/>
        <CheckBox v-if="item.itemType === 'checkbox'" :item="item" :task="task"/>
        <Html v-if="item.itemType === 'html'" :item="item" :task="task"/>
        <InteractiveButton v-if="item.itemType === 'button'" :item="item" :task="task"/>
        <StatusInfo v-if="item.itemType === 'statusInfo'" :item="item" :task="task" />
        <SmallNote v-if="item.itemType == 'smallNote'" :item="item" :task="task" />
        <SmallRepair v-if="item.itemType == 'smallRepair'" :item="item" :task="task" />
      </template>
    </div>
    <div class="mt-2" v-if="preServiceTabValidation && !isUndefined(task.reason) && task.reason != ''">
      <Textarea
        :value=formatTaskReason
        label-class="dma--textarea-label reason_skip--label"
        text-class="dma--textarea-input h-100px reason_skip--text--disabled"
        label="Reason"
        name="reason"
        :disabled="true"
      ></Textarea>
      <div class="text-end reason_skip--updateBy">
        <template v-if="task.updatedBy">
          {{ (task.updatedBy as Audit).name }}, {{ task.updatedDate }}
        </template>
      </div>
    </div>
    <template v-else>
      <div v-if="(task.updatedBy as Audit).name && (!task.isShowReplacementRow || !task.replacement)" class="row position-absolute pe-3 text-nowrap" :style="`top: ${timeStampTop}px; right: calc(var(--bs-gutter-x) / 2);`">
        <div class="d-flex justify-content-end pb-1 my-0 timestamp-task" :style="[borderBottomStyle]" :class="updatedByContainerPlacementClass">
          {{(task.updatedBy as Audit).name }}, {{ task.updatedDate }}
        </div>
      </div>
      <div v-if="task.isShowReplacementRow && task.replacement" class="row position-absolute pe-3 text-nowrap" :style="`top: ${timeStampTop}px; right: calc(var(--bs-gutter-x) / 2);`">
        <div class="d-flex justify-content-end pb-1 my-0 timestamp-task" :style="[borderBottomStyle]" :class="updatedByContainerPlacementClass">
          {{ task.items[6].updatedBy!.name }}, {{ task.items[6].updatedDate! }}
        </div>
      </div>
      <template v-if="(task.updatedBy as Audit).name">
        <div class="row w-100" style="height: 25px" v-if="!isTaskHaveBorderBottom">
          <template v-if="!isDropDownOutsideTable">
            <div :style="style" :class="updatedByContainerPlacementClass"></div>
          </template>
          <template v-else>
            <div class="col-1"></div>
            <div class="col-1" :style="`border-left: ${leftBorderRef}`"></div>
            <div :class="`col-md-${rightBorderMDBreakpoint} col-lg-${rightBorderLGBreakpoint}`" :style="`border-right: ${rightBorderRef}`"></div>
          </template>
        </div>
      </template>
      <template v-if="task.isShowAdjustmentRow && task.adjustment">
        <TaskAdjustment :task="task" />
      </template>
      <template v-if="task.isShowReplacementRow && task.replacement">
        <TaskReplacement :task="task" />
      </template>
      <template v-if="(task.isShowCleanedRow) && (task.cleaned)">
        <TaskCleaned :task="task" />
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  ref
} from 'vue'
import Image from './item/Image.vue'
import Label from './item/Label.vue'
import Dropdown from './item/Dropdown.vue';
import Input from './item/Input.vue';
import {
  Task,
  ShowParametereEnum
} from '@/core/types/entities/dma/e-form/Task';
import { last, isUndefined } from "lodash";
import SmallCamera from './item/small-camera/SmallCamera.vue';
import CheckBox from './item/CheckBox.vue';
import SmallRepair from "./item/SmallRepair.vue"
import SmallNote from "./item/SmallNote.vue"
import Html from "@/components/e-form/HTML.vue";
import InteractiveButton from './item/InteractiveButton.vue';
import TaskAdjustment from './TaskAdjustment.vue'
import TaskReplacement from './TaskReplacement.vue'
import StatusInfo from "@/components/e-form/statusInfo.vue"
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore';
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { Audit } from '@/core/types/intervention/Audit';
import TaskCleaned from './TaskCleaned.vue';
import {
  BrakePackTypeDropdownValueEnum
} from '@/core/types/entities/dma/e-form/Item';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  },
  taskIndex: {
    type: Number,
    required: true
  },
  taskGroup: {
    type: Array as PropType<Task[]>,
    required: true
  },
  isMonitoring: {
    type: Boolean,
    required: true,
    default: false
  }
});

const updatedByContainerPlacementClass = computed(() => {
  // get remaining column
  let col = 12
  // get total offset
  let offset = 0
  props.task.items.every((item) => {
    if (!isUndefined(item.style) && item.style.visibility == 'hidden' && (isUndefined(item!.style) || isUndefined(item!.style.border) || item!.style.border.left == 'none')) {
      col = Number(col) - Number(item.style.breakPoint)
      offset = Number(offset) + Number(item.style.breakPoint)
      return true
    } else {
      return false
    }
  })
  return `col-${col} offset-${offset}`
})

const timeStampTop = computed(() => {
  let number = 40
  return number
})

const leftBorderRef = ref('')
const rightBorderRef = ref('')

const eformStore = usePreviewFormStore()

const showTask = computed(() => {
  let showTask = true
  if (props.task.showParameter == "suspensionCylinder") {
    showTask = false
    eformStore.stateStoredSuspensionCylinderValue.forEach((item) => {
      if (item.value == "Out of spec" || item.value == "Out Spec") {
        showTask = true
      }
    })
  }
  if (props.task.showParameter == "cylinderHeightNeedAdjustment") {
    if (eformStore.stateStoredAdjustmentOptionValue == "Yes" || eformStore.stateStoredAdjustmentOptionValue == "2") {
      showTask = true
    } else {
      showTask = false
    }
  }
  if (props.task.showParameter == "cylinderHeightAdjustmentsFilled") {
    showTask = true
    eformStore.stateStoredAdjustedSuspensionCylinderValue.forEach((item) => {
      if (!item.value) {
        showTask = false
      }
    })
  }

  // check brake pack type
  // ticket BAA-11165
  showTask = handleCheckShwoBrakePackTask(showTask);
  return showTask
})

// logic untuk menampilkan task caliper/oil cooled
// default is caliper
const handleCheckShwoBrakePackTask = (currentShowTask: boolean): boolean => {
  let showTask = currentShowTask;
  if (eformStore.SelectedBrakeTypeDropdown == BrakePackTypeDropdownValueEnum.OIL_COOLED) {
    if (props.task.showParameter == ShowParametereEnum.BRAKE_TYPE_CALIPER) {
      showTask = false;
    }
  } else {
    if (props.task.showParameter == ShowParametereEnum.BRAKE_TYPE_OIL_COOLED) {
      showTask = false;
    }
  }
  return showTask;
}

const findTaskByParentKey = (key: string) => {
  let taskResult: Task | undefined
  eformStore.stateSelectedSubGroups.forEach((subGroup) => {
    subGroup.taskGroup.forEach((taskGroup) => {
      taskGroup.task.forEach((task) => {
        if (task.parentGroupTaskId == key) {
          taskResult = task
          return
        }
      })
    })
  })
  return taskResult
}

const isTaskValue = computed(() => {
  let className = ""
  if (eformStore.generalForm.status == 'Open') return
  if (!props.isMonitoring) return className
  if (props.task.category == 'NORMAL') {
    // check input and dropdown
    const inp = props.task.items.find((f) => {
      return f.itemType == 'input' && f.valueItemType != 'comment'
    })
    const drop = props.task.items.find((f) => {
      return f.itemType == 'dropDown'
    })
    if (inp && drop) {
      return !inp.value && !drop.value ? 'task-required' : ''
    }
    if (!inp && drop && !drop.value) {
      return 'task-required'
    }
  }
  if (Object.hasOwn(props.task, 'groupTaskId') && !Object.hasOwn(props.task, 'parentGroupTaskId') && !Object.hasOwn(props.task, 'childGroupTaskId')) {
    let input = props.task.items.find((f) => {
      return f.itemType == 'input' && !f.valueItemType && !f.value
    })
    if (input) {
      return 'task-required'
    }
    // accomodate average
    input = props.task.items.find((f) => {
      return f.category == 'cbmCalculateAvg' && !f.value
    })
    if (input) {
      return 'task-required'
    }
    const dropdownTool = props.task.items.find((f) => {
      return f.categoryItemType == 'dropdownTool'
    })
    if (dropdownTool) {
      input = props.task.items.find((f) => {
        return f.categoryItemType == 'paramRatingDynamic' && !f.value
      })
      if (input) {
        return 'task-required'
      }
    }
  }
  // CALIPER and Oil Cooled
  if (Object.hasOwn(props.task, 'parentGroupTaskId')) {
    // need to check dropdown first
    const oilOrCaliper = props.task.items.find((f) => {
      return f.categoryItemType == 'brakeTypeDropdown'
    })
    if (oilOrCaliper) {
      const ratingParam = props.task.items.find((f) => {
        return f.categoryItemType == 'paramRatingDynamic'
      })
      if (!oilOrCaliper.value || (oilOrCaliper.value == 'Oil Cooled' && !ratingParam?.value)) {
        return 'task-required'
      }
    }
  }
  if (Object.hasOwn(props.task, 'childGroupTaskId')) {
    // need to parent first
    const task = findTaskByParentKey(props.task.childGroupTaskId as string)
    if (task) {
      const oilOrCaliper = task.items.find((f) => {
        return f.categoryItemType == 'brakeTypeDropdown'
      })
      if (oilOrCaliper) {
        if (oilOrCaliper.value == 'Caliper') {
          // need to find the rating param
          const ratingParam = props.task.items.find((f) => {
            return f.categoryItemType == 'paramRatingDynamic'
          })
          if (ratingParam && !ratingParam.value) {
            return 'task-required'
          }
        } else {
          if (!oilOrCaliper.value) {
            return 'task-required'
          }
        }
      }
    }
  }
  if (Object.hasOwn(props.task, 'rating') && props.task.rating == 'AUTOMATIC_PREVIOUS_GROUP' && !Object.hasOwn(props.task, 'parentGroupTaskId') && !Object.hasOwn(props.task, 'childGroupTaskId')) {
    const input = props.task.items.find((f) => {
      return f.itemType == 'input' && !f.valueItemType && !f.value
    })
    if (input) {
      return 'task-required'
    }
  }
  if (Object.hasOwn(props.task, 'taskValue') && !props.task.taskValue && !Object.hasOwn(props.task, 'parentGroupTaskId') && !Object.hasOwn(props.task, 'childGroupTaskId')) {
    className = 'task-required'
  } else {
    className = ""
  }
  if (!showTask.value) {
    className = ""
  }
  return className
})

const paddingTopTable = computed(() => {
  let margin = ""
  let sampleItem
  if (props.task.items.length <= 1) {
    sampleItem = props.task.items[0]
  } else {
    sampleItem = props.task.items[1]
  }
  if (!isUndefined(sampleItem.style) && !isUndefined(sampleItem.style.border)) {
    if (sampleItem.style.border.top != 'none') {
      margin = "mt-3"
    }
  }
  return margin
})


const rightBorderMDBreakpoint = computed(() => {
  let rightBorderMDBreakpoint = 0
  props.task.items.forEach((item, index) => {
    if ((index + 1) == props.task.items.length) {
      if (item.itemType == "dropDown") {
        const itemBeforeLastItem = props.task.items[index - 1]
        if (!isUndefined(itemBeforeLastItem!.style) && !isUndefined(itemBeforeLastItem!.style.border) && itemBeforeLastItem!.style.border.right != 'none') {
          props.task.items.forEach((itemBp, indexBp) => {
            if (indexBp > 1 && indexBp <= index - 1) {
              let currentItemBp = 0
              if (!isUndefined(itemBp.style.potraitBreakPoint)) {
                currentItemBp = itemBp.style.potraitBreakPoint
              } else {
                let usedBreakpoints = 0
                if (itemBp.style.breakPoint == 'none') {
                  props.task.items.forEach((itemCountBr, indexCountBr) => {
                    if (itemCountBr.style.breakPoint != 'none') {
                      usedBreakpoints += Number(itemCountBr.style.breakPoint)
                    }
                  })
                  currentItemBp = 12 - usedBreakpoints
                } else {
                  currentItemBp = (itemBp.style.breakPoint - usedBreakpoints)
                }
              }
              rightBorderMDBreakpoint += Number(currentItemBp)
            }
          })
        }
      }
    }
  })
  return rightBorderMDBreakpoint
})

const rightBorderLGBreakpoint = computed(() => {
  let rightBorderLGBreakpoint = 0
  props.task.items.forEach((item, index) => {
    if ((index + 1) == props.task.items.length) {
      if (item.itemType == "dropDown") {
        const itemBeforeLastItem = props.task.items[index - 1]
        if (!isUndefined(itemBeforeLastItem!.style) && !isUndefined(itemBeforeLastItem!.style.border) && itemBeforeLastItem!.style.border.right != 'none') {
          props.task.items.forEach((itemBp, indexBp) => {
            if (indexBp > 1 && indexBp <= index - 1) {
              let currentItemBp = 0
              let usedBreakpoints = 0
              if (itemBp.style.breakPoint == 'none') {
                props.task.items.forEach((itemCountBr, indexCountBr) => {
                  if (itemCountBr.style.breakPoint != 'none') {
                    usedBreakpoints += Number(itemCountBr.style.breakPoint)
                  }
                })
                currentItemBp = 12 - usedBreakpoints
              } else {
                currentItemBp = (itemBp.style.breakPoint - usedBreakpoints)
              }
              rightBorderLGBreakpoint += Number(currentItemBp)
            }
          })
        }
      }
    }
  })
  return rightBorderLGBreakpoint
})

const isDropDownOutsideTable = computed(() => {
  // let status = false
  let leftBorder = false
  let rightBorder = false
  let bottomBorder = false
  props.task.items.forEach((item, index) => {
    if (index == 1) {
      if (!isUndefined(item!.style) && !isUndefined(item!.style.border) && item!.style.border.left != 'none') {
        leftBorder = true
        leftBorderRef.value = item!.style.border.left
        if (!isUndefined(item!.style) && !isUndefined(item!.style.border) && item!.style.border.bottom != 'none') {
          bottomBorder = true
        }
      }
    }
    if ((index + 1) == props.task.items.length) {
      if (item.itemType == "dropDown") {
        const itemBeforeLastItem = props.task.items[index - 1]
        if (!isUndefined(itemBeforeLastItem!.style) && !isUndefined(itemBeforeLastItem!.style.border) && itemBeforeLastItem!.style.border.right != 'none') {
          rightBorder = true
          rightBorderRef.value = itemBeforeLastItem!.style.border.right
        }
      }
    }
  })
  return leftBorder && rightBorder && !bottomBorder
})

const isTaskHaveBorderBottom = computed(() => {
  const firstItem = props.task.items.find((item) => {
    return item.style.visibility != 'hidden'
  })
  const lastItem = last(props.task.items)
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned
  return !isRepJust && (!isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none') && (!isUndefined(firstItem!.style) && !isUndefined(firstItem!.style.border) && firstItem!.style.border.left != 'none')
})

const style = computed(() => {
  // get first item
  const firstItem = props.task.items.find((item) => {
    return item.style.visibility != 'hidden'
  })
  // get last item
  const lastItem = last(props.task.items)
  let borderRight = !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.right != 'none' ? `border-right: ${lastItem!.style.border.right}; ` : ""
  let borderLeft = !isUndefined(firstItem!.style) && !isUndefined(firstItem!.style.border) && firstItem!.style.border.left != 'none' ? `border-left: ${firstItem!.style.border.left}; ` : ""
  let marginBottomTable = (props.task.updatedBy as Audit).name && !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none' ? `margin-bottom: 1rem; ` : ""

  // if task have border bottom
  if (isTaskHaveBorderBottom.value) {
    borderRight = ''
    borderLeft = ''
  }
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned
  if (isRepJust) {
    marginBottomTable = ''
  }
  if (borderRight) {
    return `${borderRight}${borderLeft}${marginBottomTable}`
  } else {
    return `${marginBottomTable}`
  }
})

const borderBottomStyle = computed(() => {
  let borderBottom = ''
  const lastItem = last(props.task.items)
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned
  if (isRepJust) {
    borderBottom = ''
  } else {
    borderBottom = (props.task.updatedBy as Audit).name && !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none' ? `border-bottom: ${lastItem!.style.border.bottom}; ` : ""
  }
  return ''
})

const generalStyle = computed(() => {
  let style = ''
  if (!isUndefined(props.task.generalStyle)) style = props.task.generalStyle
  return style
})

const taskCustomStyle = computed(() => {
  let style = ''
  const customStyle = props.task.customStyle
  if (!isUndefined(customStyle)) {
    const customStyleArr = customStyle.split(' | ')
    customStyleArr.forEach((custStyle) => {
      if (custStyle.includes('noteStyle')) {
        if (!isUndefined(props.taskGroup[props.taskIndex - 1].updatedBy!.name) && props.taskGroup[props.taskIndex - 1].updatedBy!.name) {
          style = `${style} ${custStyle.split(' = ')[1]}`
        }
      }
    })
  }
  return style
})

const preServiceTabValidation = computed(() => {
  return props.task.items.findIndex((item) => {
    return item.customValidation == 'preServiceTab'
  }) >= 0
})

const formatTaskReason = computed(() => {
  let val = props.task.reason || ''
  if (val) {
    if (val.includes("Other")) {
      val = val.split(";;")[1]
    } else {
      val = val.split(";;")[0]
    }
  }
  return val
})
</script>

<style lang="scss" scoped>
  .task-required {
    background-color: #ecc9c9;
  }
</style>
