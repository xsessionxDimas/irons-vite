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
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
import { useStore } from 'vuex';
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { generateId as generateIdHelper } from '@/core/helpers/generate-id';
import {
  Mutations as ErrorHandleMutations
} from "@/store/enums/ErrorHandleEnum"
import { Mutations as PageMutations } from '@/store/enums/PageEnum';
import PbiReport from '@/components/pbi/PbiReportCbm.vue';
import {
  Mutations
} from "@/store/enums/PbiEmbeddedEnums";

const props = defineProps([
  "breadCrumb",
  "reportName",
  "analyticPage",
  "eventName",
  "isPublic",
  "isHideVisualHeaders",
])
const store = useStore();

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
  store.commit(Mutations.SET_PBI_URL, `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}`)
})

onMounted(async () => {
  store.commit(ErrorHandleMutations.SET_ERROR_PAGES, generatePageName.value)
  // store.dispatch(StoreActions.ACTIVE_PAGE, props.breadCrumb.activePage);
  // setCurrentPageBreadcrumbs(props.breadCrumb.currentPageBreadCrumb,
  //   props.breadCrumb.breadCrumbList
  // );
  // store.commit(PageMutations.SET_CURRENT_MODULE, {
  //   module: generatePageName.value,
  //   initialPage: 'pbi-list-module'
  // })
})

onUnmounted(async () => {
  // reset error state
  store.commit(ErrorHandleMutations.SET_ERROR_PAGES, generatePageName.value)
})
</script>
