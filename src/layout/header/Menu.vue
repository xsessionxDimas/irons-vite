<template>
  <!--begin::Menu wrapper-->
  <div
    class="header-menu align-items-stretch"
    data-kt-drawer="true"
    data-kt-drawer-name="header-menu"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="{default:'200px', '300px': '250px'}"
    data-kt-drawer-direction="end"
    data-kt-drawer-toggle="#kt_header_menu_mobile_toggle"
    data-kt-place="true"
    data-kt-place-mode="prepend"
    data-kt-place-parent="{default: '#kt_body', lg: '#kt_header_nav'}">
    <!--begin::Menu-->
    <div
      class="
        menu
        menu-lg-rounded
        menu-column
        menu-lg-row
        menu-state-bg
        menu-title-white-700
        menu-state-title-success
        menu-state-icon-success
        menu-state-bullet-success
        menu-arrow-white-400
        fw-bold
        my-5 my-lg-0
        align-items-stretch"
      id="#kt_header_menu" style="padding-top: 10px;"
      data-kt-menu="true">
      <div class="menu-item me-lg-1 bspace-menu">
        <router-link
          :to="{ name : 'mydashboard'}"
          v-slot="{ href, isActive, isExactActive }">
          <a
            href="javascript:void(0)"
            class="menu-link py-3"
            @click="redirectByLink(href)"
            :class="[isActive && 'active', isExactActive && 'active']">
            <span class="menu-title">
              <inline-svg src="/media/svg/header/home.svg" />
            </span>
          </a>
        </router-link>
      </div>
      <template v-if="menuVisible">
        <template v-for="(item, i) in MainMenuConfig" :key="i">
          <div class="menu-item me-lg-1 bspace-menu">
            <span
                @click="pageClick(item, item.toLowerCase())"
                class="menu-link py-3"
                :class="{ active: hasActiveChildren(item) }">
                <span class="menu-title fw-600">{{ item }}</span>
                <span class="menu-arrow d-lg-none"></span>
              </span>
            </div>
        </template>
      </template>
      <!--end::Menu-->
    </div>
  </div>
  <!--end::Menu wrapper-->
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import navigator from "@/core/mixins/navigator";
import { useMenuStore } from "../../store/pinia/application/useMenuStore";

defineProps({
  menuVisible: {
    type: Boolean,
    required: true
  }
});

const menuStore = useMenuStore();
const { redirectByLink, redirectByName } = navigator();

const hasActiveChildren = (page) => {
  return menuStore.activePage === page;
};

const MainMenuConfig = computed(() => {
  if (typeof (menuStore.menu.getAllTribeMenu) !== 'function') return [];
  return menuStore.menu?.getAllTribeMenu();
});
const pageClick = (newPage:string, route: string) => {
  menuStore.setActivePage(newPage);
  const routeClick = route.split(" ").join("");
  redirectByName(routeClick);
}
</script>
