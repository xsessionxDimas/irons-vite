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
        <HTML v-if="item.itemType === 'html'" :item="item" :task="task"/>
        <InteractiveButton v-if="item.itemType === 'button'" :item="item" :task="task"/>
        <StatusInfo v-if="item.itemType === 'statusInfo'" :item="item" :task="task" />
      </template>
    </div>
    <div v-if="(task.updatedBy as Audit).name" class="row w-100 avoid prevent-split">
      <div class="d-flex justify-content-end pb-1 avoid prevent-split" :style="task.isShowAdjustmentRow? `${style}border-bottom:0px;margin-bottom:0px;` : style" :class="updatedByContainerPlacementClass">
        <span>
          {{ (task.updatedBy as Audit).name }}, {{ task.updatedDate! }}
        </span>
      </div>
    </div>
    <template v-if="task.isShowAdjustmentRow">
      <TaskAdjustment :task="task" :style="style" />
    </template>
    <template v-if="(task as unknown as IDetailTask).reference">
      <CollapsedTableItem :reference="((task as unknown as IDetailTask).reference as Reference)"
      v-if="(task as unknown as IDetailTask).reference!.taskType == 'collapsibleTable'"
      :is-print="true" />
      <ReferenceInline
      :reference="((task as unknown as IDetailTask).reference as Reference)"
      :items="((task as unknown as IDetailTask).reference!.items as ReferenceItemDetail[])"
      v-if="(task as unknown as IDetailTask).reference!.taskType == 'inline'" />
    </template>
  </template>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from "vue";
import { Task } from '@/core/types/entities/dma/e-form/Task';
import Label from "./component/Label.vue"
import Image from "./component/Image.vue"
import SmallCamera from "./component/SmallCamera.vue"
import Input from "./component/Input.vue"
import Dropdown from "./component/Dropdown.vue"
import CheckBox from "./component/CheckBox.vue"
import HTML from "./component/HTML.vue"
import InteractiveButton from "./component/InteractiveButton.vue"
import TaskAdjustment from './component/TaskAdjustment.vue'
import { isUndefined, last } from "lodash"
import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import StatusInfo from "./component/StatusInfo.vue"
import { Audit } from "@/core/types/intervention/Audit";
import { IDetailTask } from "@/core/types/intervention/IDetailTask";
import {
  ReferenceItemDetail
} from "@/core/types/intervention/ReferenceItemDetail";
import CollapsedTableItem from './component/CollapsedTableItem.vue';
import ReferenceInline from '@/views/dma/component-intervention-forms/components/refactor/ReferenceInline.vue'
import { Reference } from "@/core/types/intervention/Reference";

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  }
});

const eformStore = usePreviewFormStore()

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
  return showTask
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
  const borderRight = !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.right != 'none' ? `border-right: ${lastItem!.style.border.right}; ` : ""
  const borderBottom = (props.task.updatedBy as Audit).name && !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none' ? `border-bottom: ${lastItem!.style.border.bottom}; ` : ""
  const borderLeft = !isUndefined(firstItem!.style) && !isUndefined(firstItem!.style.border) && firstItem!.style.border.left != 'none' ? `border-left: ${firstItem!.style.border.left}; ` : ""
  const marginBottomTable = (props.task.updatedBy as Audit) && !isUndefined(lastItem!.style) && !isUndefined(lastItem!.style.border) && lastItem!.style.border.bottom != 'none' ? `margin-bottom: 1rem; ` : ""
  return `${borderRight}${borderLeft}${borderBottom}${marginBottomTable}`
})
</script>
<style lang="scss" scoped>
.row {
  margin: 0;
}
</style>
