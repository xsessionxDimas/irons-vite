<template>
    <div class="mt-5 ps-0">
      <el-collapse class="task-group general-accordion defect-panel-wrapper px-5 pb-1 testing" v-model="defectIdentifiedCollapse">
        <el-collapse-item title="Defect Identified" name="Defect Identified">
          <!-- items -->
          <!-- items header -->
          <div class="row px-2 item mx-1 w-100 defect-panel-header">
            <div class="col-1 column-sm-12-percent column-md-7-percent column-lg-10-percent column-xl-6-percent text-center align-items-center d-flex justify-content-center">Task</div>
            <div class="col align-items-center d-flex text-break">Task Description – Defect Description</div>
            <div class="text-break col-1 text-center column-sm-11-percent column-md-10-percent column-lg-5-percent align-items-center d-flex justify-content-center flex-basis-80">Priority</div>
            <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">Review Status</div>
            <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center">Work Order</div>
            <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important">Repair Status</div>
            <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex" style="word-break: initial !important" v-if="viewIsDownload"></div>
          </div>
          <!-- items data -->
          <template v-if="defectSMU">
            <div class="item px-2 my-2 mx-1">
              <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
                <div class="col-1 column-sm-12-percent column-md-7-percent column-xl-6-percent align-items-center d-flex text-break justify-content-center"></div>
                <div class="col align-items-center d-flex text-break defect-description"><span class="text-break" v-html="defectSMU.taskDesc"></span></div>
                <div class="col-1 justify-content-center column-sm-11-percent column-md-11-percent column-xl-5-percent align-items-center d-flex flex-basis-80"></div>
                <div class="col-1 column-sm-20-percent column-md-24-percent column-lg-10-percent column-xl-10-percent align-items-center d-flex justify-content-center">
                    <div class="label d-flex align-items-center acknowledge-btn py-2 px-1 rounded text-center justify-content-center cursor-pointer"
                      :class="detailInfoClass(defectSMU.id, headers)"
                      @click="acknowledge(defectSMU.id)">
                      Detailed Information
                    </div>
                </div>
                <div class="col-1 column-sm-30-percent column-md-23-percent column-lg-16-percent column-xl-16-percent align-items-center d-flex justify-content-center"></div>
                <div class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"></div>
                <div v-if="route.path != '/ironforms/e-form'" class="col-1 column-sm-10-percent column-md-6-percent column-lg-6-percent column-xl-6-percent justify-content-center align-items-center d-flex"></div>
              </div>
              <div class="row flex-nowrap w-100 flex-row-reverse create-by" style="font-size: 13px !important">
                {{ defectSMU.createdBy.name }}, {{ defectSMU.updatedDate != "" ? defectSMU.updatedDate : defectSMU.createdDate }}
              </div>
            </div>
          </template>
          <template v-if="Object.keys(headersDisplay).length === 0 && !defectSMU">
            <div class="row flex-nowrap px-2 my-2 mx-1 w-100">
              <p style="text-align: center;">No data recorded</p>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <SMUDetailDialog
      v-model:show="showSMUDetailDialog"
      :detailDefect="detailDefectSMU"
      :ownership="formatOwnershipHTML"
      :view-only="(!plannerApprove && defectSMU?.status == 'Acknowledge') || (plannerApprove && defectSMU?.plannerStatus == 'Acknowledge') || route.path == '/ironforms/e-form' || route.path == '/ironforms/monitoring-status/preview'"
      :plannerApprove="plannerApprove"
      :plannerStatus="defectSMU?.plannerStatus || ''"
      :plannerName="defectSMU?.updatedBy.name || ''"
      :time-stamp="defectSMU?.updatedDate || ''"
      @on-refresh-data="onRefreshData"
    />
</template>


<script lang="ts" setup>
import {
  defineProps,
  computed,
  ref,
  watch,
  onMounted,
  defineEmits
} from 'vue'
import {
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore"
import { Header } from '@/core/types/entities/dma/defects/Header'
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form/useGeneralFormStore'
import {
  formatOwnership
} from "@/store/pinia/dma/e-form/helpers"
import SMUDetailDialog from './SMUDetailDialog.vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  viewOnly: {
    required: false,
    type: Boolean,
    default: false
  },
  supervisor: {
    required: true,
    type: Boolean,
    default: true
  },
  fitterId: {
    required: false,
    type: String,
    default: ""
  },
  plannerApprove: {
    required: false,
    type: Boolean,
    default: false
  },
  viewIsDownload: {
    required: false,
    type: Boolean,
    default: false
  },
  isApproval: {
    type: Boolean,
    default: false
  }
})

const route = useRoute();

