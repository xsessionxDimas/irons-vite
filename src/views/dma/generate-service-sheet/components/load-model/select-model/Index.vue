<template>
  <div class="mt-2">
    <h2>Load Existing Model</h2>
  </div>
  <el-form :model="form" v-loading="is_form_loading">
    <div class="row mb-2 w-100">
      <div class="col-2 d-flex align-items-center">
        Select Model
      </div>
      <div class="col">
        <el-select clearable class="m-2" filterable v-model="form.model" placeholder="Select Existing Model" size="small">
          <el-option v-for="model in modelList" :label="`${model.brand} ${model.equipmentModel}`" :value="`${model.brand} ${model.equipmentModel}`" :key="model.equipmentModelId" />
        </el-select>
      </div>
    </div>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :disabled="disabledCondition">Generate & Load</el-button>
      <el-button @click="handleResetForm">Clear</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  useJSONStore
} from "@/store/pinia/dma/generate-service-sheet/useJSONStore";
import { cloneDeep } from "lodash";
import {
  defineEmits,
  ref,
  computed
} from "vue";

const emits = defineEmits(["loadSuccess"]);

const JSONStore = useJSONStore();

const defaultForm = {
  model: '',
}
const form = ref(cloneDeep(defaultForm))

const modelList = computed(() => {
  return JSONStore.modelList
})

const disabledCondition = computed(() => {
  return !(form.value.model != "")
})

const is_form_loading = ref(false)

const handleSubmit = async () => {
  is_form_loading.value = true
  await JSONStore.postGenerateServiceSheetByModel(form.value.model)
  setTimeout(() => {
    is_form_loading.value = false
    emits("loadSuccess");
  }, 1000);
}

const handleResetForm = () => {
  form.value = cloneDeep(defaultForm)
}
</script>
