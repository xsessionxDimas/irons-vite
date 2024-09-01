<template>
    <div>
        <el-row :gutter="20" class="centered-input">
        <el-col :span="17">
        <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
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
        </el-col>
            <el-col :span="7">
                <el-checkbox  class="is-bordered" v-model="inputValueCheckbox" label="Checkbox" size="large" />
            </el-col>
        </el-row>
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
  valueCheckbox: {
    required: true,
    type: Boolean,
    default: false
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

const emits = defineEmits(["handleChange", "handleChangeCheckbox"]);
const links = toRef(props, "options");
const localOptions = ref<Option[]>([]);

const inputValue = computed(() => {
  return props.value
})

const inputValueCheckbox = computed({
  get: () => {
    return props.valueCheckbox;
  },
  set: (val) => {
    emits("handleChangeCheckbox", val);
  },
});


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
<style scoped>
.centered-input {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-checkbox {
  margin-right: 10px;
  margin-top: 25px;
}

.el-checkbox.is-bordered.is-checked .el-checkbox__inner {
  border-color: #409EFF;
  background-color: #409EFF;
  width: 54px;
  height: 54px;
}

.el-checkbox.is-bordered .el-checkbox__inner {
  border-color: #dcdfe6;
  background-color: #fff;
  width: 54px;
  height: 54px;
}

.el-checkbox .el-checkbox__label {
  font-size: 16px;
  line-height: 54px;
  margin-left: 8px;
}

</style>

