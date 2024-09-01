<template>
  <div class="fv-row" :class="gridClass">
    <label v-if="label" :class="`form-label fs-6 fw-bolder ${labelClass || 'text-dark'}`">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
      <slot name="after-label"></slot>
    </label>
    <el-form-item class="col" :class="!props.margin ? 'm-0' : ''">
      <el-select
        v-model="inputValue"
        :class="`w-100 ${inputClass}`"
        :placeholder="placeholder"
        clearable
        filterable
        v-loading="isLoading"
        :disabled="isDisabled"
        :popper-class="popperClass"
        :multiple="props.isMultiple"
      >
        <el-option
          v-for="option in options"
          :key="option"
          :label="option.label"
          :value="option.value"
          :selected="value && value.toString().includes(option.value.toString())"
        />
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
import { boolean } from "yup";

const props = defineProps({
  margin: {
    type: Boolean,
    default: true,
  },
  value: {
    required: true,
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
  inputClass: {
    required: false,
    default: "",
  },
  isLoading: {
    required: false,
    type: Boolean,
    default: false,
  },
  popperClass: {
    required: false,
    type: String,
    default: "",
  },
  isMultiple: {
    required: false,
    type: Boolean,
    default: false
  },
  required: {
    required: false,
    type: Boolean,
    default: false
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
