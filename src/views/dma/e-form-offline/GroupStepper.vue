<template>
  <div class="d-flex justify-content-between">
    <template v-for="(group, index) in groups" :key="group.id">
      <div class="d-flex flex-column m-1 mb-3 stepper-button" :class="completedTask(group)">
          <div class="box-menu text-center p-2 d-flex justify-content-center align-items-center stepper-title"
            :class="[classGenerator(group.id, group)]"
            @click="handleChangeSelectedGroup(group.id, group.groupName, group)">
            <span>{{ group.groupLabel }}</span>
          </div>
          <div
            v-if="infoVisible"
            class="text-center box-pill rounded-pill mt-2 mb-4 stepper-button-info w-100 py-2 cursor-pointer"
            :class="[index == 0 ? 'invisible': '', classGenerator(group.id, group)]"
            @click="handleGoToUnfilledTask(group)"
          >
            <p v-if="group.groupName == 'DEFECT_IDENTIFIED_SERVICE'" class="mb-0">Found: {{ group.totalTask }} item(s)</p>
            <p v-else class="mb-0">Done {{ group.doneTask }}/{{ group.totalTask }}</p>
          </div>
      </div>
    </template>
    <div>
      <button class="border-0 mt-10 align-items-center" @click="toggleInfoVisibility"
      style="background:transparent">
        <em class="fa" :class="chevronClass"></em>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Group } from '@/core/types/entities/dma/e-form/group';
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsStore';
import { useEFormStore } from '@/store/pinia/dma/e-form-offline/useEFormStore';
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore";
import { ElLoading } from 'element-plus';
import {
  defineProps,
  PropType,
  computed,
  ref,
  watch
} from 'vue';
import { isUndefined } from 'lodash';
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  ILoadingInstance
} from 'element-plus/lib/el-loading/src/loading.type';
import IronformConfig from "@/core/config/IronformConfig";
import {
  classGenerator as classGeneratorFunc,
  classGeneratorParams
} from '@/views/dma/e-form-offline/shared/service-tab-class-generator';

defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    default() {
      return []
    }
  }
});

const store = useEFormStore();
const defectStore = useDefectsStore()
const generalStore = useGeneralFormStore()

const loader = ref<ILoadingInstance>()
const chevronClass = ref("fa-chevron-up");
const infoVisible = ref(true);
const enableSkipPreservice = ref(IronformConfig.enableSkipPreservice)

let selectedId = ref("")
let selectedGroupName = ref("")
let selectedGroupObj = ref<Group>({} as Group)

const selectedGroup = computed(() => {
  return store.selectedGroup;
});

const isUpdated = computed(() => {
  return generalStore.generalUpdated;
});

/**
 * Determines the CSS class for a completed task based on the group's properties.
 * @param {Group} group - The group object containing task information.
 * @returns {string} - The CSS class for the completed task.
 */
const completedTask = (group: Group) => {
  if (group.totalTask <= 0) return '';
  const isSpecialGroup = group.groupName !== "General" && group.groupName !== "DEFECT_IDENTIFIED_SERVICE";
  const isTaskDone = group.totalTask === group.doneTask;
  const isSelectedGroup = group.id === selectedGroup.value?.id;
  if (isSpecialGroup && isTaskDone) {
    return isSelectedGroup ? 'done-task-selected' : 'done-task';
  }
  return '';
}

const preServiceGroup = computed(() => {
  return store.groups.find((item) => {
    return item.groupName == "PRE_SERVICE_OPERATIONAL_CHECK"
  })
})

const classGenerator = (groupId: string, group: Group): string => {
  const params: classGeneratorParams = {
    groupId,
    group,
    selectedGroup: selectedGroup.value,
    isUpdated: isUpdated.value,
    skipPreService: store.skipPreService,
    enableSkipPreservice: enableSkipPreservice.value,
    preServiceGroup: preServiceGroup.value
  }
  return classGeneratorFunc(params)
}

