<template>
  <div class="fv-row custom-text-input" :class="gridClass">
    <!--begin::Label-->
    <label :class="`form-label fs-6 fw-bolder ${labelClass || 'text-dark'}`">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <!--end::Label-->

    <!--begin::Input-->
    <el-form-item class="col">
      <el-input
        v-if="textInputType === 'number'"
        ref="elementInputRef"
        :placeholder="placeholder"
        :name="name"
        :maxlength="max"
        v-model="inputValue"
        v-loading="isLoading"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        @keypress="onlyNumber"
        :class="inputClass"
      />
      <el-input
        v-else
        ref="elementInputRef"
        :placeholder="placeholder"
        :type="textInputType"
        :name="name"
        :maxlength="max"
        v-model="inputValue"
        v-loading="isLoading"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :class="inputClass"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  gridClass: {
    required: false,
    type: String,
    default: ""
  },
  max: {
    type: Number,
    default: 524288
  },
  value: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  label: {
    required: false,
    type: String,
  },
  placeholder: {
    required: false,
    type: String
  },
  disabled: {
    default: false
  },
  labelClass: {
    required: false,
    default: "",
  },
  inputClass: {
    required: false,
    default: "",
  },
  rows: {
    required: false,
    type: Number,
    default: 1,
  },
  textInputType: {
    required: false,
    type: String,
    default: "text"
  },
  isLoading: {
    required: false,
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
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
const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
}
</script>

<style lang="scss">
@import "@/assets/sass/typography/_custom-typography-variables.scss";

.custom-text-input .el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
  color: $gray-800 !important;
  background-color: #bec2d3;
  border: none;
}

.custom-text-input .el-textarea__inner {
  height: 9.9rem;
  line-height: 1.5rem;
  padding: 1rem;
}
</style>
