<template>
  <div class="fv-row" :class="gridClass">
    <label :class="`form-label fs-6 fw-bolder ${labelClass || 'text-dark'}`">{{ label }}</label>
    <el-form-item class="col">
      <el-select
        v-model="inputValue"
        class="w-100"
        :placeholder="placeholder"
        clearable
        filterable
        v-loading="isLoading"
        :disabled="isDisabled"
        :popper-class="popperClass"
        :allow-create="allowCreate"
        :default-first-option="defaultFirstOption"
      >
        <el-option
          v-for="option in localOptions"
          :key="option"
          :label="option.label"
          :value="option.value"
          :selected="value && value.includes(option.value)" />
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
  ref,
  onBeforeMount
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
  allowCreate: {
    required: false,
    type: Boolean,
    default: false,
  },
  defaultFirstOption: {
    required: false,
    type: Boolean,
    default: false,
  }
});
const emits = defineEmits(["handleChange"]);
const links = toRef(props, "options");
const localOptions = ref<Option[]>([]);

const inputValue = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emits("handleChange", val);
  },
});
onBeforeMount(() => {
  const options = links.value.filter((item) => {
    return item.label.toString().toLowerCase()
  });
  localOptions.value = uniqBy(options, "label");
})
</script>
