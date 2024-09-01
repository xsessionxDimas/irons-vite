<template>
  <div class="form-floating mb-3 dma-password-container" :class="isError">
    <input :autocomplete="placeholder" :type="type" class="form-control" :placeholder="placeholder" maxlength="6" v-model="inputValue" @keypress="onlyNumber" pattern="[0-9]*" inputmode="numeric"/>
    <label for="floatingInput2">{{ placeholder }}</label>
    <img src="/media/svg/dma/icons/eye.svg" alt="show password" class="fa-eye" @click="toggleShowPassword">
  </div>
  <template v-if="isLoading">
    <div class="d-flex align-items-center mb-3">
      <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <span>checking PIN...</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import {
  defineProps,
  ref,
  defineEmits,
  computed,
  PropType
} from 'vue'
import { PinInput } from "@/core/types/entities/dma/pin/PinInput";

const props = defineProps({
  placeholder: {
    type: String,
    default: 'input'
  },
  value: {
    required: true,
    type: Object as PropType<PinInput>
  },
  isLoading: {
    default: false
  }
})
const emits = defineEmits(['changeVal'])
const type = ref('password')

const inputValue = computed({
  get: () => {
    return props.value.value
  },
  set: (val) => {
    emits('changeVal', val)
  }
})

const isError = computed(() => {
  if (props.value.isError) {
    return 'error'
  }
  return ''
})

const toggleShowPassword = () => {
  if (type.value == 'password') {
    type.value = 'text'
  } else {
    type.value = 'password'
  }
}

const onlyNumber = ($event) => {
  let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
  if ((keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
}
</script>

<style scoped lang="scss">
.dma-password-container {
  position: relative;
  // width: 300px;

  input[type="password"], input[type="text"] {
    width: 100%;
    // padding: 12px 36px 12px 12px;
    box-sizing: border-box;
  }

  label {
    font-weight: 400
  }

  .fa-eye {
    position: absolute;
    top: 28%;
    right: 1rem;
    color: #212B36;
    font-size: 24px;

    &:hover {
      cursor: pointer;
    }
  }

  &.error {
    input[type="password"], input[type="text"] {
      border: 2px solid #FF4842
    }

    label {
      color: #FF4842;
    }
  }
}
</style>
