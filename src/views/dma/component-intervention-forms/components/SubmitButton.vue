<template>
  <div class="row justify-content-end">
    <div class="col-3 col-sm-2 col-xl-1">
      <div class="row justify-content-end">
        <button type="button" class="btn btn-success" :disabled="!showNextButton" @click="handleShowNextPage" style="background-color: #18AF4A;">Submit</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useComponentInterventionEformStore
} from "@/store/pinia/dma/component-intervention/useComponentInterventionEformStore";
import { ElLoading } from "element-plus";
import { computed, defineEmits } from "vue";

const previewStore = useComponentInterventionEformStore();
const emits = defineEmits(['submit'])

const handleShowNextPage = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const status = await previewStore.setShowNextPage();
  if (status) {
    emits('submit', status)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loading.close()
};

const showNextButton = computed(() => {
  // const currentGroup = previewStore.stateGroups.findIndex((group) => {
  //   return group.name == previewStore.stateSelectedGroup?.name;
  // });
  // if (currentGroup + 1 > previewStore.groups.length) {
  //   return false;
  // }
  // return true;
  return previewStore.isAllTaskDone && previewStore.allCustomValidationRequiredDone
});
</script>