/* stores */
const store = useInterimDefectsStore()
const camStore = useCameraStore()
const generalStore = useGeneralFormStore()
const defectFormStore = useDefectsFormStore()

const emits = defineEmits(['onRefreshData', 'onGetPositionY'])

/* refs */
const defectIdentifiedCollapse = ref('Defect Identified')
const defectMOs = ref<Array<any>>([])
const refHeader = ref<string>("")
const showSMUDetailDialog = ref<boolean>(false);

const defectSMU = computed(() => {
  return store.DefectSMUHeader;
});
const detailDefectSMU = computed(() => {
  return store.DefectSMUDetail;
});
const formatOwnershipHTML = computed(() => {
  const ownership = defectFormStore.Ownership
  return formatOwnership(ownership)
})

const activeCollapse = ref([""])

/* computeds */
const headers = computed(() => {
  return props.supervisor ? store.ApprovalData.DefectHeaders : store.ApprovalData.DefectHeaders.filter((h) => {
    return (['P3', 'P4']).includes(h.priority) || h.defectType == 'machineSMU'
  })
})

const headersDisplay = computed(() => {
  const headerTemp = headers.value as Header[]
  store.ApprovalData.DefectDetails.forEach((detail) => {
    const headerIndex = headers.value.findIndex((h) => {
      return h.id === detail.defectHeaderId;
    });
    if (headerIndex >= 0) {
      headerTemp[headerIndex].descriptionDefect = detail.detail.description
    }
  })
  headerTemp.forEach((item) => {
    if (item.taskDesc && item.taskDesc.split(";")[1] && item.taskDesc.split(";")[1] != '') {
      item.taskNo = item.taskDesc.split(";")[0] + ";" + item.taskDesc.split(";")[1]
    }
  })
  const headerNoSMU = headerTemp.filter((obj) => {
    return obj.defectType !== 'machineSMU'
  })
  return headerNoSMU.reduce((groups, item) => {
    const group = (groups[item.taskNo] || []);
    group.push(item);
    groups[item.taskNo] = group;
    return groups;
  }, {}) as any;
})

const dataReady = computed(() => {
  return store.DataFetched
})

const detailInfoClass = (headerId: string, headers: Header[]) => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.id === headerId
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
      if (header.priority === undefined && header.defectType !== 'machineSMU') {
        cssClass = "light-green color-dark-green"
      }
    }
  } else if (!props.supervisor && header?.plannerStatus) {
    cssClass = "light-green color-dark-green"
  }
  return cssClass
}

watch(dataReady, (value) => {
  if (value === true) {
    initialDefectMO()
    initialCollapseData()
  }
})

const initialDefectMO = () => {
  defectMOs.value = []
  headers.value.forEach((h) => {
    defectMOs.value.push({
      id: h.id,
      wo: h.defectWorkorder,
      load: false
    })
  })
}

const initialCollapseData = () => {
  activeCollapse.value = []
  headers.value.forEach((h) => {
    const foundIndex = activeCollapse.value.findIndex((val) => {
      if (h.taskDesc && h.taskDesc.split(";")[1] && h.taskDesc.split(";")[1] != '') {
        return val == h.taskDesc.split(";")[0] + ";" + h.taskDesc.split(";")[1]
      }
      return val == h.taskNo
    })
    if (foundIndex < 0) {
      if (h.taskDesc && h.taskDesc.split(";")[1] && h.taskDesc.split(";")[1] != '') {
        activeCollapse.value.push(h.taskDesc.split(";")[0] + ";" + h.taskDesc.split(";")[1])
      } else {
        activeCollapse.value.push(h.taskNo)
      }
    }
  })
}

onMounted(() => {
  if (dataReady.value) {
    initialDefectMO()
    initialCollapseData()
  }
  generalStore.getServerTimestamp()
})

/* methods */
const acknowledge = (headerId: string) => {
  emits('onGetPositionY')
  camStore.setCurrent('defect')
  const defectType = store.setDefectData(headerId)
  if (props.plannerApprove) {
    if (store.HeaderStatus != 'Decline') {
      store.updateHeaderDefect(headerId)
    }
  }
  refHeader.value = headerId
  if (defectType == 'machineSMU') {
    showSMUDetailDialog.value = true
  }
}
const onRefreshData = () => {
  emits('onRefreshData')
}
</script>
<style>
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
<style lang="scss">
.defect-panel-task {
  border: none !important;
  .el-collapse-item__header {
    font-size: 14px !important;
    font-weight: 400 !important;
    background-color: #F4F6F8;
    padding: 2.5rem 0;
    border-radius: 12px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .defect-description {
    color: #637381;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
  .el-collapse-item__arrow {
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
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
