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
        <template v-if="headersCBM.length < 1">
          <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
            <p style="text-align: center;">No data recorded</p>
          </div>
        </template>
        <template v-else v-for="(item) in headersCBM" :key="item.id">
          <div class="item px-2 my-2 mx-1">
            <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
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
                  :class="detailInfoClass(item.id, headers, !plannerApprove, 'cbmNAStatus', 'plannerCbmNAStatus', isDisabled, defectStatus)"
                  @click.prevent="showDetail(item.id)">
                  Detailed Information
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
  <CBMInfo :visibility="formVisibility" :cbm-data="(cbmData as Header)" :view-only="viewOnly"
    :cbm-is-confirmed="isCBMConfirmed" @close-form="onFormClosed" @on-approve-cbm="acknowledgeCBM">
  </CBMInfo>
  <ErrorBox :visibility="isErrorShows" :caption="store.stateErrorMessage" @on-close="handleCloseErrorPopUp" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  ref,
  computed,
  toRef
} from 'vue'
import { Header } from '@/core/types/entities/dma/defects/Header'
import CBMInfo from './CBMInfo.vue'
import {
  useComponentInterventionDefectsStore
} from '@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore'
import {
  displayTaskNoCBM,
  displayDescCBM
} from '@/core/helpers/manipulate-html-string'
import {
  checkIsAdditionalTask
} from "@/store/pinia/dma/component-intervention/helper";
import ErrorBox from '@/components/alert/ErrorBox.vue'
import {
  NoNetworkMessages
} from "@/store/enums/ErrorMessagesEnum"
import {
  DefectConfirmationParams
} from '@/core/types/misc/DefectConfirmationParams'
import { detailInfoClass } from "@/store/pinia/dma/e-form/helpers"
import { cbmValColor } from '@/core/helpers/ironforms/defects-form/cbm-helper'

const props = defineProps({
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  headers: {
    required: true,
    type: [] as PropType<Header[]>
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false
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

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
  (e: "onRefreshData"): void;
}>();

/* stores */
const store = useComponentInterventionDefectsStore()

const loader = ref<Array<boolean>>([])
const titlePanel = ref(props.isAdditionalTask ? 'Component Condition Data (Additional Task)' : 'Component Condition Data')
const cbmCollapse = ref(titlePanel.value)
const cbmData = ref<Header | undefined>()
const formVisibility = ref(false)
const cbmHeaders = toRef(props, "headers");
const isErrorShows = ref(false)

const headersCBM = computed(() => {
  if (props.isAdditionalTask) {
    return cbmHeaders.value.filter((val) => {
      return checkIsAdditionalTask(val.taskDesc)
    })
  } else {
    return cbmHeaders.value.filter((val) => {
      return !checkIsAdditionalTask(val.taskDesc)
    })
  }
})

const isCBMConfirmed = computed(() => {
  return props.plannerApprove ? cbmData.value?.plannerCbmNAStatus === "Confirmed" : cbmData.value?.cbmNAStatus === "Confirmed"
})

headersCBM.value.forEach(() => {
  loader.value.push(false)
})

const showDetail = (headerId: string) => {
  const header = headersCBM.value.find((h) => {
    return h.id === headerId
  });
  cbmData.value = header
  formVisibility.value = true
}

const acknowledgeCBM = async (params: DefectConfirmationParams) => {
  /* check if already repaired */
  try {
    const header = store.ApprovalData.CBMHeaders.find((h) => {
      return h.id === params.headerId
    })
    if (header) {
      await store.updateCBMConfirmedStatus(params.headerId, props.plannerApprove, params.reason)
      if (params.callback) {
        emits('onRefreshData')
        params.callback(store.IsError, store.ErrorMessage)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const handleCloseErrorPopUp = () => {
  isErrorShows.value = false
  if (store.stateErrorMessage != NoNetworkMessages.NO_NETWORK_VIEW) {
    store.resetErrorStatus()
    onRefreshData()
  }
}

const onRefreshData = () => {
  emits('onRefreshData')
}

const onFormClosed = () => {
  formVisibility.value = false
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
