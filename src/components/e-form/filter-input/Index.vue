<template>
  <SelectSearch
  :data="optionsList"
  :display-label="true"
  :placeholder="dropDownPlaceholder"
  @on-selected="handleSelectFitter"
  />
</template>
<script lang="ts" setup>
import { Option } from "@/core/types/misc/Option";
import {
  defineProps,
  defineEmits,
  PropType,
  computed
} from "vue"
import SelectSearch from "@/components/inputs/dma/SelectSearch.vue"

// -------- DATA FROM PARENT ---------
const props = defineProps({
  dropDownPlaceholder: {
    type: String,
    default: "select"
  },
  options: {
    type: Array as PropType<Option[]>
  },
})

const emits = defineEmits(['handle-select-fitter'])

// -------- COMPUTED ---------
const optionsList = computed(() => {
  return props.options as Option[]
})


// ---------- FUNCTIONS ----------
const handleSelectFitter = (val) => {
  emits("handle-select-fitter", val.value)
}
</script>

<style lang="scss">
.filter-dropdown {
  .is-focus {
    .el-input__inner {
      border-color: #18AF4A !important;

      &:focus {
        border-color: #18AF4A !important;
      }
    }
  }

  .el-input__inner {
    &:focus {
      border-color: #18AF4A !important;
    }
  }
}
</style>
<style lang="scss">
@import "@/assets/sass/pages/intervention-label.scss";
</style>

<style lang="scss">
.filter-input {
  .el-input__inner{
    color: transparent;
  }
  .el-input__custom-option{
    color: #606266;
    padding-left: 15px;
  }
}
</style>
