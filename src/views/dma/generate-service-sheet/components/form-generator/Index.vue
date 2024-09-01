<style scoped>
.tablet-simulated {
  max-width: 844px;
  position: relative;
  margin: auto;
}
</style>

<template>
  <el-form :model="form" label-width="170px">
    <el-form-item label="Choose Service Size">
      <el-select v-model="form.serviceSize" placeholder="Select" @change="onServiceSizeChange">
        <el-option v-for="item in serviceSize" :key="item" :label="item?.replace('psType', '')" :value="item" />
      </el-select>
      <el-button class="ms-4" type="primary" @click="handleDownload">
        Download Excel
      </el-button>
      <el-button class="ms-4" type="primary" @click="downloadFullModel">
        Download JSON
      </el-button>
    </el-form-item>

    <el-checkbox label="Tablet Width" v-model="form.simulate.use_tablet_width" />
    <el-checkbox label="Timestamp Overriding" v-model="form.simulate.timestamp_overriding" />
  </el-form>

  <div :class="{ 'tablet-simulated': form.simulate.use_tablet_width }">
    <GroupStepper v-if="groups && activeGroup" :groups="groups" :active-group="activeGroup" />

    <Editor v-model:open="editor.open" :content="editor.content" @changed="updatedTask" />

    <div v-if="activeGroup" :key="`version-${version}`">
      <template v-for="(subGroup, subGroupIndex) in activeGroup.subGroup" :key="subGroup.key">
        <SubGroup :subGroup="subGroup" @taskClicked="(options) => taskClicked({ ...options, subGroupIndex })">
          <!-- SLOT: ROW AFTER EACH TASK GROUP -->
          <template #row-after-taskgroup="{ taskGroupIndex }" v-if="activeGroupProblem">
            <div class="col-12 bg-danger text-white px-2 mb-5"
              v-if="activeGroupProblem.get(`taskgroup-${taskGroupIndex}`)">
              <ul>
                <li class="col-12 bg-danger text-white" :key="key" v-for="(subGroupProblem, key) in activeGroupProblem.get(
                  `taskgroup-${taskGroupIndex}`
                )" v-text="subGroupProblem.msg" />
              </ul>
            </div>
          </template>

          <!-- SLOT: ROW AFTER EACH TASK -->
          <template #row-after-task="{ task, taskIdx, taskGroupIndex }" v-if="activeGroupProblem">
            <div class="col-12 bg-danger text-white px-2">
              <ul v-if="activeGroupProblem.get(`taskgroup-${taskGroupIndex}/task-${taskIdx}`)">
                <li class="col-12 bg-danger text-white" :key="key" v-for="(taskProblem, key) in activeGroupProblem.get(
                  `taskgroup-${taskGroupIndex}/task-${taskIdx}`
                )" v-text="taskProblem.msg" />
              </ul>

              <div v-for="(item, itemIdx) in task.items" :key="(item as any).key">
                <ul v-if="activeGroupProblem.get(
                  `taskgroup-${taskGroupIndex}/task-${taskIdx}/item-${itemIdx}`
                )
                  ">
                  <li class="col-12 bg-danger text-white" :key="key" v-for="(itemProblem, key) in activeGroupProblem.get(
                    `taskgroup-${taskGroupIndex}/task-${taskIdx}/item-${itemIdx}`
                  )" v-text="itemProblem.msg" />
                </ul>
              </div>
            </div>
          </template>
        </SubGroup>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  reactive,
  ref,
  watch
} from "vue";
import {
  useJSONStore
} from "@/store/pinia/dma/generate-service-sheet/useJSONStore";
import GroupStepper from "./GroupStepper.vue";
import SubGroup from "./SubGroup.vue";
import { Task } from "@/core/types/generate-service-sheet/Task";
import {
  SubGroup as SubGroupType
} from "@/core/types/generate-service-sheet/SubGroup";
import Editor from "../editor/Index.vue";
import { isArray } from "lodash";
import { ElLoading } from 'element-plus';
import {
  ILoadingInstance
} from "element-plus/lib/el-loading/src/loading.type";
import {
  Model
} from '@/core/types/generate-service-sheet/Model'

