<template>
  <div class="d-flex justify-content-between">
    <template v-for="(group, index) in groups" :key="group.id">
      <div class="d-flex flex-column m-1 mb-3 stepper-button" :class="completedTask(group)">
          <div class="box-menu text-center p-2 d-flex justify-content-center align-items-center stepper-title"
            :class="[group.id == selectedGroup?.id ? 'active' : '', classGenerator(group)]"
            @click="handleChangeSelectedGroup(group.id, group.groupName, group)">
            <span>{{ group.groupLabel }}</span>
          </div>
          <div class="text-center box-pill rounded-pill mt-2 mb-4 stepper-button-info w-100 py-2" v-if="infoVisible" :class="[index == 0 ? 'invisible': '', group.id == selectedGroup?.id ? 'active' : '', classGenerator(group)]">
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
  useInterimPreviewFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewFormStore';
import { ElLoading } from 'element-plus';
import { isUndefined } from 'lodash';
import {
  defineProps,
  PropType,
  computed,
  ref
} from 'vue';

const store = useInterimPreviewFormStore();

const selectedGroup = computed(() => {
  return store.selectedGroup;
});

const chevronClass = ref("fa-chevron-up");
const infoVisible = ref(true);

defineProps({
  groups: {
    type: Array as PropType<Group[]>,
    default() {
      return []
    }
  }
});

const classGenerator = (group: Group): string => {
  let className = "";
  if (!isUndefined(group.isDisable) && group.isDisable == "true") {
    className += " disabled";
  }
  return className;
}

const handleChangeSelectedGroup = (async (id: string, groupName: string, group: Group) => {
  if (!isUndefined(group.isDisable) && group.isDisable == "true") return
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  store.setSelectedGroup(id)
  await store.getTaskProgress()
  if (groupName != "DEFECT_IDENTIFIED_SERVICE") {
    await store.updateGroupByParam(groupName)
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
    const notGeneralNDefectIdentifedGroup = group.groupName != "General-interim" && group.groupName != "DEFECT_IDENTIFIED_SERVICE"
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
