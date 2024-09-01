<template>
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion py-1 px-5 testing" v-model="titleComp">
        <el-collapse-item :title="title" :name="title">
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
            <div class="col align-items-center d-flex text-break">Task Description</div>
            <div class="col align-items-center d-flex text-break">Comments</div>
            <div :class="[supervisor ? 'col justify-content-end pe-16' : 'col-1 justify-content-center']" class="column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex">Review Status</div>
            <div v-if="!supervisor" class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent align-items-center d-flex justify-content-center"></div>
            <div v-if="!supervisor" class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Confirmed</div>
          </div>
          <template v-if="headers.length < 1">
            <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
              <p style="text-align: center;">No data recorded</p>
            </div>
          </template>
          <template v-else v-for="(item, index) in headers" :key="item.id">
            <div class="item px-2 my-2 mx-1">
              <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center">{{ item.taskNo.replace(';', '') }}</div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break defect-identified-task" v-html="displayDesc(item.taskDesc)"></span>
                </div>
                <div class="col align-items-center d-flex text-break">
                  <span class="text-break">{{ item.commentValue }}</span>
                </div>
                <div :class="[supervisor ? 'col justify-content-end' : 'col-1 justify-content-center']" class="column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex">
                  <template v-if="item.plannerCbmNAStatus == 'Decline' || item.cbmNAStatus == 'Decline'">
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center red-bg text-dark-red cursor-pointer"
                      @click="showDetail(item)">
                      Declined
                    </div>
                  </template>
                  <template v-else>
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                      :class="detailInfoClass(item.id, headers, true, 'cbmNAStatus', 'plannerCbmNAStatus')"
                      @click.prevent="showDetail(item)">
                      Detailed Information
                    </div>
                  </template>
                </div>
                <div v-if="!supervisor" class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent align-items-center d-flex justify-content-center"></div>
                <div v-if="!supervisor" class="col-1 column-sm-20-percent column-md-11-percent column-lg-11-percent column-xl-11-percent justify-content-center align-items-center d-flex">
                  <div v-if="item.cbmNAStatus != 'Decline'" class="mx-10 little-box rounded-circle d-flex justify-content-center align-items-center flex-fill cbm-confirm-checkbox flex-column"
                  :class="(defectIsNotConfirmed(item.id, headers, plannerApprove) && defectReviewPage()) ? isDisabled ? 'not-allowed' :'dot' : 'not-allowed'">
                      <div class="little-dot" v-if="defectIsNotConfirmed(item.id, headers, plannerApprove)" @click="updateConfirmed(item.id, index)"></div>
                      <img src="/media/svg/dma/icons/Check.png" style="width:28px" alt="" v-if="(!defectIsNotConfirmed(item.id, headers, plannerApprove))" />
                      <div class="ms-1 d-flex align-items-center" v-if="loader[index]">
                        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                        <span>Loading...</span>
                      </div>
                  </div>
                </div>
              </div>
              <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                {{ item.createdBy.name }}, {{ item.updatedDate != "" ? item.updatedDate : item.createdDate }}
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <NAForm
    ref="NAFormComponent"
    :view-only="isDisabled || !supervisor"
    :visibility="showDetailForm"
    :na-data-header="dataNAHeader"
    :na-data-detail="dataNADetail"
    @close="closeDetail"
    @on-submit-decline="submitDecline"
    @on-submit-confirm="submitConfirm"
    @onRefreshData="onRefreshData" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  ref,
  computed,
  defineEmits
} from 'vue'
import { Header } from '@/core/types/entities/dma/defects/Header'
import {
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore'
import NAForm from '@/views/dma/components/defects/NAForm.vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import {
  defectIsNotConfirmed,
  defectReviewPage
} from '@/views/dma/components/defects/functions/defects-functions'
import { isUndefined } from 'lodash'
import { detailInfoClass } from "@/store/pinia/dma/e-form/helpers"
import { Detail } from '@/core/types/entities/dma/defects/Detail'

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  isDefect: {
    required: true,
    type: Boolean,
    default: true
  },
  headers: {
    required: true,
    type: [] as PropType<Header[]>
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['onRefreshData', 'onGetPositionY'])

