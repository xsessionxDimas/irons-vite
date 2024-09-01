<template>
  <div class="row justify-content-end">
      <div class="col-3 col-sm-2 col-xl-1">
        <div class="row justify-content-end">
          <button :disabled="disabled" type="button" class="btn btn-success" @click="handleShowNextPage" style="background-color: #18AF4A;">Submit</button>
        </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useInterimEngineStore
} from "@/store/pinia/dma/interim-engine-service/useInterimEngineStore";
import { ElLoading } from "element-plus";
import { computed, defineEmits, defineProps } from "vue";

defineProps({
  disabled: {
    default: false,
  }
})

const previewStore = useInterimEngineStore();
const emits = defineEmits(['submit'])

const isTaskAllDone = computed(() => {
  return previewStore.isAllTaskDone
})

const buttonLabel = computed(() => {
  return isTaskAllDone.value && previewStore.generalForm.status != "Submited" ? 'Submit' : 'Next'
})

const handleShowNextPage = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  // always submit because just 1 tab only
  // to illegally submit form
  // const status = true
  const status = await previewStore.setShowNextPage(buttonLabel.value);
  if (status) {
    emits('submit', status)
  }
  loading.close()
};
</script>
