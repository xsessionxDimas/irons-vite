<template>
  <div class="fv-row" :class="gridClass">
    <label v-if="label" :class="`form-label fs-6 fw-bolder ${labelClass || 'text-dark'}`">{{ label }}</label>
    <el-form-item class="col">
      <el-select
        v-model="inputValue"
        :class="`w-100 ${inputClass}`"
        :placeholder="placeholder"
        clearable
        filterable
        :disabled="isDisabled"
        remote
        v-loading="isLoading"
        :remote-method="querySearchAsync"
        @change="handleChange"
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
  value: {
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
  labelClass: {
    required: false,
    default: "",
  },
  inputClass: {
    required: false,
    default: "",
  },
  isLoading: {
    required: false,
    type: Boolean,
    default: false,
  }
});

const emits = defineEmits(["handleChange"]);
const links = toRef(props, "options");
const localOptions = ref<Option[]>([]);

const inputValue = computed(() => {
  return props.value
})

const handleChange = (val) => {
  localOptions.value = [];
  emits("handleChange", val);
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
