<template>
  <div class="d-flex justify-content-between">
    <template v-for="(group, index) in groups" :key="group.key">
      <div class="d-flex flex-column m-1 mb-3 stepper-button" :class="completedTask(group)" style="flex: 1;">
          <div class="box-menu text-center p-2 d-flex justify-content-center align-items-center stepper-title"
            :class="[classGenerator(group.key, group.name)]"
            @click="handleChangeSelectedGroup(group.key, group.name)">
            <span>{{ group.name }}</span>
          </div>
          <div class="text-center box-pill rounded-pill mt-2 mb-4 stepper-button-info w-100 py-2 clickable" v-if="infoVisible" :class="index == 0 ? 'invisible': ''">
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
import {
  ComponentInterventionGroup
} from '@/core/types/entities/dma/component-intervention/ComponentInterventionGroup';
import {
  useComponentInterventionEformStore
} from '@/store/pinia/dma/component-intervention/useComponentInterventionEformStore';
import {
  useGeneralComponentInterventionFormStore
} from '@/store/pinia/dma/component-intervention/useGeneralComponentInterventionFormStore';
import {
  computed,
  ref,
  defineProps
} from 'vue';
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { ElLoading } from 'element-plus';

const store = useComponentInterventionEformStore();
const generalStore = useGeneralComponentInterventionFormStore();
const globalConnectionStore = useGlobalConnectionStore();

const props = defineProps({
  isMonitoring: {
    required: false,
    type: Boolean,
    default: false,
  }
})

const selectedGroup = computed(() => {
  return store.selectedGroup;
});

const isUpdated = computed(() => {
  return generalStore.generalUpdated;
});

const chevronClass = ref("fa-chevron-up");
const infoVisible = ref(true);

const groups = computed(() => {
  return store.stateGroups
})

const handleChangeSelectedGroup = (async (id: string, groupName: string) => {
  if (!globalConnectionStore.stateConnectionStatus) {
    globalConnectionStore.setSubmitConnectionError(true)
  } else {
    if (!props.isMonitoring) {
      if (isUpdated.value == false) return;
    }
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading Intervention Form',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    store.setSelectedGroup(id)
    await store.updateGroupByParam(groupName)
    loading.close()
  }
});
const toggleInfoVisibility = () => {
  infoVisible.value = !infoVisible.value;
  chevronClass.value = infoVisible.value ? "fa-chevron-up" : "fa-chevron-down";
}

const completedTask = (group: ComponentInterventionGroup) => {
  let className = ''
  if (group.totalTask > 0) {
    const notGeneralNDefectIdentifedGroup = group.name != "General"
    const isTaskDone = group.totalTask == group.doneTask
    const isSelectedGroup = group.key == selectedGroup.value?.key
    if (notGeneralNDefectIdentifedGroup && isTaskDone) className = 'done-task'
    if (notGeneralNDefectIdentifedGroup && isTaskDone && isSelectedGroup) className = 'done-task-selected'
  }
  return className
}

const classGenerator = (grupId: string, groupName: string): string => {
  let className = "";
  className = grupId == selectedGroup.value?.key ? 'active' : '';
  if (!props.isMonitoring) {
    if (groupName != 'General') {
      if (isUpdated.value === false) {
        className += " disabled";
      }
    }
  }
  return className;
}
</script>

<style scoped>
  .clickable {
    cursor: pointer;
  }
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
