<template>
  <div class="fv-row" :class="gridClass">
    <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <el-form-item class="col">
      <el-select
        v-model="inputValue"
        class="w-100"
        :placeholder="placeholder"
        clearable
        filterable
        :disabled="isDisabled"
        remote
        :remote-method="querySearchAsync"
        @change="handleChange"
        @focus="handleFocus"
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
/**
 * @note
 * Autocomplete with showing label in form
 */
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

const emits = defineEmits(["handleChange"]);
const links = toRef(props, "options");
const localOptions = ref<Option[]>([]);

const inputValue = computed(() => {
  return props.value
})


onBeforeMount(() => {
  localOptions.value = props.options;
})

const handleChange = (val) => {
  // localOptions.value = [];
  emits("handleChange", val);
  setTimeout(() => {
    localOptions.value = uniqBy(props.options, "label");
  }, 20)
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

const handleFocus = () => {
  localOptions.value = []
}
</script>
