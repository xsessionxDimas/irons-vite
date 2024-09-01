<template>
  <KTLoader v-if="loaderEnabled" :logo="loaderLogo"></KTLoader>
  <!-- begin:: Body -->
  <div class="page d-flex flex-row flex-column-fluid ironlake-layout">
    <!-- begin:: Aside Left -->
    <KTAside
      v-if="asideEnabled"
      :lightLogo="themeLightLogo"
      :darkLogo="themeDarkLogo"
    ></KTAside>
    <!-- end:: Aside Left -->
    <div id="kt_wrapper" class="d-flex flex-column flex-row-fluid wrapper">
      <KTHeader :title="pageTitle" :menuVisible="true"></KTHeader>
      <!-- begin:: Content -->
      <div
        id="kt_content"
        class="content d-flex flex-column flex-column-fluid"
        style="padding: 5px 0; width: 100%"
      >
        <!-- begin:: Content Body -->
        <div class="post d-flex flex-column-fluid">
          <div
            id="kt_content_container"
            :class="{
              'container-fluid': contentWidthFluid,
              'container-xxl': !contentWidthFluid,
            }"
          >
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
.container-xxl {
  padding: 0;
  max-width: 95%;
}
</style>

<script lang="ts" setup>
import {
  computed,
  onBeforeMount,
  watch,
  onMounted
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useI18n, LocaleMessages, VueMessageType } from "vue-i18n";
import KTAside from "@/layout/aside/Aside.vue";
import KTHeader from "@/layout/header/Header.vue";
import HtmlClass from "@/core/services/LayoutService";
import KTScrollTop from "@/layout/extras/ScrollTop.vue";
import KTLoader from "@/components/Loader.vue";
import { MenuComponent, DrawerComponent } from "@/assets/ts/components/index";
import { removeModalBackdrop } from "@/core/helpers/dom";
import {
  loaderEnabled,
  contentWidthFluid,
  loaderLogo,
  asideEnabled,
  themeLightLogo,
  themeDarkLogo,
} from "@/core/helpers/config";
import {
  checkDMASignInStatus,
  checkSignInStatus,
} from "@/core/helpers/get-user-info";
import { useLanguageStore } from "@/store/pinia/application/useLanguageStore";

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

const online = useOnline();
const store = useStore();
const i18n = useI18n();
const route = useRoute();
const langStore = useLanguageStore();

// initialize html element classes
HtmlClass.init();

const { instance } = useMsal()

const router = useRouter();
const authStore = useAuthenticationStore();
const menuStore = useMenuStore();

const pageTitle = computed(() => {
  return store.getters.pageTitle;
});

const activeMenu = computed(() => {
  return route.path
})

const isLoggedIn = computed(() => {
  return authStore.loggedIn;
});

const setLanguage = () => {
  const lang = localStorage.getItem("lang")
    ? (localStorage.getItem("lang") as string)
    : "en";
  i18n.setLocaleMessage(
    lang,
    langStore.dictionary as LocaleMessages<VueMessageType>,
  );
  i18n.locale.value = lang;
};

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

onBeforeMount(async () => {
  await checkSignInStatus(instance);
  await checkDMASignInStatus(online.value, instance);
  setLanguage();
});

onMounted(() => {
  if (!isOfflineOrSlowInternetConnection()) {
    startRenewTokenJob()
  }
});

watch(online, (value) => {
  if (value) {
    startRenewTokenJob()
  } else {
    cronSyncStore.stopAllJob()
  }
})

watch(isLoggedIn, async (value) => {
  if (!value) {
    renewToken(instance)
  }
})

watch(activeMenu, (value) => {
  if (!menuStore.authPage(value)) {
    router.push({ name: '401' })
  }
});

watch(
  () => {
    return route.path;
  },
  () => {
    MenuComponent.hideDropdowns(undefined);
    DrawerComponent.hideAll();
    removeModalBackdrop();
  },
);
</script>

<style scoped lang="scss">
.ironlake-layout {
  font-family: "Public Sans";
}
</style>
