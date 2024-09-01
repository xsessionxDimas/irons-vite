<template>
  <div v-show="showTask">
    <div class="row w-100" :class="[paddingTopTable, requiredTaskClass]" :style="[generalStyle, taskCustomStyle]">
      <template v-for="item in props.task.items" :key="item.key">
        <Image v-if="item.itemType === 'image'" :item="item" :task="task"/>
        <Label v-if="item.itemType === 'label'" :item="item" :task="task" :is-show-adjustment="isShowAdjustment"/>
        <Input v-if="item.itemType === 'input'" :item="item" :task="task" :is-show-adjustment="isShowAdjustment" :general-submitted="generalSubmitted" />
        <SmallCamera v-if="item.itemType === 'smallCamera'" :item="item" :task="task" :is-show-adjustment="isShowAdjustment" :general-submitted="generalSubmitted"/>
        <HtmlItem v-if="item.itemType === 'html'" :item="item" :task="task" :is-show-adjustment="isShowAdjustment"/>
        <InteractiveButton v-if="item.itemType === 'button'" :item="item" :task="task" @show-task-adjustment="showTaskAdjustment" :is-show-adjustment="isShowAdjustment"/>
        <StatusInfo v-if="item.itemType === 'statusInfo'" :item="item" :task="task" />
        <CheckBoxPreService v-if="item.itemType === 'checkbox' && item.customValidation == 'preServiceTab'" :item="item" :task="task" :general-submitted="generalSubmitted"/>
        <CheckBox v-else-if="item.itemType === 'checkbox'" :item="item" :task="task"/>
        <Dropdown v-if="item.itemType === 'dropDown'" :item="item" :taskGroupName="props.taskGroupName" :task="task" :general-submitted="generalSubmitted" @setLoading="setLoading"/>
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
        {{ task.updatedBy!.name }}, {{ task.updatedDate! }}
      </div>
    </div>
    <template v-else>
      <div v-if="task.updatedBy!.name" class="row position-absolute pe-3 text-nowrap" :style="`top: ${timeStampTop}px; right: calc(var(--bs-gutter-x) / 2);`">
        <div class="d-flex justify-content-end pb-1 my-0 timestamp-task" :style="[borderBottomStyle]" :class="updatedByContainerPlacementClass">
          {{ task.updatedBy!.name }}, {{ task.updatedDate! }}
        </div>
      </div>
      <template v-if="task.updatedBy!.name">
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
      <template v-if="task.rating == 'AUTOMATIC' && (task.isShowAdjustmentRow || isShowAdjustment)">
        <TaskAdjustment :task="task" @show-task-adjustment="showTaskAdjustment" :general-submitted="generalSubmitted"/>
      </template>
      <template v-if="(task.rating == 'AUTOMATIC_REPLACEMENT' || task.rating == 'AUTOMATIC_REPLACEMENT_GAP') && (task.isShowReplacementRow || isShowAdjustment)">
        <TaskReplacement :task="task" @show-task-adjustment="showTaskAdjustment" :general-submitted="generalSubmitted"/>
      </template>
      <template v-if="(task.rating == TaskRatingEnum.MANUAL_CLEANED) && (task.isShowCleanedRow || isShowAdjustment)">
        <TaskCleaned :task="task" @show-task-adjustment="showTaskAdjustment" :general-submitted="generalSubmitted"/>
      </template>
    </template>
  </div>
<!-- task.category == 'CBM' && task.rating == 'AUTOMATIC' && task.taskValue == 'C' || task.taskValue == 'X' -->
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  ref,
  watch
} from 'vue'
import Image from './item/Image.vue'
import Label from './item/Label.vue'
import Dropdown from './item/Dropdown.vue';
import Input from './item/Input.vue';
import {
  Task,
  ShowParametereEnum
} from '@/core/types/entities/dma/e-form/Task'
import { last, isUndefined } from "lodash"
import SmallCamera from './item/small-camera/SmallCamera.vue';
import CheckBox from './item/CheckBox.vue';
import HtmlItem from "@/components/e-form/OfflineHTML.vue";
import InteractiveButton from './item/InteractiveButton.vue';
import TaskAdjustment from './TaskAdjustment.vue'
import TaskReplacement from './TaskReplacement.vue';
import TaskCleaned from './TaskCleaned.vue';
import StatusInfo from "@/components/e-form/statusInfo.vue"
import { useEFormStore } from '@/store/pinia/dma/e-form-offline/useEFormStore';
import Textarea from "@/components/inputs/dma/Textarea.vue";
import CheckBoxPreService from './item/CheckBoxPreService.vue';
import {
  BrakePackTypeDropdownValueEnum
} from '@/core/types/entities/dma/e-form/Item';
import { TaskRatingEnum } from "@/core/types/entities/dma/e-form/Task"

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
  taskGroupName: {
    type: String,
    required: false,
    default: ""
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  }
});

