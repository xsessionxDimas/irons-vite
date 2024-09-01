<template>
  <div class="d-flex align-items-center position-relative my-0">
    <input
      type="text"
      v-model="inputValue"
      class="form-control form-control-solid ps-15 bg-white rounded"
      :placeholder="placeholder? placeholder: translate('SEARCHANY', t, te)"
      @keyup="handleKeyUp"
   />
  </div>
</template>

<style lang="scss" scoped>
  .form-control {
    border-color: #dcdfe6;
  }
  .form-control:hover {
    border-color: var(--el-color-text-placeholder);
}
</style>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { translate } from "@/core/helpers/language"
import { useI18n } from "vue-i18n"

export default defineComponent({
  props: {
    queryInput: {
      required: true,
      type: String
    },
    placeholder: {
      required: false,
      type: String
    }
  },
  emits: ['handleFilter', 'handleFilterbyEnter'],
  setup(props, { emit }) {
    const { t, te } = useI18n()
    // computeds start
    const inputValue = computed({
      get: () => {
        return props.queryInput
      },
      set: (val) => {
        emit('handleFilter', val)
      }
    })

    const handleKeyUp = (e) => {
      if (e.key == 'Enter') {
        emit('handleFilterbyEnter', inputValue)
      }
    }

    return {
      inputValue,
      handleKeyUp,
      translate,
      t,
      te
    }
  },
})
</script>

