<template>
    <!-- Background white -->
    <div class="full-page d-flex">
        <!-- Left Sidebar -->
        <div class="d-flex flex-column flex-shrink-0" style="width: 11rem;">
            <!--logo wrapper -->
            <div class="logo-wrapper d-flex align-items-center ms-1" @click="handlePreviewDashboardIronForms">
              <NwImg style="cursor:pointer;margin-left: auto;" src="/media/logos/logo-whitebg.png" class="h-40px logo" />
            </div>
            <!-- menu wrapper -->
            <div class="ms-5 menu-wrapper d-flex flex-column">
                <template v-for="menu in menus" :key="menu.Path">
                    <div class="px-2 menu d-flex flex-fill flex-column justify-content-center align-items-center py-5 shadow-lg position-relative"
                        @click="onButtonClick(menu.Path, menu.MenuName)"
                        :class="isActivePage(menu.Path) ? 'active': ''">
                        <img :src="`${getIconState(menu.Path)}/${menu.Icon}`" alt="icon" style="width:18px; height:20px;" />
                        <h4 class="label text-center">{{ menuMapping(menu.MenuName) }}</h4>
                    </div>
                </template>
                <div class="menu d-flex flex-fill flex-column justify-content-center align-items-center py-5 shadow-lg"
                    @click="showLogoutConfirm">
                    <img src="/media/svg/dma/side-menu/inactive/logout.png" alt="icon" style="width:18px; height:20px;" />
                    <h4 class="label">Logout</h4>
                </div>
                <div class="mb-10">
                    <AvatarCard />
                </div>
            </div>
        </div>
        <!-- Content -->
        <div class="d-flex flex-column flex-fill px-5">
            <router-view />
        </div>
        <OfflineWorkOrderDialog
        :title="'Commence Digital Service'"
        :placeholder="'Outstanding Services'"
        :visibility="offlineWorkOrderConfirm"
        :data="offlineWorkOrders"
        @on-submit="onOfflineWorkOrderSubmitted"
        @on-download="handleDownloadJSONServiceForm"
        @on-close="() => { offlineWorkOrderConfirm = !offlineWorkOrderConfirm }" />
        <ErrorBox
        :visibility="errorBoxVisible"
        :caption="'Data is not available in offline mode'"
        @on-close="() => { errorBoxVisible = false }" />
        <WorkOrderDialog
        :title="'Commence Digital Service'"
        :placeholder="'Outstanding Services'"
        :visibility="workOrderConfirm"
        :data="workorders"
        @on-submit="onWorkOrderSubmitted"
        @on-close="() => { workOrderConfirm = !workOrderConfirm }" />
        <OfflineWorkOrderDialog
        :title="'Commence Digital Component Intervention'"
        :placeholder="'Outstanding Component Intervention'"
        :visibility="interventionConfirm"
        :data="outstandingInterventions"
        @on-submit="onInterventionSubmitted"
        @on-download="handleDownloadJSONInterventionForm"
        @on-close="() => { interventionConfirm = !interventionConfirm }" />
        <WorkOrderDialog
        :title="'Interim Engine Service'"
        :placeholder="'Outstanding Interim Engine Service'"
        :visibility="interimConfirm"
        :data="interimWorkOrders"
        @on-submit="onInterimSubmitted"
        @on-close="() => { interimConfirm = !interimConfirm }" />
        <Confirmation :visibility="logoutConfirm"
          caption="Are you sure want to log out?"
          @on-no-confirm="onHideHandler"
          @on-yes-confirm="onSignOutHandler" />
          <InformationPopUp :show="showNoNetworkDialog" @close="closeNoNetworkDialog" :title-pop-up="'No internet connection'"/>
    </div>
</template>

