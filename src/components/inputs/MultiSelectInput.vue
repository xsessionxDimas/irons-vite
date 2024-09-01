<template>
  <div class="fv-row" :class="gridClass">
    <label :class="`form-label fs-6 fw-bolder ${labelClass || 'text-dark'}`">{{ label }}</label>
    <el-form-item class="col">
      <el-select
        v-model="inputValue"
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="w-100"
        :placeholder="placeholder"
        clearable
        filterable
        :disabled="isDisabled"
        v-loading="loading"
        :popper-class="popperClass"
      >
        <el-option
          v-for="option in options"
          :key="option"
          :label="option.label"
          :value="option.value"
          :selected="value && value.includes(option.value)" />
      </el-select>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
  PropType
} from "vue";
import { Option } from "@/core/types/misc/Option";

const props = defineProps({
  value: {
    required: true,
    type: Array,
  },
  gridClass: {
    required: false,
    type: String,
    default: ""
  },
  name: {
    required: true,
    type: String,
  },
  label: {
    required: false,
    type: String,
  },
  options: {
    required: true,
    type: Array as PropType<Option[]>,
  },
  placeholder: {
    required: false,
    type: String,
    default: "Please Select"
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false,
  },
  labelClass: {
    required: false,
    type: String,
    default: "text-dark",
  },
  loading: {
    required: false,
    type: Boolean,
    default: false,
  },
  popperClass: {
    required: false,
    type: String,
    default: "",
  }
});
const emits = defineEmits(["handleChange"]);
const inputValue = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emits("handleChange", val);
  },
});
</script>
