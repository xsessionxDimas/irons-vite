<template>
  <div class="report mb-4 prevent-split">
    <div class="report_section_header avoid">
      <h4 class="title ps-3">SMU Machine Acknowledgement</h4>
    </div>
    <div class="report_body">
      <div class="item my-2 avoid grid-template-defect-smu prevent-split">
          <div class="label vertical-center">
            Task Description
          </div>
          <div
            class="label vertical-center"
          >
            Status
          </div>
          <div
            class="label vertical-center"
          >
            Review Status
          </div>
        </div>
        <template v-for="item in headers" :key="item.id">
          <div class="item my-2 avoid prevent-split">
            <div class="grid-template-defect-smu my-2">
              <div class="label vertical-center">
                <span class="text-break defect-identified-task" v-html="formatSmuTitle(item.taskDesc)"></span>
              </div>
              <div class="label vertical-center">
                <span class="text-break defect-identified-task">
                </span>
              </div>
              <div class="vertical-center">
                <div
                  class="btn-detail px-3 label py-2 rounded text-center height-fit"
                  :class="formClass(item.id)"
                >
                  Detailed Information
                </div>
              </div>
            </div>
            <div class="text-end create-by">
              {{ timestamp }}
            </div>
          </div>
        </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import {
  useComponentInterventionDefectsStore
} from "@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore"
import {
  formatHtml,
  displayDesc
} from '@/core/helpers/manipulate-html-string'

/* stores */
const store = useComponentInterventionDefectsStore();

const headers = computed(() => {
  return store.ApprovalData.SMUDefectHeaders;
});

const formClass = (headerId: string): string => {
  let cssClass = "light-yellow color-dark-yellow";
  const header = headers.value.find((h) => {
    return h.id === headerId;
  });
  if (header) {
    switch (header.status) {
      case "Submited":
        cssClass = "light-yellow color-dark-yellow";
        break;
      case "Acknowledge":
        cssClass = "light-green color-dark-green";
        break;
    }
    if (header.priority === undefined) {
      cssClass = "light-green color-dark-green";
    }
  }
  return cssClass;
};
const statusRange = (description: string) => {
  const isInRange = !description.toLowerCase().includes("not")
  return isInRange
}
// based on when smu is revised
const timestamp = computed(() => {
  if (headers.value.length > 0) {
    const detail = store.ApprovalData.SMUDefectDetails.find((obj) => {
      return obj.defectHeaderId == headers.value[0].id
    }) ?? null
    if (detail) {
      return `${detail.updatedBy?.name || detail.createdBy.name}, ${detail.updatedDate != "" ? detail.updatedDate : detail.createdDate}`
    }
  }
  return ""
})

const formatSmuTitle = (headerTitle) => {
  const title = displayDesc(formatHtml(headerTitle))
  let result = title
  if (title.includes('-')) {
    result = title.split(' - ')[0]
  }
  return result
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
.grid-template-defect-smu {
  display: grid;
  grid-template-columns: 466px 213px 144.61px;
  grid-gap: 5px;
}
.height-fit {
  height: fit-content;
  margin: auto !important;
}
.horizontal-vertical-center {
  margin: auto !important;
}
.letter-space-hypen {
 letter-spacing: 1.5px;
}
</style>