const shouldReturnBasedOnDisableStatus = (group: Group) => {
  return !isUndefined(group.isDisable) && group.isDisable === "true";
}
const shouldReturnBasedOnPreService = (group: Group) => {
  if (!isUndefined(preServiceGroup.value) && !isUndefined(preServiceGroup.value.doneTask)) {
    if (preServiceGroup.value.doneTask !== preServiceGroup.value.totalTask) {
      return group.groupName !== preServiceGroup.value.groupName && group.groupName !== "DEFECT_IDENTIFIED_SERVICE" && group.groupName !== "General";
    }
  }
}

const handleChangeSelectedGroup = (async (id: string, groupName: string, group: Group) => {
  selectedId.value = id
  selectedGroupName.value = groupName
  selectedGroupObj.value = group
  if (!isUndefined(group.isDisable) && group.isDisable == "true") {
    return
  }
  if (!store.skipPreService && shouldReturnBasedOnPreService(group) && enableSkipPreservice.value) return;
  if (shouldReturnBasedOnDisableStatus(group)) return;
  loader.value = ElLoading.service({
    lock: true,
    text: 'Loading E-Form',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    await store.setSelectedGroup(id)
    if (!isOfflineOrSlowInternetConnection()) {
      await store.getTaskProgress()
      if (groupName == "DEFECT_IDENTIFIED_SERVICE") {
        const isOfflineTaskPending = await store.checkCurrentWoPendingOfflineTask()
        if (isOfflineTaskPending) {
          await defectStore.getDefectFromLocalDB(store.generalForm.workOrder)
        } else {
          await defectStore.getDefectsData(store.generalForm.workOrder)
          await defectStore.saveDefectServiceFormToLocalDB(store.generalForm.workOrder)
        }
      } else {
        await store.updateGroupByParam(groupName)
        await defectStore.getDefectsData(store.generalForm.workOrder)
        changeSMUDataFromServer()
        await defectStore.saveDefectServiceFormToLocalDB(store.generalForm.workOrder)
      }
    } else {
      if (groupName == "DEFECT_IDENTIFIED_SERVICE") {
        await defectStore.getDefectFromLocalDB(store.generalForm.workOrder)
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loader.value.close()
    loader.value = undefined
  }
});

const changeSMUDataFromServer = () => {
  if (Object.keys(defectStore.DefectSMUHeader).length > 0) {
    const detail = defectStore.stateData.DefectDetails.find((obj) => {
      return obj.defectHeaderId == defectStore.DefectSMUHeader.id
    })
    store.generalForm.smu = detail?.detail.machineSMU;
    store.generalForm.imageEquipment = JSON.parse(detail?.detail.images);
  }
}

const handleGoToUnfilledTask = async (group) => {
  if (!isUpdated.value) return
  if (store.selectedGroup?.groupName != group.groupName) {
    await handleChangeSelectedGroup(group.id, group.groupName, group)
  }
  if (!store.skipPreService && shouldReturnBasedOnPreService(group) && enableSkipPreservice.value) return;
  if (shouldReturnBasedOnDisableStatus(group)) return;
  if (group.totalTask != group.doneTask) {
    store.handleScrollToUnfilledTask()
  }
}

const toggleInfoVisibility = () => {
  infoVisible.value = !infoVisible.value;
  chevronClass.value = infoVisible.value ? "fa-chevron-up" : "fa-chevron-down";
}

const onlineVal = computed(() => {
  return !isOfflineOrSlowInternetConnection()
})

watch(onlineVal, async (newVal, old) => {
  if (!newVal && old) {
    if (loader.value) {
      handleChangeSelectedGroup(selectedId.value, selectedGroupName.value, selectedGroupObj.value)
    }
  }
})
</script>

<style scoped>
  .box-menu {
    min-height: 80px;
    background: #DFE3E8;
    border-radius: 12px;
    cursor: pointer;
    font-size: 12px;
    height: 100%;
  }
  .box-pill {
    background: #DFE3E8;
    font-size: 12px;
  }
  .active {
    background: #01A3FF;
    color: white;
  }
  .disabled {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed !important;
  }
  .cursor-pointer {
    cursor: pointer
  }
</style>
