<template>
  <div :class="`dma--textarea-wrapper ${disabled && 'disabled'} form-control avoid prevent-split`">
    <label :class="labelClass" v-html="label" v-if="!disableFloating"></label>
    <textarea ref="dmaTextarea" :name="name" :class="[textClass, disableFloatingClass]" :placeholder="placeholder"
      v-model="inputValue" :disabled="disabled"></textarea>
  </div>
  <div class="mt-2" v-if="!isValid && !disabled">
    <label class="error-label">{{ errorMessage }}</label>
  </div>
</template>

<script lang="ts" setup>
import { TextareaParam } from "@/core/types/misc/TextareaParam";
import {
  defineProps,
  defineEmits,
  computed
} from "vue";

const emits = defineEmits(["handleChange"]);
const props = defineProps({
  labelClass: {
    type: String,
    default: 'dma--textarea-label'
  },
  textClass: {
    type: String,
    default: 'dma--textarea-input h-100px'
  },
  gridClass: {
    required: false,
    type: String,
    default: ""
  },
  max: {
    type: Number,
    default: 524288
  },
  index: {
    type: Number,
  },
  value: {
    required: true,
    type: String,
  },
  errorMessage: {
    required: false,
    type: String,
    default: "",
  },
  isValid: {
    required: false,
    type: Boolean,
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
    default: ""
  },
  disabled: {
    default: false
  },
  isLoading: {
    required: false,
    type: Boolean,
    default: false,
  },
  disableFloating: {
    required: false,
    type: Boolean,
    default: false
  }
});
const inputValue = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    const param = {} as TextareaParam
    if (props.index != undefined) {
      param.index = props.index
    }
    param.value = val
    emits("handleChange", param);
  },
});
const disableFloatingClass = computed(() => {
  return props.disableFloating ? "dma--textarea-input-disable" : "";
});
</script>

<style lang="scss">
@import "@/assets/sass/typography/_custom-typography-variables.scss";

.dma--textarea-wrapper {
  position: relative;
  padding: 1rem 0 0 0.75rem;

  &.disabled {
    background-color: #eff2f5;
  }
}

.dma--textarea-label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.75rem 1rem;
  color: #212B36;
  font-size: 15px;
}

.dma--textarea-input {
  width: 100%;
  margin-top: 1.5rem;
  border: none;
  color: #212B36;
  font-size: 15px;

  &:focus-visible,
  &:focus {
    border: none !important;
    outline: none !important;
  }

  &:disabled {
    background-color: #eff2f5;
  }
}

.error-label {
  color: #FF4842;
  font-size: 12px;
  font-weight: 400;
}

.dma--textarea-input-disable {
  margin-top: initial !important;
}
</style>
