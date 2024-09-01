<template>
  <FormViewer :hideBackBtnComp="hideBackBtnComp" :title="title || 'Digital Service'" :defect-close-first="true" page-from="monitoringstatus" />
  <FormAlreadyOpenedByOtherSupervisor :show="isFormOpenedByOtherSupervisor" @close="handleExitFormOpenedByOtherSupervisor" />
</template>
<script setup lang="ts">
import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import {
  computed,
  defineProps,
} from "vue";
import FormViewer from "@/views/dma/components/form-preview/Index.vue";
import { useRouter } from "vue-router";
import FormAlreadyOpenedByOtherSupervisor from '../../../e-form/sub-group/task-group/task/item/dialog/FormAlreadyOpenedByOtherSupervisor.vue'

// defineProps(['title'])
const props = defineProps<{
  title?: string,
  hideBackBtn?: boolean
}>()

const hideBackBtnComp = computed(() => {
  return props.hideBackBtn ? true : false
})

const previewStore = usePreviewFormStore()

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
