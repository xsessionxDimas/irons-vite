<template>
  <template v-if="showTask">
    <div class="row w-100 avoid prevent-split">
      <template v-for="item in props.task.items" :key="item.key">
        <Image v-if="item.itemType === 'image'" :item="item" :task="task" />
        <Label v-if="item.itemType === 'label'" :item="item" :task="task" />
        <Dropdown v-if="item.itemType === 'dropDown'" :item="item" :task="task" />
        <Input v-if="item.itemType === 'input'" :item="item" :task="task" />
        <SmallCamera v-if="item.itemType === 'smallCamera'" :item="item" :task="task" />
        <CheckBox v-if="item.itemType === 'checkbox'" :item="item" :task="task" />
        <HTMLItem v-if="item.itemType === 'html'" :item="item" :task="task"/>
        <InteractiveButton v-if="item.itemType === 'button'" :item="item" :task="task"/>
        <StatusInfo v-if="item.itemType === 'statusInfo'" :item="item" :task="task" />
      </template>
    </div>
    <div class="mt-2" v-if="!isUndefined(task.reason) && task.reason != ''">
      <Textarea
        :value="formatTaskReason"
        label-class="dma--textarea-label reason_skip--label"
        text-class="dma--textarea-input h-100px reason_skip--text--disabled"
        label="Reason"
        name="reason"
        :disabled="true"
      ></Textarea>
      <div class="text-end reason_skip--updateBy timestamp-task">
        {{ task.updatedBy!.name }}, {{ task.updatedDate! }}
      </div>
    </div>
    <template v-else>
      <div v-if="task.updatedBy!.name" class="row position-absolute pe-3 text-nowrap" :style="`top: ${timeStampTop}px; right: -13px;`">
        <div class="d-flex justify-content-end pb-1 my-0 timestamp-task avoid" :class="updatedByContainerPlacementClass">
          <span>
            {{ task.updatedBy!.name }}, {{ task.updatedDate! }}
          </span>
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
      <template v-if="checkAdjustmentFilled">
        <TaskAdjustment :task="task" />
      </template>
      <template v-else-if="(!isUndefined(props.task?.replacement) && props.task?.replacement.measurement)">
        <TaskReplacement :task="task" />
      </template>
      <template v-else-if="(!isUndefined(props.task?.cleaned) && props.task?.cleaned.rating)">
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
} from "vue";
import {
  Task,
  ShowParametereEnum
} from '@/core/types/entities/dma/e-form/Task';
import Label from "./component/Label.vue"
import Image from "./component/Image.vue"
import SmallCamera from "./component/SmallCamera.vue"
import Input from "./component/Input.vue"
import Dropdown from "./component/Dropdown.vue"
import CheckBox from "./component/CheckBox.vue"
import HTMLItem from "./component/HTML.vue"
import InteractiveButton from "./component/InteractiveButton.vue"
import TaskAdjustment from './component/TaskAdjustment.vue'
import TaskReplacement from './component/TaskReplacement.vue'
import TaskCleaned from './component/TaskCleaned.vue'
import { isUndefined, last } from "lodash"
import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import StatusInfo from "./component/StatusInfo.vue"
import Textarea from "@/components/inputs/dma/Textarea.vue";
import {
  BrakePackTypeDropdownValueEnum
} from '@/core/types/entities/dma/e-form/Item';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});

const eformStore = usePreviewFormStore()

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
const checkAdjustmentFilled = computed(() => {
  return !isUndefined(props.task?.adjustment) && (props.task?.adjustment.measurement != "" || props.task?.adjustment.commentValue != "")
})
const isTaskHaveBorderBottom = computed(() => {
  const firstItem = props.task.items.find((item) => {
    return item.style.visibility != 'hidden'
  })
  const lastItem = last(props.task.items)
  const isReplacement = (!isUndefined(props.task?.replacement) && props.task?.replacement.measurement)
  const isCleaned = (!isUndefined(props.task?.cleaned) && props.task?.rating)
  const isRepJust = isCleaned || isReplacement || checkAdjustmentFilled.value
  return !isRepJust && (!isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none') && (!isUndefined(firstItem!.style) && !isUndefined(firstItem!.style.border) && firstItem!.style.border.left != 'none')
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

const showTask = computed(() => {
  let showTask = true
  if (props.task.showParameter == "suspensionCylinder") {
    showTask = false
    eformStore.stateStoredSuspensionCylinderValue.forEach((item) => {
      console.log("item", item.value);
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

const timeStampTop = computed(() => {
  let number = 40
  if (props.task.taskValue) {
    props.task.items.every((t) => {
      if (t.itemType == "dropDown") {
        const options = t.caption!.replace("[", "").replace("]", "").split("; ")
        const value = t.itemValue!.replace("[", "").replace("]", "").split(", ")
        const selectedIndex = value.findIndex((val) => {
          return val.replaceAll("'", '') == props.task.taskValue
        })
        if (selectedIndex >= 0) {
          if (options[selectedIndex].replaceAll("'", '').length > 30) {
            number = 80
            return false
          }
        }
      }
      return true
    })
  }
  return number
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

const updatedByContainerPlacementClass = computed(() => {
  // get remaining column
  let col = 12
  // get total offset
  let offset = 0
  props.task.items.every((item) => {
    if (!isUndefined(item.style) && item.style.visibility == 'hidden') {
      col = Number(col) - Number(item.style.breakPoint)
      offset = Number(offset) + Number(item.style.breakPoint)
      return true
    } else {
      return false
    }
  })
  return `col-${col} offset-${offset}`
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
  const isReplacement = (!isUndefined(props.task?.replacement) && props.task?.replacement.measurement)
  const isCleaned = (!isUndefined(props.task?.cleaned) && props.task?.rating)
  const isRepJust = isCleaned || isReplacement || checkAdjustmentFilled.value
  if (isRepJust) {
    marginBottomTable = ''
  }
  if (borderRight) {
    return `${borderRight}${borderLeft}${marginBottomTable}`
  } else {
    return `${marginBottomTable}`
  }
})
</script>
<style lang="scss" scoped>
.row {
  margin: 0;
}
</style>
