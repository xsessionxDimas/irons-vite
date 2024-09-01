<template>
  <div v-loading="!isDMASet">
    <HomeIconButton :data="menus" @submit-e-form="onEFormClicked" v-if="isDMASet"/>
    <template v-if="offlineWorkOrderConfirm">
      <OfflineWorkOrderDialog
      :title="'Commence Digital Service'"
      :placeholder="'Outstanding Services'"
      :visibility="offlineWorkOrderConfirm"
      :data="offlineWorkOrders"
      @on-submit="onOfflineWorkOrderSubmitted"
      @on-download="handleDownloadJSONServiceForm"
      @on-close="() => { offlineWorkOrderConfirm = !offlineWorkOrderConfirm }" />
    </template>
    <WorkOrderDialog
    :title="'Commence Digital Service'"
    :placeholder="'Outstanding Services'"
    :visibility="workOrderConfirm"
    :data="workorders"
    @on-submit="onWorkOrderSubmitted"
    @on-close="() => { workOrderConfirm = !workOrderConfirm }" />
    <template v-if="interventionConfirm">
      <OfflineWorkOrderDialog
        :title="'Commence Digital Component Intervention'"
        :placeholder="'Outstanding Component Intervention'"
        :visibility="interventionConfirm"
        :data="outstandingInterventions"
        @on-submit="onInterventionSubmitted"
        @on-download="handleDownloadJSONInterventionForm"
        @on-close="() => { interventionConfirm = !interventionConfirm }" />
    </template>
    <WorkOrderDialog
    :title="'Interim Engine Service'"
    :placeholder="'Outstanding Interim Engine Service'"
    :visibility="interimConfirm"
    :data="interimWorkOrders"
    @on-submit="onInterimSubmitted"
    @on-close="() => { interimConfirm = !interimConfirm }" />
    <InformationPopUp
    :show="showNoNetworkDialog"
    @close="closeNoNetworkDialog"
    :title-pop-up="'No internet connection'"/>
    <WorkOrderDialog
    :title="'SOS Print Label'"
    :placeholder="'Completed Services'"
    :visibility="printLabelConfirm"
    :data="sosHistories"
    @on-submit="onSosSubmitted"
    @on-close="() => { printLabelConfirm = !printLabelConfirm }" />
    <ErrorBox
    :visibility="errorBoxVisible"
    :caption="'Data is not available in offline mode'"
    @on-close="() => { errorBoxVisible = false }" />
  </div>
</template>


<script lang="ts" setup>
import HomeIconButton from '@/components/buttons/dma/HomeIconButton.vue'
import InformationPopUp from '@/components/dialog/InformationPopUp.vue'
import WorkOrderDialog from '@/components/dialog/WorkOrderDialog.vue'
import ErrorBox from '@/components/alert/ErrorBox.vue'
import { useMenuStore } from '@/store/pinia/application/useMenuStore'
import {
  onBeforeMount,
  computed,
  ref,
  watch,
  onUnmounted
} from 'vue'
import navigator from '@/core/mixins/navigator'
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore'
import { Option } from '@/core/types/misc/Option'
import {
  useDailyScheduleStore
} from '@/store/pinia/dma/daily-schedule/useDailyScheduleStore'
import {
  useComponentInterventionStore
} from '@/store/pinia/dma/component-intervention/useComponentInterventionStore'
import {
  useComponentInterventionEformStore
} from '@/store/pinia/dma/component-intervention/useComponentInterventionEformStore'
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form/useGeneralFormStore'
import {
  useGeneralFormStore as useOfflineGeneralFormStore
} from '@/store/pinia/dma/e-form-offline/useGeneralFormStore'
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import {
  useComponentInterventionHeaderStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionHeaderStore'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  useInterimEngineStore
} from '@/store/pinia/dma/interim-engine-service/useInterimEngineStore'
import {
  useInterimGeneralFormStore
} from '@/store/pinia/dma/interim-engine-service/useInterimGeneralFormStore'
import {
  usePositionListStore
} from '@/store/pinia/administration/organization-unit/position/usePositionListStore'
import {
  useOfflineDailyScheduleStore
} from '@/store/pinia/dma/daily-schedule/useOfflineDailyScheduleStore'
import {
  useEFormStore as useOfflineEFormStore
} from '@/store/pinia/dma/e-form-offline/useEFormStore'
import { useSosStore } from '@/store/pinia/dma/sos/useSosStore'
import OfflineWorkOrderDialog from '@/components/dialog/OfflineWorkOrderDialog.vue'
import { ElLoading } from 'element-plus'
import { appInsights } from '@/main'
import { cloneDeep } from 'lodash'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { WorkOrder } from '@/core/types/intervention/WorkOrder'

