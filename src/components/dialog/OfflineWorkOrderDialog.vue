<template>
    <!-- Vertically centered modal -->
    <el-dialog v-model="dialogVisible"
    :width="dialogWidth"
    :top="topOffset"
    :show-close="true"
    :center="true"
    :title="title"
    :close-on-click-modal="false"
    :before-close="onClose">
    <SelectSearchWithIcon
      :data="data"
      :display-label="true"
      @on-focus="() => { topOffset = '15vh'; }"
      @on-lost-focus="() => { topOffset = '25vh' }"
      :placeholder="placeholder"
      @on-selected="onWorkOrderSelected"
      :dialogVisible="dialogVisible"
      @on-download="onDownload"
    />
    <!-- <SelectSearch :data="data" :display-label="true" @on-focus="() => { topOffset = '15vh'; }" @on-lost-focus="() => { topOffset = '25vh' }"  :placeholder="placeholder" @on-selected="onWorkOrderSelected" :dialogVisible="dialogVisible" /> -->
    <template #footer>
      <span class="dialog-footer" style="display:block; text-align:right">
        <el-button type="success" class="w-100" @click.prevent="onSubmit" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white" :disabled="!workOrder">Select</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef,
  PropType,
  ref
} from "vue";
import { Option } from "@/core/types/misc/Option";
import SelectSearchWithIcon from '@/components/inputs/dma/offline/SelectSearchWithIcon.vue'
import { useMediaQuery } from "@vueuse/core";
import { computed } from "@vue/reactivity";

const microScreen = useMediaQuery('(min-width: 500px)');
const smallScreen = useMediaQuery('(min-width: 768px)');
const mediumScreen = useMediaQuery('(min-width: 1000px)');
const largScreen = useMediaQuery('(min-width: 1200px)');

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  data: {
    required: true,
    type: Array as PropType<Option[]>
  },
  title: {
    required: false,
    type: String,
    default: ""
  },
  placeholder: {
    required: false,
    type: String,
    default: "Outstanding Services"
  }
});

const workOrder = ref("");
const emits = defineEmits(["onSubmit", "onClose", "onDownload"])
const dialogVisible = toRef(props, "visibility");
const topOffset = ref("25vh");

const dialogWidth = computed(() => {
  let value = "30%";
  if (microScreen.value) {
    value = "85%";
  }
  if (smallScreen.value) {
    value = "70%";
  }
  if (mediumScreen.value) {
    value = "55%";
  }
  if (largScreen.value) {
    value = "50%";
  }
  return value;
})

/* methods */
const onSubmit = () => {
  emits("onSubmit", workOrder.value);
}

const onDownload = (param) => {
  emits("onDownload", param);
}

const onClose = () => {
  workOrder.value = "";
  emits("onClose");
}

/* life cycle */
const onWorkOrderSelected = (value: string) => {
  workOrder.value = value;
}
</script>

<style>
  .el-dialog__title {
    display: block !important;
    font-size: 13px  !important;
    font-weight: 800  !important;
    text-align: left;
  }
</style>
