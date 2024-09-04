<template>
  <div class="mt-5 ps-0">
    <el-collapse v-model="panel" class="general-accordion task-group py-1 px-5 mb-3">
      <el-collapse-item name="Intervention Labour Personnel">
        <template #title>
          <h4 class="subtitle ps-3">Intervention Labour Personnel</h4>
        </template>
        <div class="d-flex flex-row justify-content-between">
          <div class="p-2 d-flex flex-row flex-grow-1">
            <div class="d-flex w-100">
              <div class="flex-fill">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" :value="intervention.serviceStart" disabled />
                  <label class="label-font">Intervention Start Date</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" :value="serialNumber" disabled />
                  <label class="label-font">Serial Number</label>
                </div>
              </div>
              <div class="flex-fill ps-3">
                <div class="form-floating mb-3 position-relative">
                  <input type="text" class="form-control" disabled
                    :value="formatNumberWithComma(intervention.interventionSMU ?? '')" />
                  <!-- edit smu -->
                  <div class="ms-2 position-absolute" style="top: 2px; right: 0;" v-if="isEditableSMU">
                    <button class="btn p-4 justify-items-center rounded cursor-pointer svg-icon svg-icon-btech-primary-500" @click="handleEditClick">
                      <img src="/media/icons/bumaau/icon-edit.png" style="width: 1.25rem; height: 1.25rem" />
                    </button>
                  </div>
                  <label class="label-font">Machine SMU</label>
                </div>
              </div>
              <div class="ms-2" v-if="smuImages && smuImages.length > 0">
                <div class="p-3 justify-items-center rounded" style="background: #18af4a">
                  <span style="font-weight: 700; color: white; cursor: pointer" @click="() => (showImages = true)">+{{
      smuImages.length }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="smuBy && smuDate" class="d-flex flex-row justify-content-end timestamp-task">
          {{ smuBy.name }}, {{ smuDate }}
        </div>
        <div class="d-flex flex-row">
          <div class="flex-fill ps-3">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" disabled :value="formatHmOffset(intervention.hmOffset)" />
              <label class="label-font">Hour Meter Offset</label>
            </div>
          </div>
        </div>
        <div>
          <h4 class="subtitle ps-3 service-labour">Service Labour Personnel</h4>
          <table class="components-table mx-2">
            <thead>
              <tr>
                <th class="main-col text-center">Name</th>
                <th class="shift-col text-center">Shift</th>
                <th class="date-col text-center">Start Date</th>
                <th class="date-col text-center">Finish Date</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="mechanic in intervention.servicePersonnels" :key="mechanic.key">
                <tr>
                  <td class="text-center">{{ mechanic.mechanic.name }}</td>
                  <td class="text-center">{{ mechanic.shift }}</td>
                  <td class="text-center">{{ mechanic.serviceStart }}</td>
                  <td class="text-center">{{ mechanic.serviceEnd }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <ImagePreview :re-render="reRender" :images="(smuImages as string[])" :show-delete-button="false"
    :visibility="showImages" :type="'imageEquipment'" :show-mandatory-caption="false" :is-monitoring="true"
    @on-close="() => (showImages = false)" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  computed,
  PropType,
  ref,
  defineEmits,
} from "vue";
import { Intervention } from "@/core/types/intervention/Intervention";
import { formatNumberWithComma } from "@/core/helpers/number-format";
import ImagePreview from "@/components/camera/ImagePreview.vue";
import { Audit } from "@/core/types/intervention/Audit";
import { isUndefined } from "lodash";
import {
  isBefore,
  removeAEST,
  add
} from "@/core/helpers/date-format";
import { isPlanner } from "@/store/pinia/dma/e-form/helpers"

const props = defineProps({
  intervention: {
    required: true,
    type: Object as PropType<Intervention>,
  },
  reRender: {
    type: Boolean,
    default: false,
  },
  serialNumber: {
    required: true,
    type: String
  }
});

const emits = defineEmits([
  "onSMUReviseIconClicked"
]);

const showImages = ref(false);
const panel = ref("Intervention Labour Personnel");
const smuImages = computed(() => {
  return props.intervention.imageEquipment as string[] | undefined;
});
const smuBy = computed((): Audit | undefined => {
  return props.intervention.smuBy
})

const smuDate = computed((): string | undefined => {
  return props.intervention.smuDate
})

const formatHmOffset = (val) => {
  if (val != 'Not Applicable') {
    return formatNumberWithComma(val);
  } else {
    return 'Not Applicable'
  }
}

const isEditableSMU = computed(() => {
  const checkIsPlanner = isPlanner()
  const checkNewData = !isUndefined(props.intervention.smuBy) && !isUndefined(props.intervention.smuDate)
  const checkStatus = props.intervention.interventionExecution == "Close" && props.intervention.defectStatus == "Completed"
  let checkHistoryDate = false
  const statusHistoryClose = props.intervention.statusHistory.filter((history) => {
    return history.status == "Completed"
  })
  if (statusHistoryClose.length == 1) {
    const completedDate = removeAEST(statusHistoryClose[0].updatedDate)
    checkHistoryDate = isBefore(undefined, add(completedDate, 3, "months", "DD/MM/YY HH:mm:ss"))
  }
  return checkIsPlanner && checkNewData && checkStatus && checkHistoryDate
})

const handleEditClick = () => {
  emits("onSMUReviseIconClicked")
}
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 800px) {
  .main-col {
    width: 460px !important;
  }

  .shift-col {
    width: 100px !important;
  }

  .date-col {
    width: 100px !important;
  }
}

@media only screen and (min-width: 900px) {
  .shift-col {
    width: 250px !important;
  }

  .date-col {
    width: 250px !important;
  }

  .main-col {
    width: 400px !important;
  }
}

.label-font {
  font-size: 13px;
  font-weight: 600;
  color: #212b36 !important;
  opacity: 0.65;
}

.components-table {
  width: 99%;
  color: #919eab;
  font-size: 14px;
  font-weight: 600;
}

table.components-table thead {
  background-color: #eff2f5;
}

table.components-table tr th,
table.components-table tr td {
  font-size: 15px !important;
  color: black !important;
  font-weight: normal !important;
  border: 1px solid #e6e8ea;
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}

.general-accordion {
  .table-header-background-color {
    background-color: #f9fafb;

    &.border-bottom {
      border-bottom: 1px solid #919eab3d;
    }
  }

  .service-labour {
    &.table-body {
      border-bottom: 1px solid #919eab3d;
    }

    .border-left {
      border-left: 1px solid #919eab3d;
    }
  }
}
</style>
