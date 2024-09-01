<template>
  <!--begin::Menu-->
  <div
    class="
      menu
      menu-sub
      menu-sub-dropdown
      menu-column
      menu-rounded
      menu-blue-600
      fw-bold
      py-4"
    data-kt-menu="true">
    <!--begin::Menu item-->
    <!--end::Menu item-->
    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> {{ translate("SIGNOUT", t, te) }} </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<style scoped>
  .menu {
    background: #FFFFFF;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2) !important;
    border-radius: 12px;
    width: 156px;
  }

  .menu-blue-600 a {
    color: #0D47A1;
    font-weight: 600;
    font-size: 12px;
    line-height: 21px;
    /* identical to box height */
    letter-spacing: 0.001em;
  }

  .px-5 {
    padding-right: 1.25rem !important;
    padding-left: 0.9rem !important;
  }

  .menu-sub-dropdown {
    box-shadow: none;
  }
</style>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMsal } from "@/msal/api/useMsal";
import { translate } from "@/core/helpers/language";
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import { useMenuStore } from "@/store/pinia/application/useMenuStore";
import { db } from "@/database/schema/DexieSchema"
import { clearRecords } from "@/database/schema/DatabaseWrapper"

const router = useRouter();
const { t, te } = useI18n();
const userStore = useAuthenticationStore();
const menuStore = useMenuStore();
const { instance } = useMsal();

const signOut = async () => {
  try {
    await instance.logoutPopup();
  } catch (error) {
    console.log(error)
  } finally {
    localStorage.clear();
    sessionStorage.clear();
    userStore.reset();
    menuStore.reset();
    await clearRecords(db, 'validTokenNew')
    router.push({ name: "signin" });
  }
};
</script>
