<template>
    <div class="mt-5 ps-0">
      <el-collapse
        v-model="activeTaskGroup"
        class="task-group general-accordion py-1 px-5 mb-3">
        <el-collapse-item title="Safety Precautions" name="Safety Precautions">
          <template v-for="(task, index) in tasks" :key="task.key">
            <div
              class="d-flex justify-content-start"
              :class="index == tasks.length - 1 ? 'mb-5' : ''">
              <div class="p-2">
                <NwImg src="/media/logos/bumaau/cautions.png" alt="cautions" />
              </div>
              <div class="p-2 bg-green flex-fill">
                <template v-if="task.items[1].taskType != 'html'">
                  {{ task.items[1].value }}
                </template>
                <template v-else>
                  <span ref="safetyPrecautinsHtml" v-html="contentHTML(task.items[1].value)"></span>
                </template>
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <PDFViewerDialog :show="previewPDF" @handle-close-modal="closePDF" :blob-url="pdfBlobUrl"/>
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  ref,
  onMounted,
} from 'vue'
import {
  ISafetyPrecautionTask
} from '@/core/types/intervention/ISafetyPrecautionTask'
import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue'
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string'

defineProps({
  tasks: {
    required: true,
    type: Array as PropType<ISafetyPrecautionTask[]>,
  }
})

const contentHTML = (string) => {
  return addSpanOnHyphen(string).replaceAll('{BLOB_URL}', import.meta.env.VITE_APP_BASE_URL_VERSIONING_DIGITAL)
}

/* refs */
const activeTaskGroup = ref('Safety Precautions')
const safetyPrecautinsHtml = ref<HTMLElement>()
const previewPDF = ref(false)
const pdfBlobUrl = ref('')

/* methods and handlers */
const closePDF = () => {
  previewPDF.value = false
}

/* life cycles */
onMounted(() => {
  try {
    if (!safetyPrecautinsHtml.value) return
    // const htmlElement = safetyPrecautinsHtml.value as HTMLElement
    // const showPDFArr = Array.from(htmlElement.getElementsByClassName('show-pdf')) as HTMLElement[]
    // showPDFArr.forEach((element) => {
    //   element.onclick = (event) => {
    //     event.preventDefault()
    //     previewPDF.value = true
    //     pdfBlobUrl.value = (element as HTMLAnchorElement).href
    //   }
    // })
  } catch (error) {
    console.log(error);
  }
})
</script>

<style lang="scss">
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}

.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}

.general-accordion {
  .el-collapse-item__content {
    padding-bottom: 10px;
    font-size: 15px;
  }
}
</style>
