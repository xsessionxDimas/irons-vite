<template>
  <h3 class="mt-3 border"></h3>
  <h3 class="mt-3">History Modified</h3>
  <div class="d-flex flex-row justify-content-between">
    <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
      <label>Item</label>
    </div>
    <div class="col-2 col-lg-3 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
      <label>Measurement Location</label>
    </div>
    <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
      <label>Measurement Value</label>
    </div>
    <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
      <label>UoM</label>
    </div>
    <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
      <label>Rating</label>
    </div>
    <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
    </div>
    <div class="col-2 col-lg-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
      Action
    </div>
  </div>
  <template v-for="(itemHistory, historyIndex) in history.detail.history" :key="itemHistory.key">
    <InlineTask :history="itemHistory" :taskNo="taskNo" :items="itemHistory.items" :task="itemHistory" :row="historyIndex" :max="history.detail.history.length"/>
  </template>
</template>

<script lang="ts" setup>
import {
  defineProps
} from 'vue'
import InlineTask from "./InlineTask.vue";

defineProps({
  history: {
    type: Object as any,
    required: true
  },
  taskNo: {
    required: true
  }
})
</script>
<style scoped>
.border {
  border-top: 1px solid #eff2f5;
}
</style>
