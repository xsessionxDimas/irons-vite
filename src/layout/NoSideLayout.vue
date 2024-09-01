<template>
  <KTLoader v-if="loaderEnabled"></KTLoader>

  <!-- begin:: Body -->
  <div id="no-layout" class="page d-flex flex-row flex-column-fluid">
    <!-- begin:: Aside Left -->
    <KTAside v-if="asideEnabled"></KTAside>
    <!-- end:: Aside Left -->

    <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
      <KTHeader :title="pageTitle"></KTHeader>
      <!-- begin:: Content -->
      <div id="kt_content" class="content d-flex flex-column flex-column-fluid" style="padding: 5px 0">
        <KTToolbar
          v-if="subheaderDisplay"
          :breadcrumbs="breadcrumbs"
          :title="pageTitle"
       />
        <!-- begin:: Content Body -->
        <div class="post d-flex flex-column-fluid">
          <div
            id="kt_content_container" class="container mt-15 mx-container-lg">
            <router-view />
          </div>
        </div>
        <!-- end:: Content Body -->
      </div>
    </div>
  </div>
  <!-- end:: Body -->
  <KTScrollTop></KTScrollTop>
</template>

<style scoped>
  .container, .container-xxl {
    padding: 0;
  }

  #kt_toolbar {
    display:none
  }

  #kt_aside {
    max-height: 65px;
  }

  .aside-enabled.aside-fixed .wrapper {
    transition: padding-left 0.3s ease;
    padding-left: 0;
  }

  .header-fixed.toolbar-fixed .wrapper {
    padding-top: calc(5px + var(--kt-toolbar-height));
  }
  @media (min-width: 1400px) {
    .container-xxl, .container-xl, .container-lg, .container-md, .container-sm, .container {
        max-width: 1500px;
    }
  }

  #profile-bg {
    position:absolute;
    width:100%;
    display: block;
  }

  @media (min-width: 1400px) and (max-width: 1599.98px) {
    .mx-container-lg {
      margin-left: 5%;
      margin-right: 5%;
    }
  }
</style>

<script lang="ts" setup>
import {
  computed,
  onBeforeMount,
  onMounted,
  watch
} from "vue";
import { useBreadcrumbsStore } from "../store/templates/useBreadcrumbStore";
import { useRoute, useRouter } from "vue-router"
import KTAside from "../layout/aside/Aside.vue"
import KTHeader from "../layout/header/Header.vue"
import KTToolbar from "../layout/toolbar/Toolbar.vue"
import HtmlClass from "../core/services/LayoutService"
import KTScrollTop from "../layout/extras/ScrollTop.vue"
import KTLoader from "../components/Loader.vue"
import {
  MenuComponent,
  DrawerComponent,
} from "../assets/ts/components/index"
import { removeModalBackdrop } from "../core/helpers/dom"
import {
  loaderEnabled,
  asideEnabled,
  subheaderDisplay,
} from "../core/helpers/config"
import {
  checkSignInStatus
} from '../core/helpers/get-user-info'
import {
  useAuthenticationStore
} from '../store/pinia/application/useAuthenticationStore'
import { useOnline } from '@vueuse/core'
import { useSyncStore } from "../store/pinia/dma/sync/useSyncStore";
import { CronJob } from "cron";
import {
  isOfflineOrSlowInternetConnection,
  renewToken
} from "../core/helpers/internet-connection";
import { useMsal } from "../msal/api/useMsal";

const online = useOnline()
const store = useBreadcrumbsStore()
const route = useRoute()
const { instance } = useMsal()
const authStore = useAuthenticationStore()
const router = useRouter()

// initialize html element classes
HtmlClass.init();

const pageTitle = computed(() => {
  return store.pageTitle;
})

const breadcrumbs = computed(() => {
  return store.getBreadcrumbs?.pageBreadcrumbPath
})

const isLoggedIn = computed(() => {
  return authStore.loggedIn
})


onBeforeMount(async () => {
  if (isOfflineOrSlowInternetConnection()) {
    router.push({ name: "ironforms" })
    return
  }
  await checkSignInStatus(instance)
});

onMounted(() => {
  if (!isOfflineOrSlowInternetConnection()) {
    startRenewTokenJob()
  }
})

const cronSyncStore = useSyncStore()

const renewTokenJob = computed(() => {
  return cronSyncStore.jobRenewToken
})

const startRenewTokenJob = () => {
  if (renewTokenJob.value && renewTokenJob.value.running) return
  if (!renewTokenJob.value) {
    const job = new CronJob(
      "*/10 * * * *", // every 10 minutes
      async function () {
        renewToken(instance)
      }, // onTick
      null, // onComplete
      true
    );
    cronSyncStore.setJobRenewTokenRunning(job)
  } else {
    renewTokenJob.value.start()
  }
}

watch(isLoggedIn, (value) => {
  if (!value) {
    renewToken(instance)
  }
})

watch(online, (value) => {
  if (value) {
    startRenewTokenJob()
  } else {
    cronSyncStore.stopAllJob()
  }
})

watch(
  () => {
    return route.path;
  },
  () => {
    MenuComponent.hideDropdowns(undefined);
    DrawerComponent.hideAll();
    removeModalBackdrop();
  }
);
</script>
