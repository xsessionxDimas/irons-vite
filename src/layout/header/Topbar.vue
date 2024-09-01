<template>
  <!--begin::Toolbar wrapper-->
  <div class="d-flex align-items-stretch flex-shrink-0">
    <div class="topbar d-flex align-items-stretch flex-shrink-0">
      <div class="d-flex align-items-center">
        <!--begin::Menu wrapper-->
        <div class="
            btn btn-icon
            position-relative
            w-30px
            h-30px
            w-md-40px
            h-md-40px" style="visibility:hidden">
          <em class="bi bi bi-bell-fill" style="font-size:2rem; color:#CFD8DC"></em>
        </div>
        <!--end::Menu wrapper-->
      </div>
      <!--begin::User-->
      <div :class="wrapperClass"
        class="d-flex align-items-center"
        id="kt_header_user_menu_toggle">
        <!--begin::Menu-->
        <div id="user-menu"
          ref="trigger"
          @click="userClick"
          class="btn btn-icon btn-active-light-primary
            w-md-260px
            h-md-260px"
          style="width:156px; justify-content:normal; height: 48px"
          data-kt-menu-trigger="click"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="bottom">
          <template v-if="userPic != ''">
            <div class="symbol symbol-circle">
              <img
                class="menu-avatar-img"
                :src="userPic"
                alt="metronic"
             />
            </div>
          </template>
          <template v-else>
            <div class="symbol symbol-circle firstname-placeholder text-center d-flex flex-row justify-content-center align-items-center py-5">
              <span>{{ initial }}</span>
            </div>
          </template>
          <div class="d-flex flex-column " style="margin-left:10px; width: 70%">
            <div class="fw-bolder d-flex align-items-center text-white fs-6 wrap name-container justify-content-between">
              {{ firstName }} <em ref="caret" :class="caretClass" style="flex: 1; font-size:1rem; margin-left:10px; margin-right: 10px"></em>
            </div>
            <a href="javascript:void(0)" class="fw-bold text-muted fs-8 text-elipsis" style="text-align: left;">
              {{ authStore.user.Position }}
            </a>
          </div>
        </div>
        <KTUserMenu></KTUserMenu>
        <!--end::Menu-->
      </div>
    </div>
  </div>
  <!--end::Toolbar wrapper-->
</template>

<style scoped>
  .menu-avatar-img {
    width: 36px !important;
    height: 36px !important;
  }

 .btn-check:checked + .btn.btn-active-light-primary, .btn-check:active + .btn.btn-active-light-primary, .btn.btn-active-light-primary:focus:not(.btn-active), .btn.btn-active-light-primary:hover:not(.btn-active), .btn.btn-active-light-primary:active:not(.btn-active), .btn.btn-active-light-primary.active, .btn.btn-active-light-primary.show, .show > .btn.btn-active-light-primary {
    background-color: transparent !important;
    border-radius: 12px;
  }
  .wrap {
    word-wrap: break-word;
    text-align: left;
  }
</style>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import KTUserMenu from "@/layout/header/partials/UserMenu.vue";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { isUndefined } from 'lodash'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const authStore = useAuthenticationStore();
const wrapperClass = ref<string>("");
const trigger = ref<HTMLDivElement | null>(null);
const caretClass = ref<string>("bi bi-caret-down-fill");

const userClick = () => {
  if (trigger.value?.className.includes("menu-dropdown")) {
    caretClass.value = "bi bi-caret-down-fill";
    wrapperClass.value = "";
  } else {
    caretClass.value = "bi bi-caret-up-fill";
    wrapperClass.value = "wrapper-active";
  }
}

const userPic = computed(() => {
  return authStore.userPic
})

const firstName = computed(() => {
  const nameType = typeof authStore.user?.Name
  if (nameType !== 'undefined') {
    const nameArr = authStore.user?.Name.split(' ')
    return nameArr[0]
  }
  return ''
})

onBeforeMount(async () => {
  if (authStore.userPic == '') {
    await authStore.setUserProfilePic(!isOfflineOrSlowInternetConnection())
  }
})

const initial = computed(() => {
  return !isUndefined(authStore.user.Name) ? authStore.user.Name[0] : ''
})
</script>

<style lang="scss" scoped>
  .firstname-placeholder {
    width: 36px;
    height: 36px;
    background-color: #18AF4A;

    span {
      font-size: 20px;
      color: white;
    }
  }
</style>
