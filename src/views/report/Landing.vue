<template>
  <div class="d-flex flex-column" style="margin-left:10px">
    <div class="d-flex align-items-center text-blue m-3 mt-5 page-title-dashboard" style="line-height:36px;">
      {{ translate("WELCOME", t, te)}} {{ authStore.user.Name }}!
    </div>
    <p class="page-subtitle m-3 mt-4">{{ translate("PICKUP", t, te) }}</p>
  </div>
  <div class="row gy-5 g-xl-8 m-2 h-250px">
    <div class="col-6 col-md-4 col-lg-3 col-xl-20-percent col-xxl-3 px-2">
      <MenuCard
        cardHeader="History"
        cardText="Menu related to History"
        iconPath="fas fa-sitemap fs-2x">
        <router-link
          v-slot="{ href }"
          :to="{name: 'historicaldmaeform'}">
          <a href="javascript:void(0)" @click="redirectByLink(href)" class="btn btn-sm btn-go-to-apps">{{ translate("GOTOAPP", t, te) }}</a>
        </router-link>
      </MenuCard>
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
    color : #37474F;
  }

  @media (min-width: 1399.98px) {
    .col-xl-20-percent {
      width: 20%;
    }
  }
</style>

<script lang="ts" setup>
import {
  onBeforeMount,
  onMounted} from "vue";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import { setCurrentPageTitle } from "@/core/helpers/breadcrumb";
import navigator from "@/core/mixins/navigator";
import { translate } from "@/core/helpers/language";
import { useI18n } from "vue-i18n";
import MenuCard from "@/components/cards/MenuCard.vue";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

const store = useStore();
const authStore = useAuthenticationStore();
const { t, te } = useI18n();
store.dispatch(Actions.ACTIVE_PAGE, "Report");
const { redirectByLink } = navigator();


onBeforeMount(() => {
  const payload = {
    title: "Report",
    pageBreadcrumbPath: ["Home"]
  };
  store.dispatch(Actions.SET_BREADCRUMB_ACTION, payload);
});
onMounted(() => {
  setCurrentPageTitle("Report");
});
</script>
