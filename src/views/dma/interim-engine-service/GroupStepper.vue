<template>
  <div class="d-flex justify-content-between">
    <template v-for="(group, index) in groups" :key="group.id">
      <div class="d-flex flex-column m-1 mb-3 stepper-button" :class="completedTask(group)">
          <div class="box-menu text-center p-2 d-flex justify-content-center align-items-center stepper-title"
            :class="[classGenerator(group.id, group)]"
            @click="handleChangeSelectedGroup(group.id, group.groupName, group)">
            <span>{{ group.groupLabel }}</span>
          </div>
          <div @click="handleGoToUnfilledTask(group)" class="text-center box-pill rounded-pill mt-2 mb-4 stepper-button-info w-100 py-2" v-if="infoVisible"
          :class="[index == 0 ? 'invisible': '', classGenerator(group.id, group)]">
            Done {{ group.doneTask }}/{{ group.totalTask }}
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
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore';
import {
  useInterimEngineStore
} from '@/store/pinia/dma/interim-engine-service/useInterimEngineStore';
import {
  useInterimGeneralFormStore
} from "@/store/pinia/dma/interim-engine-service/useInterimGeneralFormStore";
import { ElLoading } from 'element-plus';
import {
  defineProps,
  PropType,
  computed,
  ref
} from 'vue';
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { isUndefined } from 'lodash';

defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    default() {
      return []
    }
  }
});

const store = useInterimEngineStore();
const defectStore = useInterimDefectsStore()
const generalStore = useInterimGeneralFormStore()
const globalConnectionStore = useGlobalConnectionStore()

const selectedGroup = computed(() => {
  return store.selectedGroup;
});

const generalSubmitted = computed(() => {
  return generalStore.generalUpdated;
});

const completedTask = (group: Group) => {
  let className = ''
  if (group.totalTask > 0) {
    const notGeneralNDefectIdentifedGroup = group.groupName != "General" && group.groupName != "DEFECT_IDENTIFIED_SERVICE"
    const isTaskDone = group.totalTask == group.doneTask
    const isSelectedGroup = group.id == selectedGroup.value?.id
    if (notGeneralNDefectIdentifedGroup && isTaskDone) className = 'done-task'
    if (notGeneralNDefectIdentifedGroup && isTaskDone && isSelectedGroup) className = 'done-task-selected'
  }
  return className
}

const preServiceGroup = computed(() => {
  return store.groups.find((item) => {
    return item.groupName == "PRE_SERVICE_OPERATIONAL_CHECK"
  })
})

const classGenerator = (grupId: string, group: Group): string => {
  let className = "";
  className = grupId == selectedGroup.value?.id ? 'active' : '';
  if (!isUndefined(group.isDisable) && group.isDisable == "true") {
    className += " disabled";
  }
  if (!isUndefined(preServiceGroup.value) && !isUndefined(preServiceGroup.value.doneTask)) {
    if (preServiceGroup.value!.doneTask != preServiceGroup.value?.totalTask) {
      if (group.groupName != preServiceGroup.value!.groupName && group.groupName != "DEFECT_IDENTIFIED_SERVICE" && group.groupName != "General") {
        className += " disabled";
      }
    }
  }
  return className;
}

const chevronClass = ref("fa-chevron-up");
const infoVisible = ref(true);

const handleChangeSelectedGroup = (async (id: string, groupName: string, group: Group) => {
  if (!isUndefined(group.isDisable) && group.isDisable == "true") return
  if (!isUndefined(preServiceGroup.value) && !isUndefined(preServiceGroup.value.doneTask)) {
    if (preServiceGroup.value!.doneTask != preServiceGroup.value?.totalTask) {
      if (group.groupName != preServiceGroup.value!.groupName && group.groupName != "DEFECT_IDENTIFIED_SERVICE" && group.groupName != "General") {
        return
      }
    }
  }
  if (!globalConnectionStore.stateConnectionStatus) {
    globalConnectionStore.setSubmitConnectionError(true)
  } else {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading E-Form',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    store.setSelectedGroup(id)
    await store.getTaskProgress()
    if (groupName == "DEFECT_IDENTIFIED_SERVICE") {
      await defectStore.getDefectsData(store.generalForm.workOrder)
    } else {
      await store.updateGroupByParam(groupName)
    }
    loading.close()
  }
});

const handleGoToUnfilledTask = async (group) => {
  if (!generalSubmitted.value) return
  if (store.selectedGroup?.groupName != group.groupName) {
    await handleChangeSelectedGroup(group.id, group.groupName, group)
  }
  if (!isUndefined(group.isDisable) && group.isDisable == "true") return
  if (!isUndefined(preServiceGroup.value) && !isUndefined(preServiceGroup.value.doneTask)) {
    if (preServiceGroup.value!.doneTask != preServiceGroup.value?.totalTask) {
      if (group.groupName != preServiceGroup.value!.groupName && group.groupName != "DEFECT_IDENTIFIED_SERVICE" && group.groupName != "General") {
        return
      }
    }
  }
  if (group.totalTask != group.doneTask) {
    store.handleScrollToUnfilledTask()
  }
}

const toggleInfoVisibility = () => {
  infoVisible.value = !infoVisible.value;
  chevronClass.value = infoVisible.value ? "fa-chevron-up" : "fa-chevron-down";
}
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
    cursor: not-allowed;
  }
</style>
