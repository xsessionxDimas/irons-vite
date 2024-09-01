<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row my-4">
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Model</label>
              <el-select
                v-model="filterData.Model"
                placeholder="Type any.."
                clearable
                filterable
                @change="onModelSelected"
              >
                <el-option
                  v-for="item in listStore.ModelOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Version</label>
              <el-select
                v-model="filterData.Version"
                placeholder="Type any.."
                clearable
                filterable
                @change="onVersionSelected"
              >
                <el-option
                  v-for="item in listStore.VersionOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="row my">
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Group Name</label>
              <el-select
                v-model="filterData.GroupName"
                placeholder="Type any.."
                clearable
                filterable
                @change="onGroupNameSelected"
              >
                <el-option
                  v-for="item in listStore.GroupNameOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Sub Group Name</label>
              <el-select
                v-model="filterData.SubGroupName"
                placeholder="Type any.."
                clearable
                filterable
                @change="onSubGroupNameSelected"
              >
                <el-option
                  v-for="item in listStore.SubGroupNameOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="row my-4">
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Task Group Name</label>
              <el-select
                v-model="filterData.TaskGroupName"
                placeholder="Type any.."
                clearable
                filterable
                @change="onTaskGroupNameSelected"
              >
                <el-option
                  v-for="item in listStore.TaskGroupNameOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Task Description</label>
              <el-select
                v-model="filterData.TaskDescription"
                placeholder="Type any.."
                clearable
                filterable
                @change="onTaskDescriptionSelected"
              >
                <el-option
                  v-for="item in listStore.TaskDescriptionOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="row my-4">
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Task Key</label>
              <el-select
                v-model="filterData.TaskKey"
                placeholder="Type any.."
                clearable
                filterable
                @change="onTaskKeySelected"
              >
                <el-option
                  v-for="item in listStore.TaskKeyOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">PS Type</label>
              <el-select
                v-model="filterData.PsType"
                placeholder="Type any.."
                clearable
                filterable
                @change="onPsTypeSelected"
              >
                <el-option
                  v-for="item in listStore.PsTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="row my-4">
          <div class="col-12 col-md-6 px-0">
            <div class="row p-0 m-0">
              <label class="`form-label fs-6 fw-bolder 'text-dark'`">Check</label>
              <el-select
                v-model="filterData.Check"
                placeholder="Type any.."
                clearable
                filterable
                @change="onCheckSelected"
              >
                <el-option
                  v-for="item in listStore.CheckOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="secondary" @click="handleReset">Reset</el-button>
                <el-button type="primary" @click="handleFilterClick">Filter</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useTaskKeyMonitoringListStore
} from '@/store/pinia/iron-lake/report/task-key-monitoring/useTaskKeyMonitoringListStore';
import {
  FilterData
} from "@/core/types/entities/iron-lake/report/task-key-monitoring/FilterData";

/* stores */
const listStore = useTaskKeyMonitoringListStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

/* handlers */
const handleReset = () => {
  handleCloseModal()
  listStore.resetFilter()
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onModelSelected = (value: string) => {
  listStore.setModel(value);
};
const onTaskDescriptionSelected = (value: string) => {
  listStore.setTaskDescription(value);
};
const onTaskKeySelected = (value: string) => {
  listStore.setTaskKey(value);
};
const onPsTypeSelected = (value: string) => {
  listStore.setPsType(value);
};
const onCheckSelected = (value: string) => {
  listStore.setCheck(value);
};
const onVersionSelected = (value: string) => {
  listStore.setVersion(value);
};
const onGroupNameSelected = (value: string) => {
  listStore.setGroupName(value);
};
const onSubGroupNameSelected = (value: string) => {
  listStore.setSubGroupName(value);
};
const onTaskGroupNameSelected = (value: string) => {
  listStore.setTaskGroupName(value);
};
const handleFilterClick = () => {
  const checkModel = listStore.lastUsedFilterData.Model !== listStore.filterData.Model
  const checkTaskDescription = listStore.lastUsedFilterData.TaskDescription !== listStore.filterData.TaskDescription
  const checkTaskKey = listStore.lastUsedFilterData.TaskKey !== listStore.filterData.TaskKey
  const checkPsType = listStore.lastUsedFilterData.PsType !== listStore.filterData.PsType
  const checkCheck = listStore.lastUsedFilterData.Check !== listStore.filterData.Check
  const checkVersion = listStore.lastUsedFilterData.Version !== listStore.filterData.Version
  const checkGroupName = listStore.lastUsedFilterData.GroupName !== listStore.filterData.GroupName
  const checkSubGroupName = listStore.lastUsedFilterData.SubGroupName !== listStore.filterData.SubGroupName
  const checkTaskGroupName = listStore.lastUsedFilterData.TaskGroupName !== listStore.filterData.TaskGroupName
  const status = (checkModel || checkTaskDescription || checkTaskKey || checkPsType || checkCheck || checkVersion || checkGroupName || checkSubGroupName || checkTaskGroupName)
  emits("handle-close", status);
}
</script>
