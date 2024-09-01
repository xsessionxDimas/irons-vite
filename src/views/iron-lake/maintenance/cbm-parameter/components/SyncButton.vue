<template>
  <button
    class="d-flex gap-2 align-items-center btn btn-btech-outline px-4 py-2"
    @click="onClick"
  >
    <icon name="reload" size="24" />
    Sync
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import Icon from "@/components/ironlake/Icon.vue";

const emit = defineEmits(["handleSync"]);
const onClick = () => {
  emit("handleSync");
};
</script>

<style scoped>
.btn-btech-outline {
  border: 1.5px solid #01a3ff !important;
  color: #01a3ff;
}
.btn-btech-outline:hover {
  background-color: #01a3ff;
  color: #fff;
}
</style>
