<template>
  <div class="report mb-4">
    <div class="report_section_header">
      <h4 class="title ps-3">Safety Precautions</h4>
    </div>
    <div class="report_body">
      <template v-for="(task, index) in data" :key="task.key">
        <div
          class="d-flex justify-content-start avoid"
          :class="index == data.length - 1 ? 'mb-5' : ''"
        >
          <div class="p-2">
            <img :src="image" alt="cautions" />
          </div>
          <div class="p-2 bg-green flex-fill" v-html="contentHTML(task.items[1].value)"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from "vue";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import { formatHtml } from "@/core/helpers/manipulate-html-string"

const props = defineProps({
  data: {
    required: true,
    type: Array as PropType<Task[]>,
  },
});
const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFESURBVHgBrZTbUcMwEEVXsgPJ5EclhA6gAqQO3IHTAXRgqIASCB1ABVaGAlJCUoJ/iMNAtKwfM7ZAjzBwPyzN+mrnWFcyg4iwFAL4W07TCsz8hamqCvlTiCmpHwF51s55rempQnYOQbrJEhCyUUlimcrQGhZsuD7f0rD4Vt6BmV35Pt1LiK/TwtEMutr+Fn5DiOV0Adxs6LXwrKOAZhcuSjchN3dWM8QVGHwaOQQk+wc4hbCjw61lun5vfbSnaJnNUTH1qcOEHEs4VTwpfpTAoqNj4g7CJ4nrST4usKFZcyPqjbMhoz3ExstyR1MroIEwPdyAjw7Z0tOskRgfo26zHUFYMnjfjpwVHgdRMjrsh12f3tkqQOBP2ZYmn2JEJ6PJxgl731HR38bIyJWONxqMkkLhGv5N+NyHMr8E+MjgT+KaQtFfrQR4Lk7yuiQAAAAASUVORK5CYII='
const data = computed(() => {
  return props.data;
});
const contentHTML = (string) => {
  return formatHtml(string).replaceAll('{BLOB_URL}', import.meta.env.VITE_APP_BASE_URL_VERSIONING_DIGITAL)
}
</script>
<style lang="scss" scoped>
.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}
</style>
