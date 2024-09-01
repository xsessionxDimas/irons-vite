<template>
  <div id="kt_header" class="header align-items-stretch">
    <!--begin::Container-->
    <div
      :class="{
        'container-fluid': headerWidthFluid,
        'container-xxl': !headerWidthFluid,
      }"
      class="d-flex align-items-stretch justify-content-between"
    >
      <!--begin::Aside mobile toggle-->
      <div
        class="d-flex align-items-center d-lg-none ms-n3 me-1"
        title="Show aside menu"
        v-if="!checkIsDashboard"
      >
        <div
          class="btn btn-icon btn-active-light-primary"
          id="kt_aside_mobile_toggle"
        >
          <span class="svg-icon svg-icon-2x mt-1">
            <inline-svg src="/media/icons/duotune/menu/menu-burger.svg" />
          </span>
        </div>
      </div>
      <!--end::Aside mobile toggle-->

      <!--begin::Mobile logo-->
      <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 d-lg-none">
        <div class="aside-logo flex-column-auto" id="kt_aside_logo">
          <!--begin::Logo-->
          <a href="javascript:void(0)" @click="handlePreviewDashboard()">
            <img alt="Logo" src="/media/logos/bumaau/buma-logo.png" class="h-40px logo" />
          </a>
          <!--end::Logo-->
        </div>
      </div>
      <!--end::Mobile logo-->

      <!--begin::Wrapper-->
      <div
        class="
          d-flex
          align-items-stretch
          justify-content-between
          flex-lg-grow-1">
        <!--begin::Navbar-->
        <div class="d-flex align-items-stretch" id="kt_header_menu_nav">
          <KTMenu :menu-visible="menuVisible"></KTMenu>
        </div>
        <!--end::Navbar-->

        <!--begin::Topbar-->
        <div class="d-flex align-items-stretch flex-shrink-0">
          <KTTopbar></KTTopbar>
        </div>
        <!--end::Topbar-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Header-->
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import KTTopbar from '@/layout/header/Topbar.vue';
import KTMenu from '@/layout/header/Menu.vue';

import {
  headerChangeColor,
  headerWidthFluid,
  headerLeft,
  asideDisplay,
} from '@/core/helpers/config';
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: "KTHeader",
  props: {
    title: String,
    hdColor: String,
    menuVisible: Boolean
  },
  components: {
    KTTopbar,
    KTMenu,
  },
  // emits: ["headerUpdate"],
  setup() {
    const route = useRoute()
    const router = useRouter()

    const checkIsDashboard = computed(() => {
      return route.name == 'mydashboard'
    })

    const handlePreviewDashboard = () => {
      router.push({ name: 'mydashboard' })
    }

    return {
      headerChangeColor,
      headerWidthFluid,
      headerLeft,
      asideDisplay,
      checkIsDashboard,
      handlePreviewDashboard
    };
  },
  methods: {
    forceHeaderUpdate() {
      alert("success update header");
      this.$forceUpdate();
    }
  },
});
</script>