const store = useJSONStore();

const loading = ref<ILoadingInstance>();
const version = ref<number>(1);

const form = reactive({
  serviceSize: "",
  simulate: {
    disable_by_task_key: false,
    use_tablet_width: true,
    timestamp_overriding: false
  }
});

watch(() => {
  return form.simulate.timestamp_overriding
}, (isNeeded) => {
  if (!isNeeded) return store.setTaskMapping(undefined);

  store.setTaskMapping((task: Task, { has_value }) => {
    if (has_value) {
      Object.assign<Task, unknown>(task, {
        adjustment: {
          updatedBy: {
            name: "Tommy Nugrahanto Wisudawan",
            "id": 'fake'
          },
          updatedDate: "27/11/23 14:23:27 (AEST)"
        }
      })

      if (isArray(task.items)) {
        task.items[task.items.length - 1].value = "3"
      }
    }
    return task;
  });
})

const editor = reactive({
  content: {} as Task,
  open: false,
});

store.$subscribe((mutation, state) => {
  form.serviceSize = state.selectedPsType || "";
});

/* computeds */
const groups = computed(() => {
  return store.avaiableGroups;
});
const activeGroup = computed(() => {
  return store.activeGroup;
});
const serviceSize = computed(() => {
  return store.availableServiceSize;
});
const activeGroupProblem = computed(() => {
  return store.activeGroupProblems;
});

/* events */
const onServiceSizeChange = () => {
  store.setPsType(form.serviceSize as keyof Model);
};

const whichSubGroupIndexOpen = ref<number>();
const whichTaskGroupIndexOpen = ref<number>();
const whichTaskIndexOpen = ref<number>();

function taskClicked(detail: {
  task: Task;
  subGroup: SubGroupType;
  subGroupIndex: number;
  taskGroupId: number;
  taskIdx: number;
}) {
  whichSubGroupIndexOpen.value = detail.subGroupIndex;
  whichTaskGroupIndexOpen.value = detail.taskGroupId;
  whichTaskIndexOpen.value = detail.taskIdx;
  // openTaskEditor(detail);
}

function openTaskEditor(detail: { task: Task; }) {
  editor.content = detail.task;
  editor.open = true;
}

function updatedTask(task: Task) {
  if (!store.selectedTaskGroup && store.selectedTaskGroup != 0) throw Error("taskgroup is not selected");
  if (!whichTaskGroupIndexOpen.value && whichTaskGroupIndexOpen.value != 0) throw Error("task group index is not found");
  if (!whichSubGroupIndexOpen.value && whichSubGroupIndexOpen.value != 0) throw Error("sub task group index is not found");
  if (!whichTaskIndexOpen.value && whichTaskIndexOpen.value != 0) throw Error("task index is not found")
  if (!store || !store.stateModel || !store.selectedPsType) throw Error("state manager is not ready");

  // save only address of object on select ps type
  const taskGroupAddress = store.stateModel[store.activePsType];
  if (!taskGroupAddress) throw Error(`can't set task group memory address for PSTYPE: ${store.activePsType}`);

  Object.assign(
    taskGroupAddress[store.selectedTaskGroup].subGroup[
      whichSubGroupIndexOpen.value
    ].taskGroup[whichTaskGroupIndexOpen.value].task[whichTaskIndexOpen.value],
    task
  );
}

const handleDownload = async () => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Generating Excel',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await store.postDownloadExcelModel()
  loading.value.close()
}

function download(stringJSON: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(stringJSON)
  );
  let model = 'model'
  if (store.model[store.activePsType]) {
    if (Array.isArray(store.model[store.activePsType])) {
      model = (store.model[store.activePsType] as any[])[0].modelId
    }
  }
  element.setAttribute("download", `${model}.json`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function downloadFullModel() {
  download(JSON.stringify(store.model, null, 2));
}
</script>
