<template>
  <PBI
    :reportName="reportName"
    :breadCrumb="breadCrumb"
    :analyticPage="analyticPage"
    :eventName="eventName"
    :visibletab="false"
    :showFilter="false"
    :isPublic="false"
    :isTransparent="false"
    class="ash-silo-dashboard"
 />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted
} from "vue";
import PBI from "./PBI.vue";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import ApiService from "@/core/services/ApiService";
import { GET_PROFILE } from "@/store/pinia/application/newUrls";

export default defineComponent({
  name: "pbi-embedded-index",
  components: {
    PBI,
  },
  setup() {
    const reportName = "ASH-SILO";
    const breadCrumb = {
      currentPageBreadCrumb: "Ash Silo Dashboard",
      activePage: "Ash Silo Dashboard",
      breadCrumbList: [
        {
          pageName: "Ash Silo Dashboard",
          pageRoute: "/ash-silo",
        },
      ],
    };
    const analyticPage = "Ash Silo Dashboard";
    const eventName = "ash_silo_dashboard";
    const extendExpiredLogin = ref<boolean>(false);
    const isOnMounted = ref<boolean>(false);
    const store = useAuthenticationStore();

    const getUserInfo = async () => {
      const userEmail = store.user.Email;
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

    onMounted(() => {
      let timeToUpdate = 60; // in minute
      timeToUpdate = timeToUpdate * 60 * 1000;
      isOnMounted.value = true;
      setInterval(() => {
        if (isOnMounted.value) {
          extendExpiredLogin.value = true;
          getUserInfo();
        }
      }, timeToUpdate);
    });

    onUnmounted(() => {
      isOnMounted.value = false;
    });

    return {
      reportName,
      breadCrumb,
      analyticPage,
      eventName,
    };
  },
});
</script>

<style lang="scss" scoped>
.ash-silo-dashboard {
  margin: 0 !important;
  height: 100% !important;
}
</style>
