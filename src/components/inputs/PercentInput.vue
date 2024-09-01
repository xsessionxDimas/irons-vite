<template>
  <div class="fv-row" :class="gridClass">
  <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <el-form-item>
      <el-input
        v-model="inputValue"
        :placeholder="placeholder"
        class="select-bg-grey"
        @keypress="onlyNumber"
        :maxlength="max"
        @focus="removePercent"
        @blur="formatPercent"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits
} from "vue";

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
    type: String,
    default: 'Input Text'
  },
  disabled: {
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
const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
}
const removePercent = () => {
  // check if have value
  if (inputValue.value) {
    // set nominal to empty string
    inputValue.value = inputValue.value.replace('%', '');
  }
}
const formatPercent = () => {
  let value = ''
  if (inputValue.value) {
    value = inputValue.value + '%'
  }
  emits("handleChange", value);
}
</script>
