<template>
  <PbiReportEquipment
    v-bind="propsData"
    class="equipment-dashboard"
  />
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  onBeforeMount
} from "vue";
import {
  useAuthenticationStore
} from "../../../../store/pinia/application/useAuthenticationStore";
import ApiService from "../../../../core/services/ApiService";
import { GET_PROFILE } from "../../../../store/pinia/application/newUrls";
import PbiReportEquipment from '../../../../components/pbi/PbiReportEquipment.vue';
import {
  Mutations
} from "../../../../store/enums/PbiEmbeddedEnums";
import { usePbiEmbeddedStore } from '../../../../store/templates/usePbiEmbeddedStore';

const reportName = "AM-EHM-Equipment";
const extendExpiredLogin = ref<boolean>(false);
const isOnMounted = ref<boolean>(false);
const authStore = useAuthenticationStore();
const store = usePbiEmbeddedStore();

const propsData = computed(() => {
  return {
    reportName,
    visibletab: false,
    isPublic: false,
    isTransparent: true,
    isHideVisualHeaders: true,
    pbiReportId: "a9befe6f-7bc4-4d4a-91c1-8715b01416c5",
    pbiWorkspaceId: "d90b69f1-3a2e-423e-9e27-e341dc02a972"
  }
})

let timeToUpdate = 1; // in minute
const getUserInfoInterval = setInterval(() => {
  if (isOnMounted.value) {
    extendExpiredLogin.value = true;
    getUserInfo();
  }
}, timeToUpdate * 60 * 1000);

onBeforeMount(() => {
  store[Mutations.SET_PBI_URL](`${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_ADM}`)
})

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
.equipment-dashboard {
  margin: 0 auto !important;
  // aspect-ratio: 16 / 9;
  width: 100%;
  height: 100% !important;
  overflow: hidden !important;
}
</style>
