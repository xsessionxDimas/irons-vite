<template>
  <el-dialog
    v-model="showDialog"
    width="90%"
    custom-class="el-defect-crack-form-custom"
    @closed="handleClose"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape = "false"
  >
    <template #title>
      <span class="el-dialog__title">{{ suspensionCylinderFormStore.stateSCCalibration.subGroup[0].name }}</span>
    </template>
    <div class="row text-center pt-5 justify-content-end" style="word-break: normal;">
      <div class="row px-2">
        <template v-for="subGroup in suspensionCylinderFormStore.stateSCCalibration.subGroup" :key="subGroup.key">
          <SubGroup :subGroup="subGroup"/>
        </template>
      </div>
      <div class="col-2">
        <el-button type="success" :disabled="submitButtonDisabled" class="ok-button" @click="handleSubmit">Submit</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  useSuspensionCylinderFormStore
} from '@/store/pinia/dma/e-form/useSuspensionCylinderFormStore';
import { computed } from '@vue/reactivity';
import { ElLoading } from 'element-plus';
import { defineProps, defineEmits } from 'vue'
import SubGroup from './template/sub-group/SubGroup.vue';

// ---------- PROPS N EMITS ----------
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
});
const emits = defineEmits(["close", "onConfrimSubmit"]);
// ---------- PROPS N EMITS ----------

// ---------- STORES ----------
const suspensionCylinderFormStore = useSuspensionCylinderFormStore()
// ---------- STORES ----------

// ---------- COMPUTED ----------
const showDialog = computed(() => {
  return props.show
})

const submitButtonDisabled = computed(() => {
  let status = false
  suspensionCylinderFormStore.stateValidation.forEach((item) => {
    if (!item.value || item.value == "false") {
      console.log("item", item);
      status = true
      return
    }
  })
  return status
})
// ---------- COMPUTED ----------

// ---------- FUNCTIONS ----------
const handleSubmit = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading the page',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await suspensionCylinderFormStore.submitForm()
  handleClose()
  loading.close()
  await emits("onConfrimSubmit")
}

const handleClose = () => {
  emits("close")
}
// ---------- FUNCTIONS ----------
</script>

<style lang="scss">
  .oil-not-in-range__header {
    .el-dialog__header {
      border-bottom: none !important;
    }
  }

  .ok-button {
    background-color: #18AF4A;
  }
</style>
