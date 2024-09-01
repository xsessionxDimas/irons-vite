<template>
  <PBI
    :reportName="reportName"
    :breadCrumb="breadCrumb"
    :analyticPage="analyticPage"
    :eventName="eventName"
    :visibletab="false"
    :showFilter="false"
    :isPublic="false"
    :isHideVisualHeaders="true"
    class="cbm-compliance-dashboard"
    :isTransparent="true"
    />
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  onUnmounted,
  onBeforeMount
} from "vue";
import PBI from "./PBI.vue";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import ApiService from "@/core/services/ApiService";
import { GET_PROFILE } from "@/store/pinia/application/newUrls";
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";

const reportName = "AM-EHM-CBM-Compliance";
const breadCrumb = {
  currentPageBreadCrumb: "CBM Compliance Report",
  activePage: "CBM Compliance Report",
  breadCrumbList: [
    {
      pageName: "IronPortal",
      pageRoute: "ironportal",
    },
    {
      pageName: "IronPortal Dashboard",
      pageRoute: "/iron-portal",
    },
    {
      pageName: "CBM Compliance Report",
      pageRoute: "/iron-portal/pbi/cbm-compliance",
    },
  ],
};
const analyticPage = "BUMA CBM Compliance Dashboard";
const eventName = "cbm_compliance_dashboard";
const extendExpiredLogin = ref<boolean>(false);
const isOnMounted = ref<boolean>(false);
const store = useAuthenticationStore();

const storeVuex = useStore();

let timeToUpdate = 1; // in minute
const getUserInfoInterval = setInterval(() => {
  if (isOnMounted.value) {
    extendExpiredLogin.value = true;
    getUserInfo();
  }
}, timeToUpdate * 60 * 1000);

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
  isOnMounted.value = true;
  getUserInfoInterval;
});

onUnmounted(() => {
  isOnMounted.value = false;
  clearInterval(getUserInfoInterval);
});

onBeforeMount(() => {
  storeVuex.dispatch(StoreActions.ACTIVE_PAGE, "IronPortal");
  setCurrentPageBreadcrumbs("CBM Compliance Report", [
    {
      pageName: "IronPortal",
      pageRoute: "ironportal",
    },
    {
      pageName: "IronPortal Dashboard",
      pageRoute: "ironportal",
    },
    {
      pageName: "CBM Compliance Report",
      pageRoute: "ironportaldashboardcbmcompliance",
    },
  ]);
})
</script>

<style lang="scss" scoped>
.cbm-compliance-dashboard {
  margin: 0 auto !important;
  // aspect-ratio: 16 / 9;
  width: 100%;
  height: 100% !important;
  overflow: hidden !important;
  background-color:#F2F3F7;
}
</style>
