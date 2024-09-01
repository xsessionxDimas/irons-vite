<template>
  <el-dialog
    v-model="showDialog"
    width="90%"
    custom-class="el-defect-crack-form-custom"
    @open="handleOpen"
    @closed="handleClose"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape = "false">
    <template #title>
      <span class="el-dialog__title">Digital Payload Calibration</span>
    </template>
    <div class="row text-center pt-5 justify-content-end" style="word-break: normal;">
      <template v-if="suspensionCylinderFormStore.stateSCHeader.modelId.includes('CAT')">
        <div class="ps-0 mt-1">
          <div class="card">
            <el-collapse v-model="eqInfActiveTaskGroup" class="task-group e-form-only py-1 px-5 mb-3">
              <el-collapse-item title="Equipment Information" name="Equipment Information" class="calibration-preview-title">
                <div class="ps-3 position-relative">
                  <div class="row w-100">
                    <div class="px-2 pt-2 input-eform-status col-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" disabled v-model="suspensionCylinderFormStore.stateSCHeader.equipment" />
                        <label>Unit Number</label>
                      </div>
                    </div>
                    <div class="px-2 pt-2 input-eform-status col-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" disabled v-model="suspensionCylinderFormStore.stateSCHeader.updatedDate" />
                        <label>Calibration Date</label>
                      </div>
                    </div>
                    <div class="px-2 pt-2 input-eform-status col-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" disabled v-model="suspensionCylinderFormStore.stateSCHeader.smu" />
                        <label>Machine SMU</label>
                      </div>
                    </div>
                  </div>
                  <div class="row w-100">
                    <div class="text-start text-bold px-2 pt-2 input-eform-status col-12">
                      <label>Service Labour Personnel</label>
                    </div>
                  </div>
                  <div class="row w-100">
                    <div class="px-2 pt-2 input-eform-status col-12">
                      <div class="form-floating">
                        <input type="text" class="form-control" disabled v-model="suspensionCylinderFormStore.stateSCHeader.updatedBy.name" />
                        <label>Service Labour Personnel</label>
                      </div>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="ps-5 my-3 pe-0">
          <div class="row w-100">
            <div class="text-center d-flex align-items-center justify-content-start light-green color-dark-green rounded py-4 px-2">
              <img class="mx-2" src="media/svg/dma/ic_check.png" alt="">
              Payload Calibrated Successfully
            </div>
          </div>
        </div>
        <template v-if="sylinderMeasurments">
          <TransactionTable
          :tasks="sylinderMeasurments"
          :title="'Cylinder Height Initial Measurement'" />
        </template>
        <template v-if="sylinderMeasurments">
        <TransactionTable v-if="adjustmentSylinderMeasurments"
          :tasks="adjustmentSylinderMeasurments"
          :title="'Cylinder Height Adjustment'" />
        </template>
        <div class="ps-0 mt-5">
          <div class="card">
            <el-collapse v-model="adInfActiveTaskGroup" class="task-group e-form-only py-1 px-5 mb-3">
              <el-collapse-item title="Additional Information" name="Additional Information" class="calibration-preview-title">
                <div class="ps-3 position-relative">
                  <div class="row w-100">
                    <div class="px-2 pt-2 input-eform-status col-12">
                      <el-input
                        v-model="additionalInfoField"
                        :rows="5"
                        type="textarea"
                        placeholder="Please input"
                        :readonly="true"
                      />
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="sylinderMeasurments">
          <TransactionTable
          :tasks="sylinderMeasurments"
          :title="'Cylinder Height Initial Measurement'" />
        </template>
        <template v-if="sylinderMeasurments">
        <TransactionTable v-if="adjustmentSylinderMeasurments"
          :tasks="adjustmentSylinderMeasurments"
          :title="'Cylinder Height Adjustment'" />
        </template>
        <div class="row px-2">
          <template v-for="subGroup in suspensionCylinderFormStore.stateSCCalibration.subGroup" :key="subGroup.key">
            <SubGroup :subGroup="subGroup"/>
          </template>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  useSuspensionCylinderFormStore
} from '@/store/pinia/dma/e-form/useSuspensionCylinderFormStore';
import { computed } from '@vue/reactivity';
import {
  defineProps,
  defineEmits,
  ref
} from 'vue'
import TransactionTable from './template/sub-group/table-item/TransactionTable.vue'
import SubGroup from './template/sub-group/SubGroup.vue'
import { Item } from '@/core/types/entities/dma/e-form/Item';

// ---------- PROPS N EMITS ----------
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
});
const emits = defineEmits(["close"]);
// ---------- PROPS N EMITS ----------

// ---------- STORES ----------
const suspensionCylinderFormStore = useSuspensionCylinderFormStore()
// ---------- STORES ----------

// ---------- LOCAL VARS ----------
const eqInfActiveTaskGroup = ref("Equipment Information")
const adInfActiveTaskGroup = ref("Additional Information")
// ---------- LOCAL VARS ----------

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
const sylinderMeasurments = computed(() => {
  const initial = suspensionCylinderFormStore.stateSCCalibration.transactionCalibration.filter((t) => {
    return t.rating && t.rating == 'CALIBRATION'
  })
  return initial ?? []
})
const adjustmentSylinderMeasurments = computed(() => {
  const initial = suspensionCylinderFormStore.stateSCCalibration.transactionCalibration.filter((t) => {
    return t.showParameter && t.showParameter == 'cylinderHeightNeedAdjustment' && t.items.length > 3
    && t.items.find((i) => {
      return i.itemType === 'statusInfo'
    }) != undefined
  })
  return initial ?? []
})

const additionalInfoField = computed(() => {
  let val = ''
  suspensionCylinderFormStore.stateSCCalibration.subGroup.forEach((subG) => {
    subG.taskGroup.forEach((taskG) => {
      if (taskG.key == "ADDITIONAL_INFORMATION") {
        val = taskG.task[0].items[0].value
      }
    })
  })
  return val
})
// ---------- COMPUTED ----------

// ---------- FUNCTIONS ----------
const handleSubmit = () => {
  console.log("oke submitted");
  suspensionCylinderFormStore.submitForm()
}

const handleOpen = () => {
  console.log(suspensionCylinderFormStore.stateSCCalibration)
}

const handleClose = () => {
  emits("close")
}
// ---------- FUNCTIONS ----------
</script>

<style lang="scss">
  .calibration-preview-title {
    .el-collapse-item__header {
      padding-left: 6.5px;
      max-height: 30px;
      padding-top: 6.5px
    }
  }
  .oil-not-in-range__header {
    .el-dialog__header {
      border-bottom: none !important;
    }
  }

  .silinder-title {
    width: 661px;
    height: 24px;
    font-family: 'Public Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    color: #212B36;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
  }

  .ok-button {
    background-color: #18AF4A;
  }
</style>

<style lang="scss" scoped>
    @import "@/assets/sass/pages/defect.panel.scss";
</style>