/* stores */
const store = useInterimDefectsStore()

const NAFormComponent = ref()
const loader = ref<Array<boolean>>([])
const titleComp = computed(() => {
  return props.title
})

props.headers.forEach(() => {
  loader.value.push(false)
})

const showDetailForm = ref(false)
const dataNAHeader = ref<Header>()
const dataNADetail = ref<Detail>()

const closeDetail = () => {
  showDetailForm.value = false
}

const supervisor = computed(() => {
  return !props.plannerApprove
})

const submitDecline = async (params: {headerId: string, reason: string, afterSubmit: (isError: boolean, errorMessage: string) => void}) => {
  if (props.plannerApprove) {
    await store.updatePlannerDefectDeclineStatus(params.headerId, params.reason)
    params.afterSubmit(store.stateIsError, store.stateErrorMessage)
  } else {
    await store.updateDefectDeclineStatus(params.headerId, params.reason)
    params.afterSubmit(store.stateIsError, store.stateErrorMessage)
  }
}

const submitConfirm = async (params: {headerId: string, reason?: string, afterSubmit: (isError: boolean, errorMessage: string) => void}) => {
  const { headerId, reason = "", afterSubmit } = params;
  if (props.plannerApprove) {
    await store.updatePlannerDefectConfirmedStatus(headerId)
    afterSubmit(store.stateIsError, store.stateErrorMessage)
  } else {
    await store.updateDefectConfirmedStatus(headerId, reason)
    afterSubmit(store.stateIsError, store.stateErrorMessage)
  }
}

const showDetail = (item) => {
  emits('onGetPositionY')
  dataNAHeader.value = undefined
  dataNADetail.value = undefined
  const headerId = item.id
  let found = store.ApprovalData.DefectNADetails.find((d) => {
    return d.defectHeaderId == headerId
  })
  let foundHeader = item
  if (found) {
    showDetailForm.value = true
    dataNAHeader.value = foundHeader
    dataNADetail.value = found
  } else {
    found = store.ApprovalData.CrackNADetails.find((d) => {
      return d.defectHeaderId == headerId
    })
    if (found) {
      showDetailForm.value = true
      dataNAHeader.value = foundHeader
      dataNADetail.value = found
    }
  }
}

const updateConfirmed = async (headerId: string, index: number) => {
  if (!defectReviewPage() || props.isDisabled) return
  if (props.isDefect) {
    const header = store.ApprovalData.DefectNAHeaders.find((h) => {
      return h.id === headerId
    })
    if (header) {
      if (props.plannerApprove) {
        if (!isUndefined(header.plannerCbmNAStatus) && header.plannerCbmNAStatus === "Confirmed") return
      } else {
        if (header.cbmNAStatus === "Confirmed") return
      }
      loader.value[index] = true
      if (props.plannerApprove) {
        await store.updatePlannerDefectConfirmedStatus(headerId)
      } else {
        await store.updateDefectConfirmedStatus(headerId)
      }
      NAFormComponent.value.handleErrorMessage(store.stateIsError, store.stateErrorMessage)
      loader.value[index] = false
    }
  } else {
    const header = store.ApprovalData.CrackNAHeaders.find((h) => {
      return h.id === headerId
    })
    if (header) {
      if (props.plannerApprove) {
        if (!isUndefined(header.plannerCbmNAStatus) && header.plannerCbmNAStatus === "Confirmed") return
      } else {
        if (header.cbmNAStatus === "Confirmed") return
      }
      loader.value[index] = true
      if (props.plannerApprove) {
        await store.updatePlannerCrackConfirmedStatus(headerId)
      } else {
        await store.updateCrackConfirmedStatus(headerId)
      }
      NAFormComponent.value.handleErrorMessage(store.stateIsError, store.stateErrorMessage)
      loader.value[index] = false
    }
  }
}
const onRefreshData = () => {
  emits('onRefreshData')
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
