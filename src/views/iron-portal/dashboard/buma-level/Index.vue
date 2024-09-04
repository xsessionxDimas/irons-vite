<template>
  <PbiReport
    :reportName="reportName"
    :idPageName="idPageName"
    :isPublic="false"
    :pbiReportId="reportId"
    :pbiWorkspaceId="workspaceId"
    :isHideVisualHeaders="true"
    :visibletab="false"
    :isTransparent="true"
    class="buma-level-dashboard"
  />
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted
} from "vue";
import {
  useAuthenticationStore
} from "../../../../store/pinia/application/useAuthenticationStore";
import ApiService from "../../../../core/services/ApiService";
import { GET_PROFILE } from "../../../../store/pinia/application/newUrls";

import { usePbiEmbeddedStore } from '../../../../store/templates/usePbiEmbeddedStore';
import { generateId as generateIdHelper } from '../../../../core/helpers/generate-id';
import PbiReport from '../../../../components/pbi/PbiReport.vue';
import {
  Mutations
} from "../../../../store/enums/PbiEmbeddedEnums";

const store = usePbiEmbeddedStore();
const authStore = useAuthenticationStore();

const reportId = "a9befe6f-7bc4-4d4a-91c1-8715b01416c5";
const workspaceId = "d90b69f1-3a2e-423e-9e27-e341dc02a972";
const reportName = "AM-EHM-Buma-Level";

const extendExpiredLogin = ref<boolean>(false);
const isOnMounted = ref<boolean>(false);
let timeToUpdate = 1; // in minute

// start: COMPUTED ==============================================
const idPageName = computed(() => {
  return generateIdHelper(5);
})
// end: COMPUTED ==============================================

// start: METHODS ===============================================
const getUserInfoInterval = setInterval(() => {
  if (isOnMounted.value) {
    extendExpiredLogin.value = true;
    getUserInfo();
  }
}, timeToUpdate * 60 * 1000);

const getUserInfo = async () => {
  const userEmail = authStore.user.Email;
  const params = { email: userEmail, ver: "v1" };
  if (extendExpiredLogin.value) {
    try {
      await ApiService.get(
        GET_PROFILE,
        "",
        new URLSearchParams(params).toString(),
      );
    } catch (error) {
      console.log(error);
    }
    extendExpiredLogin.value = false;
  }
};
// end: METHODS ===============================================

onBeforeMount(() => {
  store[Mutations.SET_PBI_URL](`${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}`)
})

onMounted(async () => {
  isOnMounted.value = true;
  getUserInfoInterval;
})

onUnmounted(async () => {
  isOnMounted.value = false;
  clearInterval(getUserInfoInterval);
})
</script>

<style lang="scss" scoped>
.buma-level-dashboard {
  margin: 0 auto !important;
  // aspect-ratio: 16 / 9;
  width: 100%;
  height: 100% !important;
  overflow: hidden !important;
}
</style>
