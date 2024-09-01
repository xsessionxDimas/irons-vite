<template>
  <div class="ps-0 mt-3">
    <Textarea
      :value="propertyValue"
      :label="propertyName"
      name="InstructionPlaceholder"
      :disabled="isDisabled"
      @handleChange="handleChange"
    ></Textarea>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
} from 'vue';
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from '@/core/types/misc/TextareaParam'

const props = defineProps({
  propertyValue: {
    type: String,
    required: true
  },
  propertyName: {
    type: String,
    required: false,
    default: ''
  },
  isDisabled: {
    type: Boolean,
    required: false,
    default: false
  }
});

const emits = defineEmits(['onInputChanged'])

const handleChange = (e : TextareaParam) => {
  emits("onInputChanged", e.value)
}

</script>

  <style lang="scss">
  .service-sheet-input {
    .el-input__inner {
      border-right: 0px;
    }
    .el-input-group__append {
      background-color: transparent;
      border-left: 0px;
    }
  }

  .e-form-container {
    .el-input {
      .el-input__inner::placeholder {
        font-size: 0.69rem;
      }
    }
    @media (max-width:900px) {
      .eform-table-row {
        .el-input {
          .el-input__inner::placeholder{
            font-size: 0.72rem;
          }
        }
      }
    }
  }
  </style>

<style lang="scss" scoped>
@import "@/assets/sass/pages/floating-label.scss";
</style>

