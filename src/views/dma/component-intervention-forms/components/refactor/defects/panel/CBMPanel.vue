<template>
  <div class="mt-5 ps-0">
    <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="cbmCollapse">
      <el-collapse-item :title="titlePanel" :name="titlePanel">
        <div class="row px-2 item mx-1 w-100 defect-panel-header">
          <div
            class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">
            Task</div>
          <div class="col align-items-center d-flex text-break">Task Description</div>
          <div class="col align-items-center d-flex text-break">Comments</div>
          <div
            class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent align-items-center d-flex justify-content-center">
            Rating</div>
          <div
            class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
            Review Status</div>
        </div>
        <template v-if="headers.length < 1">
          <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
            <p style="text-align: center;">No data recorded</p>
          </div>
        </template>
        <template v-else v-for="item in headers" :key="item.id">
          <div class="item px-2 my-2 mx-1">
            <div class="row flex-nowrap px-2 my-2 item mx-1 w-100">
              <div
                class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">
                {{ displayTaskNoCBM((item.taskNo as string).replace(';', '')) }}</div>
              <div class="col align-items-center d-flex text-break">
                <span class="text-break defect-identified-task"
                  v-html="displayDescCBM(item.taskDesc.split(';').length > 3 ? item.taskDesc?.split(';')[2] : item.taskDesc, (item.taskNo as string).replace(';', ''))"></span>
              </div>
              <div class="col align-items-center d-flex text-break">
                <span class="text-break">{{ item.commentValue }}</span>
              </div>
              <div
                class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent align-items-center d-flex justify-content-center">
                <div class="little-box d-flex justify-content-center align-items-center px-2"
                  :class="cbmValColor(item.taskValue)">
                  <span style="font-weight:600; color:white">{{ item.taskValue }}</span>
                </div>
                <template v-if="item.correctedValue">
                  <div class="little-box d-flex justify-content-center align-items-center px-2 ms-1"
                    :class="cbmValColor(item.correctedValue)">
                    <span style="font-weight:600; color:white">{{ item.correctedValue }}</span>
                  </div>
                </template>
              </div>
              <div
                class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                <div
                  class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                  :class="detailInfoClassIntervention(item.id as string, defectHeader, 'cbmNAStatus', 'plannerCbmNAStatus', defectStatus)"
                  @click.prevent="showDetail(item)">
                  Detailed Information
                </div>
              </div>
            </div>
            <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
              {{ item.createdBy.name }}, {{ item.updatedDate && item.updatedDate != "" ? item.updatedDate :
      item.createdDate }}
            </div>
          </div>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  ref,
  defineEmits,
  toRef
} from 'vue'
import { Defect } from '@/database/schema/Defect'
import {
  displayTaskNoCBM,
  displayDescCBM
} from '@/core/helpers/manipulate-html-string'
import {
  checkIsAdditionalTask
} from '@/store/pinia/dma/component-intervention/helper'
import { cbmValColor } from '@/core/helpers/ironforms/defects-form/cbm-helper'
import { detailInfoClassIntervention } from '@/store/pinia/dma/e-form/helpers'

const props = defineProps({
  defectHeader: {
    required: true,
    type: [] as PropType<Defect[]>
  },
  isAdditionalTask: {
    required: false,
    type: Boolean,
    default: false
  },
  defectStatus: {
    required: false,
    type: String,
    default: ''
  }
});

const emits = defineEmits(["onViewDetailInformation"])

/* stores */
const titlePanel = ref(props.isAdditionalTask ? 'Component Condition Data (Additional Task)' : 'Component Condition Data')
const cbmCollapse = ref(titlePanel.value)
const cbmHeaders = toRef(props, "defectHeader")

const headers = computed(() => {
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

const showDetail = (item: Defect) => {
  emits("onViewDetailInformation", {
    type: 'cbm',
    taskId: item.taskId as string,
    taskNo: item.taskNo,
    taskDesc: item.taskDesc
  })
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

.letter-space-hypen {
  letter-spacing: 1.5px;
}

.testing {
  .el-collapse-item__header {
    min-height: min-content;
    height: fit-content;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";
</style>
