<template>
  <div class="report mb-4 prevent-split">
    <div class="report_section_header avoid prevent-split">
      <h4 class="title ps-3">Component Condition Data {{ isAdditionalTask ? '(Additional Task)' : '' }}</h4>
    </div>
    <div class="report_body">
      <div class="item grid-template-defect my-2 avoid prevent-split">
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
      <template v-for="(item) in headersFinalList" :key="item.id">
        <div class="item my-2 avoid prevent-split">
          <div class="grid-template-defect my-2">
            <!-- left -->
            <div class="label vertical-center d-flex align-items-center">{{ displayTaskNoCBM((item.taskNo as
        string).replace(';', '')) }}</div>
            <div class="label vertical-center defect-identified-task"
              v-html="displayDescCBM(formatHtml(item.taskDesc).split(';').length > 3 ? formatHtml(item.taskDesc)?.split(';')[2] : formatHtml(item.taskDesc), (item.taskNo as string).replace(';', ''))">
            </div>
            <div class="label vertical-center">{{ item.commentValue }}</div>
            <!-- rating -->
            <div class="horizontal-vertical-center d-flex">
              <div class="little-box d-flex justify-content-center align-items-center"
                :class="cbmValColor(item.taskValue)">
                <span style="font-weight:600; color:white">{{ item.taskValue }}</span>
              </div>
              <template v-if="item.correctedValue">
                <div class="ms-1 little-box d-flex justify-content-center align-items-center px-2 ms-1"
                  :class="cbmValColor(item.correctedValue)">
                  <span style="font-weight:600; color:white">{{ item.correctedValue }}</span>
                </div>
              </template>
            </div>
            <div class="vertical-center">
              <div class="btn-detail px-3 label py-2 rounded text-center height-fit light-green color-dark-green">
                Detailed Information
              </div>
            </div>
          </div>
          <div class="text-end create-by">
            {{ item.createdBy.name }}, {{ item.updatedDate }}
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
  computed,
  toRef
} from "vue";
import { Header } from "@/core/types/entities/dma/defects/Header";
import {
  checkIsAdditionalTask
} from "@/store/pinia/dma/component-intervention/helper";
import {
  displayTaskNoCBM,
  displayDescCBM,
  formatHtml
} from '@/core/helpers/manipulate-html-string'

const props = defineProps({
  headers: {
    required: true,
    type: [] as PropType<Header[]>
  },
  isAdditionalTask: {
    required: false,
    type: Boolean,
    default: false
  },
});

const cbmHeaders = toRef(props, "headers");

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

const headersFinalList = computed(() => {
  const defectHeaderList = cbmHeaders.value
  if (props.isAdditionalTask) {
    return defectHeaderList.filter((val) => {
      return checkIsAdditionalTask(val.taskDesc)
    })
  } else {
    return defectHeaderList.filter((val) => {
      return !checkIsAdditionalTask(val.taskDesc)
    })
  }
})

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

.grid-template-defect {
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
