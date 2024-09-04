<template>
  <div class="service-label d-flex flex-column justify-content-around prevent-split">
    <header-label
      :title="isCoolant ? 'SOS Coolant Analysis' : 'SOS Oil Analysis'"
      :compartment="`${labelData.equipment} - ${detail.compartmentLubricant}`"
    />
    <p>Field with asterisk (<span class="text-danger">*</span>) means mandatory</p>
    <div class="row g-2 mb-3">
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input v-model="customerName" type="text" class="form-control" disabled>
          <label for="floatingInput">Customer<span class="text-danger">*</span></label>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="custom-date-picker">
          <div class="form-floating sample-date">
            <input
              v-model="sampleDate"
              :readonly="!disableAll"
              :disabled="disableAll"
              type="text"
              class="form-control"
              @click="showDatePicker"
            >
            <label for="floatingInput">Sample Date<span class="text-danger">*</span></label>
            <img src="/media/svg/dma/calendar.svg" class="me-2 input-icon" style="height: 18px" alt="icon">
          </div>
          <el-date-picker
            v-model="selectedDate"
            ref="sampleDatePicker"
            type="date"
            class="form-control el-date-picker"
            style="visibility: hidden"
            size="small"
            :clearable="false"
          />
        </div>
        <p v-if="errors[0].items[indexCompartment] && errors[0].items[indexCompartment].message" class="text-danger mt-1 mb-0">{{ errors[0].items[indexCompartment].message }}</p>
      </div>

      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input v-model="equipment" type="text" class="form-control" disabled>
          <label for="floatingInput">Unit Number<span class="text-danger">*</span></label>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <select
            v-model="psTypeId"
            class="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
            :disabled="disableAll"
          >
            <option v-for="(serviceInterval, idxServiceInterval) in serviceIntervalList" :key="idxServiceInterval" :value="serviceInterval">
              {{ serviceInterval }}
            </option>
          </select>
          <label for="floatingSelect">Service Interval</label>
        </div>
      </div>

      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input v-model="equipmentSerialNumber" type="text" class="form-control" disabled>
          <label for="floatingInput">Serial Number<span class="text-danger">*</span></label>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="fuelBurn"
            type="text"
            class="form-control"
            :disabled="disableAll"
            @keypress="onlyNumber"
            @input="onInputFuelBurn"
          >
          <label for="floatingInput">Fuel Burn<span class="text-danger">*</span></label>
        </div>
        <p v-if="errors[2].items[indexCompartment] && errors[2].items[indexCompartment].message" class="text-danger mt-1 mb-0">{{ errors[2].items[indexCompartment].message }}</p>
      </div>

      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="machineSmu"
            :disabled="disableAll"
            type="text"
            class="form-control"
            @keypress="onlyNumber"
            @input="clearError('machineSmu')"
          >
          <label for="floatingInput">Machine SMU<span class="text-danger">*</span></label>
        </div>
        <p v-if="errors[1].items[indexCompartment] && errors[1].items[indexCompartment].message" class="text-danger mt-1 mb-0">{{ errors[1].items[indexCompartment].message }}</p>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input v-model="jobSite" type="text" class="form-control" disabled>
          <label for="floatingInput">Job Site<span class="text-danger">*</span></label>
        </div>
      </div>
    </div>

    <div class="dash-line">
      <svg width="1500" height="20">
        <line x1="0" y1="5" x2="1500" y2="5" stroke="#E0E0E0" stroke-width="1" stroke-dasharray="17, 5" />
      </svg>
    </div>

    <div class="row gx-2 gy-4 mb-3">
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input v-model="details[indexCompartment].compartmentLubricant" type="text" class="form-control" disabled>
          <label for="floatingInput">Compartment<span class="text-danger">*</span></label>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="componentHours"
            :disabled="disableAll"
            type="text"
            class="form-control"
            @keypress="onlyNumber"
          >
          <label for="floatingInput">Component Hours</label>
        </div>
      </div>

      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="fluidHours"
            :disabled="disableAll"
            type="text"
            class="form-control"
            @keypress="onlyNumber"
          >
          <label for="floatingInput">Fluid Hours</label>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="fluidAdded"
            :disabled="disableAll"
            type="text"
            class="form-control"
            @keypress="onlyNumber"
          >
          <label for="floatingInput">Fluid Added</label>
        </div>
      </div>

      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <select
            v-model="fluidChanged"
            :disabled="disableAll"
            class="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
          >
            <option value="1">Yes</option>
            <option value="2">No</option>
          </select>
          <label for="floatingSelect">Fluid Changed</label>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <select
            v-model="filterChange"
            :disabled="disableAll"
            class="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
          >
            <option value="">-</option>
            <option value="1">Yes</option>
            <option value="2">No</option>
          </select>
          <label for="floatingSelect">Filter Change</label>
        </div>
      </div>

      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="oilType"
            type="text"
            class="form-control"
            id="floatingInput"
            autocomplete="off"
            :disabled="disableAll"
            @focus="showOilType = true"
            @blur="hideOilType"
            @keydown.down.prevent="highlightNextOilType"
            @keydown.up.prevent="highlightPrevOilType"
            @keydown.enter.prevent="selectOilType(highlightedIndexOilType)"
          />
          <label for="floatingInput">Oil Type</label>

          <ul v-if="showOilType && filteredOilType.length" class="list-group position-absolute autocomplete-list">
            <li
              v-for="(suggestion, index) in filteredOilType"
              :key="index"
              :class="['list-group-item option', { 'active': index === highlightedIndexOilType }]"
              @mousedown="selectOilType(index)"
              @mouseover="highlightOilType(index)"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="oilGrade"
            type="text"
            class="form-control"
            id="floatingInput"
            autocomplete="off"
            :disabled="disableAll"
            @focus="fetchOilGrade"
            @blur="hideOilGrade"
            @keydown.down.prevent="highlightNextOilGrade"
            @keydown.up.prevent="highlightPrevOilGrade"
            @keydown.enter.prevent="selectOilGrade(highlightedIndexOilGrade)"
          />
          <label for="floatingInput">Oil Grade</label>

          <ul v-if="showOilGrade && filteredOilGrade.length" class="list-group position-absolute autocomplete-list">
            <li
              v-for="(suggestion, index) in filteredOilGrade"
              :key="index"
              :class="['list-group-item option', { 'active': index === highlightedIndexOilGrade }]"
              @mousedown="selectOilGrade(index)"
              @mouseover="highlightOilGrade(index)"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>

      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="coolant"
            type="text"
            class="form-control"
            id="floatingInput"
            autocomplete="off"
            :disabled="disableAll"
            @focus="showCoolant = true"
            @blur="hideCoolant"
            @keydown.down.prevent="highlightNextCoolant"
            @keydown.up.prevent="highlightPrevCoolant"
            @keydown.enter.prevent="selectCoolant(highlightedIndexCoolant)"
          />
          <label for="floatingInput">Coolant</label>

          <ul v-if="showCoolant && filteredCoolant.length" class="list-group position-absolute autocomplete-list">
            <li
              v-for="(suggestion, index) in filteredCoolant"
              :key="index"
              :class="['list-group-item option', { 'active': index === highlightedIndexCoolant }]"
              @mousedown="selectCoolant(index)"
              @mouseover="highlightCoolant(index)"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-3">
        <div class="form-floating">
          <input
            v-model="fuelType"
            type="text"
            class="form-control"
            id="floatingInput"
            autocomplete="off"
            :disabled="disableAll"
            @input="fetchFuelType"
            @focus="showFuelType = true"
            @blur="hideFuelType"
            @keydown.down.prevent="highlightNextFuelType"
            @keydown.up.prevent="highlightPrevFuelType"
            @keydown.enter.prevent="selectFuelType(highlightedIndexFuelType)"
          />
          <label for="floatingInput">Fuel Type</label>

          <ul v-if="showFuelType && filteredFuelType.length" class="list-group position-absolute autocomplete-list">
            <li
              v-for="(suggestion, index) in filteredFuelType"
              :key="index"
              :class="['list-group-item option', { 'active': index === highlightedIndexFuelType }]"
              @mousedown="selectFuelType(index)"
              @mouseover="highlightFuelType(index)"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <Alert
      v-if="detail.label"
      type="warning"
      message="This data cannot be edited anymore, because label number has already been generated!"
      width="auto"
      class="mx-auto"
      :closable="false"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  PropType,
  computed,
  ref,
  toRefs,
  watch
} from "vue";
import { Detail, SosLabel } from "@/core/types/entities/dma/sos/SosLabel";
import {
  dynamicDateFormatter,
  formatSlashDate
} from "@/core/helpers/date-format";
import { useSosStore } from "@/store/pinia/dma/sos/useSosStore";
import { ElLoading } from "element-plus";

