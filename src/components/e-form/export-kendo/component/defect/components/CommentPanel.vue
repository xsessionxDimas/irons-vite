<template>
  <div class="report mb-4 prevent-split">
    <div class="report_section_header avoid">
      <h4 class="title ps-3">Comments</h4>
    </div>
    <div class="report_body">
      <div class="item grid-template-defect-comment-section my-2 avoid prevent-split">
        <div class="label vertical-center">No</div>
        <div class="label vertical-center">Task Description</div>
        <div class="label vertical-center">
          Comments
        </div>
      </div>
      <!-- items -->
      <template v-for="(item) in headers" :key="item.id">
        <div class="item my-2 avoid prevent-split">
          <div class="grid-template-defect-comment-section my-2">
              <!-- left -->
              <div class="label d-flex align-items-center">{{ item.taskDesc.split(';')[0] }}</div>
              <div class="label vertical-center">
                <span class="text-break defect-identified-task" v-html="displayDesc(formatHtml(item.taskDesc), isIntervention)"></span>
              </div>
              <div class="label vertical-center">
                <span class="text-break">{{ item.taskComment }}</span>
              </div>
          </div>
          <div class="text-end create-by" v-if="item.updatedBy && item.updatedDate">
            {{ item.updatedBy?.name }}, {{ item.updatedDate }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from "vue";
import { Comment } from "@/core/types/entities/dma/defects/Comment";
import {
  formatHtml,
  displayDesc
} from '@/core/helpers/manipulate-html-string';

defineProps({
  headers: {
    required: true,
    type: [] as PropType<Comment[]>
  },
  isIntervention: {
    required: false,
    type: Boolean,
    default: false
  }
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
.grid-template-defect-comment-section {
  display: grid;
  grid-template-columns: 60px 389px 389px;
  grid-gap: 5px;
}
.horizontal-vertical-center {
  margin: auto !important;
}
.letter-space-hypen {
 letter-spacing: 1.5px;
}
</style>
