<template>
  <div class="report mb-4 prevent-split">
    <div class="report_section_header avoid">
      <h4 class="title ps-3">Component Condition Data</h4>
    </div>
    <div class="report_body">
      <div class="item grid-template-defect-comment my-2 avoid prevent-split">
        <div class="label vertical-center">No</div>
        <div class="label vertical-center">Task Description</div>
        <div class="label vertical-center">Comments</div>
        <div class="label vertical-center text-center">
          Rating
        </div>
        <div class="label vertical-center">
          Review Status
        </div>
      </div>
      <!-- items -->
      <template v-for="(item) in headers" :key="item.id">
        <div class="item my-2 avoid prevent-split">
          <div class="grid-template-defect-comment my-2">
            <!-- left -->
            <div class="label d-flex align-items-center">{{ displayTaskNoCBM((item.taskNo as string).replace(';', ''))
              }}</div>
            <div class="label vertical-center defect-identified-task"
              v-html="displayDescCBM(formatHtml(item.taskDesc).split(';').length > 3 ? formatHtml(item.taskDesc)?.split(';')[2] : formatHtml(item.taskDesc), (item.taskNo as string).replace(';', ''))">
            </div>
            <div class="label vertical-center" style="overflow-wrap: break-word;">{{ item.commentValue }}</div>
            <!-- rating -->
            <div class="horizontal-vertical-center d-flex">
              <div class="little-box red d-flex justify-content-center align-items-center"
                :class="cbmValColor(item.taskValue)">
                <span style="font-weight:600; color:white">{{ item.taskValue }}</span>
              </div>
              <template v-if="item.correctedValue">
                <div class="little-box red d-flex justify-content-center align-items-center ms-1"
                  :class="cbmValColor(item.correctedValue)">
                  <span style="font-weight:600; color:white">{{ item.correctedValue }}</span>
                </div>
              </template>
            </div>
            <div class="label vertical-center d-flex">
              <div class="btn-detail px-3 label py-2 rounded text-center height-fit light-green color-dark-green">
                Detailed Information
              </div>
            </div>
          </div>
          <div class="text-end create-by">
            {{ item.createdBy.name }}, {{ item.updatedDate != "" ? item.updatedDate : item.createdDate }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType, ref } from "vue";
import { Header } from "@/core/types/entities/dma/defects/Header";
import {
  displayTaskNoCBM,
  displayDescCBM,
  formatHtml
} from '@/core/helpers/manipulate-html-string'

const props = defineProps({
  headers: {
    required: true,
    type: [] as PropType<Header[]>
  }
});

const loader = ref<Array<boolean>>([]);

props.headers.forEach(() => {
  loader.value.push(false);
});

const cbmValColor = (val) => {
  let color = ''
  switch (val) {
    case "A":
      color = "green"
      break;
    case "B":
      color = "blue"
      break;
    case "X":
      color = "red"
      break;
    case "C":
      color = "gold"
      break;
    default:
      break;
  }
  return color
}

</script>
<style lang="scss">
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}

.vcp__body {
  overflow: inherit !important;
}
</style>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";

.grid-template-defect-comment {
  display: grid;
  grid-template-columns: 60px 210px 210px 144.61px 158px;
  grid-gap: 5px;
}

.horizontal-vertical-center {
  margin: auto !important;
}

.letter-space-hypen {
  letter-spacing: 1.5px;
}
</style>
