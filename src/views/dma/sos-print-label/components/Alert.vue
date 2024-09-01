<template>
  <div
    class="custom-alert mb-3"
    :style="alertStyle"
  >
    <div class="d-flex flex-row align-items-center">
      <img :src="iconAlert" class="me-2" style="height: 18px" alt="icon">
      <p class="mb-0 ms-2 me-auto">{{ message }}</p>
      <img
        v-if="closable"
        src="media/svg/dma/close.svg"
        class="ms-4 pointer"
        style="height: 11px"
        alt="icon"
        @click="closeAlert"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed
} from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'success'
  },
  message: {
    type: String,
    required: true
  },
  closable: {
    type: Boolean,
    required: false,
    default: true
  },
  width: {
    type: String,
    required: false,
    default: '595px'
  }
})
const emit = defineEmits(['close']);

const backgroundColor = computed(() => {
  switch (props.type) {
    case 'error':
      return '#FFEDEC';
    case 'warning':
      return '#FFF3CD';
    default:
      return '#DDF7D5';
  }
})
const borderColor = computed(() => {
  switch (props.type) {
    case 'error':
      return '#FF918E';
    case 'warning':
      return '#FFDA6A';
    default:
      return '#74CF92';
  }
})
const iconAlert = computed(() => {
  switch (props.type) {
    case 'error':
      return 'media/svg/dma/error.svg';
    case 'warning':
      return 'media/svg/dma/warning.svg';
    default:
      return 'media/svg/dma/green-checklist.svg';
  }
})
const alertStyle = computed(() => {
  return {
    'background-color': backgroundColor.value,
    'border': `1px solid ${borderColor.value}`,
    'width': `${props.width}`
  }
})

const closeAlert = () => {
  emit('close', true);
}
</script>

<style lang="scss">
.custom-alert {
  padding: 12px;
  border-radius: 8px;
}
.pointer {
  cursor: pointer;
}
</style>
