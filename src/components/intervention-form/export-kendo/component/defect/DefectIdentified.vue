<template>
  <div id="Defect Identified-Intervention" class="dma-historical-eform">
    <HeaderTask title="Identified Defects" />
    <DefectHeader />
    <DefectSMUPanel />
    <DefectPanel />
    <DefectPanel :is-additional-task="true"/>
    <DefectGenericPanel />
    <CBMPanel :headers="store.ApprovalData.CBMHeaders" />
    <CBMPanel :headers="store.ApprovalData.CBMHeaders" :is-additional-task="true" />
    <NAPanel :title="'Not Applicable Item Check'" :headers="store.ApprovalData.DefectNAHeaders" />
    <NAPanel :title="'Not Applicable Item Check (Additional Task)'" :headers="store.ApprovalData.DefectNAHeaders" :is-additional-task="true"/>
    <CommentPanel :headers="dataComments" :is-intervention="true" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import DefectHeader from '@/components/e-form/export-kendo/component/defect/components/DefectHeader.vue';
import DefectSMUPanel from './components/DefectSMUPanel.vue';
import DefectPanel from './components/DefectPanel.vue';
import DefectGenericPanel from './components/DefectGenericPanel.vue'
import CBMPanel from './components/CBMPanel.vue';
import NAPanel from './components/NAPanel.vue';
import {
  useComponentInterventionDefectsStore
} from "@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore"
import HeaderTask from "../HeaderTask.vue";
import CommentPanel from "@/components/e-form/export-kendo/component/defect/components/CommentPanel.vue"
const store = useComponentInterventionDefectsStore();

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
