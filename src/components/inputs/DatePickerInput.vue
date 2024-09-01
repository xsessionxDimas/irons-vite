<template>
  <div class="fv-row" :class="gridClass">
    <label :class="`form-label fs-6 fw-bolder ${labelClass || 'text-dark'}`">{{ label }}</label>
    <el-form-item prop="startDate">
      <el-date-picker
        :class="`w-100 ${inputClass}`"
        v-model="inputValue"
        :placeholder="placeholder"
        :name="name"
        :format="props.formatDate"
        :disabled-date="disabledDateProcess"
        :clearable="isClearable"
        :disabled="isDisabled"
        v-loading="isLoading"
     />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits
} from "vue";
import { momentFormat } from "@/core/helpers/date-format"

const props = defineProps({
  value: {
    required: true,
    type: Date,
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
  placeholder: {
    required: false,
    type: String
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false,
  },
  disabledDate: {
    required: false,
    default: {
      from: "",
      to: ""
    }
  },
  isClearable: {
    required: false,
    type: Boolean,
    default: true,
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
  formatDate: {
    required: false,
    type: String,
    default: "DD.MM.YYYY",
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

const disabledDateProcess = (time: Date) => {
  let timeMoment = momentFormat(time)
  if (props.disabledDate.from && props.disabledDate.to) {
    return !(timeMoment > momentFormat(props.disabledDate.from)) || !(timeMoment < momentFormat(props.disabledDate.to))
  } else if (props.disabledDate.from && !props.disabledDate.to) {
    return !(timeMoment > momentFormat(props.disabledDate.from))
  } else if (!props.disabledDate.from && props.disabledDate.to) {
    return !(timeMoment < momentFormat(props.disabledDate.to))
  }
}

</script>

