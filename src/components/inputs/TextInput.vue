<template>
  <div class="fv-row">
    <!--begin::Label-->
    <label v-if="label" :class="`form-label fs-6 fw-700 ${labelClass || 'text-dark'}`">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <!--end::Label-->

    <!--begin::Input-->
    <Field
      :placeholder="placeholder"
      class="form-control form-control-lg"
      type="text"
      :name="name"
      :maxlength="max"
      autocomplete="off"
      v-model="inputValue"
      :disabled="disabled"
   />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";
import { Field } from "vee-validate";

const props = defineProps({
  margin: {
    type: Boolean,
    default: true
  },
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
  required: {
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
</script>
