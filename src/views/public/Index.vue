<template>
  <PBI
    :reportName="reportName"
    :breadCrumb="breadCrumb"
    :analyticPage="analyticPage"
    :eventName="eventName"
    :visibletab="false"
    :showFilter="false"
    :isPublic="true"
    :isTransparent="false"
    class="ash-silo-dashboard"
 />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PBI from "../ash-silo/pbi-embedded/PBI.vue";

export default defineComponent({
  name: "pbi-embedded-index",
  components: {
    PBI,
  },
  setup() {
    const reportName = "ASH_SILO";
    const breadCrumb = {
      currentPageBreadCrumb: "Ash Silo Dashboard",
      activePage: "Ash Silo Dashboard",
      breadCrumbList: [
        {
          pageName: "Ash Silo Dashboard",
          pageRoute: "/ash-silo",
        },
      ],
    };
    const analyticPage = "Ash Silo Dashboard";
    const eventName = "ash_silo_dashboard";

    return {
      reportName,
      breadCrumb,
      analyticPage,
      eventName,
    };
  },
});
</script>

<style lang="scss" scoped>
.ash-silo-dashboard {
  overflow: hidden;
  margin: 0 !important;
  height: 100% !important;
}
</style>
