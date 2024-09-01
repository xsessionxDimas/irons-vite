<template>
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="defectIdentifiedCollapse">
        <el-collapse-item :title="titlePanel" :name="titlePanel">
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
            <div class="col align-items-center d-flex text-break">Task Description</div>
            <div class="col align-items-center d-flex text-break">Comments</div>
            <div class="col column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-end pe-16">Review Status</div>
            <!-- <div class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent align-items-center d-flex justify-content-center"></div>
            <div class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Confirmed</div> -->
          </div>
          <template v-if="headers.length < 1">
            <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
              <p style="text-align: center;">No data recorded</p>
            </div>
          </template>
          <template v-else v-for="(item) in headers" :key="item.id">
            <div class="item px-2 my-2 mx-1">
              <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ item.taskNo?.replace(';', '') }}</div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc ?? '', true)"></span>
                </div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break">{{ item.commentValue }}</span>
                </div>
                <div class="col d-flex justify-content-end column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center">
                  <template v-if="item.cbmNAStatus == 'Decline'">
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                      @click="showDetail(item)">
                      Declined
                    </div>
                  </template>
                  <template v-else>
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                      :class="item.cbmNAStatus == 'Confirmed'? 'light-green color-dark-green': 'light-yellow color-dark-yellow'"
                      @click.prevent="showDetail(item)">
                      Detailed Information
                    </div>
                  </template>
                </div>
                <!-- <div class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent align-items-center d-flex justify-content-center"></div>
                <div class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent justify-content-center align-items-center d-flex">
                  <div class="mx-10 little-box rounded-circle d-flex justify-content-center align-items-center flex-fill cbm-confirm-checkbox flex-column"
                    :class="'not-allowed'">
                    <div class="little-dot" v-if="isNotConfirmed(item)"></div>
                    <img src="/media/svg/dma/icons/Check.png" style="width:28px" alt="" v-if="!isNotConfirmed(item)" />
                  </div>
                </div> -->
              </div>
              <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                {{ item.createdBy.name }}, {{ item.updatedDate && item.updatedDate != "" ? item.updatedDate : item.createdDate }}
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
  PropType,
  ref,
  computed,
  defineEmits
} from 'vue'
import { Defect } from '@/database/schema/Defect'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import {
  checkIsAdditionalTask
} from "@/store/pinia/dma/component-intervention/helper";

const props = defineProps({
  defectHeader: {
    required: true,
    type: [] as PropType<Defect[]>
  },
  isAdditionalTask: {
    required: false,
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(["onViewDetailInformation"])

/* stores */
const titlePanel = ref(props.isAdditionalTask ? 'Not Applicable Item Check (Additional Task)' : 'Not Applicable Item Check')
const defectIdentifiedCollapse = ref(titlePanel.value)


const sortDecline = (a, b) => {
  const ADeclineStatus = Boolean(a.declineReason)
  const BDeclineStatus = Boolean(b.declineReason)
  if (ADeclineStatus < BDeclineStatus) {
    return -1;
  }
  if (ADeclineStatus > BDeclineStatus) {
    return 1;
  }
  return 0;
}

const headers = computed(() => {
  if (props.isAdditionalTask) {
    return props.defectHeader.filter((val) => {
      return checkIsAdditionalTask(val.taskDesc)
    }).sort(sortDecline)
  } else {
    return props.defectHeader.filter((val) => {
      return !checkIsAdditionalTask(val.taskDesc)
    }).sort(sortDecline)
  }
})

const isNotConfirmed = (defect: Defect) => {
  let confirmed = false
  if (defect) {
    confirmed = defect.cbmNAStatus === "Not-Confirm"
  }
  return confirmed
}

const showDetail = (item: Defect) => {
  emits("onViewDetailInformation", {
    type: 'na',
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
</style><style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";
</style>