/* online sensor */

const store = useMenuStore()
const eFormStore = useEFormStore()
const offlineEformStore = useOfflineEFormStore()
const dailyScheduleStore = useDailyScheduleStore()
const offlineDailyScheduleStore = useOfflineDailyScheduleStore()
const componentInterventionStore = useComponentInterventionStore()
const generalStore = useGeneralFormStore()
const offlineGeneralStore = useOfflineGeneralFormStore()
const masterStore = useMasterStore()
const globalConnectionStore = useGlobalConnectionStore()
const componentInterventionEformStore = useComponentInterventionEformStore()
const interventionHeaderStore = useComponentInterventionHeaderStore()
const interimEngineServiceHeaderStore = useInterimEngineStore()
const sosStore = useSosStore()
const authStore = useAuthenticationStore()
const interimGeneralStore = useInterimGeneralFormStore()

const workOrderConfirm = ref(false)
const offlineWorkOrderConfirm = ref(false)
const interventionConfirm = ref(false)
const printLabelConfirm = ref(false)
const interimConfirm = ref(false)
const errorBoxVisible = ref(false)
const { redirectByName } = navigator()

/* computed */
const showNoNetworkDialog = computed(() => {
  return globalConnectionStore.stateSubmitConnectionError
})

const workorders = computed(() => {
  return dailyScheduleStore.DailyScheduleOptions
})

const offlineWorkOrders = computed(() => {
  const wo = cloneDeep(offlineDailyScheduleStore.DailyScheduleOptions)

  return offlineDailyScheduleStore.DailyScheduleOptions
    .filter((item) => {
      return wo.some((valueElement) => {
        return valueElement.value === item.value;
      });
    })
    .slice()
    .sort((a, b) => {
      let x
      setTimeout(() => {
        const indexA = wo.findIndex((valueElement) => {
          return valueElement.value === a.value;
        });
        const indexB = wo.findIndex((valueElement) => {
          return valueElement.value === b.value;
        });
        x = indexA - indexB;
      }, 15);
      return x
    });
});

const isDMASet = computed(() => {
  if (isOfflineOrSlowInternetConnection()) return true
  else {
    return store.stateIsDMAMenuSet
  }
})

const outstandingInterventions = computed(() => {
  return interventionHeaderStore.WorkOrder.map((e) => {
    return {
      label: `<span class="break-word">${e.equipment} - ${e.equipmentDesc} - <span class="${e.sampleStatus?.toLowerCase() == 'caution' ? 'yellow' : e.sampleStatus?.toLowerCase() == 'normal' ? 'green' : 'red'}">${e.sampleStatus} Intervention</span> - ${e.componentSystem} - ${e.sapWorkOrder}</span>`,
      value: e.id,
      icon: e.status == 'Updated' ? 'Updated' : '',
      labelPlain: `${e.equipment} - ${e.equipmentDesc} - ${e.sampleStatus} Intervention - ${e.sapWorkOrder}`,
      status: e.interventionExecution,
      progress: e.progress
    }
  })
})

const interimWorkOrders = computed(() => {
  return dailyScheduleStore.DailyScheduleInterimOptions
})

const sosHistories = computed(() => {
  return sosStore.SosHistoryOptions
})

const menus = computed(() => {
  return store.menuDMA;
});

const onEFormClicked = (menu: string) => {
  const isDailyScheduleEmpty = offlineDailyScheduleStore.stateDailyScheduleOptions.length == 0
  switch (menu) {
    case "eform":
      if (!isOfflineOrSlowInternetConnection()) {
        workOrderConfirm.value = true
      }
      break;
    case "eformoffline":
    case "eformv2":
      if (isOfflineOrSlowInternetConnection() && isDailyScheduleEmpty) {
        offlineDailyScheduleStore.getDailyScheduleFromLocalDB()
      }
      offlineWorkOrderConfirm.value = true
      break;
    case "componentinterventionforms":
      interventionConfirm.value = true
      break
    case "interimengineservice":
      interimConfirm.value = true
      break
    case "sosprintlabel":
      openSosDialog();
      break
  }
}

const openSosDialog = async () => {
  if (sosStore.SosHistory.length == 0) {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading SOS History',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    sosStore.getSosHistory(authStore.user.SiteId)
    loading.close()
  }
  printLabelConfirm.value = true;
}

const onSosSubmitted = async (option: Option) => {
  sosStore.setSelectedSos(option)
  redirectByName('sosprintlabel')
}

