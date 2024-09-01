<template>
  <FormViewer :title="`Digital Service Approval - ${previewStore.generalForm.equipment} - ${previewStore.generalForm.workOrder}`" :defect-close-first="false" page-from="approval">
    <template #buttonEndOfGroup>
      <div class="row justify-content-center w-100">
        <div class="col-12 col-lg-12 pe-0 ps-4">
          <div class="d-flex row justify-contend-end">
            <button type="button" class="btn btn-success" @click="handleConfirmation" style="background-color: #18AF4A;">Submit</button>
          </div>
        </div>
      </div>
    </template>
  </FormViewer>
  <SubmitComplete :show="!previewForm"  @close="handleCloseDialog"/>
  <Confirmation :visibility="confirmExitVisibility"
    caption="Are you sure closing the e-form?"
    @on-no-confirm="onConfirmExitCancel"
    @on-yes-confirm="handleCloseForm"/>
  <SubmitComplete :show="showCompleteDialog" @close="handleClose" />
</template>
<script setup lang="ts">
import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import {
  computed,
  ref
} from "vue";
import FormViewer from "@/views/dma/components/form-preview/Index.vue";
import { useRouter } from "vue-router";
import SubmitComplete from './components/SubmitComplete.vue'
import { ElLoading } from "element-plus";
import Confirmation from '@/components/dialog/Confirmation.vue';

const previewStore = usePreviewFormStore()
const router = useRouter()
const confirmExitVisibility = ref(false)
const showCompleteDialog = ref(false)

const previewForm = computed(() => {
  return previewStore.formPreview || true
})

const handleCloseDialog = () => {
  router.push({ name: 'approval' })
  previewStore.changePreviewForm(true)
}


const handleConfirmation = () => {
  confirmExitVisibility.value = true
}


const onConfirmExitCancel = () => {
  confirmExitVisibility.value = false;
}
const handleCloseForm = async () => {
  confirmExitVisibility.value = false
  const loading = ElLoading.service({
    lock: true,
    text: 'Closing Form',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const status = await previewStore.closeForm()
  previewStore.changePreviewForm(false)
  loading.close()
  if (status) {
    showCompleteDialog.value = true
  }
}

const handleClose = () => {
  showCompleteDialog.value = false
  router.push({ name: "approval" })
}
</script>

<style lang="scss" scoped>
  .e-form-container {
    font-family: 'Public sans' !important;
  }
</style>
