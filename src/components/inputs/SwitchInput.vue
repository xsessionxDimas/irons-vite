<template>
  <div class="fv-row" :class="gridClass">
    <!--begin::Label-->
    <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <!--end::Label-->
    <!--begin::Input-->
    <el-form-item>
      <el-switch
        v-model="inputValue"
        :name="name"
        :disabled="disabled"
     />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, defineEmits } from "vue";

const props = defineProps({
  value: {
    required: true,
    type: Boolean,
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
  disabled: {
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
