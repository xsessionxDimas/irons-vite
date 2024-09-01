<template>
  <div class="row m-0 p-5 bg-white">
    <Filter
      @handleFetch="handleFetchList"
   />
    <ListItem
      :listData="listData"
      @handleClick="handleExportPDF"
   />
   <!-- <export-pdf ref="downloadPdf" /> -->
  </div>
</template>


<script lang="ts" setup>
import {
  computed,
  onBeforeMount,
  onUnmounted,
  ref
} from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { Actions as StoreActions } from "@/store/enums/StoreEnums";
import { useStore } from "vuex";
import { ElLoading } from 'element-plus';
import Filter from "./component/listing/Filter.vue"
import ListItem from "./component/listing/ListItem.vue"
import {
  useHistoricalEformDmaListStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaListStore';
import _ from "lodash";
// import exportPdf from "@/components/e-form/export-pdf/Index.vue"
import { swalAlertError } from "@/core/helpers/sweet-alert";

const store = useStore();
const listStore = useHistoricalEformDmaListStore();

// const downloadPdf = ref()

const listData = computed(() => {
  return listStore.displayData
})

const handleFetchList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Fetching List',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await listStore.getData()
  loading.close();
}

/* life cycle hooks */
onUnmounted(() => {
  listStore.resetState();
})

onBeforeMount(async () => {
  store[StoreActions.ACTIVE_PAGE]("IronLake");
  setCurrentPageBreadcrumbs("Report DMA", [
    {
      pageName: "Iron Lake",
      pageRoute: "ironlake",
    },
    {
      pageName: "Report",
      pageRoute: "historicaldmaeform",
    },
    {
      pageName: "Report DMA",
      pageRoute: "historicaldmaeform",
    },
  ]);
  listStore.getLookupSite();
  listStore.getLookupPsType();
  listStore.getLookupEquipment();
  listStore.getLookupModel();
});

/* methods */
const handleExportPDF = async (item) => {
  // downloadPdf.value.handleFetchItem(item).then((status) => {
  //   if (!status.status) {
  //     swalAlertError(status.message, "OK")
  //   }
  // })
}
</script>

<style lang="scss" scoped>
  .hidden {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
    overflow: hidden;
    height: 0;
  }
</style>

<style lang="scss">
  .dma-historical-eform {
    .before {
     page-break-before: always;
   }
   .after {
     page-break-after: always;
   }
   .avoid {
     page-break-inside: avoid;
   }
   .title {
     font-style: normal;
     font-weight: 600;
     font-size: 16px;
     line-height: 24px;
   }
   .report{
    font-family: 'Public sans' !important;
     border-radius: 8px;
     border: 1px solid rgba(145, 158, 171, 0.24);
     padding: 12px !important;
     &_section {
       &_header {
         padding-bottom: 12px;
         &_subtitle {
           .title {
             font-size: 14px;
           }
         }
       }
       &_body {
         padding: 12px;
       }
     }
   }
  }
</style>
