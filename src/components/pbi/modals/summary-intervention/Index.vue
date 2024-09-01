<template>
  <div class="w-95 mx-auto section-summary-intervantion">
    <div class="div-dark-rounded my-3 pt-5 px-10">
      <el-button text class="dark-btn" @click="backToDetailInfo">
        <inline-svg src="/media/icons/bootstrap-icon/arrow-left-short.svg" width="36" height="36" fill="white" />
        Back to Component Condition Summary (Medium-Long Term)
        Item selected
      </el-button>
      <div class="d-flex align-items-top mt-3">
        <p class="text-white w-5 me-3">
          Filter by:
        </p>
        <SelectInput
          class="custom-text-input me-3 w-15"
          :value="filter.site"
          :isLoading="filterLoading.site"
          placeholder="Select Site"
          name="Site"
          :max="200"
          @handleChange="handleSiteChange"
          :options="sumInterventionStore.siteOption"
          />
        <SelectInput
        class="custom-text-input me-3 w-15"
          :value="filter.model"
          :isLoading="filterLoading.model"
          placeholder="Select Equipment Model"
          name="EquipmentModel"
          :max="200"
          @handleChange="handleEquipmentModelChange"
          :is-disabled="!filter.site"
          :options="sumInterventionStore.modelOption"
        />
        <SelectInput
          class="custom-text-input me-3 w-15"
          :value="filter.equipment"
          :isLoading="filterLoading.equipment"
          placeholder="Select Equipment Number"
          name="EquipmentNumber"
          :max="200"
          @handleChange="handleEquipmentNumberChange"
          :is-disabled="!filter.model"
          :options="sumInterventionStore.equipmentOption"
        />
        <SelectInput
          class="custom-text-input me-3 w-50"
          :value="filter.component"
          :isLoading="filterLoading.component"
          placeholder="Select Component"
          name="Component"
          :max="200"
          :isMultiple="true"
          @handleChange="handleComponentChange"
          :is-disabled="!filter.equipment"
          :options="sumInterventionStore.componentOption"
        />
      </div>
    </div>
    <div class="div-dark-rounded py-7 px-10 w-100 d-flex align-items-start flex-column" style="flex-grow: 1; height: 100%;">
      <h3 class="text-white mb-3">Summary Caution & Critical List</h3>
      <h4 class="text-white">Sensor</h4>
      <SensorList
        :reRender="reRenderSensorDataSelection"
        :listData="sensorDataList"
        :selectAll="check_select_all_sensor"
        :lastPage="sensorDataLastPage"
        :currentPage="sensorDataCurrentPage"
        @infiniteScroll_lastDataSearch="loadSensorOrEvent"
        @changeSelectAll="(isCheck: boolean) => sumInterventionStore.setIsSensorSelectAll(isCheck)"
      />
      <div class="d-flex justify-content-end mt-3 mt-auto w-100">
        <el-button
          :disabled="sensorDataList.length == 0"
          @click="onSubmitSummaryIntervention"
          type="success"
          v-loading="sumInterventionStore.loadingUpdate"
        >
          Submit for Intervention Form
        </el-button>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import {
  defineEmits,
  computed,
  WritableComputedRef,
  onBeforeMount,
} from 'vue';
import {
  SensorDataType,
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/3dpHornetType";

import {
  useSummaryInterventionStore
} from "@/store/pinia/iron-portal/dashboard/pbi-equipment/summary-intervention/useSummaryInterventionStore"

import SelectInput from "@/components/inputs/SelectInput.vue";
import SensorList from "./SensorList.vue"
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import {
  swalAlertConfirmation,
  swalAlertSuccess,
  swalAlertError,
} from '@/core/helpers/sweet-alert';
import _ from 'lodash';

const reRenderSensorDataSelection: WritableComputedRef<boolean> = computed({
  get() {
    return sumInterventionStore.rerenderSensorList;
  },
  // setter
  set(newValue) {
    sumInterventionStore.setReRenderSensorSelection(newValue)
  }
});

const emits = defineEmits(['onBack', 'onSubmitSummaryIntervention'])

const authStore = useAuthenticationStore();
const sumInterventionStore = useSummaryInterventionStore();

const check_select_all_sensor = computed(() => {
  return sumInterventionStore.isSensorSelectAll
})

// computeds
const filter = computed(() => {
  return sumInterventionStore.filter;
});
const filterLoading = computed(() => {
  return sumInterventionStore.filterLoading;
});
const sensorDataList = computed((): SensorDataType[] => {
  return sumInterventionStore.sensorDataList
});
const sensorDataLastPage = computed((): number => {
  return sumInterventionStore.sensorDataLastPage
});
const sensorDataCurrentPage = computed((): number => {
  return sumInterventionStore.sensorDataCurrentPage
});
const isError = computed((): boolean => {
  return sumInterventionStore.isError
});
const errors = computed((): string[] => {
  return sumInterventionStore.errors
});


/* handlers */


const loadSensorOrEvent = (direction) => {
  sumInterventionStore.getSensorDataListPaginate(direction);
}

const handleSiteChange = async (value: string) => {
  filter.value.site = value;
  sessionStorage.setItem("IronPortalDashboardFilter-Site", JSON.stringify([
    value
  ]))
  if (value != "") {
    await sumInterventionStore.getModelLookup();
  }
  await handleEquipmentModelChange("");
};
const handleEquipmentModelChange = async (value: string) => {
  filter.value.model = value;
  sessionStorage.setItem("IronPortalDashboardFilter-Model", JSON.stringify([
    value
  ]))
  if (value != "") {
    await sumInterventionStore.getEquipmentLookup();
  }
  await handleEquipmentNumberChange("");
};
const handleEquipmentNumberChange = async (value: string) => {
  filter.value.equipment = value;
  sessionStorage.setItem("IronPortalDashboardFilter-Equipment", JSON.stringify([
    value
  ]))
  if (value != "") {
    await sumInterventionStore.getComponentLookup();
  }
  await handleComponentChange([]);
};
const handleComponentChange = (value: string[]) => {
  console.log(value)
  let tempValue: string[] = []
  if (value.length == 0 && filter.value.equipment != "") {
    tempValue = [
      "All"
    ]
  } else if (value.includes("All")) {
    value.splice(0, 1)
    tempValue = value
  } else {
    tempValue = value
  }

  sumInterventionStore.setFilterComponent(tempValue);
  sessionStorage.setItem("IronPortalDashboardFilter-Component", JSON.stringify(value.length != 0 ? tempValue : []))
  sumInterventionStore.setIsSensorSelectAll(false)
  reRenderSensorDataSelection.value = false
  sumInterventionStore.resetList();
  reRenderSensorDataSelection.value = true
  if (
    filter.value.site != "" &&
    filter.value.model != "" &&
    filter.value.equipment != "" &&
    filter.value.component.length > 0
  ) {
    debounceHandleComponentChange()
  }
};
const debounceHandleComponentChange = _.debounce(() => {
  sumInterventionStore.getSensorDataListPaginate();
}, 1500)

// Methods

const backToDetailInfo = () => {
  emits("onBack")
};

const onSubmitSummaryIntervention = async () => {
  swalAlertConfirmation("Are you sure you want to submit?").then(async (res) => {
    if (res.isConfirmed) {
      sumInterventionStore.updateIntervention(authStore.user.Name).then(() => {
        if (!isError.value) {
          swalAlertSuccess(
            "Form has been successfully submitted!",
            "OK"
          ).then(() => {
            // Go back to Equipment front page
            emits("onSubmitSummaryIntervention");
          });
        } else {
          swalAlertError(
            errors.value[0],
            "OK",
            false
          );
        }
      })
    }
  });
}

const getArrayItemInSessionStorage = (storageName: string): string[] => {
  const stringifiedArrayValue = sessionStorage.getItem(storageName)
  if (stringifiedArrayValue) {
    return JSON.parse(stringifiedArrayValue)
  }
  return []
}

const getFirstArrayItemInSessionStorage = (storageName: string): string => {
  const stringifiedArrayValue = sessionStorage.getItem(storageName)
  if (stringifiedArrayValue && stringifiedArrayValue.length > 0) {
    return JSON.parse(stringifiedArrayValue)[0]
  }
  return ""
}

onBeforeMount(async () => {
  const sessionStorageSite = getFirstArrayItemInSessionStorage("IronPortalDashboardFilter-Site")
  const sessionStorageModel = getFirstArrayItemInSessionStorage("IronPortalDashboardFilter-Model")
  const sessionStorageEquipment = getFirstArrayItemInSessionStorage("IronPortalDashboardFilter-Equipment")
  const sessionStorageComponent = getArrayItemInSessionStorage("IronPortalDashboardFilter-Component")
  if (sessionStorageSite) {
    await handleSiteChange(sessionStorageSite)
  }
  if (sessionStorageModel) {
    await handleEquipmentModelChange(sessionStorageModel)
  }
  if (sessionStorageEquipment) {
    await handleEquipmentNumberChange(sessionStorageEquipment)
  }
  if (sessionStorageComponent) {
    await handleComponentChange(sessionStorageComponent)
  }
})
</script>

<style lang="scss" scoped>
.section-summary-intervantion {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px - 20px);
  overflow-y: scroll;
}
.div-dark-rounded {
  background-color: #2d2b39;
  border-radius: 20px;
}
.dark-btn.el-button {
  background: #2D2B39 !important;
  color: white !important;
  border: 0px;
  padding: 0px !important;
}
</style>
