<template>
  <div class="fv-row row" :class="gridClass">
    <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <el-form-item class="col">
      <el-select
        v-model="inputValueFrom"
        class="w-100"
        :placeholder="placeholder"
        clearable
        filterable
        :disabled="isDisabled"
        remote
        :remote-method="querySearchAsync"
        @change="handleChangeFrom"
        hide-loading="true">
        <el-option
          v-for="item in localOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
       />
      </el-select>
    </el-form-item>
    <div class="el-form-item col-1 align-self-center justify-content-center">To</div>
    <el-form-item class="col">
      <el-select
        v-model="inputValueTo"
        class="w-100"
        :placeholder="placeholder"
        clearable
        filterable
        :disabled="isDisabled"
        remote
        :remote-method="querySearchAsync"
        @change="handleChangeTo"
        hide-loading="true">
        <el-option
          v-for="item in localOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
  PropType,
  toRef,
  ref
} from "vue";
import { Option } from "@/core/types/misc/Option";
import { uniqBy } from "lodash";

const props = defineProps({
  valueFrom: {
    required: true,
    type: String,
  },
  valueTo: {
    required: true,
    type: String,
  },
  gridClass: {
    required: false,
    type: String,
    default: ""
  },
  label: {
    required: false,
    type: String,
  },
  placeholder: {
    required: false,
    type: String,
    default: "Type any.."
  },
  options: {
    required: true,
    type: Array as PropType<Option[]>,
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["handleChangeFrom", "handleChangeTo"]);
const links = toRef(props, "options");
const localOptions = ref<Option[]>([]);

const inputValueFrom = computed(() => {
  return props.valueFrom
})

const inputValueTo = computed(() => {
  return props.valueTo
})

const handleChangeFrom = (val) => {
  localOptions.value = [];
  emits("handleChangeFrom", val);
}

const handleChangeTo = (val) => {
  localOptions.value = [];
  emits("handleChangeTo", val);
}

const querySearchAsync = (query: string) => {
  if (query) {
    setTimeout(() => {
      const options = links.value.filter((item) => {
        return item.label.toString().toLowerCase().includes(query.toLowerCase())
      });
      localOptions.value = uniqBy(options, "label");
    }, 200)
  } else {
    localOptions.value = []
  }
}
</script>

<style lang="scss">
.el-select-dropdown {
  // max-width: 600px;
  width: 0;
}
</style>
