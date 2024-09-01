<template>
  <div class="mt-2">
    <h2>Load model</h2>
    <p>Upload excel file</p>
  </div>
  <el-form :model="form" v-loading="is_form_loading">
    <el-form-item label="Load Model">
      <el-upload
        @click="clearFiles"
        ref="uploadRef"
        class="upload-demo"
        :multiple="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="handleChange"
        :auto-upload="false"
        :limit="1">
        <el-button type="primary">Choose model</el-button>
        <template #tip>
          <div class="el-upload__tip">only accept xlsx file</div>
        </template>
      </el-upload>
    </el-form-item>

    <!-- ONLY SHOW WHEN USER UPLOAD EXCEL FILE -->
    <template v-if="is_excel">
      <el-form-item label="Worksheet Name">
        <el-input v-model="form.name" style="width: 400px" />
      </el-form-item>
    </template>

    <el-form-item>
      <el-button type="primary" @click="onSubmit" :disabled="!is_file_attached">{{
        nextButtonText
      }}</el-button>
      <el-button type="primary" @click="handleDownload" :disabled="downloadEnable">Download JSON</el-button>
      <el-button @click="clearFiles">Clear</el-button>
    </el-form-item>
  </el-form>
  <el-dialog
    v-model="errorGridVisible"
    title="Failed to generate"
    width="90%"
    top="7vh"
    destroy-on-close
    center
    @closed="() => { errorGridVisible = false }">
    <error-grid :data="errorData" />
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineEmits,
  ref,
  reactive,
  computed
} from "vue";
import { UploadFile } from "element-plus/lib/el-upload/src/upload.type";
import { ElMessage } from "element-plus";
import {
  useJSONStore
} from "@/store/pinia/dma/generate-service-sheet/useJSONStore";
import { Model } from "@/core/types/generate-service-sheet/Model";
import { GenerateError } from "@/core/types/misc/GenerateError";
import ErrorGrid from "./ErrorGrid.vue";
import { isEmpty } from "lodash"

const emits = defineEmits(["loadSuccess"]);

const JSONStore = useJSONStore();

const form = reactive({
  accepted_format: "",
  file: null as UploadFile | null,
  name: "",
});

const cloudResourceForm = reactive({
  model: {
    name: "",
  },
});

const uploadRef = ref(null);
const errorGridVisible = ref(false)
const errorData = ref<GenerateError[]>([])

const file_extension = computed(() => {
  return form.file?.name.split(".").reverse()[0];
});

const downloadEnable = computed(() => {
  return isEmpty(JSONStore.model)
})

const nextButtonText = computed(() => {
  if (is_excel.value) return "Generate & Load";

  return "Load";
});

const is_file_attached = computed(() => {
  return !!form.file;
});

const is_excel = computed(() => {
  return file_extension.value == "xlsx";
});

const is_form_loading = computed(() => {
  return JSONStore.isExcelOnRendering || JSONStore.fetchingExistingModel;
});

const handleChange = (file?: UploadFile) => {
  if (!file) return;
  form.file = file;
};

const handleDownload = () => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(JSONStore.model, null, 2))
  );
  element.setAttribute("download", "model.json");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const clearFiles = () => {
  JSONStore.clearModel();
  form.file = null;
  if (uploadRef.value) {
    (uploadRef.value as any).clearFiles();
  }
};

// TECH-DEBT: can refactor to get more clean code
const onSubmit = async () => {
  if (!is_file_attached.value) return;

  if (is_excel.value) {
    const excelFile = form.file?.raw;

    if (!excelFile) {
      ElMessage.error("file contains, but hasn't File object");
      throw Error("file contains, but hasn't File object");
    }

    const formData = new FormData();

    formData.append("workSheet", form.name);
    formData.append("file", excelFile);

    JSONStore.postGenerateServiceSheet(formData)
      .then(() => {
        const partial_name = String(excelFile.name).split(".");
        partial_name.pop();
        const file_name_without_exstention = partial_name.join();
        JSONStore.fileName = file_name_without_exstention;
        ElMessage.success("EXCEL generated to JSON and JSON has been loaded!");
        emits("loadSuccess", null);
      })
      .catch((feedback) => {
        errorData.value = feedback.errors as GenerateError[]
        // need to show the grid
        errorGridVisible.value = true
      });
  } else {
    const jsonFile = form.file?.raw;
    const jsonStringtify = await jsonFile?.text();
    if (!jsonFile || !jsonStringtify) return;
    let model: Model | undefined = undefined;
    try {
      model = JSON.parse(jsonStringtify);
    } catch (e) {
      ElMessage.error(e.message);
      throw e;
    }

    if (!model) {
      ElMessage.warning("JSON file is empty");
      return;
    }
    if (!Object.keys(model)[0].includes("psType")) {
      ElMessage.warning("JSON from API or file is invalid");
      return;
    }

    JSONStore.setModel(model);
    const partial_name = String(jsonFile.name).split(".");
    partial_name.pop();
    const file_name_without_exstention = partial_name.join();
    JSONStore.fileName = file_name_without_exstention;
    ElMessage.success("JSON has been loaded!");
    emits("loadSuccess", null);
  }
};
</script>