import HeaderLabel from "./HeaderLabel.vue";
import Alert from './Alert.vue';

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
  }
})

const { customerName, equipmentSerialNumber, equipment, jobSite, details } = toRefs(props.labelData);
const sosStore = useSosStore();

const errors = computed(() => {
  return sosStore.SosEditErrors
})
const disableAll = computed(() => {
  if (props.detail.label != '' && props.detail.label != null && props.detail.label != undefined) {
    return true;
  } else {
    return false;
  }
})

const serviceIntervalList = ref<string[]>([
  '250',
  '500',
  '1000',
  '2000',
  '4000',
  '5000'
])
const psTypeId = computed({
  get: () => {
    return props.labelData.psTypeId
  },
  set: (val) => {
    sosStore.stateSosLabel.psTypeId = val;
    sosStore.updatePayloadGeneralData('psTypeId', val);
  }
})
const sampleDate = computed({
  get: () => {
    if (props.detail.sampleDate == '') {
      return '';
    } else if (props.detail.sampleDate.length == 8) {
      return props.detail.sampleDate
    } else {
      return dynamicDateFormatter(props.detail.sampleDate, 'DD/MM/YY HH:mm:ss (Z)', 'DD/MM/YYYY');
    }
  },
  set: (val) => {
    sosStore.updateSosData('sampleDate', props.indexCompartment, val);
  }
})
const fuelBurn = computed({
  get: () => {
    return sosStore.stateSosLabel.details[props.indexCompartment].fuelBurn;
  },
  set: (val) => {
    sosStore.updateSosData('fuelBurn', props.indexCompartment, val);
  }
})
const onInputFuelBurn = (event) => {
  let value = event.target.value;

  // Allow only numbers and one decimal point
  value = value.replace(/[^0-9.]/g, '');

  // Ensure only one decimal point is allowed
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limit to five digits before the decimal point
  if (parts[0].length > 5) {
    parts[0] = parts[0].substring(0, 5);
  }

  // Limit to two digits after the decimal point
  if (parts[1] && parts[1].length > 2) {
    parts[1] = parts[1].substring(0, 2);
  }

  // Combine the parts back together
  fuelBurn.value = parts.join('.');
  clearError('fuelBurn')
}
const machineSmu = computed({
  get: () => {
    return props.detail.lastMeterHrs;
  },
  set: (val) => {
    sosStore.updateSosData('lastMeterHrs', props.indexCompartment, val);
  }
})
const componentHours = computed({
  get: () => {
    return props.detail.componentHours;
  },
  set: (val) => {
    sosStore.updateSosData('componentHours', props.indexCompartment, val);
  }
})
const fluidHours = computed({
  get: () => {
    return props.detail.fluidHours;
  },
  set: (val) => {
    sosStore.updateSosData('fluidHours', props.indexCompartment, val);
  }
})
const fluidAdded = computed({
  get: () => {
    return props.detail.volume;
  },
  set: (val) => {
    sosStore.updateSosData('volume', props.indexCompartment, val);
  }
})
const fluidChanged = computed({
  get: () => {
    switch (props.detail.fluidChanged) {
      case 'True':
        return '1';
      case 'False':
        return '2';
      default:
        return '';
    }
  },
  set: (val) => {
    let value = '';
    switch (val) {
      case '1':
        value = 'True';
        break;
      case '2':
        value = 'False';
        break;
      default:
        value = '';
        break;
    }
    sosStore.updateSosData('fluidChanged', props.indexCompartment, value);
  }
})
const filterChange = computed({
  get: () => {
    switch (props.detail.filterChanged) {
      case 'True':
        return '1';
      case 'False':
        return '2';
      case '':
        return '-';
      default:
        return '-';
    }
  },
  set: (val) => {
    let value = '';
    switch (val) {
      case '1':
        value = 'True';
        break;
      case '2':
        value = 'False';
        break;
      case '-':
        value = '';
        break;
      default:
        value = '';
        break;
    }
    sosStore.updateSosData('filterChanged', props.indexCompartment, value);
  }
})

