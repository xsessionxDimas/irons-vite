<template>
  <div class="my-2 mx-2">
    <h1>IRONFORMS MODEL GENERATOR</h1>
  </div>
  <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
  <!-- LOAD MODEL -->
    <el-tab-pane label="Load Model" name="upload">
      <div class="row w-100">
        <div class="col-2 d-flex align-items-center">
          Select Generate Mode
        </div>
        <div class="col">
          <el-select v-model="selectedMode" class="m-2" placeholder="Select" size="small">
            <el-option
              v-for="item in listMode"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <template v-if="selectedMode == 1">
        <SelectModel
        @load-success="
            () => {
              activeName = 'preview';
            }
          "
        />
      </template>
      <template v-else-if="selectedMode == 2">
        <UploadForm
          @load-success="
            () => {
              activeName = 'preview';
            }
          "
        />
      </template>
    </el-tab-pane>

    <!-- PREVIEW -->
    <el-tab-pane
      label="Viewer"
      name="preview"
      :disabled="store.availableServiceSize.length < 1"
    >
      <FormPreview />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import UploadForm from "./components/load-model/uploader/Index.vue";
import SelectModel from "./components/load-model/select-model/Index.vue";
import FormPreview from "./components/form-generator/Index.vue";
import {
  useJSONStore
} from "@/store/pinia/dma/generate-service-sheet/useJSONStore";

const store = useJSONStore();
const listMode = [
  {
    value: 1,
    label: "Existing Model"
  },
  {
    value: 2,
    label: "Upload Excel"
  }
]
const selectedMode = ref(1);
const activeName = ref("upload");

onBeforeMount(() => {
  store.getEquipmentList()
})
</script>
<style scoped>
.demo-tabs {
  margin-top: 10px;
  margin-left: 7px;
  margin-right: 7px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
