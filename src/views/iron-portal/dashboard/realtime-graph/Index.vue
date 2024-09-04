<template>
  <PbiReportRealtimeGraph
    :reportName="reportName"
    :visibletab="false"
    :isPublic="false"
    :isTransparent="true"
    :pbiReportId="reportId"
    :pbiWorkspaceId="workspaceId"
    :isHideVisualHeaders="true"
    class="dashboard"
  />
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  onUnmounted,
  onBeforeMount
} from "vue";
import {
  useAuthenticationStore
} from "../../../../store/pinia/application/useAuthenticationStore";
import ApiService from "../../../../core/services/ApiService";
import PbiReportRealtimeGraph from '../../../../components/pbi/PbiReportRealtimeGraph.vue';
import { GET_PROFILE } from "../../../../store/pinia/application/newUrls";
import { usePbiEmbeddedStore } from '../../../../store/templates/usePbiEmbeddedStore';
import {
  Mutations
} from "../../../../store/enums/PbiEmbeddedEnums";

const store = usePbiEmbeddedStore();
const authStore = useAuthenticationStore();

const reportName = "AM-EHM-3DP-Realtime";
const reportId = "a9befe6f-7bc4-4d4a-91c1-8715b01416c5";
const workspaceId = "d90b69f1-3a2e-423e-9e27-e341dc02a972";
const extendExpiredLogin = ref<boolean>(false);
const isOnMounted = ref<boolean>(false);

let timeToUpdate = 1; // in minute
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

onBeforeMount(() => {
  store[Mutations.SET_PBI_URL](`${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}`)
})

onMounted(() => {
  isOnMounted.value = true;
  getUserInfoInterval;
});

onUnmounted(() => {
  isOnMounted.value = false;
  clearInterval(getUserInfoInterval);
});
</script>

<style lang="scss" scoped>
.dashboard {
  margin: 0 auto !important;
  // aspect-ratio: 16 / 9;
  width: 100%;
  height: 100% !important;
  overflow: hidden !important;
}
</style>