const eformStore = useEFormStore()

const showTask = computed(() => {
  let showTask = true
  if (props.task.showParameter == "suspensionCylinder") {
    showTask = false
    let allTaskFilled = true
    let thereisOutOfSpecTask = false
    if (eformStore.stateStoredSuspensionCylinderValue || eformStore.stateStoredSuspensionCylinderValue.length > 0) {
      eformStore.stateStoredSuspensionCylinderValue.forEach((item) => {
        if (!item.value) {
          allTaskFilled = false
        }
        if (item.value == "Out of spec" || item.value == "Out Spec") {
          thereisOutOfSpecTask = true
        }
      })
    }
    showTask = allTaskFilled && thereisOutOfSpecTask
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

const requiredTaskClass = computed(() => {
  let className = ''
  if (props.task.taskValue != undefined) {
    if (props.task.taskValue == '') {
      className = 'task-required'
    }
  }
  props.task.items.forEach((item) => {
    if (item.categoryItemType == "brakeTypeDropdown") {
      if (item.value == "Caliper") {
        className = ""
      }
    }
  });
  // kalau dia anakan braketype dan disable
  if (props.task.childGroupTaskId) {
    eformStore.stateSelectedSubGroups.forEach((subGroup) => {
      subGroup.taskGroup.forEach((taskGroup) => {
        taskGroup.task.forEach((task: Task) => {
          if (task.parentGroupTaskId) {
            if (task.parentGroupTaskId == props.task.childGroupTaskId) {
              if (task.taskValue) {
                className = ""
              }
            }
          }
        })
      })
    })
  }
  if (props.task.rating == "CALIBRATION") {
    // get item with value
    for (const item of props.task.items) {
      if (item.itemType == "statusInfo" && !item.value) {
        className = "task-required"
        break
      }
    }
  }
  if (props.task.showParameter) {
    if (props.task.showParameter == "cylinderHeightNeedAdjustment") {
      const length = props.task.items.length
      if (length == 7) {
        const status = props.task.items.find((x) => {
          return x.itemType == 'statusInfo'
        })
        if (status && status.value === '' && showTask.value) {
          className = "task-required"
        }
      }
    }
  }
  if (!showTask.value) {
    className = ""
  }
  return className
})

const isGetDataByParam = computed(() => {
  return eformStore.stateGetDataByParam
})

watch(isGetDataByParam, async (newVal, oldVal) => {
  if (newVal) {
    if (!props.task.isShowCleanedRow) {
      showTaskAdjustment(false);
    }
  }
})

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

const leftBorderRef = ref('')
const rightBorderRef = ref('')

const rightBorderMDBreakpoint = computed(() => {
  let rightBorderMDBreakpoint = 0
  props.task.items.forEach((item, index) => {
    if ((index + 1) == props.task.items.length) {
      if (item.itemType == "dropDown") {
        const itemBeforeLastItem = props.task.items[index - 1]
        if (!isUndefined(itemBeforeLastItem!.style) && !isUndefined(itemBeforeLastItem!.style.border) && itemBeforeLastItem!.style.border.right != 'none') {
          if (props.task.items.length == 3) {
            rightBorderMDBreakpoint = Number(itemBeforeLastItem.style.breakPoint) - 1
          } else {
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
          if (props.task.items.length == 3) {
            rightBorderLGBreakpoint = Number(itemBeforeLastItem.style.breakPoint) - 1
          } else {
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

const isTaskLoading = ref(false)
const isShowAdjustment = ref(false)

const setLoading = (status) => {
  isTaskLoading.value = status
}
const showTaskAdjustment = (show: boolean) => {
  isShowAdjustment.value = show
}
const timeStampTop = computed(() => {
  let number = 40
  if (isTaskLoading.value) number = 60
  return number
})

const isTaskHaveBorderBottom = computed(() => {
  const firstItem = props.task.items.find((item) => {
    return item.style.visibility != 'hidden'
  })
  const lastItem = last(props.task.items)
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned || isShowAdjustment.value
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
  let marginBottomTable = props.task.updatedBy!.name && !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none' ? `margin-bottom: 1rem; ` : ""

  // if task have border bottom
  if (isTaskHaveBorderBottom.value) {
    borderRight = ''
    borderLeft = ''
  }

  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned || isShowAdjustment.value

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
  const isRepJust = isReplacement || isAdjustment || isCleaned || isShowAdjustment.value
  if (isRepJust) {
    borderBottom = ''
  } else {
    borderBottom = props.task.updatedBy!.name && !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none' ? `border-bottom: ${lastItem!.style.border.bottom}; ` : ""
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
