<template>
  <div class="wrapper d-flex flex-column flex-fill px-4">
    <div class="d-flex justify-content-between align-items-center">
      <p class="page-title">SOS Print Label</p>
      <div class="d-flex flex-row align-items-center">
        <online-status></online-status>
      </div>
    </div>
    <select-search
      :value="selectedSosHistoryLabel"
      :data="sosHistories"
      :display-label="true"
      :placeholder="'Completed Services'"
      :dialogVisible="dialogVisible"
      @on-selected="onSosSelected"
    />
    <div class="d-flex flex-row align-items-center justify-content-end mt-5 w-100">
      <p class="mb-0" v-if="selectedCompartment.length > 0">
        {{ selectedCompartment.length }} Selected
      </p>
      <el-button
        :disabled="!selectedSosHistoryLabel || selectedCompartment.length == 0"
        type="success"
        class="button ms-5"
        @click="openPreview"
        >Next</el-button
      >
    </div>
    <div class="d-flex flex-column" v-if="compartmentList.length">
      <div class="task w-100">
        <div class="form-check">
          <input
            v-model="checkAll"
            id="check-all"
            class="form-check-input"
            type="checkbox"
            :indeterminate="isIndeterminated"
            @change="handleCheckAllChange"
          />
          <label class="form-check-label ms-3 task--label" for="check-all">
            Compartment or System
          </label>
        </div>
      </div>
      <div
        class="compartment w-100"
        v-for="(comp, indexComp) in compartmentList"
        :key="indexComp"
      >
        <div class="form-check">
          <input
            v-model="selectedCompartment"
            class="form-check-input"
            type="checkbox"
            :value="comp"
            :id="comp.value"
            :disabled="comp.status != ''"
            @change="handleCheckedCompartmentChange"
          />
          <div class="d-flex flex-row ps-3 justify-content-between pe-9">
            <label
              class="form-check-label"
              :class="comp.status != '' ? 'text-disabled' : ''"
              :for="comp.value"
            >
              {{ comp.label }}
            </label>
            <p v-if="comp.labelNumber" class="text-message">{{ comp.labelNumber }}</p>
            <p v-else class="text-message">{{ comp.status }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="task w-100" v-else>
      <p class="task--label mb-0">Compartment or System</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onMounted,
  watch,
  onBeforeMount
} from "vue";
import navigator from "@/core/mixins/navigator";
import { useSosStore } from "@/store/pinia/dma/sos/useSosStore";
import { ElLoading } from "element-plus";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { Option } from "@/core/types/misc/Option";

import OnlineStatus from "@/components/sensors/OnlineStatus.vue";
import SelectSearch from "@/components/inputs/dma/SelectSearch.vue";

const sosStore = useSosStore();

const loading = ref();
const dialogVisible = ref<boolean>(false);
const checkAll = ref<boolean>(false);
const isIndeterminated = ref<boolean>(false);
const compartmentList = computed(() => {
  return sosStore.FormattedSosCompartment;
});
const selectedCompartment = computed({
  get: () => {
    return sosStore.SelectedSosCompartment;
  },
  set: (val) => {
    sosStore.stateSelectedSosCompartment = val;
  },
});

const isContainDisabled = computed(() => {
  for (const comp of compartmentList.value) {
    if (comp.status != '') {
      return true;
    }
  }
  return false;
})
const handleCheckAllChange = () => {
  if (checkAll.value && isContainDisabled.value) {
    selectedCompartment.value = compartmentList.value.filter((comp) => {
      return comp.status == ''
    })
  } else if (checkAll.value && !isContainDisabled.value) {
    selectedCompartment.value = compartmentList.value;
  } else {
    selectedCompartment.value = [];
  }
  handleCheckedCompartmentChange();
};
const handleCheckedCompartmentChange = () => {
  const checkedCount = selectedCompartment.value.length;
  isIndeterminated.value =
    checkedCount > 0 && checkedCount < compartmentList.value.length;
};

const sosHistories = computed(() => {
  return sosStore.SosHistoryOptions;
});
const selectedSosHistory = computed(() => {
  return sosStore.SelectedSosHistory;
});
const selectedSosHistoryLabel = computed(() => {
  const item = sosStore.SelectedSosHistory;
  return Object.keys(item).length == 0
    ? ""
    : `${item.equipment} - ${item.modelId} - ${formatPsType(item.psTypeId)}${item.workOrder} - ${item.eformType}`;
});
const formatPsType = (val) => {
  return val == null ? '' : val + ' Hr Service - '
}

const onSosSelected = (value: Option) => {
  sosStore.setSelectedSos(value);
  selectedCompartment.value = [];
  sosStore.stateSosCompartment = [];
  handleCheckedCompartmentChange();
  getSosCompartment();
};

const authStore = useAuthenticationStore();
watch(
  () => {
    return authStore.user.SiteId;
  },
  async (newVal) => {
    if (newVal) {
      loading.value = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (sosHistories.value.length == 0) {
        await sosStore.getSosHistory(authStore.user.SiteId);
      }
      loading.value.close();
    }
  }
);

const getSosCompartment = async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const payload = {
    workOrder: selectedSosHistory.value.workOrder,
    eformType: selectedSosHistory.value.eformType
  };
  await sosStore.getSosCompartment(payload);
  handleCheckedCompartmentChange();
  if (selectedCompartment.value.length > 0) {
    sosStore.checkLatestCompartmentList();
    sosStore.checkSortSelectedCompartment();
  }
  loading.value.close();
};

const { redirectByName } = navigator();
const openPreview = async () => {
  await getSosCompartment();
  await getLabelData();
  redirectByName("sosprintlabelpreview");
};
const getLabelData = async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const payload = {
    workOrder: selectedSosHistory.value.workOrder,
    eformType: selectedSosHistory.value.eformType,
    oilSampleKey: selectedCompartment.value.map((comp) => {
      return comp.value;
    }),
  };
  await sosStore.getLabelData(payload);
  loading.value.close();
};

onMounted(async () => {
  if (authStore.user.SiteId && sosHistories.value.length == 0) {
    loading.value = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    await sosStore.getSosHistory(authStore.user.SiteId);
    loading.value.close();
  }
  if (Object.keys(selectedSosHistory.value).length) {
    await getSosCompartment();
  }
});

onBeforeMount(() => {
  if (loading.value) {
    loading.value.close();
  }
})
</script>

<style lang="scss" scoped>
.page-title {
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  margin: revert !important;
}

.button {
  background: #18af4a;
  box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24);
  color: white;
  border-radius: 8px;
}

.text-disabled {
  opacity: 0.5;
}

.form-check-input:checked,
.form-check-input[type="checkbox"]:indeterminate {
  background-color: #18af4a;
  border-color: #18af4a;
}

.task {
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #f4f6f8;
  border-radius: 8px;
  &--label {
    font-weight: 700;
  }
}
.compartment {
  margin-top: 20px;
  margin-left: 40px;
  padding: 8px 20px;
  border-radius: 8px;
  .text-message {
    font-size: 13px;
    font-weight: 700;
    color: #637381;
  }
}
</style>
