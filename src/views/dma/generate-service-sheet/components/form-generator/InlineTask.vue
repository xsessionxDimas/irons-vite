<template>
  <div>
    <div
      class="row w-100"
      :class="[paddingTopTable, requiredTaskClass]"
      :style="[generalStyle, taskCustomStyle]"
    >
      <template v-for="item in props.task.items" :key="item.key">
        <Image
          v-if="item.itemType === 'image'"
          :item="item"
          :task="task"
          :key="item.value"
        />

        <Label v-if="item.itemType === 'label'" :item="item" :task="task" />
        <Input v-if="item.itemType === 'input'" :item="item" :task="task" />
        <Dropdown
          v-if="item.itemType === 'dropDown'"
          :item="item"
          :taskGroupName="props.taskGroupName"
          :task="task"
        />
        <SmallCamera v-if="item.itemType === 'smallCamera'" :item="item" :task="task" />
        <HTMLComponent v-if="item.itemType === 'html'" :item="item" :task="task" />
        <InteractiveButton v-if="item.itemType === 'button'" :item="item" :task="task" />
        <SmallNote v-if="item.itemType == 'smallNote'" :item="item" :task="task" />
        <SmallRepair v-if="item.itemType == 'smallRepair'" :item="item" :task="task" />
        <CheckBoxPreService
          v-if="item.itemType === 'checkbox' && item.customValidation == 'preServiceTab'"
          :item="item"
          :task="task"
        />
        <CheckBox v-else-if="item.itemType === 'checkbox'" :item="item" :task="task" />
      </template>
    </div>

    <template v-if="task_ever_filled">
      <div class="row position-absolute pe-3 text-nowrap" style="top: 40px; right: calc(var(--bs-gutter-x) / 2);"><div class="d-flex justify-content-end pb-1 my-0 timestamp-task col-12 offset-0" v-text="timestamp"></div></div>
      <div class="row w-100" style="height: 25px;"><div class="col-12 offset-0" style=""></div></div>
    </template>

    <div
      class="mt-2"
      v-if="preServiceTabValidation && !isUndefined(task.reason) && task.reason != ''"
    >
      <Textarea
        :value="formatTaskReason"
        label-class="dma--textarea-label reason_skip--label"
        text-class="dma--textarea-input h-100px reason_skip--text--disabled"
        label="Reason"
        name="reason"
        :disabled="true"
      ></Textarea>
      <div class="text-end reason_skip--updateBy"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from "vue";
import Image from "./task/item/Image.vue";
import Label from "./task/item/Label.vue";
import HTMLComponent from "./task/item/HTMLComponent.vue";
import Dropdown from "./task/item/Dropdown.vue";
import Input from "./task/item/Input.vue";
import { isUndefined } from "lodash";
import SmallCamera from "./task/item/small-camera/SmallCamera.vue";
import CheckBox from "./task/item/CheckBox.vue";
import CheckBoxPreService from "./task/item/CheckBoxPreService.vue";
import SmallRepair from "./task/item/SmallRepair.vue";
import SmallNote from "./task/item/SmallNote.vue";
import InteractiveButton from "./task/item/InteractiveButton.vue";
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { Task } from "@/core/types/generate-service-sheet/Task";

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
  taskIndex: {
    type: Number,
    required: true,
  },
  taskGroup: {
    type: Array as PropType<Task[]>,
    required: true,
  },
  taskGroupName: {
    type: String,
    required: false,
    default: "",
  },
});

const task_ever_filled = computed<boolean>(() => {
  return !!props.task?.adjustment?.updatedBy.name
});

const timestamp = computed<string | undefined>(() => {
  if (task_ever_filled.value) {
    return `${props.task.adjustment?.updatedBy?.name}, ${props.task.adjustment?.updatedDate}`
  }

  return undefined;
})

const paddingTopTable = computed(() => {
  let margin = "";
  let sampleItem;
  if (props.task.items.length <= 1) {
    sampleItem = props.task.items[0];
  } else {
    sampleItem = props.task.items[1];
  }
  if (!isUndefined(sampleItem.style) && !isUndefined(sampleItem.style.border)) {
    if (sampleItem.style.border.top != "none") {
      margin = "mt-3";
    }
  }
  return margin;
});

const requiredTaskClass = computed(() => {
  let className = "";
  return className;
});

const generalStyle = computed(() => {
  let style = "";
  return style;
});

const taskCustomStyle = computed(() => {
  let style = "";
  return style;
});

const preServiceTabValidation = computed(() => {
  return (
    props.task.items.findIndex((item) => {
      return item.customValidation == "preServiceTab";
    }) >= 0
  );
});

const formatTaskReason = computed(() => {
  let val = props.task.reason || "";
  if (val) {
    if (val.includes("Other")) {
      val = val.split(";;")[1];
    } else {
      val = val.split(";;")[0];
    }
  }
  return val;
});
</script>
