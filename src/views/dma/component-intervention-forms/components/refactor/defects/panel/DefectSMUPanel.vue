<template>
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="defectIdentifiedCollapse">
        <el-collapse-item :title="titlePanel" :name="titlePanel">
                <!-- items -->
                <!-- items header -->
                <div class="row px-2 item mx-1 w-100 defect-panel-header">
                  <div class="col align-items-center d-flex text-break">Task Description</div>
                  <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Status</div>
                  <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
                </div>
                <!-- items data -->
                <template v-if="headers.length < 1">
                  <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                    <p style="text-align: center;">No data recorded</p>
                  </div>
                </template>
                <template v-else v-for="item in headers" :key="item.id">
                  <div class="item px-2 my-2 mx-1">
                    <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                      <div class="col align-items-center d-flex text-break">
                        <span class="text-break defect-identified-task" v-html="formatSmuTitle(item.taskDesc)"></span>
                      </div>
                      <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">
                      </div>
                      <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                        <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                          :class="detailInfoClass(item.defectHeaderId as string, headers)"
                          @click="acknowledge(item)">
                          Detailed Information
                        </div>
                      </div>
                    </div>
                    <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                      {{ timestamp }}
                    </div>
                  </div>
                </template>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>


<script lang="ts" setup>
import {
  defineProps,
  computed,
  ref,
  PropType,
  defineEmits
} from 'vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { Defect } from '@/database/schema/Defect'
import { isUndefined } from 'lodash'

const props = defineProps({
  defectHeader: {
    required: true,
    type: Object as PropType<Defect[]>
  },
  supervisor: {
    required: false,
    type: Boolean,
    default: true
  },
  // viewIsDownload: {
  //   required: false,
  //   type: Boolean,
  //   default: false
  // },
})

const emits = defineEmits(["onViewDetailInformation"])

/* refs */
const titlePanel = ref('SMU Machine Acknowledgement')
const defectIdentifiedCollapse = ref(titlePanel.value)

/* computeds */
const headers = computed(() => {
  return props.defectHeader
})
const statusRange = (description: string) => {
  const isInRange = !description.toLowerCase().includes("not")
  return isInRange
}
const detailInfoClass = (headerId: string, headers: Defect[]) => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.defectHeaderId === headerId
  })
  if (props.supervisor) {
    if (header) {
      switch (header.status) {
        case "Submited":
          cssClass = "light-yellow color-dark-yellow"
          break
        case "Acknowledge":
          cssClass = "light-green color-dark-green"
          break
      }
    }
  } else {
    if (!isUndefined(header!.plannerStatus) && header!.plannerStatus) {
      cssClass = "light-green color-dark-green"
    }
  }
  return cssClass
}
/* methods */
const acknowledge = (item: Defect) => {
  emits("onViewDetailInformation", {
    type: 'machineSMU',
    smuDetail: JSON.parse(item.defectData),
    approvalSPVData: {
      approvedDate: item.approvedDate,
      approvedBy: item.approvedBy,
      status: item.status,
    }
  })
}

const formatSmuTitle = (headerTitle) => {
  const title = displayDesc(headerTitle)
  let result = title
  if (title.includes('-')) {
    result = title.split(' - ')[0]
  }
  return result
}

const timestamp = computed(() => {
  if (props.defectHeader?.length > 0) {
    const defectDataSMU = JSON.parse(props.defectHeader[0].defectData)
    return `${defectDataSMU.updatedBy?.name || defectDataSMU.createdBy.name}, ${defectDataSMU.updatedDate != "" ? defectDataSMU.updatedDate : defectDataSMU.createdDate}`
  }
  return ""
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
.defect-panel-header, .defect-panel-task {
  .flex-basis-80 {
    flex-basis: 80px;
  }
  .download-icon {
    cursor: pointer;
    &.icon-{
      &red {
      filter: invert(16%) sepia(51%) saturate(7200%) hue-rotate(355deg) brightness(98%) contrast(118%);
      }
      &green {
        filter: invert(74%) sepia(57%) saturate(6500%) hue-rotate(103deg) brightness(93%) contrast(81%);
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";
</style>
