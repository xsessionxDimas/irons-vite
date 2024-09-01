<template>
  <!--begin::Toolbar-->
  <div class="my-5" id="kt_toolbar">
    <!--begin::Container-->
    <div id="kt_toolbar_container" class="container-fluid d-flex flex-stack">
      <!--begin::Page title-->
      <div
        class="mb-5 mb-lg-0 lh-1">
        <!--begin::Title-->
        <div class="row mb-1">
          <div class="col-12">
            <h1 class="page-title my-3" style="margin-right:2rem">
              {{ title }}
            </h1>
          </div>
        </div>
        <!--end::Title-->

        <div class="row">
          <div class="col-12">
            <ol class="breadcrumb text-muted fs-6 fw-bold">
              <li class="breadcrumb-item pe-3 text-muted">
                <a href="#" @click="handleRedirect('mydashboard')" class="breacrumb-inactive text-hover-primary">{{ translate('HOME', t, te) }}</a>
              </li>
              <template v-for="(item, index) in breadcrumbs" :key="index">
                <template v-if="index === (breadcrumbs.length - 1)">
                  <li class="breadcrumb-item pe-3 breacrumb-active">{{ item.pageName }}</li>
                </template>
                <template v-else>
                  <li class="breadcrumb-item pe-3 text-muted">
                    <a href="#" @click.prevent="handleRedirect(item.pageRoute)" class="breacrumb-inactive text-hover-primary">{{ item.pageName }}</a>
                  </li>
                </template>
              </template>
            </ol>
          </div>
        </div>
        <!--end::Breadcrumb-->
      </div>
      <!--end::Page title-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Toolbar-->
</template>

<style scoped>
  #kt_toolbar {
    margin-left: 10px;
  }
</style>


<script lang="ts">
import { defineComponent } from "vue";
import { toolbarWidthFluid } from "@/core/helpers/config";
import navigator from "@/core/mixins/navigator";
import { translate } from "@/core/helpers/language"
import { useI18n } from "vue-i18n"

export default defineComponent({
  name: "KToolbar",
  props: {
    breadcrumbs: Array,
    title: String,
  },
  components: {},
  setup() {
    const { t, te } = useI18n()
    const { redirectByName } = navigator()
    const handleRedirect = (name) => {
      redirectByName(name)
    }
    return {
      toolbarWidthFluid,
      handleRedirect,
      translate,
      t,
      te
    };
  },
});
</script>
