<template>
  <div class="report mb-4">
    <div class="report_section_header avoid">
      <h4 class="subtitle ps-3">Intervention Labour Personnel</h4>
    </div>
    <div class="report_section_body pt-0">
      <div class="d-flex flex-row justify-content-between">
        <div class="p-2 d-flex flex-row flex-grow-1">
          <div class="row-grid row-grid-3-col w-100">
              <Input label="Intervention Start Date" :value="formStore.generalForm.serviceStart" />
              <Input label="Serial Number" :value="serialNumber" />
              <div class="d-flex">
                <div style="flex-basis: 90%">
                  <Input label="Machine SMU" :value="(formStore.generalForm.interventionSMU as string)" />
                </div>
                <div class="ms-2 mb-3" v-if="smuImages.length > 0" style="flex-basis: 10%">
                  <div class="p-3 justify-items-center rounded" style="background: #18af4a">
                    <span style="font-weight: 700; color: white"
                      >+{{ smuImages.length }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <template v-if="formStore.generalForm.smuBy && formStore.generalForm.smuDate">
        <div class="d-flex flex-row">
          <div class="flex-fill ps-3">
            <div class="d-flex justify-content-end pb-1 my-0 timestamp-task avoid">
              <span>
                {{ formStore.generalForm.smuBy.name }}, {{ formStore.generalForm.smuDate }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <div class="d-flex flex-row">
        <div class="flex-fill ps-3">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              disabled
              :value="formatHmOffset(formStore.generalForm.hmOffset)"
            />
            <label>Hour Meter Offset</label>
          </div>
        </div>
      </div>
      <div class="prevent-split">
        <h4 class="subtitle ps-3 service-labour avoid">Service Labour Personnel</h4>
        <div class="report_section_body">
          <div class="table-report">
            <TableRow
              :header="true"
              :data="['Name', 'Shift', 'Start Date', 'Finish Date']"
            />
            <TableRow
              v-for="mechanic in data.servicePersonnels"
              :key="mechanic.key"
              :data="[
                mechanic.mechanic.name,
                mechanic.shift,
                mechanic.serviceStart,
                mechanic.serviceEnd,
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { isUndefined } from "lodash";
import TableRow from "../component/TableRowServiceLabour.vue";
import {
  useGeneralComponentInterventionFormStore
} from "@/store/pinia/dma/component-intervention/useGeneralComponentInterventionFormStore";
import {
  useComponentInterventionEformStore
} from '@/store/pinia/dma/component-intervention/useComponentInterventionEformStore';
import { formatNumberWithComma } from "@/core/helpers/number-format";
import Input from "@/components/e-form/export-kendo/component/general/component/Input.vue";

defineProps({
  data: {
    required: true,
    type: Object,
  },
});

/* stores */
const formStore = useGeneralComponentInterventionFormStore();
const componentInterventionEformStore = useComponentInterventionEformStore()

// ----- SMU IMAGES -----
const smuImages = computed(() => {
  try {
    const smuImages = formStore.generalForm.imageEquipment;
    if (!isUndefined(smuImages)) {
      if (!smuImages) {
        return [];
      } else {
        return smuImages as string[];
      }
    } else {
      return [];
    }
  } catch {
    return [];
  }
});

const formatHmOffset = (val) => {
  if (val != 'Not Applicable') {
    return formatNumberWithComma(val);
  } else {
    return 'Not Applicable'
  }
}

const serialNumber = computed(() => {
  return componentInterventionEformStore.SerialNumber
})
</script>

<style lang="scss" scoped>
@import "@/assets/sass/pages/floating-label.scss";
</style>

<style lang="scss">
.form-control,
.form-select {
  color: #919eab;
}

.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}

.vcp__body {
  overflow: inherit !important;
}

.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #212b36;
}

.subtitle {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
}

.no-float {
  height: 48px;
}

.relative-hidder {
  position: inherit !important;
}

@media only screen and (max-width: 767px) {
  .no-float {
    height: 44px;
  }
}

.general-accordion {
  .table-header-background-color {
    background-color: #f9fafb;

    &.border-bottom {
      border-bottom: 1px solid #919eab3d;
    }
  }
  .previous-crack-container word-breaker {
    border: 1px solid #919eab3d;
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
