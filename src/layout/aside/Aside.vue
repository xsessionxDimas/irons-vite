<template>
  <div id="aside-wrapper">
    <!--begin::Aside toggler-->
    <div class="button-collapse">
      <div v-if="$route.name !== 'mydashboard' && $route.name !== 'personalinfo'"
        id="kt_aside_toggle"
        :class="`btn btn-icon px-0 btn-color-white btn-active-color-white aside-toggle xd ${isSideOpened ? '' : 'hovered active'}`"
        data-kt-toggle="true"
        data-kt-toggle-state="active"
        data-kt-toggle-target="body"
        data-kt-toggle-name="aside-minimize"
        @click="changeSideState(!isSideOpened)">
        <span>
          <div class="button-collapse-icon"></div>
        </span>
      </div>
    </div>
    <!--end::Aside toggler-->
    <div
      id="kt_aside"
      class="aside aside-hoverable"
      :class="[
        asideTheme === 'light' && 'aside-light',
        asideTheme === 'dark' && 'aside-dark',
      ]"
      data-kt-drawer="true"
      data-kt-drawer-name="aside"
      data-kt-drawer-activate="{default: true, lg: false}"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction="start"
      data-kt-drawer-toggle="#kt_aside_mobile_toggle"
    >
      <!--begin::Brand-->
      <div class="aside-logo flex-column-auto" id="kt_aside_logo">
        <!--begin::Logo-->
        <a href="javascript:void(0)" @click="handlePreviewDashboard()">
          <img alt="Logo" src="/media/logos/logo-whitebg.png" class="h-40px logo" />
        </a>
        <!--end::Logo-->
      </div>
      <!--end::Brand-->

      <!--begin::Aside menu-->
      <div class="aside-menu flex-column-fluid">
        <KTMenu></KTMenu>
      </div>
      <!--end::Aside menu-->

      <!--begin::Footer-->
      <div
        class="aside-footer flex-column-auto pt-5 pb-7 px-5"
        id="kt_aside_footer"
      >
      </div>
      <!--end::Footer-->
    </div>
  </div>
  <!--end::Aside-->
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUpdated
} from "vue";
import { useI18n } from "vue-i18n";
import { DrawerComponent } from "../../assets/ts/components/_DrawerComponent";
import { ToggleComponent } from "../../assets/ts/components/_ToggleComponent";
import { asideTheme } from "../../core/helpers/config";
import KTMenu from "../../layout/aside/Menu.vue";
import {
  Actions as MenuActions
} from "../../store/enums/StoreEnums"
import { useMenuStore } from "../../store/templates/useMenuStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "KTAside",
  components: {
    KTMenu,
  },
  props: {
    lightLogo: String,
    darkLogo: String,
  },
  setup() {
    const { t } = useI18n();
    const store = useMenuStore();
    const router = useRouter();

    const isSideOpened = computed(() => {
      console.log(store.getIsSideActive, 'aaa')
      return store.getIsSideActive;
    });

    const changeSideState = (state: boolean) => {
      store[MenuActions.SET_IS_SIDE_ACTIVE](state)
    }

    const handlePreviewDashboard = () => {
      router.push({ name: 'mydashboard' })
    }

    onMounted(() => {
      ToggleComponent.reinitialization();
      DrawerComponent.reinitialization();
    });

    onUpdated(() => {
      ToggleComponent.bootstrap();
    });

    return {
      asideTheme,
      t,
      isSideOpened,
      changeSideState,
      handlePreviewDashboard
    };
  },
});
</script>

<style lang="scss">
.button-collapse-icon::before {
  content: url('../../../media/icons/duotune/arrows/arr080.svg');
}
#kt_aside_toggle.active .button-collapse-icon::before {
  display: inline-block;
  transform: rotate(180deg);
}
// HOVER WHITE
#kt_aside_toggle:hover .button-collapse-icon::before {
  content: url('../../../media/icons/duotune/arrows/arr080-white.svg') !important;
}
</style>
