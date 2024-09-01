<template>
  <!-- Background Image -->
  <div class="background-wrapper">
    <video
      v-if="menuDashboardName.includes(routeName as string) ? true : false"
      class="background-img"
      autoplay
      loop
      muted
      descriptions="background video"
    >
      <source src="/media/BUMA-Australia-drone-footage-onl.mp4" type="video/mp4">
    </video>
  </div>
  <!-- Top Bar : start -->
  <el-menu
    mode="horizontal"
    background-color="#2d2b39"
    :ellipsis="false"
    class="ironportal-top-menu d-flex align-items-center justify-content-between"
  >
    <!--begin::Logo-->
    <div class="ironportal-logo top-menu-item">
      <a href="javascript:void(0)" @click="handlePreviewDashboard()">
        <el-image style="height: 40px;" class="px-md-10 px-sm-2" src="/media/logos/logo-whitebg.png" alt="BUMA AU logo" />
      </a>
    </div>
    <!--end::Logo-->
    <div class="ironportal-logo top-menu-item">
      <el-image style="height: 50px; margin: 0 auto;" src="/media/logos/iron-portal/ironportal-white.png" alt="IronPortal logo" />
    </div>
    <div class="top-menu-item d-flex justify-content-end align-items-center">
      <el-tooltip class="box-item" effect="dark" :content="`${isScreenMaximized ? 'Shrink' : 'Expand'} dashboard`" placement="bottom">
        <button class="btn btn-circle btn-icon btn-bg-dark me-1" @click="isScreenMaximized = !isScreenMaximized">
          <inline-svg
            :src="`media/svg/buttons/${isScreenMaximized ? 'minimize' : 'maximize'}.svg`"
            style="fill:white"
            width="20"
            height="20"
          />
        </button>
      </el-tooltip>
      <div id="user-menu">
        <div class="px-md-10 px-sm-5 d-flex align-items-center" style="width: max-content; justify-content:normal; height: 60px;">
          <!-- User Profile Pic -->
          <template v-if="userPic != ''">
            <div class="symbol symbol-circle">
              <img
                class="menu-avatar-img"
                :src="userPic"
                alt="metronic"
                style="height: 50px; width: 50px;"
              />
            </div>
          </template>
          <template v-else>
            <div class="symbol avatar-card symbol-circle firstname-placeholder text-center d-flex flex-row justify-content-center align-items-center py-5">
              <span>{{ initial }}</span>
            </div>
          </template>
          <!-- Profile -->
          <div class="d-flex flex-column ms-3">
            <div class="d-flex align-items-center text-white wrap name-container justify-content-between text-medium fw-600">
              {{ fullName }}
            </div>
            <span class="text-elipsis text-green text-normal fw-500" style="text-align: left; width: max-content;">
              {{ authStore.user.Position }}
            </span>
            <!-- Week and Current Date -->
            <div class="w-100 top-menu-time">
              <span class="text-green fw-500 text-normal">
                {{ weekNumber && weekNumber != "" ? weekNumber : "Week -" }}
              </span>
              <el-divider direction="vertical" />
              <span class="text-white fw-400 text-normal">
                {{ currentDate && currentDate != "" ? simpleFormatDateShort(normalizeDate(new Date(currentDate))) : "-" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-menu>
  <!-- Top Bar : end -->
  <!-- IronPortal Content : start -->
  <div class="ironportal-content" :style="isScreenMaximized ? 'padding-bottom: 10px' : ''">
    <router-view :key="keyForReload" />
  </div>
  <!-- IronPortal Content : end -->
  <!-- Bottom Bar : start -->
  <el-menu
    v-if="((menuDashboardName.includes(routeName as string) ? false : true) && !isScreenMaximized)"
    :default-active="activeMenu"
    mode="horizontal"
    background-color="#2d2b39"
    text-color="#919eab"
    active-text-color="#1d8f45"
    :ellipsis="true"
    class="ironportal-bottom-menu d-flex align-items-center justify-content-center"
    @select="handleSelectMenu"
  >
    <div class="d-flex">
      <el-menu-item v-for="(menu, i) in menuList" :key="i" :index="menu.MenuName" class="bottom-menu-item">
        <img
          v-if="menu.Icon && menu.Icon != ''"
          class="bottom-menu-item-icon"
          alt=""
          :src="`/media/svg/iron-portal/${menu.Icon}${activeMenu == menu.MenuName ? '-green' : ''}.svg`"
        />
        <span :class="`ms-3 ${activeMenu == menu.MenuName && 'text-white'}`">{{ menu.PageName }}</span>
      </el-menu-item>
    </div>
  </el-menu>
  <!-- Bottom Bar : end -->
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeMount,
  onMounted,
  ref,
  watch
} from 'vue'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import { isFunction, isUndefined } from 'lodash'
import {
  normalizeDate,
  simpleFormatDateShort
} from '@/core/helpers/date-format'
import { useMenuStore } from '@/store/pinia/application/useMenuStore'
import { useRoute, useRouter } from 'vue-router'
import { AxiosResponse } from 'axios'
import ApiService from '@/core/services/ApiService'
import {
  checkSignInStatus,
  checkDMASignInStatus,
} from '@/core/helpers/get-user-info'
import { useSyncStore } from '@/store/pinia/dma/sync/useSyncStore'
import { CronJob } from 'cron'
import { useMsal } from "@/msal/api/useMsal";
import {
  isOfflineOrSlowInternetConnection,
  renewToken
} from "@/core/helpers/internet-connection";

const route = useRoute()
const router = useRouter()
const authStore = useAuthenticationStore()
const menuDashboardName = [
  "ironportaldashboard"
]; // Dashboard name to show or hide menu and video dashboard
const keyForReload = ref(0); // Just for reloading purpose. To reload page even though the url is not changed
const menuStore = useMenuStore();
const backgroundSrc = ref("");
const weekNumber = ref("");
const currentDate = ref("");
const userPic = computed(() => {
  return authStore.userPic
})
const isScreenMaximized = ref(false)
const { instance } = useMsal()
// Menu handling: start =======================================

const activeMenu = computed(() => {
  const tempRoute = route.path.split("/");
  return `/${tempRoute[1]}/${tempRoute[2]}`; // Just return the menu without param
})

const notAllowedPageNames = [
  "CBM Compliance Report",
  "Summary Intervention",
  "Detail Information",
  "Revise and Overwrite Authority"
]

const menuList = computed(() => {
  if (isFunction(menuStore.menu.getAllProductMenu)) {
    const products = menuStore.menu.getAllProductMenu("IronPortal");
    const dashboardMenu = products.find((e) => {
      return e.MenuName.includes("/ironportal-dashboard")
    })
    if (dashboardMenu) {
      const menu = menuStore.menu.getAllFeatureMenu(dashboardMenu.MenuId)
      return menu.filter((menu) => {
        return notAllowedPageNames.indexOf(menu.PageName) < 0; // Returns true for menu that's not found in notAllowedPageNames.
      });
    }
  }
  return []
})

const handleSelectMenu = (key: string) => {
  if (key == activeMenu.value) {
    keyForReload.value++;
  } else {
    router.push({ path: key });
    keyForReload.value = 0;
  }
}


// Menu handling: end =========================================

// Profile: start =============================================
const initial = computed(() => {
  return !isUndefined(authStore.user.Name) ? authStore.user.Name[0] : ""
})
const fullName = computed(() => {
  const nameType = typeof authStore.user?.Name
  if (nameType !== "undefined") {
    return authStore.user.Name
  }
  return ""
})
const isLoggedIn = computed(() => {
  return authStore.loggedIn;
})
const routeName = computed(() => {
  return route.name;
})

const activePage = computed(() => {
  return route.path
})

// Profile: end ===============================================
const fetchBackground = async () => {
  const url = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_UTILITY}/api/master_attachment/download_by_url_ehms`
  const params = {
    ver: "v1",
  };
  try {
    const response: AxiosResponse<Blob> = await ApiService.getBlob(url, "", new URLSearchParams(params).toString());
    const blob = new Blob([response.data]);
    backgroundSrc.value = URL.createObjectURL(blob);
  } catch (error) {
    console.log(error);
  }
}

const getCurrentWeekAndDate = async () => {
  const url = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_IRON_PORTAL}/api/master_week`
  const params = {
    ver: "v1",
  };
  try {
    const response: AxiosResponse<any> = await ApiService.get(url, "week_number", new URLSearchParams(params).toString());
    weekNumber.value = response.data.result.content.weekNumber;
    currentDate.value = response.data.result.content.date;
  } catch (error) {
    console.log(error)
  }
}

