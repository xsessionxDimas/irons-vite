<template>
  <div class="mt-5 ps-0">
    <el-collapse
      v-model="activeTaskGroup"
      class="task-group general-accordion py-1 px-5 mb-3"
    >
      <el-collapse-item title="Safety Precautions" name="Safety Precautions">
        <template v-for="(task, index) in data" :key="task.key">
          <div
            class="d-flex justify-content-start"
            :class="index == data.length - 1 ? 'mb-5' : ''"
          >
            <div class="p-2">
              <img src="/media/logos/bumaau/cautions.png" alt="cautions" />
            </div>
            <div class="p-2 bg-green flex-fill">
              <template v-if="task.items[1].taskType != 'html'">
                {{ task.items[1].value }}
              </template>
              <template v-else>
                <span ref="safetyPrecautinsHtml" v-html="contentHTML(task.items[1].value)"></span>
              </template>
            </div>
            <!-- <span ref="html" v-html="html"></span> -->
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
  onMounted
} from "vue";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import PDFViewerDialog from '@/components/e-form/PDFViewerDialog.vue'
import { addSpanOnHyphen } from "@/core/helpers/manipulate-html-string";

defineProps({
  data: {
    required: true,
    type: Array as PropType<Task[]>,
  },
});

const activeTaskGroup = ref('Safety Precautions')
// const html = "Always follow the isolation procedure <a class='show-pdf' href='https://digitaluatbumaausta001.blob.core.windows.net/utility/DMA/BA-SE-P38' target='_blank'>(BA-SE-P38)</a> and attach your Personal Lock / Tag* and lock out the controls while equipment is being serviced or repaired. Use appropriate PPE for tasks performed."

const safetyPrecautinsHtml = ref(null) as any
const pdfBlobUrl = ref('')

const previewPDF = ref(false)

const closePDF = () => {
  previewPDF.value = false
}

const contentHTML = (string) => {
  return addSpanOnHyphen(string).replaceAll('{BLOB_URL}', process.env.VUE_APP_BASE_URL_VERSIONING_DIGITAL)
}

onMounted(() => {
  try {
    if (safetyPrecautinsHtml.value) {
      Array.from(safetyPrecautinsHtml.value).forEach((safetyEl: any) => {
        const showPDFArr = Array.from(safetyEl.getElementsByClassName('show-pdf')) as HTMLAnchorElement[]
        showPDFArr.forEach((element) => {
          element.onclick = (event) => {
            event.preventDefault()
            previewPDF.value = true
            pdfBlobUrl.value = element.href
          }
        });
      })
    }
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
