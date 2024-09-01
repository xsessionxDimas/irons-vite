<template>
  <div id="DEFECT_IDENTIFIED_SERVICE" class="dma-historical-eform">
    <HeaderTask title="Identified Defects" />
    <CBMPanel :headers="store.ApprovalData.CBMHeaders" />
    <NAPanel :title="'Not Applicable Item Check'" :headers="store.ApprovalData.DefectNAHeaders" :is-defect="true"/>
    <CommentPanel :headers="dataComments" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import CBMPanel from './components/CBMPanel.vue';
import NAPanel from './components/NAPanel.vue';
import CommentPanel from './components/CommentPanel.vue';
import {
  useInterimDefectsStore
} from '@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore'
import HeaderTask from "../HeaderTask.vue";
const store = useInterimDefectsStore();

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
