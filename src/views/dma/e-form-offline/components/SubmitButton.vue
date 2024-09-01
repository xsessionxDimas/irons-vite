<template>
  <div class="row justify-content-end">
    <template v-if="showNextButton">
      <div class="col-3 col-sm-2 col-xl-1">
        <div class="row justify-content-end">
          <button type="button" class="btn btn-success" :disabled="isEmptyEmployee(previewStore.employee)" @click="handleShowNextPage" style="background-color: #18AF4A;">{{ buttonLabel }}</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsStore";
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import { ElLoading } from "element-plus";
import { computed, defineEmits } from "vue";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { isEmpty } from "lodash";
import {
  Mechanic
} from "@/core/types/entities/dma/e-form/general/ServicePersonnel";

const previewStore = useEFormStore();
const emits = defineEmits(['submit'])
const defectStore = useDefectsStore()

const handleShowNextPage = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const status = await previewStore.setShowNextPage(buttonLabel.value);
  // to illegally submit form
  // const status = true
  if (status && buttonLabel.value == 'Submit') {
    emits('submit', status)
  } else {
    if (previewStore.stateSelectedGroup.groupName == "DEFECT_IDENTIFIED_SERVICE") {
      if (isOfflineOrSlowInternetConnection()) {
        await defectStore.getDefectFromLocalDB(previewStore.generalForm.workOrder)
      }
    }
  }
  loading.close()
};

const isEmptyEmployee = (employee: Mechanic) => {
  if (isEmpty(employee)) return true
  if (!employee.id && !employee.name && isTaskAllDone.value) return true;
  return false
}

const buttonLabel = computed(() => {
  return isTaskAllDone.value && previewStore.generalForm.status != "Submited" ? 'Submit' : 'Next'
})

const isTaskAllDone = computed(() => {
  return previewStore.isAllTaskDone
})

const showNextButton = computed(() => {
  const currentGroup = previewStore.stateGroups.findIndex((group) => {
    return group.groupName == previewStore.stateSelectedGroup?.groupName;
  });
  if (currentGroup + 1 >= previewStore.groups.length) {
    if (currentGroup + 1 == previewStore.groups.length) {
      if (buttonLabel.value == "Submit") {
        return true
      }
    }
    return false;
  }
  return true;
});
</script>
