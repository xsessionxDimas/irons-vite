<template>
  <div class="wrapper d-flex flex-column flex-fill">
    <div class="d-flex justify-content-between align-items-center">
      <p class="page-title"></p>
      <div>
        <online-status></online-status>
      </div>
    </div>
    <div class="mt-4">
      <div class="d-flex flex-row justify-content-end align-items-center">
        <p class="filter-text me-6 mb-0">Filter by Date</p>
        <el-date-picker
          v-model="dateRangeFilter"
          class="btn btn-outline filter-date-monitoring"
          popper-class="filter-date-monitoring-popper"
          type="daterange"
          unlink-panels
          range-separator="-"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="DD/MM/YYYY"
          :clearable="true"
          @change="handleDateRange"
        />
      </div>
      <template v-for="defect in defectList" :key="defect.name">
        <ListGroup :dataList="defect" @onItemClick="defectItemClick" :loading="loading" :is-defect-list-page="true" pageName="defect-identified" :showCounting="false"/>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  ref,
  onMounted,
  watch
} from 'vue'
import { ElLoading } from 'element-plus';
import {
  ListDefectSheet
} from "@/core/types/entities/dma/defects/ListDefectSheet";
import {
  addCurrentDateWithFormatHelper,
  formatDateHelper,
  substractCurrentDateWithFormatHelper
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import {
  usePositionListStore
} from '@/store/pinia/administration/organization-unit/position/usePositionListStore';
import {
  useIdentifiedDefectSheetStore
} from '@/store/pinia/dma/identified-defects/e-form/useIdentifiedDefectSheetStore';
import {
  useIdentifiedDefectInterimStore
} from '@/store/pinia/dma/identified-defects/interim/useIdentifiedDefectInterimStore';
import {
  useIdentifiedDefectInterventionStore
} from '@/store/pinia/dma/identified-defects/component-intervention/useIdentifiedDefectInterventionStore';

import OnlineStatus from '@/components/sensors/OnlineStatus.vue';
import ListGroup from "@/components/e-form/ListGroup.vue";
import { isUndefined } from 'lodash'
import {
  useDefectSheetStore
} from '@/store/pinia/dma/defect-approval/useDefectSheetStore'
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form-offline/defects/useDefectsStore'
import navigator from "@/core/mixins/navigator"
import {
  usePersonelLabourStore
} from "@/store/pinia/dma/personel-labour/usePersonelLabourStore";

const defectSheetStore = useDefectSheetStore();
const personelStore = usePersonelLabourStore();
const store = useDefectsStore();

const listStore = usePositionListStore();
const identifiedDefectSheetStore = useIdentifiedDefectSheetStore();
const identifiedDefectInterimStore = useIdentifiedDefectInterimStore();
const identifiedDefectInterventionStore = useIdentifiedDefectInterventionStore();

const authStore = useAuthenticationStore();

const { redirectByLink } = navigator();

const loading = ref(false);
const dateRangeFilter = ref<string[]>(identifiedDefectSheetStore.defaultRange);

const defectList = computed(() => {
  return [
    {
      name: "Digital Service Forms",
      list: identifiedDefectSheetStore.ServiceFormList,
      options: identifiedDefectSheetStore.ServiceFormOptions
    },
  ] as ListDefectSheet[]
});

const employeeId = computed(() => {
  return authStore.user.EmployeeId
});

const initData = async () => {
  loading.value = true;
  const loader = ElLoading.service({
    lock: true,
    text: 'Loading Identified Defect List',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  await personelStore.getPersonalLabours();
  await listStore.getPositionDMA();
  await identifiedDefectSheetStore.getIdentifiedDefectList(employeeId.value);
  await identifiedDefectInterimStore.getIdentifiedDefectList(employeeId.value);
  await identifiedDefectInterventionStore.getIdentifiedDefectList(employeeId.value);
  loader.close();
  loading.value = false;
};

const defectItemClick = (item) => {
  if (item.name == defectList.value[0].name) {
    onItemClickEform(item.item.dailyScheduleId)
  }
};

const onItemClickEform = (id: string) => {
  const defect = identifiedDefectSheetStore.setSelectedDefect(id);
  defectSheetStore.setSelectedDefectFromOtherPage(defect);
  store.reset();
  redirectByLink('/ironforms/identified-defects/service-form-detail');
}

const handleDateRange = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading Identified Defect List',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (!dateRangeFilter.value || dateRangeFilter.value.length === 0) {
    identifiedDefectSheetStore.setDefaultFilterDateRange();
    dateRangeFilter.value = identifiedDefectSheetStore.defaultRange
  }
  identifiedDefectSheetStore.setDefaultFilter(formatDateHelper(dateRangeFilter.value[0], "YYYY-MM-DD"), formatDateHelper(dateRangeFilter.value[1], "YYYY-MM-DD"))
  await identifiedDefectSheetStore.getIdentifiedDefectList(employeeId.value)
  loading.close()
};

onMounted(async () => {
  if (employeeId.value) {
    await initData()
  }
});

watch(employeeId, async (newVal) => {
  // validation.value = ''
  if (!isUndefined(newVal)) {
    await initData()
  }
}, { deep: true })
</script>

<style lang="scss">

.filter-date-monitoring {
  &.el-range-editor.el-input__inner {
    border: 1px solid #DFE3E8;
    padding: 0.5rem 1rem;
    min-height: 0;
    width: 250px;
  }

  .el-input__icon, input, .el-range-separator {
    font-weight: 600;
    color: #212B36;
  }

  .el-range-separator {
    display: flex;
    align-items: center;
    padding: 0 3px;
  }

  &-popper {
    .el-date-table td.end-date span, .el-date-table td.start-date span {
      background-color: #18AF4A;
    }
    .el-date-table td.in-range div {
      background-color: #E8F7ED;
    }
    .el-date-table td.today span {
      color: #18AF4A;
    }
  }
}

.filter-text {
  display: inline;
  font-weight: 400;
  text-shadow: 0px 3px 6px rgba(150, 150, 150, 0.2);
  position: relative;
  cursor: pointer;
  font-size: 15px;
}
</style>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect-review.scss";
</style>
