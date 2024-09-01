<template>
  <h3 class="mt-3 border"></h3>
  <h3 class="mt-3">History Modified</h3>
  <div class="d-flex flex-row justify-content-between" v-if="history.detail.rating == 'MANUAL' || history.detail.rating == 'NORMAL'">
    <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
      <label>Task</label>
    </div>
    <div class="col text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
      <label>Measurement Location</label>
    </div>
    <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
      <label>Rating</label>
    </div>
    <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
    </div>
    <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
      Action
    </div>
  </div>
  <div class="d-flex flex-row justify-content-between" v-else>
    <template v-if="taskRating == TaskRatingEnum.OIL_COOLED">
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
        <label>Task</label>
      </div>
      <div class="col text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label>Measurement Location</label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label>Tool</label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label>A</label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label>B</label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label>Piston Movement (B-A)</label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label>UoM</label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label>Percent Worn</label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label>Rating</label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
        <label></label>
      </div>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
        Action
      </div>
    </template>
    <template>
      <div class="col-1 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
        <label>Task</label>
      </div>
      <div class="col text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-left: 1px solid rgba(145, 158, 171, 0.24);">
        <label>Measurement Location</label>
      </div>
      <div class="col text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24);">
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
      <div class="col-2 text-start px-2 py-2" style="background-color: rgb(249, 250, 251); border-top: 1px solid rgba(145, 158, 171, 0.24); border-right: 1px solid rgba(145, 158, 171, 0.24);">
        Action
      </div>
    </template>
  </div>
  <template v-for="(itemHistory, index) in history.detail.history" :key="itemHistory.key">
    <InlineTaskAdjustment v-if="itemHistory.cbmAdjustmentReplacementValue" :history="itemHistory" :item="itemHistory" :row="index" :max="history.detail.history.length"/>
    <InlineTask v-else :history="itemHistory" :items="itemHistory.items" :task="itemHistory" :row="index" :max="history.detail.history.length"/>
  </template>
</template>

<script lang="ts" setup>
import {
  defineProps,
  onMounted
} from 'vue'
import InlineTask from "./InlineTask.vue";
import InlineTaskAdjustment from './cbm-adjustment/InlineTask.vue';
import { TaskRatingEnum } from "@/core/types/entities/dma/e-form/Task"

const props = defineProps({
  history: {
    type: Object as any,
    required: true
  },
  taskRating: {
    required: false,
    default: ""
  },
  taskNo: {
    required: false,
    default: ""
  }
})


onMounted(async () => {
  console.log(props)
})

</script>
<style scoped>
.border {
  border-top: 1px solid #eff2f5;
}
</style>
