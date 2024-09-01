<template>
  <div class="radio-input">
    <input type="radio" v-model="inputValue" :id="value" :name="name" :value="value" :disabled="disabled"
      :required="required">
    <label :for="value" class="text-medium">{{ placeholder }}</label>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    required: true
  }
})

const emits = defineEmits(["handleChange"]);
const inputValue = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emits("handleChange", val);
  },
});
</script>

<style scoped lang="scss">
.radio-input {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