/* event handlers */
const handleDownloadJSONInterventionForm = async (param) => {
  if (param.icon == "Updated") {
    // repeat download when wo is submited by portal/revised by portal/Open (haven't filled by fitter)
    if (param.status != 'Submitted-IronPortal' && param.status != 'Open' && param.status != 'Revised') {
      return
    }
  }
  if (!globalConnectionStore.stateConnectionStatus) {
    globalConnectionStore.setSubmitConnectionError(true)
    return
  }
  const selected = interventionHeaderStore.WorkOrder.find((daily) => {
    return daily.id == param.value
  }) as WorkOrder
  const loading = ElLoading.service({
    lock: true,
    text: 'Please wait, we are downloading Component Intervention Form data to local device.',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await interventionHeaderStore.handleSetInterventionAccessibleOffline(selected);
  loading.close()
}

const handleDownloadJSONServiceForm = async (param) => {
  if (param.icon == "Updated") {
    return
  }
  if (!globalConnectionStore.stateConnectionStatus) {
    globalConnectionStore.setSubmitConnectionError(true)
    return
  }
  const selected = offlineDailyScheduleStore.stateDailySchedules.find((daily) => {
    return daily.id == param.value
  })
  const loading = ElLoading.service({
    lock: true,
    text: 'Please wait, we are downloading service sheet data to local device.',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await offlineDailyScheduleStore.handleServiceFormAccessibleOffline(selected)
  loading.close()
  // need to sorted here
}

const closeNoNetworkDialog = () => {
  globalConnectionStore.setSubmitConnectionError(false)
}

const storeModelAndPsType = (val: Option) => {
  const label:string = val.label;
  const model:string = label.split(' - ')[1];
  const hrServiceStr:string = label.split(' - ')[2];
  const hrServiceObj:RegExpMatchArray|null = hrServiceStr.match(/\d+/);
  const psType:string = hrServiceObj ? hrServiceObj[0] : '';
  localStorage.setItem('currentModel', JSON.stringify({
    model: model,
    psType: psType
  }))
}

const onOfflineWorkOrderSubmitted = async (option: Option) => {
  offlineDailyScheduleStore.setSelectedDailySchedule(option.value)
  if (isOfflineOrSlowInternetConnection()) {
    const jsonExist = await offlineDailyScheduleStore.getServiceSheetDetailFromLocalDB(offlineDailyScheduleStore.SelectedDailySchedule.workOrder)
    if (jsonExist == undefined) {
      errorBoxVisible.value = true
      return
    }
  }
  offlineDailyScheduleStore.setSelectedDailySchedule(option.value)
  offlineGeneralStore.setSMUActual(Number(offlineDailyScheduleStore.SelectedDailySchedule.smuDue))
  offlineEformStore.setModelAndPsTypeId(
    offlineDailyScheduleStore.SelectedDailySchedule.equipmentModel,
    offlineDailyScheduleStore.SelectedDailySchedule.psType,
    offlineDailyScheduleStore.SelectedDailySchedule.workOrder,
    offlineDailyScheduleStore.SelectedDailySchedule.equipmentModelName,
    offlineDailyScheduleStore.SelectedDailySchedule.unitNumber
  )
  storeModelAndPsType(option)
  redirectByName('eformoffline')
}

const onWorkOrderSubmitted = async (option: Option) => {
  dailyScheduleStore.setSelectedDailySchedule(option.value)
  generalStore.setSMUActual(Number(dailyScheduleStore.SelectedDailySchedule.smuDue))
  eFormStore.setModelAndPsTypeId(
    dailyScheduleStore.SelectedDailySchedule.equipmentModel,
    dailyScheduleStore.SelectedDailySchedule.psType,
    dailyScheduleStore.SelectedDailySchedule.workOrder,
    dailyScheduleStore.SelectedDailySchedule.equipmentModelName,
    dailyScheduleStore.SelectedDailySchedule.unitNumber
  )
  // appInsights.trackEvent({
  //   name: 'fe_event_select_daily_schedule',
  //   properties: {
  //     email: authStore.user.Email,
  //     workOrder: dailyScheduleStore.SelectedDailySchedule.workOrder
  //   }
  // });
  // appInsights.flush()
  storeModelAndPsType(option)
  redirectByName('eform')
}

const onInterventionSubmitted = async (option: Option) => {
  componentInterventionStore.setSelectedComponentIntervention(option.value)
  componentInterventionEformStore.setComponentInterventionHeader(
    componentInterventionStore.SelectedComponentIntervention.id,
    componentInterventionStore.SelectedComponentIntervention.equipment,
    componentInterventionStore.SelectedComponentIntervention.sapWorkOrder,
    componentInterventionStore.SelectedComponentIntervention.equipmentDesc,
    componentInterventionStore.SelectedComponentIntervention.sampleStatus,
    componentInterventionStore.SelectedComponentIntervention.componentDescription
  )
  interventionHeaderStore.setSelectedWorkOrder(option.value)
  interventionHeaderStore.setSelectedShortWorkOrder(option.label)
  if (!isOfflineOrSlowInternetConnection()) {
    redirectByName('componentinterventionforms')
  } else {
    const jsonExist = await interventionHeaderStore.getWorkOrderDetailFromDB(option.value)
    if (jsonExist != undefined) {
      redirectByName('componentinterventionforms')
    } else {
      errorBoxVisible.value = true
    }
  }
}

const onInterimSubmitted = async (option: Option) => {
  dailyScheduleStore.setSelectedDailyScheduleInterim(option.value)
  interimGeneralStore.setSMUActual(Number(dailyScheduleStore.SelectedDailyScheduleInterim.smuDue))
  interimEngineServiceHeaderStore.setModelAndPsTypeId(
    dailyScheduleStore.SelectedDailyScheduleInterim.equipmentModel,
    dailyScheduleStore.SelectedDailyScheduleInterim.psType,
    dailyScheduleStore.SelectedDailyScheduleInterim.workOrder,
    dailyScheduleStore.SelectedDailyScheduleInterim.equipmentModelName,
    dailyScheduleStore.SelectedDailyScheduleInterim.unitNumber
  )
  redirectByName('interimengineservice')
}

onUnmounted(() => {
  // appInsights.stopTrackPage(pageName);
  // appInsights.stopTrackEvent();
})

/* life cycles */
onBeforeMount(async () => {
  // appInsights.startTrackPage(`FE WEB ${pageName}`);
  appInsights.setAuthenticatedUserContext(authStore.user.Email);
  // appInsights.trackEvent({
  //   name: 'fe_event_access_page',
  //   properties: {
  //     email: authStore.user.Email,
  //     page: pageName
  //   }
  // });
  // appInsights.flush()
  eFormStore.clearStoredBrakeTypeValue()
  eFormStore.setFromHomePage(true)
  eFormStore.updateStoredDisableKeyValue([])
  eFormStore.pushDataToSuspensionCylinderStoredValue([])
  eFormStore.updateStoredAdjustmentOptionValue("")
  // offline
  offlineEformStore.pushDataToAdjustedSuspensionCylinderStoredValue([])
  offlineEformStore.clearStoredBrakeTypeValue()
  offlineEformStore.setFromHomePage(true)
  offlineEformStore.updateStoredDisableKeyValue([])
  offlineEformStore.pushDataToSuspensionCylinderStoredValue([])
  offlineEformStore.updateStoredAdjustmentOptionValue("")
  offlineEformStore.pushDataToAdjustedSuspensionCylinderStoredValue([])
  if (isOfflineOrSlowInternetConnection()) {
    offlineDailyScheduleStore.getDailyScheduleFromLocalDB()
    store.setOutstandingBadgeFromDump()
    masterStore.getSymptoms()
    masterStore.getActions()
    masterStore.getCauses()
    masterStore.getNAConditions()
    masterStore.getCBMMappings()
    masterStore.getPositions()
    masterStore.getOwnership()
    interventionHeaderStore.getWorkOrdersFromLocal()
  } else {
    postEventAzure()
  }
})

const postEventAzure = () => {
  // appInsights.startTrackPage(`FE WEB ${pageName}`);
  // appInsights.setAuthenticatedUserContext(authStore.user.Email);
  // appInsights.trackEvent({
  //   name: 'fe_event_access_page',
  //   properties: {
  //     email: authStore.user.Email,
  //     page: pageName
  //   }
  // });
  // appInsights.flush()
}

const getOutstanding = async () => {
  try {
    store.getOutstandingMenuDMA(authStore.user.EmployeeId)
  } catch (error) {
    console.log(error)
  }
}


watch(() => {
  return authStore.user.SiteId
}, (newVal) => {
  postEventAzure()
  if (newVal) {
    if (newVal && store.isMenuDMASet) {
      getOutstanding()
    }
    if (!isOfflineOrSlowInternetConnection()) {
      dailyScheduleStore.getDailySchedules(authStore.user.SiteId)
      dailyScheduleStore.getDailySchedulesInterim(authStore.user.SiteId)
      offlineDailyScheduleStore.getDailySchedules(authStore.user.SiteId)
      offlineDailyScheduleStore.getHmOffset(authStore.user.SiteId)
    } else {
      offlineDailyScheduleStore.getDailyScheduleFromLocalDB()
    }
  }
})

watch(() => {
  return store.isMenuDMASet
}, (newVal) => {
  if (newVal && authStore.user.SiteId) {
    if (!isOfflineOrSlowInternetConnection()) {
      getOutstanding()
    }
  }
})
</script>
