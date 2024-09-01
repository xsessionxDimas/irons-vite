<template>
  <label :for="fieldId" class="checkbox-input">
    <input type="checkbox" :checked="checked" :id="fieldId"
      @change="(event) => handleChecked(event)" />
    {{ label }}
  </label>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(['update:checked'])
defineProps({
  label: {
    type: String
  },
  fieldId: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
  },
})

const handleChecked = (event) => {
  emit('update:checked', event.target.checked)
}
</script>

<style scoped lang="scss">
.checkbox-input {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
