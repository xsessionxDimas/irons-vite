<template>
  <div id="DEFECT_IDENTIFIED_SERVICE" class="dma-historical-eform">
    <HeaderTask title="Identified Defects" />
    <DefectHeader />
    <DefectSMUPanel />
    <DefectPanel />
    <DefectGenericPanel />
    <CrackPanel  />
    <CBMPanel :headers="store.ApprovalData.CBMHeaders" />
    <NAPanel :title="'Service Item Checks Not Completed (N/A)'" :headers="store.ApprovalData.DefectNAHeaders" :is-defect="true"/>
    <NAPanel :title="'Service Crack Checks Not Completed (N/A)'" :headers="store.ApprovalData.CrackNAHeaders" :is-defect="false"/>
    <CommentPanel :headers="dataComments" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import DefectHeader from './components/DefectHeader.vue';
import DefectSMUPanel from './components/DefectSMUPanel.vue';
import DefectPanel from './components/DefectPanel.vue';
import DefectGenericPanel from './components/DefectGenericPanel.vue';
import CrackPanel from './components/CrackPanel.vue';
import CBMPanel from './components/CBMPanel.vue';
import CommentPanel from './components/CommentPanel.vue';
import NAPanel from './components/NAPanel.vue';
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore';
import HeaderTask from "../HeaderTask.vue";
const store = useDefectsStore();

const dataComments = computed(() => {
  return store.Comments.slice().sort(compareComments);
})

const compareComments = (a, b) => {
  const numA = parseInt(a.taskDesc.split(";;")[0]);
  const numB = parseInt(b.taskDesc.split(";;")[0]);
  return numA - numB;
}
</script>

<style lang="scss">
  .defect-header {
    background-color: #F4F6F8;
    border-radius: 8px;

    // text
    color: #637381;
    font-size: 14px;
    font-weight: 700;
  }

  .defect-list {
    // text
    color: #212B36;
    font-size: 14px;
    font-weight: 400;
  }

  .defect-not-found {
    color: #919EAB;
    font-weight: 400;
    font-size: 14px;
  }
  .vertical-center {
    margin: auto 0 !important;
  }
</style>
