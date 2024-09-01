<template>
  <DefectInformationHeader />
  <DefectSMUPanel :defect-header="props.data?.DefectSMUHeaders ?? []"
    @on-view-detail-information="onViewDetailInformation" />
  <DefectPanel :defect-header="props.data?.DefectHeaders ?? []" @on-view-detail-information="onViewDetailInformation"
    @on-print-defect="onPrintDefect" :view-is-download="viewIsDownload" :defect-detail="defectDetail ?? []" />
  <DefectPanel :defect-header="props.data?.DefectHeaders ?? []" @on-view-detail-information="onViewDetailInformation"
    :is-additional-task="true" @on-print-defect="onPrintDefect" :view-is-download="viewIsDownload" />
  <GenericDefectPanel :general-submitted="generalSubmitted" :defect-header="props.data?.DefectGenericHeaders ?? []"
    @on-view-detail-information="onViewDetailInformation" @on-add-generic-defect="onAddGenericDefect"
    @on-print-defect="onPrintDefect" :view-is-download="viewIsDownload" :defect-detail="defectDetail ?? []" />
  <CBMPanel :defect-header="props.data?.CBMHeaders ?? []" :defect-status="defectStatus"
    @on-view-detail-information="onViewDetailInformation" />
  <CBMPanel :defect-header="props.data?.CBMHeaders ?? []" :defect-status="defectStatus"
    @on-view-detail-information="onViewDetailInformation" :is-additional-task="true" />
  <NAPanel :defect-header="props.data?.DefectNAHeaders ?? []" @on-view-detail-information="onViewDetailInformation" />
  <NAPanel :defect-header="props.data?.DefectNAHeaders ?? []" @on-view-detail-information="onViewDetailInformation"
    :is-additional-task="true" />
  <CommentPanel :headers="sortedComments" :is-intervention="true" />
</template>

<script lang="ts" setup>
import DefectInformationHeader from "@/views/dma/components/defects/DefectInformationHeader.vue";
import DefectSMUPanel from './panel/DefectSMUPanel.vue'
import DefectPanel from './panel/DefectPanel.vue'
import GenericDefectPanel from './panel/GenericDefectPanel.vue'
import CBMPanel from './panel/CBMPanel.vue'
import NAPanel from './panel/NAPanel.vue'
import {
  defineProps,
  defineEmits,
  PropType,
  computed
} from 'vue'
import DefectIdentifiedClass from '@/core/classes/DefectIdentifiedClass';
import { Comment } from '@/core/types/entities/dma/defects/Comment'
import CommentPanel from "@/views/dma/components/defects/CommentPanel.vue"
import {
  Detail
} from '@/core/types/entities/dma/defects/component-intervention/Detail';

const props = defineProps({
  data: {
    type: Object as PropType<DefectIdentifiedClass>,
    required: false,
    default() {
      return null
    }
  },
  comments: {
    type: [] as PropType<Comment[]>,
    required: false,
    default: []
  },
  viewIsDownload: {
    required: false,
    type: Boolean,
    default: false
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
  defectDetail: {
    type: [] as PropType<Detail[]>,
    required: false,
    default: []
  },
  defectStatus: {
    required: false,
    type: String,
    default: ''
  }
});

const emits = defineEmits([
  "onViewDetailInformation",
  "onAddGenericDefect",
  "onPrintDefect"
])

const sortedComments = computed(() => {
  return props.comments.slice().sort(compareComments);
})

const compareComments = (a, b) => {
  const numA = parseInt(a.taskDesc.split(";;")[0]);
  const numB = parseInt(b.taskDesc.split(";;")[0]);
  return numA - numB;
}

const onViewDetailInformation = (data) => {
  emits("onViewDetailInformation", data)
}
const onAddGenericDefect = () => {
  emits('onAddGenericDefect')
}

const onPrintDefect = (data) => {
  emits("onPrintDefect", data)
}
</script>