const sampleDatePicker = ref();
const selectedDate = ref<string>('');
watch(
  () => {
    return selectedDate.value;
  },
  (val) => {
    sampleDate.value = formatSlashDate(val);
    clearError('sampleDate')
  }
);
const showDatePicker = () => {
  if (props.detail.label) {
    return;
  }
  sampleDatePicker.value.focus();
}

const isCoolant = computed(() => {
  return props.detail.lubricantType != 'Oil';
})

const onlyNumber = ($event) => {
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if (keyCode != 46 && (keyCode < 48 || keyCode > 57)) {
    $event.preventDefault();
  }
};

const fuelTypes = [
  'Aviation Gasoline (Leaded Petrol)',
  'Bio-Diesel',
  'Bio/Sewer Gas',
  'Diesel',
  'Ethanol',
  'Ethanol Biended ULP',
  'Gas Oil',
  'Hydrogen Injection',
  'Kerosine Jet A1',
  'Landfill Gas',
  'Liquid Natural Gas',
  'MDO/MGO Marine Distillate Oil',
  'Methanol',
  'Natural Gas',
  'Unleaded Petrol'
];
const fuelType = computed({
  get: () => {
    return props.detail.fuelType;
  },
  set: (val) => {
    sosStore.updateSosData('fuelType', props.indexCompartment, val);
  }
})
const filteredFuelType = ref<string[]>(fuelTypes);
const highlightedIndexFuelType = ref<number>(0);
const showFuelType = ref<boolean>(false);
const fetchFuelType = async () => {
  if (fuelType.value && fuelType.value.length > 2) {
    setTimeout(() => {
      filteredFuelType.value = fuelTypes;
    }, 1000);
  } else {
    filteredFuelType.value = [];
  }
}
const highlightFuelType = (index) => {
  highlightedIndexFuelType.value = index;
}
const highlightNextFuelType = () => {
  if (highlightedIndexFuelType.value < filteredFuelType.value.length - 1) {
    highlightedIndexFuelType.value++;
  }
}
const highlightPrevFuelType = () => {
  if (highlightedIndexFuelType.value > 0) {
    highlightedIndexFuelType.value--;
  }
}
const selectFuelType = (index) => {
  fuelType.value = filteredFuelType.value[index];
  showFuelType.value = false;
}
const hideFuelType = () => {
  setTimeout(() => {
    if (fuelType.value && !filteredFuelType.value.includes(fuelType.value)) {
      fuelType.value = '';
    }
    showFuelType.value = false;
  }, 100);
}

