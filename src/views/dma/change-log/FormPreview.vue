<template>
    <FormViewer title="Digital Service" :view-empty="true" v-if="!isLoadedForm"/>
    <GeneralDialog modal-type="taskError" :show="taskErrorDialog" @close="handleExitTaskAlreadyUpdated" :message="errorMessagetaskErrorDialog" />
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onBeforeMount
} from 'vue'
import { useRoute } from 'vue-router'
import FormViewer from "@/views/dma/components/form-preview/Index.vue";
import GeneralDialog from '@/views/dma/components/GeneralDialog.vue';
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore'
import { ElLoading } from 'element-plus';
import { useRouter } from "vue-router";
import {
  checkDMASignInStatus
} from "@/core/helpers/get-user-info"
import { useOnline } from '@vueuse/core'
import { isEmpty } from 'lodash';
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const router = useRouter()
const route = useRoute()
const previewFormStore = usePreviewFormStore()
const online = useOnline()

const taskErrorDialog = ref(false)
const loading = ref()

const isLoadedForm = computed(() => {
  return isEmpty(previewFormStore.stateGeneralForm)
})

const model = computed(() => {
  return route.params?.model as string ?? ""
})
const psType = computed(() => {
  return route.params?.pstype as string ?? ""
})

const handleFetchForm = async () => {
  const item = {
    brand: "",
    equipmentModel: model.value,
    psType: psType.value,
    workOrder: "",
    unitNumber: ""
  }
  previewFormStore.setModelAndPsTypeId(`${item.equipmentModel.replace("--", "/")}`, item.psType.toString(), item.workOrder, item.unitNumber)
  await previewFormStore.getEmptyForm()

  if (previewFormStore.errorMessage != '') {
    taskErrorDialog.value = true
  }
}

const errorMessagetaskErrorDialog = computed(() => {
  return previewFormStore.errorMessage
})

const handleExitTaskAlreadyUpdated = () => {
  taskErrorDialog.value = false
  router.push({ name: 'ironforms' })
}

onBeforeMount(async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Generating Form',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await checkDMASignInStatus(!isOfflineOrSlowInternetConnection())
  await handleFetchForm()
  loading.value.close()
});
</script>

<style scoped>
.button-wrapper-left {
  position: fixed;
  left: 0;
  bottom: 10px;
  width: 300px
}
</style>
