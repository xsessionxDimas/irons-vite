<template>
  <div class="d-flex justify-content-between">
    <template v-for="(group, index) in groups" :key="group.id">
      <div class="d-flex flex-column m-1 mb-3 stepper-button" :class="completedTask(group)">
          <div class="box-menu text-center p-2 d-flex justify-content-center align-items-center stepper-title"
            :class="[group.id == selectedGroup?.id ? 'active' : '', classGenerator(group.id, group)]"
            @click="handleChangeSelectedGroup(group.id, group.groupName, group)">
            <span>{{ group.groupLabel }}</span>
          </div>
          <div class="text-center box-pill rounded-pill mt-2 mb-4 stepper-button-info w-100 py-2" v-if="infoVisible" :class="[index == 0 ? 'invisible': '', group.id == selectedGroup?.id ? 'active' : '',  classGenerator(group)]">
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
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore';
import { ElLoading } from 'element-plus';
import { isUndefined } from 'lodash';
import {
  defineProps,
  PropType,
  computed,
  ref
} from 'vue';
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore';
import {
  useDefectsStore as useOfflineDefectsStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsStore';
import IronformConfig from "@/core/config/IronformConfig";
import {
  classGenerator as classGeneratorFunc,
  classGeneratorParams
} from '@/views/dma/e-form-offline/shared/service-tab-class-generator';

const store = usePreviewFormStore();
const defectStore = useDefectsStore()
const offlinedefectStore = useOfflineDefectsStore()

const selectedGroup = computed(() => {
  return store.selectedGroup;
});

const chevronClass = ref("fa-chevron-up");
const infoVisible = ref(true);
const enableSkipPreservice = ref(IronformConfig.enableSkipPreservice)

const props = defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    default() {
      return []
    }
  },
  isMonitoring: {
    type: Boolean,
    default: false
  },
  viewEmpty: {
    type: Boolean,
    required: false,
    default: false
  }
});

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
    isUpdated: true,
    skipPreService: true,
    enableSkipPreservice: enableSkipPreservice.value,
    preServiceGroup: preServiceGroup.value
  }
  return classGeneratorFunc(params)
}

const handleChangeSelectedGroup = (async (id: string, groupName: string, group: Group) => {
  if (!props.isMonitoring) {
    if (!isUndefined(group.isDisable) && group.isDisable == "true") return
  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  store.setSelectedGroup(id)
  if (!props.viewEmpty) {
    await store.getTaskProgress()
    if (groupName != "DEFECT_IDENTIFIED_SERVICE") {
      await store.updateGroupByParam(groupName)
    } else {
      await defectStore.getDefectsData(store.generalForm.workOrder)  
    }
    await offlinedefectStore.getDefectsData(store.generalForm.workOrder)
    await offlinedefectStore.saveDefectServiceFormToLocalDB(store.generalForm.workOrder)
  }
  loading.close()
});

const toggleInfoVisibility = () => {
  infoVisible.value = !infoVisible.value;
  chevronClass.value = infoVisible.value ? "fa-chevron-up" : "fa-chevron-down";
}

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
</script>

<style scoped>
  .box-menu {
    min-height: 80px;
    background: #DFE3E8;
    border-radius: 12px;
    cursor: pointer;
    font-size: 12px;
    height: 100%;
    word-break: initial;
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
