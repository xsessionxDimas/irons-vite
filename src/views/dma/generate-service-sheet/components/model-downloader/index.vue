<template>
  <el-input v-model="JSONStore.fileName" placeholder="File Name" class="mb-4">
    <template #append>.json (JSON File)</template>
  </el-input>

  <el-button type="primary" @click="downloadFullModel"> Save </el-button>
</template>

<script setup lang="ts">
import {
  useJSONStore
} from "@/store/pinia/dma/generate-service-sheet/useJSONStore";

const JSONStore = useJSONStore();

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", `${filename}.json`);

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function downloadFullModel() {
  download(JSONStore.fileName, JSON.stringify(JSONStore.model, null, 2));
}
</script>
