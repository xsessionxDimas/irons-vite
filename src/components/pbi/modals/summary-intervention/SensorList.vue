<template>
  <el-table
    ref="tableSensorListRef"
    :data="props.listData"
    v-loading="loading && props.listData.length == 0"
    element-loading-background="#2d2b39b3"
    empty-text="No Data"
    height="320"
    class="table-row table-dark sensor-table"
    header-row-class-name="table-header"
    row-class-name="table-row text-white"
    @selection-change="handleSelectionChange"
    @select-all="handleSelectAll"
    row-key="sensorId"
    select-on-indeterminate
  >
    <el-table-column prop="componentName" label="Component" min-width="125" />
    <el-table-column prop="sensorParameter" label="Sensor Parameter" min-width="125" />
    <el-table-column prop="occurence" label="Occurence" align="center" min-width="100" />
    <el-table-column prop="aggregate" label="Agregate" align="center" />
    <el-table-column prop="uom" label="UoM" align="center" />
    <el-table-column prop="value" label="Value" align="center" />
    <el-table-column prop="rating" label="Rating" align="center">
      <template #default="scope">
        <div :style="getRatingColor(scope.row.rating)">
          <span class="text-bold">
            {{ scope.row.rating }}
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="cautionThreshold" label="Caution Threshold" align="center" />
    <el-table-column prop="criticalThreshold" label="Critical Threshold" align="center" />
    <el-table-column
      reserve-selection
      class="table-selection"
      class-name="table-selection"
      type="selection"
      align="center"
    />

    <template #append>
      <div
        v-if="props.currentPage != props.lastPage && props.listData.length > 0"
        v-loading="true"
        element-loading-background="#2d2b39b3"
        element-loading-text="Loading"
        class="mb-5 py-10"
      ></div>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn } from "element-plus";
import {
  PropType,
  defineProps,
  ref,
  watch,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import {
  SensorDataType
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/3dpHornetType";
import {
  useSummaryInterventionStore
} from "@/store/pinia/iron-portal/dashboard/pbi-equipment/summary-intervention/useSummaryInterventionStore";
import _ from "lodash";

const emits = defineEmits([
  "infiniteScroll_lastDataSearch",
  "changeSelectAll"
])

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<SensorDataType[]>,
  },
  reRender: {
    default: false
  },
  selectAll: {
    type: Boolean,
    required: true
  },
  lastPage: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  tableHeight: {
    type: Number,
    required: true
  },
});

const sumInterventionStore = useSummaryInterventionStore();

const tableSensorListRef = ref<any>();

const handleSelectionChange = async (rows) => {
  sumInterventionStore.updateSensorDataList(rows);
}

const debouncedHandleInfiniteScroll = _.debounce((direction) => {
  console.log("emit debounce")
  emits("infiniteScroll_lastDataSearch", direction)
}, 1000)

const elTableBody = computed(() => {
  const tableref = tableSensorListRef.value;
  if (!tableref) return;

  const scrollableEl: HTMLDivElement | undefined = tableref.$el.querySelector(".el-table__body-wrapper");

  return scrollableEl;
});

const loading = computed(() => {
  return sumInterventionStore.loadingSensor
})

const handleScroll = () => {
  const scrollableEl = elTableBody.value
  console.log("scrollableEl", scrollableEl)
  if (!scrollableEl) return;

  scrollableEl.addEventListener('scroll', (e) => {
    console.log(scrollableEl.scrollHeight, scrollableEl.scrollTop);

    // scroll to top
    // if (scrollableEl.scrollTop <= 50) {
    //   debouncedHandleInfiniteScroll("prev");
    //   return
    // }

    // scroll to down
    if (scrollableEl.scrollHeight - scrollableEl.scrollTop <= 500) {
      debouncedHandleInfiniteScroll("next")
      return
    }
  })
}

const handleSelectAll = (selection) => {
  emits("changeSelectAll", selection.length > 0 ? true : false)
}

const setSelection = () => {
  if (props.listData.length > 0) {
    const checkedItems = props.listData.filter((item) => {
      return item.isCheck == true
    })
    if (checkedItems.length == props.listData.length) emits("changeSelectAll", true)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    checkedItems.forEach((row) => {
      tableSensorListRef.value!.toggleRowSelection(row, true)
    })
  } else {
    console.log("ELSE CLEAR SELECTION")
    tableSensorListRef.value!.clearSelection()
    emits("changeSelectAll", false)
  }
}

watch(() => {
  return props.reRender === true;
}, () => {
  setSelection();
})

const getRatingColor = (rating) => {
  if (rating == "A") return "background: #54D62C;"
  else if (rating == "B") return "background: blue;"
  else if (rating == "C") return "background: orange;"
  else if (rating == "X") return "background: #FF4842;"
}

onMounted(() => {
  const scrollableEl = elTableBody.value
  if (!scrollableEl) return;

  scrollableEl.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  const scrollableEl = elTableBody.value
  if (!scrollableEl) return;

  scrollableEl.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss">
.table-header {
  background-color: transparent !important;
}
.table-row {
  background-color: transparent !important;
}
.table-row::before {
  content: none;
  height: 0px;
}

.sensor-table.table-dark.el-table tr td {
  padding: 5px 0 !important;
  border-bottom: 0.25px solid #3f3d4b;
}
</style>