const setTimeoutForNextDateInfo = () => {
  const now = new Date();
  const milliSecondTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 1, 0) - now;
  console.log(milliSecondTillMidnight)
  setTimeout(async () => {
    setTimeoutForNextDateInfo();
    await getCurrentWeekAndDate();
  }, milliSecondTillMidnight);
}

const handlePreviewDashboard = () => {
  router.push({ name: 'mydashboard' })
}

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

watch(activePage, (value) => {
  if (!menuStore.authPage(value)) {
    router.push({ name: '401' })
  }
})

onBeforeMount(async () => {
  setTimeoutForNextDateInfo()
  await checkSignInStatus(instance)
  await checkDMASignInStatus(!isOfflineOrSlowInternetConnection(), instance)
  // await fetchBackground();
  await getCurrentWeekAndDate();
  if (authStore.userPic == "") {
    await authStore.setUserProfilePic(!isOfflineOrSlowInternetConnection());
  }
});

onMounted(() => {
  if (!isOfflineOrSlowInternetConnection()) {
    startRenewTokenJob()
  }
})

watch(isLoggedIn, (value) => {
  if (!value) {
    renewToken(instance)
  }
})
</script>

<style lang="scss" scoped>
.background-wrapper {
  width: 100%;
  position: relative;
  z-index: 0;
  background-color: #403c4c;
  .background-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100vh !important;
    object-position: 50% 50%;
    overflow-x: hidden;
    overflow-y: hidden;
    object-fit: cover;
  }
}
.ironportal-top-menu {
  position: absolute;
  top: 0;
  width: 100%;
  height: 70px;
  border-bottom: none;
  &>ul {
    padding: 0 !important;
  }
  .top-menu-item {
    flex: 1 1 0;
  }
  .ironportal-logo {
    display: flex;
    padding: 0;
  }
  .top-menu-time {
    width: fit-content;
    line-height: normal;
  }
  &::after, &::before {
    content: none;
  }
}
.ironportal-content {
  min-height: 100vh !important;
  padding: 80px 0 85px 0;
  background: #403c4c;
  overflow: hidden;

  // padding: 10px;
  box-sizing: border-box;
  resize: horizontal;
}
.ironportal-bottom-menu {
  position: fixed;
  bottom: 20px;
  width: 95%;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-bottom: none;
  height: min-content;
}
.bottom-menu-item {
  text-transform: uppercase;
  font-weight: 500;
  line-height: 4;
  border-right:  solid 2px #3c3a48;
  .bottom-menu-item-icon {
    width: 20px;
    height: 20px;
  }
}
.bottom-menu-item:last-child {
  border-right:  none;
}
.is-active {
  -webkit-box-shadow: inset 0 -5px 0 0px #4CAF50;
  -moz-box-shadow: inset 0 -5px 0 0px #4CAF50;
  box-shadow: inset 0 -5px 0 0px #4CAF50;
}
.avatar-card {
  background-color: #F9FAFB;
  border-radius: 50%;
}

.firstname-placeholder {
  width: 42px;
  height: 42px;
  background-color: #18AF4A;

  span {
    font-size: 24px;
    color: white;
  }
}
</style>
import ApiService from '@/core/services/ApiService'
