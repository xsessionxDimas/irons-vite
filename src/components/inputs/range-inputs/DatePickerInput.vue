<template>
  <div class="fv-row row" :class="gridClass">
    <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <el-form-item class="col">
      <el-date-picker
        v-model="inputValueFrom"
        :placeholder="placeholder"
        format="DD.MM.YYYY"
        :clearable="isClearable"
        :disabled="isDisabled"
        :disabled-date="disabledDateFromProcess"
     />
    </el-form-item>
    <div class="el-form-item col-1 align-self-center justify-content-center">To</div>
    <el-form-item class="col">
      <el-date-picker
        v-model="inputValueTo"
        :placeholder="placeholder"
        format="DD.MM.YYYY"
        :clearable="isClearable"
        :disabled="isDisabled"
        :disabled-date="disabledDateToProcess"
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
    type: Date,
  },
  valueFrom: {
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
    type: String,
    default: "Pick a date"
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false,
  },
  disabledDateFrom: {
    required: false,
    default: {
      from: "",
      to: ""
    },
  },
  disabledDateTo: {
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

const disabledDateFromProcess = (time: Date) => {
  let timeMoment = momentFormat(time)
  if (props.disabledDateFrom.from && props.disabledDateFrom.to) {
    return !(timeMoment > momentFormat(props.disabledDateFrom.from)) || !(timeMoment < momentFormat(props.disabledDateFrom.to))
  } else if (props.disabledDateFrom.from && !props.disabledDateFrom.to) {
    return !(timeMoment > momentFormat(props.disabledDateFrom.from))
  } else if (!props.disabledDateFrom.from && props.disabledDateFrom.to) {
    return !(timeMoment < momentFormat(props.disabledDateFrom.to))
  }
}

const disabledDateToProcess = (time: Date) => {
  let timeMoment = momentFormat(time)
  if (props.disabledDateTo.from && props.disabledDateTo.to) {
    return !(timeMoment > momentFormat(props.disabledDateTo.from)) || !(timeMoment < momentFormat(props.disabledDateTo.to))
  } else if (props.disabledDateTo.from && !props.disabledDateTo.to) {
    return !(timeMoment > momentFormat(props.disabledDateTo.from))
  } else if (!props.disabledDateTo.from && props.disabledDateTo.to) {
    return !(timeMoment < momentFormat(props.disabledDateTo.to))
  }
}
</script>

