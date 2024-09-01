<template>
  <KTLoader v-if="loaderEnabled"></KTLoader>

  <!-- begin:: Body -->
  <div id="no-layout" class="page d-flex flex-row flex-column-fluid">
    <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper" style="padding: 0;">
      <!-- begin:: Content -->
      <div id="kt_content" class="content full-screen" style="padding: 0;">
        <KTToolbar
          v-if="subheaderDisplay"
          :breadcrumbs="breadcrumbs"
          :title="pageTitle"
       />
        <!-- begin:: Content Body -->
        <div class="post">
          <div
            id="kt_content_container">
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

  #profile-bg {
    position:absolute;
    width:100%;
    display: block;
  }
</style>

<script lang="ts" setup>
import {
  computed,
  onBeforeMount,
  onMounted,
  watch
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import KTToolbar from "@/layout/toolbar/Toolbar.vue";
import HtmlClass from "@/core/services/LayoutService";
import KTScrollTop from "@/layout/extras/ScrollTop.vue";
import KTLoader from "@/components/Loader.vue";
import {
  MenuComponent,
  DrawerComponent,
} from "@/assets/ts/components/index";
import { removeModalBackdrop } from "@/core/helpers/dom";
import {
  loaderEnabled,
  subheaderDisplay,
} from "@/core/helpers/config";
import {
  checkSignInStatus,
  checkDMASignInStatus,
} from '@/core/helpers/get-user-info';
import { useLanguageStore } from "@/store/pinia/application/useLanguageStore";
import { useI18n, LocaleMessages, VueMessageType } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useMenuStore
} from "@/store/pinia/application/useMenuStore";
import { useOnline } from "@vueuse/core";
import { useSyncStore } from "@/store/pinia/dma/sync/useSyncStore";
import { CronJob } from "cron";
import { useMsal } from "@/msal/api/useMsal";
import {
  isOfflineOrSlowInternetConnection,
  renewToken
} from "@/core/helpers/internet-connection";

const online = useOnline()
const store = useStore()
const i18n = useI18n()
const route = useRoute()
const langStore = useLanguageStore()
const router = useRouter()
const authStore = useAuthenticationStore()
const menuStore = useMenuStore()

// initialize html element classes
HtmlClass.init();

const { instance } = useMsal()

const pageTitle = computed(() => {
  return store.getters.pageTitle;
})
const breadcrumbs = computed(() => {
  return store.getters.getBreadcrumbs?.pageBreadcrumbPath;
})
const isLoggedIn = computed(() => {
  return authStore.loggedIn;
})
const activeMenu = computed(() => {
  return route.path
})

const setLanguage = () => {
  const lang = localStorage.getItem("lang") ? (localStorage.getItem("lang") as string) : "en";
  i18n.setLocaleMessage(lang, langStore.dictionary as LocaleMessages<VueMessageType>);
  i18n.locale.value = lang;
}

onBeforeMount(async () => {
  await checkSignInStatus(instance)
  await checkDMASignInStatus(online.value, instance)
  setLanguage()
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

onMounted(() => {
  if (!isOfflineOrSlowInternetConnection()) {
    startRenewTokenJob()
  }
})

watch(isLoggedIn, async (value) => {
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

watch(activeMenu, (value) => {
  if (!menuStore.authPage(value)) {
    router.push({ name: '401' })
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
)
</script>

<style lang="scss">
html, body {
  height: 100%;
}

.full-screen {
  overflow: hidden;
  height: 100%;

  .post {
    height: 100%;

    #kt_content_container {
      height: 100%;
    }
  }
}
</style>
