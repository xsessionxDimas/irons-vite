<template>
  <iframe
    title="Plant Availability & Utilisation V3 (auto) Downtime Log"
    class="maintenance-report-dashboard"
    src="https://app.powerbi.com/reportEmbed?reportId=522d93e5-aae8-4724-bd05-e664812ed10a&autoAuth=true&ctid=5771dee4-c97e-4cb7-b713-9a60400c5fde&pageName=ReportSection484844864ee6e9e94303"
    allowFullScreen="true"
  ></iframe>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  onUnmounted
} from "vue";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import ApiService from "@/core/services/ApiService";
import { GET_PROFILE } from "@/store/pinia/application/newUrls";

const authStore = useAuthenticationStore();

const extendExpiredLogin = ref<boolean>(false);
const isOnMounted = ref<boolean>(false);
let timeToUpdate = 1; // in minute

// start: COMPUTED ==============================================

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
.maintenance-report-dashboard {
  margin: 0 auto !important;
  // aspect-ratio: 16 / 9;
  width: 100%;
  height: 100% !important;
  overflow: hidden !important;
}
</style>
