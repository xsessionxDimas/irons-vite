<template>
  <div class="report mb-4 prevent-split">
    <div class="report_section_header avoid prevent-split">
      <h4 class="title ps-3">{{ title }}</h4>
    </div>
    <div class="report_body">
      <div class="item grid-template-defect-comment my-2 avoid prevent-split">
        <div
          class="label vertical-center"
        >
          No
        </div>
        <div class="label vertical-center">
          Task Description
        </div>
        <div class="label vertical-center">Comments</div>
        <div
          class="label vertical-center"
        >
          Review Status
        </div>
      </div>
      <!-- items -->
      <template v-for="item in headers" :key="item.id">
        <div class="item my-2 avoid prevent-split">
          <div class="grid-template-defect-comment my-2">
            <!-- left -->
            <div
              class="label d-flex align-items-center"
            >
              {{ item.taskNo }}
            </div>
            <div class="label vertical-center">
              <span class="text-break defect-identified-task" v-html="displayDesc(formatHtml(item.taskDesc))"></span>
            </div>
            <div class="label vertical-center" style="overflow-wrap: break-word;">{{ item.commentValue }}</div>
            <template v-if="item.cbmNAStatus == 'Decline' || item.plannerCbmNAStatus == 'Decline'">
              <div class="vertical-center">
                <div
                  class="btn-detail px-3 label py-2 rounded text-center height-fit red-bg text-dark-red"
                >
                  Declined
                </div>
              </div>
            </template>
            <template v-else>
              <div class="vertical-center">
                <div
                  class="btn-detail px-3 label py-2 rounded text-center height-fit light-green color-dark-green"
                >
                  Detailed Information
                </div>
              </div>
            </template>
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
import {
  defineProps,
  PropType,
} from "vue";
import { Header } from "@/core/types/entities/dma/defects/Header";
import {
  formatHtml,
  displayDesc
} from '@/core/helpers/manipulate-html-string';

const props = defineProps({
  title: {
    required: true,
    type: String,
  },
  isDefect: {
    required: true,
    type: Boolean,
    default: true,
  },
  headers: {
    required: true,
    type: [] as PropType<Header[]>,
  },
});
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
  grid-template-columns: 60px 280px 279px 144.61px;
  grid-gap: 5px;
}
.horizontal-vertical-center {
  margin: auto !important;
}
.letter-space-hypen {
 letter-spacing: 1.5px;
}
</style>
