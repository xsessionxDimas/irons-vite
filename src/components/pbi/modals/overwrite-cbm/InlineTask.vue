<template>
  <tr class="row w-100">
    <div
      class="row w-100"
      :class="[paddingTopTable, requiredTaskClass]"
      :style="[generalStyle, taskCustomStyle]"
    >
      <template v-for="item in props.task.items" :key="item.key">
        <Label
          v-if="item.itemType === 'label'"
          :item="item"
          :task="task"
        ></Label>
        <Input v-if="item.itemType === 'input'" :item="item" :task="task" />
        <SmallCamera
          v-if="item.itemType === 'smallCamera'"
          :item="item"
          :task="task"
        />
        <Dropdown
          v-if="item.itemType === 'dropDown'"
          :item="item"
          :taskGroupName="props.taskGroupName"
          :task="task"
          @setLoading="setLoading"
        />
      </template>
    </div>
  </tr>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  ref
} from "vue";
import Label from "./item/Label.vue";
import Dropdown from "./item/Dropdown.vue";
import Input from "./item/Input.vue";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import { isUndefined } from "lodash";
import SmallCamera from "./item/small-camera/SmallCamera.vue";

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
  console.log('task', props.task)
  let className = "";
  if (props.task.taskValue != undefined) {
    if (props.task.taskValue == "") {
      className = "task-required";
    }
  }
  return className;
});

const isTaskLoading = ref(false);

const setLoading = (status) => {
  isTaskLoading.value = status;
};

const generalStyle = computed(() => {
  let style = "";
  if (!isUndefined(props.task.generalStyle)) style = props.task.generalStyle;
  return style;
});

const taskCustomStyle = computed(() => {
  let style = "";
  const customStyle = props.task.customStyle;
  if (!isUndefined(customStyle)) {
    const customStyleArr = customStyle.split(" | ");
    customStyleArr.forEach((custStyle) => {
      if (custStyle.includes("noteStyle")) {
        if (
          !isUndefined(props.taskGroup[props.taskIndex - 1].updatedBy!.name) &&
          props.taskGroup[props.taskIndex - 1].updatedBy!.name
        ) {
          style = `${style} ${custStyle.split(" = ")[1]}`;
        }
      }
    });
  }
  return style;
});
</script>
