<template>
  <div class="service-label d-flex flex-column justify-content-around prevent-split">
    <header-label
      :title="isCoolant ? 'SOS Coolant Analysis' : 'SOS Oil Analysis'"
      :compartment="`${labelData.equipment} - ${detail.compartmentLubricant}`"
    />
    <div class="row gx-2">
      <div class="col-4">
        <table class="w-100">
          <th />
          <column-label :title="'Customer'" :value="labelData.customerName" />
          <column-label :title="'Serial Number'" :value="labelData.equipmentSerialNumber || '-'" />
          <column-label :title="'Unit Number'" :value="labelData.equipment" />
          <column-label :title="'Machine SMU'" :value="detail.lastMeterHrs" />
          <column-label :title="'Sample Date'" :value="sampleDate" />
          <column-label :title="'Service Interval'" :value="labelData.psTypeId" />
        </table>
      </div>
      <div class="col-4">
        <table class="w-100">
          <th />
          <column-label :title="'Fuel Burn'" :value="detail.fuelBurn || '-'" />
          <column-label :title="'Job Site'" :value="labelData.jobSite" />
          <column-label :title="'Compartment'" :value="detail.compartmentLubricant" />
          <column-label :title="'Component Hours'" :value="detail.componentHours || '-'" />
          <column-label :title="'Fluid Hours'" :value="detail.fluidHours || '-'" />
          <column-label :title="'Fluid Added'" :value="`${detail.volume} ${detail.uoM}`" />
        </table>
      </div>
      <div class="col-4">
        <table class="w-100">
          <th />
          <column-label :title="'Fluid Changed'" :value="checkTask(detail.fluidChanged ?? '')" />
          <column-label :title="'Filter Changed'" :value="checkTask(detail.filterChanged ?? '')" />
          <column-label :title="'Oil Type'" :value="detail.oilType || '-'" />
          <column-label :title="'Oil Grade'" :value="detail.oilGrade || '-'" />
          <column-label :title="'Coolant'" :value="detail.coolant || '-'" />
          <column-label :title="'Fuel Type'" :value="detail.fuelType || '-'" />
        </table>
      </div>
    </div>
    <div class="d-flex flex-row justify-content-end align-items-end w-100">
      <div v-if="qrCode" class="d-flex flex-column me-auto">
        <img ref="qrImage" :src="qrCodeSrc" :key="qrCodeSrc" class="qr-image"  alt="QR Code" />
        <p class="print-data mx-auto">{{ qrCode }}</p>
      </div>
      <p class="print-data">{{ printData }}</p>
    </div>

    <!-- using svg dashline because only solid border style is supported on Kendo PDF -->
    <div class="dash-line">
      <svg v-if="(indexCompartment + 1) % 3 != 0" width="750" height="11">
        <line x1="0" y1="10" x2="750" y2="10" stroke="#E0E0E0" stroke-width="1" stroke-dasharray="5, 3" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  PropType,
  computed,
  onMounted,
  ref
} from "vue";
import HeaderLabel from "./HeaderLabel.vue";
import ColumnLabel from "./ColumnLabel.vue";
import { Detail, SosLabel } from "@/core/types/entities/dma/sos/SosLabel";
import { dynamicDateFormatter } from "@/core/helpers/date-format";
import QRCode from 'qrcode';

const props = defineProps({
  labelData: {
    type: Object as PropType<SosLabel>,
    required: true
  },
  detail: {
    type: Object as PropType<Detail>,
    required: true
  },
  printData: {
    type: String,
    required: true
  },
  indexCompartment: {
    type: Number,
    required: true
  },
  qrCode: {
    type: String,
    required: false
  }
})

const isCoolant = computed(() => {
  return props.detail.lubricantType != 'Oil';
})

const sampleDate = computed(() => {
  if (props.detail.sampleDate == '') {
    return '-';
  } else if (props.detail.sampleDate.length == 8) {
    return props.detail.sampleDate
  } else {
    return dynamicDateFormatter(props.detail.sampleDate, 'DD/MM/YY HH:mm:ss (Z)', 'DD/MM/YYYY');
  }
})

const checkTask = (val: string) => {
  if (val == '-' || val == '') {
    return '-'
  } else {
    return val.toLowerCase() == 'true' ? 'Yes' : 'No'
  }
}

const qrCodeSrc = ref<string>('');
const generatedQrCode = async () => {
  await QRCode.toDataURL(props.qrCode, function (error, url) {
    if (error) console.log(error);
    qrCodeSrc.value = url;
  });
}

onMounted(async () => {
  if (props.qrCode) {
    await generatedQrCode();
  }
})
</script>

<style lang="scss" scoped>
.service-label {
  font-family: "Public sans", sans-serif;
}
.print-data {
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
  margin-bottom: 0px;
}
.dash-line {
  width: 100%;
  overflow: hidden;
}

.qr-image {
  width: 64px;
  height: 64px;
}
</style>
