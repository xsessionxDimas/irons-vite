<template>
  <div class="d-flex flex-column" style="margin-left: 0.5rem">
    <div
      class="d-flex align-items-center my-3 mt-5 page-title-dashboard sample-dimas-style"
      style="line-height: 36px">
      Welcome {{ authStore.user.Name }}!
    </div>
    <p class="page-subtitle my-3 mt-4">Pick the app that you want to use</p>
  </div>
  <div class="row gy-5 g-xl-8 m-2 h-250px">
    <template v-for="(item) in MainMenuConfig" :key="item">
      <div class="col-6 col-sm-4 col-md-3 col-lg-20-percent col-xl-2 pe-2 col-xxl-2 ps-0">
        <DashboardCard
          v-if="cardDetail(item)"
          :cardHeader="cardDetail(item).cardHeader"
          :cardText="cardDetail(item).cardText"
          :iconPath="cardDetail(item).iconPath">
          <router-link v-slot="{ href }" :to="{ name: cardDetail(item).path }">
            <a
              href="javascript:void(0)"
              @click="redirectByLink(href)"
              class="btn btn-sm btn-go-to-apps btn-label"
              >{{ translate("Enter", t, te) }} {{ item }}</a>
          </router-link>
        </DashboardCard>
      </div>
    </template>
    <div style="display: none">
      <img src="/media/logos/bumaau/e-form.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/logos/bumaau/component-intervention-forms.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/logos/bumaau/defects.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/logos/bumaau/approval.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/logos/bumaau/monitoring-status.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/logos/bumaau/change-pin.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/logos/bumaau/logout.png" width="40" alt="e-Form">
      <img src="/media/icons/bumaau/sync.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/logos/bumaau/bumaau-home.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/icons/bumaau/available.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/icons/bumaau/not-available.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/icons/bumaau/caution.png" class="w-24px h-24px" alt="e-Form">
      <img src="/media/svg/dma/camera/e-form/png/cam-active.png" width="24" alt="e-Form">
      <img src="/media/svg/dma/camera/e-form/png/cam-user.png" width="24" alt="e-Form">
      <img src="/media/svg/dma/camera/e-form/png/cam-read.png" width="24" alt="e-Form">
      <img src="/media/logos/bumaau/defect.png" alt="e-Form">
      <img src="/media/logos/bumaau/na.png" alt="e-Form">
      <img src="/media/svg/dma/camera/photo_camera.svg" alt="e-Form">
      <img src="/media/svg/dma/camera/image-collections.svg" alt="e-Form">
      <img src="/media/svg/dma/camera/flip_camera.svg" alt="e-Form">
      <img src="/media/icons/bumaau/rotate.png" />
      <img src="/media/svg/dma/green-checklist.png" />
      <img src="/media/svg/dma/image-close-button-red.png" />
    </div>
  </div>
  <!--end::Dashboard-->
</template>

<style>
#profile-bg {
  display: none;
}
</style>

<style scoped>
.mt-5 {
  margin-top: 3.25rem !important;
}

.text-blue {
  color: #37474f;
}

.text-blue-gray-700 {
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #455a64 !important;
}
</style>

<script lang="ts" setup>
import { computed, onBeforeMount } from "vue";
import { useMenuStore as useAppMenuStore } from "../store/templates/useMenuStore"; 
import { Actions } from "../store/enums/StoreEnums";
import { setCurrentPageTitle } from "../core/helpers/breadcrumb";
import navigator from "../core/mixins/navigator";
import { translate } from "../core/helpers/language";
import { useI18n } from "vue-i18n";
import DashboardCard from "../components/cards/DashboardCard.vue";
import {
  useAuthenticationStore
} from "../store/pinia/application/useAuthenticationStore";
import { useMenuStore } from "../store/pinia/application/useMenuStore";
import { downloadLanguage } from "../core/helpers/get-user-info"

const store = useAppMenuStore();
const { t, te } = useI18n();

store[Actions.ACTIVE_PAGE]("Dashboard");
const authStore = useAuthenticationStore();
const menuStore = useMenuStore();

const { redirectByLink } = navigator();

const MainMenuConfig = computed(() => {
  if (typeof (menuStore.menu.getAllTribeMenu) !== 'function') return [];
  return menuStore.menu?.getAllTribeMenu().filter((m) => {
    const bumaau = ['IronLake', 'IronForms', 'IronPortal'];
    return bumaau.includes(m);
  });
});

const MainMenuCardConfig = computed(() => {
  if (typeof (menuStore.menu.getAllCardTribeMenuObject) !== 'function') return [];
  return menuStore.menu?.getAllCardTribeMenuObject();
});

const cardDetail = (menu: string) => {
  return MainMenuCardConfig.value[menu]
}

onBeforeMount(async () => {
  await downloadLanguage()
  setCurrentPageTitle("Dashboard")
})
</script>
