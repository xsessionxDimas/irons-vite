<template>
  <PbiReport
  :reportName="reportName"
  :analyticPage="analyticPage"
  :idPageName="idPageName"
  :isPublic="isPublic"
  :pbiReportId="reportId"
  :pbiWorkspaceId="workspaceId"
  :isTransparent="isTransparent"
/>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onBeforeMount,
  onMounted,
  onUnmounted
} from 'vue';
import { Actions as StoreActions } from "../../../store/enums/StoreEnums";
import { useStore } from 'vuex';
import { setCurrentPageBreadcrumbs } from "../../../core/helpers/breadcrumb";
import { generateId as generateIdHelper } from '../../../core/helpers/generate-id';
import {
  Mutations as ErrorHandleMutations
} from "../../../store/enums/ErrorHandleEnum"
import { Mutations as PageMutations } from '../../../store/enums/PageEnum';
import PbiReport from '../../../components/pbi/PbiReport.vue';
import {
  Mutations
} from "../../../store/enums/PbiEmbeddedEnums";
import { useMenuStore } from '../../../store/templates/useMenuStore'; 
import { usePbiEmbeddedStore } from '../../../store/templates/usePbiEmbeddedStore'; 
import { useErrorHandleStore } from '../../../store/templates/useErrorStore';
import { usePageStore } from '../../../store/templates/usePageStore';

export default defineComponent({
  name: "pbi-embedded",
  props: [
    "breadCrumb",
    "reportName",
    "analyticPage",
    'eventName',
    'isPublic',
    "isTransparent"
  ],
  components: {
    PbiReport
  },
  setup(props) {
    const store = useStore();
    const menuStore = useMenuStore();
    const pbiStore = usePbiEmbeddedStore();
    const errorStore = useErrorHandleStore();
    const pageStore = usePageStore();
    const reportId = import.meta.env.VITE_APP_ASH_SILO_REPORT_ID;
    const workspaceId = import.meta.env.VITE_APP_ASH_SILO_WORKSPACE_ID;

    // start: COMPUTED ==============================================
    const currentPage = computed(() => {
      return menuStore.getPage
    })

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
      errorStore[ErrorHandleMutations.SET_ERROR_PAGES](generatePageName.value)
      menuStore[StoreActions.ACTIVE_PAGE](props.breadCrumb.activePage);
      setCurrentPageBreadcrumbs(props.breadCrumb.currentPageBreadCrumb,
        props.breadCrumb.breadCrumbList
      );
      pageStore[PageMutations.SET_CURRENT_MODULE]({
        module: generatePageName.value,
        initialPage: 'pbi-list-module'
      })
    })

    onUnmounted(async () => {
      // reset error state
      errorStore[ErrorHandleMutations.SET_ERROR_PAGES](generatePageName.value)
    })

    return {
      currentPage,
      idPageName,
      reportId,
      workspaceId,
    }
  },
})
</script>
