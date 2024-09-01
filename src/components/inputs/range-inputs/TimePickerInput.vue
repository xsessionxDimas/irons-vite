<template>
  <div class="fv-row row" :class="gridClass">
    <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <el-form-item class="col">
      <el-time-picker
        class="w-100"
        v-model="inputValueFrom"
        :placeholder="placeholder"
        :name="name"
        :format="format"
        :valueFormat="valueFormat"
     />
    </el-form-item>
    <div class="el-form-item col-1 align-self-center justify-content-center">To</div>
    <el-form-item class="col">
      <el-time-picker
        class="w-100"
        v-model="inputValueTo"
        :placeholder="placeholder"
        :name="name"
        :format="format"
        :valueFormat="valueFormat"
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
  valueTo: {
    required: true,
    type: String,
  },
  valueFrom: {
    required: true,
    type: String,
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
    type: String,
    default: "Pick a time"
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false,
  },
  disabledTimeFrom: {
    required: false,
    default: {
      from: "",
      to: ""
    },
  },
  disabledTimeTo: {
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
  format: {
    required: false,
    type: String,
    default: "hh:mm A"
  },
  valueFormat: {
    required: false,
    type: String,
    default: "hh:mm A"
  }
});

const emits = defineEmits(["handleChangeFrom", "handleChangeTo"]);
const inputValueTo = computed({
  get: () => {
    return props.valueTo;
  },
  set: (val) => {
    emits("handleChangeTo", val);
  },
});
const inputValueFrom = computed({
  get: () => {
    return props.valueFrom;
  },
  set: (val) => {
    emits("handleChangeFrom", val);
  },
});

const disabledTimeFromProcess = (time: string) => {
  let timeMoment = momentFormat(time)
  if (props.disabledTimeFrom.from && props.disabledTimeFrom.to) {
    return !(timeMoment > momentFormat(props.disabledTimeFrom.from)) || !(timeMoment < momentFormat(props.disabledTimeFrom.to))
  } else if (props.disabledTimeFrom.from && !props.disabledTimeFrom.to) {
    return !(timeMoment > momentFormat(props.disabledTimeFrom.from))
  } else if (!props.disabledTimeFrom.from && props.disabledTimeFrom.to) {
    return !(timeMoment < momentFormat(props.disabledTimeFrom.to))
  }
}

const disabledTimeToProcess = (time: string) => {
  let timeMoment = momentFormat(time)
  if (props.disabledTimeTo.from && props.disabledTimeTo.to) {
    return !(timeMoment > momentFormat(props.disabledTimeTo.from)) || !(timeMoment < momentFormat(props.disabledTimeTo.to))
  } else if (props.disabledTimeTo.from && !props.disabledTimeTo.to) {
    return !(timeMoment > momentFormat(props.disabledTimeTo.from))
  } else if (!props.disabledTimeTo.from && props.disabledTimeTo.to) {
    return !(timeMoment < momentFormat(props.disabledTimeTo.to))
  }
}
</script>
