<template>
  <div class="d-flex flex-column" style="margin-left:10px">
    <div class="d-flex align-items-center text-blue m-3 mt-5 page-title-dashboard" style="line-height:36px;">
      {{ translate("WELCOME", t, te)}} {{ authStore.user.Name }}!
    </div>
    <p class="page-subtitle m-3 mt-4">{{ translate("PICKUP", t, te) }}</p>
  </div>
  <div class="row gy-5 g-xl-8 m-2 h-250px">
    <template v-for="menu in filteredMenu" :key="menu.cardHeader">
      <div class="col-6 col-md-4 col-lg-3 col-xl-20-percent col-xxl-3 px-2">
        <MenuCardNoDesc
          v-if="menu.cardDesc === ''"
          :cardHeader="menu.cardHeader"
          :cardText="menu.cardDesc"
          :iconPath="menu.icon">
            <a v-if="menu.cardHeader != 'Version History'" target="_blank" :href="menu.MenuName || menu.path" class="btn btn-sm btn-go-to-apps">{{ menu.btnText }}</a>
            <button v-else @click="clickVersionHistory(menu.path, menu.cardHeader)" class="btn btn-sm btn-go-to-apps">{{ menu.btnText }}</button>
        </MenuCardNoDesc>
        <MenuCard
          v-else
          :cardHeader="menu.cardHeader"
          :cardText="menu.cardDesc"
          :iconPath="`/media/icons/tribes/${menu.icon}`">
          <router-link :to="{ path: menu.path }">
            <a href="javascript:void(0)" class="btn btn-sm btn-go-to-apps">{{ menu.btnText }}</a>
          </router-link>
        </MenuCard>
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
import { useMenuStore as useAppMenuStore } from "../../store/templates/useMenuStore";
import { useBreadcrumbsStore } from "../../store/templates/useBreadcrumbStore";
import { Actions } from "../../store/enums/StoreEnums";
import { setCurrentPageTitle } from "../../core/helpers/breadcrumb";
import { translate } from "../../core/helpers/language";
import { useI18n } from "vue-i18n";
import MenuCard from "../../components/cards/MenuCard.vue";
import MenuCardNoDesc from "../../components/cards/MenuCardNoDesc.vue";
import {
  useAuthenticationStore
} from "../../store/pinia/application/useAuthenticationStore";
import { useMenuStore } from "../../store/pinia/application/useMenuStore";
import _ from "lodash"
import { swalAlertInfo } from "../../core/helpers/sweet-alert";

const store = useAppMenuStore();
const breadcrumbStore = useBreadcrumbsStore();
const authStore = useAuthenticationStore();

const { t, te } = useI18n();
store[Actions.ACTIVE_PAGE]("IronPortal");
const menuStore = useMenuStore();

const ironPortalMenus = [
  {
    cardHeader: "IronPortal Dashboard",
    cardDesc: "A Technology Platform that provides critical component condition information.",
    icon: "IronPortal-Dashboard.svg",
    path: "/ironportal-dashboard",
    btnText: "Enter IronPortal",
    MenuName: ""
  },
  {
    cardHeader: "IronPortal Configuration",
    cardDesc: "A configurable based platform to setup all of the contents related to IronPortal.",
    icon: "IronPortal-Lake.svg",
    path: "/ironportal/iron-portal-configuration",
    btnText: "Enter App",
    MenuName: ""
  },
  {
    cardHeader: "IronPortal Transactional",
    cardDesc: "A Technology Platform for uploading periodical transaction data related to IronPortal.",
    icon: "IronPortal-Transactional.svg",
    path: "/ironportal/iron-portal-transactional",
    btnText: "Enter App",
    MenuName: ""
  },
  {
    cardHeader: "IronPortal Historical",
    cardDesc: "A Technology Platform for downloading the historical of component condition monitoring data.",
    icon: "IronPortal-History.svg",
    path: "/ironportal/iron-portal-historical",
    btnText: "Enter App",
    MenuName: ""
  },
  {
    cardHeader: "Version History",
    cardDesc: "",
    icon: "/media/logos/bumaau/version-history.png",
    path: "#/ironportal/versionhistory",
    btnText: "Open Version History",
    MenuName: ""
  },
  {
    cardHeader: "User Guide",
    cardDesc: "",
    icon: "/media/logos/bumaau/help.png", // path only for default value
    path: "https://bumacomau.sharepoint.com/sites/ProjectIron-TestIronForms/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x012000D20C762BDB38564693539549249E3F62&OR=Teams%2DHL&CT=1685056186373&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiIyOC8yMzA0MDIwMjcwNSIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D&id=%2Fsites%2FProjectIron%2DTestIronForms%2FShared%20Documents%2FIron%20Forms%2FUser%20Guide&viewid=8384288d%2Dcecb%2D4ffc%2D8bee%2D97934ba7e062",
    btnText: "Open User Guide",
    MenuName: ""
  },
];

const filteredMenu = computed(() => {
  if (menuStore.menu && menuStore.menu.getAllProductMenu && menuStore.menu.getAllProductMenu("IronPortal")) {
    const productMenu = menuStore.menu.getAllProductMenu("IronPortal")
    if (productMenu && productMenu.length > 0) {
      const mergedArray = ironPortalMenus.map((obj) => {
        const matchingItem = _.find(productMenu, { PageName: obj.cardHeader });
        if (matchingItem) {
          return _.merge(obj, matchingItem);
        }
        return obj;
      });
      return mergedArray.filter((menu) => {
        const test = productMenu.find((feature) => {
          return feature.PageName == menu.cardHeader
        })
        if (test) return true
      })
    }
  }
  return []
})

const clickVersionHistory = (link, pageName) => {
  const newWindow = window.open(link, "_blank")
  if (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined") {
    swalAlertInfo(`Please allow pop-up permission on your browser if ${pageName} page is not opened in a new tab.`, "OK")
  }
}

onBeforeMount(() => {
  const payload = {
    title: "IronPortal",
    pageBreadcrumbPath: ["Home"]
  };
  breadcrumbStore[Actions.SET_BREADCRUMB_ACTION](payload);
});
onMounted(() => {
  setCurrentPageTitle("IronPortal");
});
</script>
