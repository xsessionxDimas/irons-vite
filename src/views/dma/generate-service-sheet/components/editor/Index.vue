<style>
.el-drawer__body {
  overflow-y: auto;
}

.el-drawer__header {
  margin-bottom: 10px;
}
</style>

<template>
  <el-drawer
    v-model="openState"
    title="Task Editor"
    :direction="direction"
    :before-close="beforeClose"
    size="100%"
    :key="`content-${content}`"
  >
    <div>
      <JsonEditorVue @change="emitContent" :content="{ json: content || {} }" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { Task } from "@/core/types/generate-service-sheet/Task";
import { TaskGroup } from "@/core/types/generate-service-sheet/TaskGroup";
import JsonEditorVue, { Mode } from "json-editor-vue";
import { ref, watch } from "vue";

type DrawerDirection = "ltr" | "rtl" | "ttb" | "btt";

const emits = defineEmits<{
  changed:(updatedContent: typeof content.value) => void;

  // 2 way binding for open props
  "update:open": () => void;
}>();

const props = defineProps<{
  open?: boolean;
  content?: typeof content.value;
}>();

watch(
  () => {
    return props.open;
  },
  (newState) => {
    openState.value = newState;
  }
);

watch(
  () => {
    return props.content;
  },
  (newContent) => {
    if (content.value == newContent) return;

    content.value = newContent;
  }
);

const direction = ref<DrawerDirection>("btt");
const openState = ref<boolean>(false);
const content = ref<Task | TaskGroup>();

function beforeClose() {
  openState.value = false;
  emits("update:open", false);
}

function emitContent(updatedContent: { json?: typeof content.value; text?: string }) {
  let objectTask: typeof content.value;

  if (updatedContent.json) {
    objectTask = updatedContent.json;
  } else {
    objectTask = JSON.parse(updatedContent.text || "{}") as any;
  }

  emits("changed", objectTask);
}
</script>
