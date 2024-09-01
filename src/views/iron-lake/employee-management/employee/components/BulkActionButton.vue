<template>
  <button class="btn btn-btech-outline" @click="onClick">
    <span class="svg-icon svg-icon-2x">
      <icon name="upload" size="24" />
    </span>
    Upload Bulk
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from "vue"
import Icon from "@/components/ironlake/Icon.vue"
import 

const emit = defineEmits(["handleUpload"])
const onClick = () => {
  emit("handleUpload")
}
</script>

<style scoped></style>