<script lang="ts" setup>
import {
  computed,
  watch,
  onBeforeMount,
  ref,
  onMounted,
  getCurrentInstance,
  AppContext
} from "vue"
import { Option } from "@/core/types/misc/Option";
import { useMenuStore } from "@/store/pinia/application/useMenuStore"
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore"
import {
  useDailyScheduleStore
} from "@/store/pinia/dma/daily-schedule/useDailyScheduleStore"
import navigator from "@/core/mixins/navigator"
import WorkOrderDialog from "@/components/dialog/WorkOrderDialog.vue"
import InterventionDialog from "@/components/dialog/InterventionDialog.vue";
import { useRoute } from "vue-router"
import AvatarCard from "@/views/dma/components/AvatarCard.vue"
import Confirmation from "@/components/dialog/Confirmation.vue"
import {
  checkDMASignInStatus,
} from '@/core/helpers/get-user-info'
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import { useOnline } from '@vueuse/core'
import {
  useGlobalConnectionStore
} from "@/store/pinia/application/useGlobalConnectionStore"
import InformationPopUp from "@/components/dialog/InformationPopUp.vue"
import {
  useComponentInterventionStore
} from "@/store/pinia/dma/component-intervention/useComponentInterventionStore"
import {
  useComponentInterventionEformStore
} from "@/store/pinia/dma/component-intervention/useComponentInterventionEformStore"
import { useCronStore } from '@/store/pinia/application/useCronStore'
import { useMasterStore } from "@/store/pinia/dma/masters/useMasterStore";
import {
  usePersonelLabourStore
} from "@/store/pinia/dma/personel-labour/usePersonelLabourStore";
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form/useGeneralFormStore";
import {
  useComponentInterventionHeaderStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionHeaderStore'
import {
  useInterimEngineStore
} from "@/store/pinia/dma/interim-engine-service/useInterimEngineStore";
import {
  useInterimGeneralFormStore
} from "@/store/pinia/dma/interim-engine-service/useInterimGeneralFormStore";
import OfflineWorkOrderDialog from '@/components/dialog/OfflineWorkOrderDialog.vue'
import {
  useOfflineDailyScheduleStore
} from '@/store/pinia/dma/daily-schedule/useOfflineDailyScheduleStore'
import {
  useGeneralFormStore as useOfflineGeneralFormStore
} from '@/store/pinia/dma/e-form-offline/useGeneralFormStore'
import {
  useEFormStore as useOfflineEFormStore
} from '@/store/pinia/dma/e-form-offline/useEFormStore'
import { ElLoading } from "element-plus";
import ErrorBox from '@/components/alert/ErrorBox.vue'
import {
  useInterventionFormSyncStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore";
import { useSyncStore } from "@/store/pinia/dma/sync/useSyncStore";
import { CronJob } from "cron";
import { clearRecords } from "@/database/schema/DatabaseWrapper";
import { db } from "@/database/schema/DexieSchema";
import {
  isOfflineOrSlowInternetConnection,
  renewToken
} from "@/core/helpers/internet-connection";
import { useMsal } from "@/msal/api/useMsal"
import { useRouter } from "vue-router"
import { loginRequest } from "@/msal/authConfig";
import { useAnalyticApi } from "@/analytics/api/analyticApi";
import { WorkOrder } from "@/core/types/intervention/WorkOrder";

/* online sensor */
const online = useOnline();

const { redirectByName } = navigator();

const routes = useRoute();

const profileLoading = ref(false)

/* stores */
const store = useMenuStore()
const eFormStore = useEFormStore()
const dailyScheduleStore = useDailyScheduleStore()
const authStore = useAuthenticationStore()
const globalConnectionStore = useGlobalConnectionStore()
const componentInterventionStore = useComponentInterventionStore()
const componentInterventionEformStore = useComponentInterventionEformStore()
const cronStore = useCronStore()
const masterStore = useMasterStore()
const fitterStore = usePersonelLabourStore()
const generalStore = useGeneralFormStore()
const interventionHeaderStore = useComponentInterventionHeaderStore()
const interimEngineServiceHeaderStore = useInterimEngineStore()
const interimGeneralStore = useInterimGeneralFormStore()
const offlineWorkOrderConfirm = ref(false)
const offlineDailyScheduleStore = useOfflineDailyScheduleStore()
const offlineGeneralStore = useOfflineGeneralFormStore()
const offlineEformStore = useOfflineEFormStore()
const syncStore = useInterventionFormSyncStore()
const syncCronStore = useSyncStore()
const router = useRouter()

/* refs */
const hovered = ref(false)
const workOrderConfirm = ref(false)
const interventionConfirm = ref(false)
const logoutConfirm = ref(false)
const interimConfirm = ref(false)
const errorBoxVisible = ref(false)

/* computeds */
const offlineWorkOrders = computed(() => {
  return offlineDailyScheduleStore.DailyScheduleOptions
})
const showNoNetworkDialog = computed(() => {
  return globalConnectionStore.stateSubmitConnectionError
})
const tokenIntervalId = computed(() => {
  return cronStore.TokenIntervalId
})
const menus = computed(() => {
  return store.menuDMA;
})
const workorders = computed(() => {
  return dailyScheduleStore.DailyScheduleOptions
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

const isLoggedIn = computed(() => {
  return authStore.loggedIn;
});

const formDataIntervalId = computed(() => {
  return cronStore.FormSyncIntervalId
})

watch(isLoggedIn, (value) => {
  if (!value) {
    renewToken(instance)
  }
})

const menuMapping = (menuName: string) => {
  if (menuName === "e-Form") {
    return "Digital Service Forms";
  }
  if (menuName === "Approval") {
    return "Digital Service Approvals";
  }
  return menuName;
}

onMounted(async () => {
  if (!isOfflineOrSlowInternetConnection()) {
    startRenewTokenJob()
    startSyncTaskJob()
    startSyncTaskImageJob()
    if (authStore.user.SiteId) {
      await offlineDailyScheduleStore.getDailySchedules(authStore.user.SiteId)
      dailyScheduleStore.getDailySchedules(authStore.user.SiteId)
      dailyScheduleStore.getDailySchedulesInterim(authStore.user.SiteId)
      componentInterventionStore.getComponentInterventions(authStore.user.SiteId)
    }
    await componentInterventionStore.getParamDaysBeforeEst()
    await masterStore.getCBMMappingDataFromServer()
    await masterStore.getMasterDataFromServer()
  } else {
    syncCronStore.stopAllJob()
    await masterStore.getSymptoms()
    await masterStore.getActions()
    await masterStore.getCauses()
    await masterStore.getNAConditions()
    await masterStore.getCBMMappings()
    await masterStore.getPositions()
    await masterStore.getOwnership()
    interventionHeaderStore.getWorkOrdersFromLocal()
    fitterStore.setPersonalLaboursLocal()
  }
  // --- sync ---
  syncCronStore.stopAllJob()
  if (!isOfflineOrSlowInternetConnection()) {
    if (tokenIntervalId.value != null) return
    let intervalId = window.setInterval(async () => {
      await authStore.renewToken()
    }, 600000)
    cronStore.setTokenCronJob(intervalId)
    if (formDataIntervalId.value != null) return
    intervalId = window.setInterval(async () => {
      await syncStore.SyncData()
      await syncStore.SyncImage()
    }, 2000)
    cronStore.setFormSyncCronJob(intervalId)
    interventionHeaderStore.syncWithIronPortalData()
    interventionHeaderStore.getLatestSyncDate()
    if (authStore.user.SiteId) {
      interventionHeaderStore.getWorkOrders(authStore.user.SiteId)
    }
  } else {
    syncCronStore.stopAllJob()
  }
  // --- sync ---
})


/* methods */
const handleDownloadJSONInterventionForm = async (param) => {
  if (param.icon == "Updated") {
    return
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
    text: 'Please wait, we are downloading service sheet data to local device.',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await interventionHeaderStore.handleSetInterventionAccessibleOffline(selected);
  loading.close()
}

const handleDownloadJSONServiceForm = async (param) => {
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
  redirectByName('eformoffline')
}

const isActivePage = (route = ""): boolean => {
  let formattedName
  if (route != "") {
    formattedName = route.split("/")[2].replaceAll(" ", "").replaceAll("-", "").toLowerCase()
  }
  return formattedName === routes.name || hovered.value === true;
}
const getIconState = (route: string): string => {
  return isActivePage(route) ? '/media/svg/dma/side-menu/active/' : '/media/svg/dma/side-menu/inactive/';
}
const showLogoutConfirm = () => {
  logoutConfirm.value = true;
}

/* event handlers */
const closeNoNetworkDialog = () => {
  globalConnectionStore.setSubmitConnectionError(false)
}

const onWorkOrderSubmitted = (option: Option) => {
  dailyScheduleStore.setSelectedDailySchedule(option.value)
  generalStore.setSMUActual(Number(dailyScheduleStore.SelectedDailySchedule.smuDue))
  eFormStore.setModelAndPsTypeId(
    dailyScheduleStore.SelectedDailySchedule.equipmentModel,
    dailyScheduleStore.SelectedDailySchedule.psType,
    dailyScheduleStore.SelectedDailySchedule.workOrder,
    dailyScheduleStore.SelectedDailySchedule.equipmentModelName,
    dailyScheduleStore.SelectedDailySchedule.unitNumber
  );
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
      // errorBoxVisible.value = true
    }
  }
}

const renewTokenJob = computed(() => {
  return syncCronStore.jobRenewToken
})

const startRenewTokenJob = () => {
  if (renewTokenJob.value && renewTokenJob.value.running) return
  if (!renewTokenJob.value) {
    const job = new CronJob(
      "*/10 * * * *", // every 10 minutes
      async function () {
        renewToken(instance)
      }, // onTick
      null, // onComplete
      true
    );
    syncCronStore.setJobRenewTokenRunning(job)
  } else {
    renewTokenJob.value.start()
  }
}

const syncTaskJob = computed(() => {
  return syncCronStore.jobSyncTask
})

const startSyncTaskJob = () => {
  if (syncTaskJob.value && syncTaskJob.value.running) return
  if (!syncTaskJob.value) {
    syncStore.SyncData()
    const job = new CronJob(
      "*/3 * * * * *", // every 3 seconds
      function () {
        syncStore.SyncData()
      }, // onTick
      null, // onComplete
      true
    );
    syncCronStore.setJobSyncTaskRunning(job)
  } else {
    syncStore.SyncData()
    syncTaskJob.value.start()
  }
}

const syncTaskImageJob = computed(() => {
  return syncCronStore.jobSyncTaskImage
})

const startSyncTaskImageJob = () => {
  if (syncTaskImageJob.value && syncTaskImageJob.value.running) return
  if (!syncTaskImageJob.value) {
    if (!isOfflineOrSlowInternetConnection()) {
      syncStore.SyncImage()
    }
    const job = new CronJob(
      "*/3 * * * * *", // every 3 seconds
      function () {
        if (!isOfflineOrSlowInternetConnection()) {
          syncStore.SyncImage()
        }
      }, // onTick
      null, // onComplete
      true
    );
    syncCronStore.setJobSyncTaskImageRunning(job)
  } else {
    if (!isOfflineOrSlowInternetConnection()) {
      syncStore.SyncImage()
    }
    syncTaskImageJob.value.start()
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

const onButtonClick = (menu: string, menuLable = "") => {
  const formattedName = menu.split("/")[2].replaceAll(" ", "").replaceAll("-", "").toLowerCase()
  const offlineMenus = [
    'componentinterventionforms',
    'eformoffline',
    'eformv2',
    'pendingtaskmonitor'
  ]
  if (isOfflineOrSlowInternetConnection()) {
    if (!offlineMenus.includes(formattedName)) {
      return
    }
  }
  switch (formattedName) {
    case "eform":
      workOrderConfirm.value = true
      break
    case "eformoffline":
    case "eformv2":
      offlineWorkOrderConfirm.value = true
      break;
    case "componentinterventionforms":
      interventionConfirm.value = true
      break
    case "interimengineservice":
      interimConfirm.value = true
      break
    default:
      if (menuLable.includes("Guide")) {
          window.open(menu, '_blank')?.focus()
      } else {
        redirectByName(formattedName)
      }
  }
}

const { instance } = useMsal()

const onSignOutHandler = async () => {
  try {
    await instance.logoutPopup();
  } catch (error) {
    console.log(error)
  } finally {
    localStorage.clear();
    sessionStorage.clear();
    authStore.reset();
    store.reset();
    cronStore.releaseCronJob()
    syncCronStore.reset()
    try {
      const analytic = useAnalyticApi();
      if (analytic.provider) {
        analytic.provider.resetUser()
      }
    } catch (e) {
      console.log(e)
    } finally {
      await clearRecords(db, 'validTokenNew')
      router.push({ name: "signin" });
    }
  }
}
const onHideHandler = () => {
  logoutConfirm.value = false;
}
const handlePreviewDashboardIronForms = () => {
  redirectByName('ironforms')
}
onBeforeMount(async () => {
  await instance.acquireTokenSilent(loginRequest)
  profileLoading.value = true;
  await checkDMASignInStatus(online.value, instance);
  profileLoading.value = false;
});

watch(() => {
  return authStore.user.SiteId
}, async (newVal) => {
  if (newVal) {
    await offlineDailyScheduleStore.getDailySchedules(authStore.user.SiteId)
    dailyScheduleStore.getDailySchedules(authStore.user.SiteId)
    dailyScheduleStore.getDailySchedulesInterim(authStore.user.SiteId)
    componentInterventionStore.getComponentInterventions(authStore.user.SiteId)
  }
})

watch(online, (value) => {
  if (value) {
    startRenewTokenJob()
    startSyncTaskJob()
    startSyncTaskImageJob()
  } else {
    syncCronStore.stopAllJob()
  }
})
</script>

<style lang="scss" scoped>
    body:not(.el-dialog) {
      padding-right: 0px !important;
    }
    .full-page {
        background-color: #FFFFFF;
        height: 100%;
    }
    .logo-wrapper {
        background-color: #FFFFFF;
        margin-top: 0;
    }
    .menu-wrapper {
        margin:0;
        padding: 0;
    }
    .menu {
        background: #FFFFFF;
        box-shadow: 0px 12px 24px -4px rgba(145, 158, 171, 0.12);
        border-radius: 4px;
        color: #212B36;
        margin-bottom: 15px;
        &:hover {
            background: #18AF4A;
            color: #FFFFFF;

            .label {
                color: #FFFFFF;
            }
        }
        .label {
            margin-top:15px;
            font-weight: 400;
            font-size: 12px;
            line-height: 18px;
        }
    }
    .active {
      background: #18AF4A;
      .label {
        color: white;
      }
    }
</style>

<style lang="scss" scoped>
  @import "@/assets/sass/core/components/menu/notif-menu.scss";
</style>

<style>
body:not(.el-dialog) {
  padding-right: 0px !important;
}
</style>
