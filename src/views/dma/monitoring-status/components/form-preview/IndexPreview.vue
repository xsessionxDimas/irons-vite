<template>
    <el-collapse accordion>
        <el-collapse-item title="JSON Editor" name="1">
          <JsonEditorVue @change="handlePreview" />
        </el-collapse-item>
    </el-collapse>
    <FormViewer :title="title || 'Monitoring Status Detail'" :defect-close-first="true" page-from="monitoringstatus" />
  </template>
<script setup lang="ts">
import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import { defineProps } from "vue";
import JsonEditorVue from 'json-editor-vue'
import FormViewer from "@/views/dma/components/form-preview/Index.vue";

defineProps(['title'])

const previewStore = usePreviewFormStore()

const handlePreview = (event) => {
  if (event.text != '') {
    // console.log(JSON.parse(event.text));
    const selectedGroup = JSON.parse(event.text)
    if (previewStore.stateSelectedGroup) {
      previewStore.stateSelectedGroup.groupName = selectedGroup.name
    }
    previewStore.stateSelectedSubGroups = selectedGroup
  }
}
</script>
