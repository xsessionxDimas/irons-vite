<template>
    <div class="ps-0 mt-5">
      <div class="card">
         <el-collapse v-model="activeTaskGroup" class="task-group e-form-only py-1 px-5 mb-3">
          <!-- {{ taskGroup }} -->
            <el-collapse-item :title="section.name" :name="section.name">
              <template v-for="task in section.tasks" :key="task.key">
                <template v-if="task.taskType == 'inline'">
                    <InlineTask
                    :re-render="reRender"
                    :intervention="intervention"
                    :task="task"
                    :items="task.items"
                    :defect-images="defectImages"
                    :current-fitter="currentFitter"
                    :loading-indicator="props.loadingIndicator"
                    :item-trigger-disabled-value="props.itemTriggerDisabledValue"
                    :is-read-only="isReadOnly"
                    :validation="validation"
                    :currInputTyped="currInputTyped"
                    :form-status="intervention.interventionExecution"
                    :general-submitted="generalSubmitted"
                    @on-task-changed="onTaskChanged"
                    @on-n-a-created="onNACreated"
                    @on-defect-view="onDefectView"
                    @on-init-loading-indicator="onInitLoadingItem"
                    @on-small-camera-clicked="onSmallCameraClicked"
                    @on-image-deleted="onImageDeleted"
                    @on-image-downloaded="onImageDownloaded" />
                </template>
                <template v-if="section.tasks.length < 2">
                  <div class="row w-100 m-0">
                    <p style="text-align: center;">No data recorded</p>
                  </div>
                </template>
              </template>
            </el-collapse-item>
        </el-collapse>
      </div>
    </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  watch,
  PropType,
  ref
} from 'vue'
import { Audit } from '@/core/types/intervention/Audit'
import { Section } from '@/core/types/intervention/Section'
import InlineTask from './InlineTask.vue'
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import { NAFormData } from '@/core/types/intervention/NAFormData'
import { KeyValue } from '@/core/types/misc/KeyValue'
import { Intervention } from '@/core/types/intervention/Intervention'
import { FileDeleteParam } from '@/core/types/intervention/FileDeleteParam'
import { Image } from '@/core/types/intervention/Image'

const props = defineProps({
  intervention: {
    required: true,
    type: Object as PropType<Intervention>
  },
  section: {
    required: true,
    type: Object as PropType<Section>
  },
  defectImages: {
    type: Object,
    required: true
  },
  currentFitter: {
    required: true,
    type: Object as PropType<Audit>
  },
  loadingIndicator: {
    required: true,
    type: Object
  },
  itemTriggerDisabledValue: {
    required: true,
    type: Object
  },
  reRender: {
    type: Boolean,
    default: false
  },
  expandAll: {
    type: Boolean,
    default: false
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  validation: {
    type: String,
    default: ""
  },
  currInputTyped: {
    type: String,
    default: ""
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  },
})

/* emits */
const emits = defineEmits([
  'onTaskChanged',
  'onNACreated',
  'onDefectView',
  'onInitLoadingItem',
  'onSmallCameraClicked',
  'onImageDeleted',
  'onImageDownloaded'
])
const activeTaskGroup = ref(props.section.name)

const onTaskChanged = (data: TaskUpdateObject) => {
  emits('onTaskChanged', data)
}
const onSmallCameraClicked = (param: TaskUpdateObject) => {
  emits('onSmallCameraClicked', param)
}
const onImageDeleted = (param: FileDeleteParam) => {
  emits('onImageDeleted', param)
}
const onImageDownloaded = (image: Image) => {
  emits('onImageDownloaded', image)
}
const onNACreated = (data: NAFormData) => {
  emits('onNACreated', data)
}
const onDefectView = (data: KeyValue) => {
  emits('onDefectView', data)
}
const onInitLoadingItem = (data: KeyValue) => {
  emits('onInitLoadingItem', data)
}
const expandPanel = () => {
  activeTaskGroup.value = props.section.name
}
watch(() => {
  return props.expandAll
}, () => {
  expandPanel()
})
</script>