const oilType = computed({
  get: () => {
    return props.detail.oilType;
  },
  set: (val) => {
    sosStore.updateSosData('oilType', props.indexCompartment, val);
  }
})
const oilTypeList = computed(() => {
  return sosStore.OilTypeList;
});
const filteredOilType = computed(() => {
  if (oilType.value) {
    const filtered = oilTypeList.value.filter((item) => {
      if (oilType.value != null) {
        return item.oilType.toLowerCase().includes(oilType.value.toLowerCase());
      } else {
        return []
      }
    });
    return filtered.map((item) => {
      return item.oilType
    })
  } else {
    return oilTypeList.value.map((item) => {
      return item.oilType
    });
  }
});
const highlightedIndexOilType = ref<number>(0);
const showOilType = ref<boolean>(false);
const highlightOilType = (index) => {
  highlightedIndexOilType.value = index;
}
const highlightNextOilType = () => {
  if (highlightedIndexOilType.value < filteredOilType.value.length - 1) {
    highlightedIndexOilType.value++;
  }
}
const highlightPrevOilType = () => {
  if (highlightedIndexOilType.value > 0) {
    highlightedIndexOilType.value--;
  }
}
const loading = ref();
const selectedOilTypeId = ref<string>('');
const selectOilType = async (index) => {
  oilType.value = filteredOilType.value[index];
  const oil = oilTypeList.value.find((item) => {
    return item.oilType == oilType.value;
  });
  selectedOilTypeId.value = oil ? oil.oilTypeId : '';
  showOilType.value = false;
  loading.value = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  await sosStore.getOilGradeList(selectedOilTypeId.value);
  loading.value.close();
}
const hideOilType = () => {
  const oilTypes = oilTypeList.value.map((item) => {
    return item.oilType
  });
  setTimeout(() => {
    if (oilType.value && !oilTypes.includes(oilType.value)) {
      oilType.value = '';
    }
    showOilType.value = false;
  }, 100);
}

