<template>
  <FormViewer :title="title || 'Interim Engine Service'" :defect-close-first="true" page-from="monitoringstatus" />
  <FormAlreadyOpenedByOtherSupervisor :show="isFormOpenedByOtherSupervisor" @close="handleExitFormOpenedByOtherSupervisor" />
</template>
<script setup lang="ts">
import {
  useInterimPreviewFormStore
} from "@/store/pinia/dma/preview-form-interim/useInterimPreviewFormStore";
import {
  computed,
  defineProps,
} from "vue";
import FormViewer from "@/views/dma/components/form-preview/interim-engine-service/Index.vue";
import { useRouter } from "vue-router";
import FormAlreadyOpenedByOtherSupervisor from '../../../../e-form/sub-group/task-group/task/item/dialog/FormAlreadyOpenedByOtherSupervisor.vue'

defineProps(['title'])

const previewStore = useInterimPreviewFormStore()

const router = useRouter()

const isFormOpenedByOtherSupervisor = computed(() => {
  return previewStore.stateIsFormSelectedByOtherSupervisor
})

const handleExitFormOpenedByOtherSupervisor = () => {
  router.push({ name: 'ironforms' })
}
</script>

<style lang="scss" scoped>
  .e-form-container {
    font-family: 'Public sans' !important;
  }
</style>
