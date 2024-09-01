<template>
  <div class="d-flex flex-column" style="margin-left:10px">
    <div class="d-flex align-items-center text-blue m-3 mt-5 page-title-dashboard" style="line-height:36px;">
      {{ translate("WELCOME", t, te)}} {{ authStore.user.Name }}!
    </div>
    <p class="page-subtitle m-3 mt-4">{{ translate("PICKUP", t, te) }}</p>
  </div>
  <div class="row gy-5 g-xl-8 m-2 h-250px">
    <template v-for="menu in filterMenu" :key="menu.cardHeader">
      <div
        v-if="menu.cardHeader !== 'Shift' && menu.cardHeader !== 'Language'"
        class="col-6 col-md-4 col-lg-3 col-xl-20-percent col-xxl-3 px-2">
        <MenuCard
          :cardHeader="menu.cardHeader"
          :cardText="menu.cardDesc"
          :iconPath="`/media/logos/bumaau/ironlake/${menu.icon}`">
          <router-link
            :to="{ name: menu.path }">
            <a href="javascript:void(0)" @click="redirectByName(menu.path)" class="btn btn-sm btn-go-to-apps">{{ translate("GOTOAPP", t, te) }}</a>
          </router-link>
        </MenuCard>
      </div>
      <div
        v-if="menu.cardHeader === 'Shift'"
        class="col-6 col-md-4 col-lg-3 col-xl-20-percent col-xxl-3 px-2">
        <MenuCardEm
          cardHeader="Organization Unit"
          cardText="Configuration menu related to Organization Unit"
          iconPath="fas fa-sitemap fs-3x">
          <router-link
            v-slot="{ href }"
            :to="{name: 'ironlake-organization-unit-shift'}">
            <a href="javascript:void(0)" @click="redirectByLink(href)" class="btn btn-sm btn-go-to-apps">{{ translate("GOTOAPP", t, te) }}</a>
          </router-link>
        </MenuCardEm>
      </div>
      <div
        v-if="menu.cardHeader === 'Language'"
        class="col-6 col-md-4 col-lg-3 col-xl-20-percent col-xxl-3 px-2">
        <MenuCardEm
          cardHeader="Role Management"
          cardText="Configuration menu related to Role Management"
          iconPath="fas fa-users fs-3x">
          <router-link
            v-slot="{ href }"
            :to="{name: 'ironlake-rolemanagement-language'}">
            <a href="javascript:void(0)" @click="redirectByLink(href)" class="btn btn-sm btn-go-to-apps">{{ translate("GOTOAPP", t, te) }}</a>
          </router-link>
        </MenuCardEm>
      </div>
    </template>
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
  computed,
  onBeforeMount,
  onMounted
} from "vue";
import { useStore } from "vuex";
import { Actions } from "../../store/enums/StoreEnums";
import { setCurrentPageTitle } from "../../core/helpers/breadcrumb";
import navigator from "../../core/mixins/navigator";
import { translate } from "../../core/helpers/language";
import { useI18n } from "vue-i18n";
import MenuCard from "../../components/cards/MenuCard.vue";
import MenuCardEm from "../../components/cards/MenuCardEm.vue";
import {
  useAuthenticationStore
} from "../../store/pinia/application/useAuthenticationStore";
import { useMenuStore } from "../../store/pinia/application/useMenuStore";
import { useMenuStore as useAppMenuStore } from "../../store/templates/useMenuStore";
import { useBreadcrumbsStore } from "../../store/templates/useBreadcrumbStore";


const store = useStore();
const appMenuStore = useAppMenuStore();
const menuStore = useMenuStore();
const authStore = useAuthenticationStore();
const breadcrumbsStore = useBreadcrumbsStore();

const { t, te } = useI18n();
const { redirectByName, redirectByLink } = navigator();

appMenuStore[Actions.ACTIVE_PAGE]("IronLake");

const ironLakeMenus = [
  {
    cardHeader: "Company Assignment",
    cardDesc: "Make sure the company assign with the right site",
    icon: "icon-company-assignment.png",
    path: "companyassignment"
  },
  {
    cardHeader: "Customer Assignment",
    cardDesc: "Assign your Plant with the customer here",
    icon: "icon-customer-assignment.png",
    path: "customerassignment"
  },
  {
    cardHeader: "Equipment Assignment",
    cardDesc: "Feature that contains master mapping and configuration data for equipment.",
    icon: "icon-equipment-assignment.png",
    path: "equipmentassignment"
  },
  {
    cardHeader: "Outstanding Service",
    cardDesc: "Feature for uploading weekly service schedule into IronForms",
    icon: "icon-outstanding-service.png",
    path: "dailyschedule"
  },
  {
    cardHeader: "History Outstanding Service",
    cardDesc: "The desc of History Outstanding Service",
    icon: "icon-outstanding-service-history.png",
    path: "historydailyschedule"
  },
  {
    cardHeader: "Report Iron Forms",
    cardDesc: "The desc of Report Iron Forms",
    icon: "icon-report-iron forms.png",
    path: "historicaldmaeform"
  },
  {
    cardHeader: "Parameter",
    cardDesc: "Feature that contains master mapping and configuration data for component conditions parameter.",
    icon: "icon-parameter.png",
    path: "parameterehms"
  },
  {
    cardHeader: "Employee",
    cardDesc: "Feature that contains master mapping and configuration data for employee",
    icon: "icon-employee.png",
    path: "employee"
  },
  {
    cardHeader: "Shift",
    path: ""
  },
  {
    cardHeader: "Language",
    path: ""
  }
]

const filterMenu = computed(() => {
  if (menuStore.menu?.getAllProductMenu?.("IronLake")) {
    const productMenu = menuStore.menu.getAllProductMenu("IronLake")
    if (productMenu && productMenu.length > 0) {
      let finalMenuList: any[] = []
      productMenu.forEach((val) => {
        const featureMenu = menuStore.menu.getAllFeatureMenu(val.MenuId)
        if (featureMenu && featureMenu.length > 0) {
          finalMenuList = finalMenuList.concat(featureMenu)
        }
      })
      return ironLakeMenus.filter((menu) => {
        if (finalMenuList.find((feature) => {
          return feature.PageName == menu.cardHeader
        })) return true
      })
    }
  }
  return []
})

onBeforeMount(() => {
  const payload = {
    title: "Iron Lake",
    pageBreadcrumbPath: ["Home"]
  };
  breadcrumbsStore[Actions.SET_BREADCRUMB_ACTION](payload);
});
onMounted(() => {
  setCurrentPageTitle("Iron Lake");
});
</script>