const oilGrade = computed({
  get: () => {
    return props.detail.oilGrade;
  },
  set: (val) => {
    sosStore.updateSosData('oilGrade', props.indexCompartment, val);
  }
})
const oilGradeList = computed(() => {
  return sosStore.OilGradeList;
});
const filteredOilGrade = computed(() => {
  if (oilGrade.value) {
    const filtered = oilGradeList.value.filter((item) => {
      if (oilGrade.value != null) {
        return item.oilGrade.toLowerCase().includes(oilGrade.value.toLowerCase());
      } else {
        return []
      }
    });
    return filtered.map((item) => {
      return item.oilGrade
    })
  } else {
    return oilGradeList.value.map((item) => {
      return item.oilGrade
    });
  }
});
const fetchOilGrade = async () => {
  if (selectedOilTypeId.value == '') {
    const oil = oilTypeList.value.find((item) => {
      return item.oilType == oilType.value;
    });
    selectedOilTypeId.value = oil ? oil.oilTypeId : '';
    showOilType.value = false;
    loading.value = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    await sosStore.getOilGradeList(selectedOilTypeId.value);
    loading.value.close();
  }
  showOilGrade.value = true;
}
const highlightedIndexOilGrade = ref<number>(0);
const showOilGrade = ref<boolean>(false);
const highlightOilGrade = (index) => {
  highlightedIndexOilGrade.value = index;
}
const highlightNextOilGrade = () => {
  if (highlightedIndexOilGrade.value < filteredOilGrade.value.length - 1) {
    highlightedIndexOilGrade.value++;
  }
}
const highlightPrevOilGrade = () => {
  if (highlightedIndexOilGrade.value > 0) {
    highlightedIndexOilGrade.value--;
  }
}
const selectOilGrade = (index) => {
  oilGrade.value = filteredOilGrade.value[index];
  showOilGrade.value = false;
}
const hideOilGrade = () => {
  setTimeout(() => {
    if (oilGrade.value && !filteredOilGrade.value.includes(oilGrade.value)) {
      oilGrade.value = '';
    }
    showOilGrade.value = false;
  }, 100);
}

const coolant = computed({
  get: () => {
    return props.detail.coolant;
  },
  set: (val) => {
    sosStore.updateSosData('coolant', props.indexCompartment, val);
  }
})
const coolantList = computed(() => {
  return sosStore.CoolantList;
});
const filteredCoolant = computed(() => {
  if (coolant.value) {
    const filtered = coolantList.value.filter((item) => {
      if (coolant.value != null) {
        return item.coolant.toLowerCase().includes(coolant.value.toLowerCase());
      } else {
        return []
      }
    });
    return filtered.map((item) => {
      return item.coolant;
    })
  } else {
    return coolantList.value.map((item) => {
      return item.coolant;
    });
  }
});
const highlightedIndexCoolant = ref<number>(0);
const showCoolant = ref<boolean>(false);
const highlightCoolant = (index) => {
  highlightedIndexCoolant.value = index;
}
const highlightNextCoolant = () => {
  if (highlightedIndexCoolant.value < filteredCoolant.value.length - 1) {
    highlightedIndexCoolant.value++;
  }
}
const highlightPrevCoolant = () => {
  if (highlightedIndexCoolant.value > 0) {
    highlightedIndexCoolant.value--;
  }
}
const selectCoolant = (index) => {
  coolant.value = filteredCoolant.value[index];
  showCoolant.value = false;
}
const hideCoolant = () => {
  setTimeout(() => {
    if (coolant.value && !filteredCoolant.value.includes(coolant.value)) {
      coolant.value = '';
    }
    showCoolant.value = false;
  }, 100);
}

const clearError = (field: string) => {
  switch (field) {
    case 'sampleDate':
      sosStore.stateErrorField[0].items[props.indexCompartment].message = '';
      break;
    case 'machineSmu':
      sosStore.stateErrorField[1].items[props.indexCompartment].message = '';
      break;
    case 'fuelBurn':
      sosStore.stateErrorField[2].items[props.indexCompartment].message = '';
      break;
  }
}
</script>

<style lang="scss" scoped>
.service-label {
  font-family: "Public sans", sans-serif;
}

p {
  font-size: 10px;
}
// .form-control {
//   background-color: #F9FAFB;
// }
.form-floating {
  label {
    font-size: 12px !important;
    font-weight: 700;
    color: #212B36;
    opacity: 1 !important;
  }
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

.autocomplete-list {
  z-index: 3;
  width: 100%;
  height: 200px;
  overflow-y: scroll;
  .option {
    cursor: pointer;
    font-size: 10px;
  }
}
.custom-date-picker {
  position: relative;
  .sample-date {
    position: absolute;
    top: 0;
    width: 100%;
    .input-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #aaa;
    }
    input {
      padding-right: 2.5rem;
    }
  }
  .el-date-picker {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
