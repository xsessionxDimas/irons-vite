<template>
  <PbiReport
    :reportName="reportName"
    :analyticPage="analyticPage"
    :idPageName="idPageName"
    :isPublic="isPublic"
    :pbiReportId="reportId"
    :pbiWorkspaceId="workspaceId"
    :isHideVisualHeaders="isHideVisualHeaders"
  />
</template>

<script lang="ts" setup>
import {
  computed,
  ComputedRef,
  defineProps,
  onBeforeMount,
  onMounted,
  onUnmounted
} from 'vue';
import { useErrorHandleStore } from '../../../../store/templates/useErrorStore';
import { usePbiEmbeddedStore } from '../../../../store/templates/usePbiEmbeddedStore';
import { generateId as generateIdHelper } from '../../../../core/helpers/generate-id';
import {
  Mutations as ErrorHandleMutations
} from "../../../../store/enums/ErrorHandleEnum"
import PbiReport from '../../../../components/pbi/PbiReportCbm.vue';
import {
  Mutations
} from "../../../../store/enums/PbiEmbeddedEnums";

const props = defineProps([
  "breadCrumb",
  "reportName",
  "analyticPage",
  "eventName",
  "isPublic",
  "isHideVisualHeaders",
])
const store = useErrorHandleStore();
const pbiStore = usePbiEmbeddedStore();

const reportId = "a9befe6f-7bc4-4d4a-91c1-8715b01416c5";
const workspaceId = "d90b69f1-3a2e-423e-9e27-e341dc02a972";

// start: COMPUTED ==============================================
const idPageName = computed(() => {
  return generateIdHelper(5);
})

const generatePageName: ComputedRef<string> = computed(() => {
  return `${props.analyticPage}-${idPageName.value}`
})
// end: COMPUTED ==============================================

// start: METHODS ===============================================
// end: METHODS ===============================================

onBeforeMount(() => {
  pbiStore[Mutations.SET_PBI_URL](`${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}`)
})

onMounted(async () => {
  store[ErrorHandleMutations.SET_ERROR_PAGES](generatePageName.value)
})

onUnmounted(async () => {
  // reset error state
  store[ErrorHandleMutations.SET_ERROR_PAGES](generatePageName.value)
})
</script>
