<template>
  <div class="table-preview">
    <table>
      <thead>
        <tr>
          <th class="no-column">No</th>
          <th class="col-task">Task</th>
          <th class="col-condition">Condition</th>
        </tr>
      </thead>
      <tbody>
        <!-- Normal 1 -->
        <template v-if="typeTask == 1">
            <tr>
              <td class="cel-no">{{ taskNo }}</td>
              <td>
                <div>
                    <span>{{ task }}</span>
                </div>
              </td>
              <td>
                <el-select v-model="dummySelect" placeholder="Choose one" size="small">
                  <el-option
                    v-for="item in optionsSelectCondition"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </td>
            </tr>
        </template>
        <!-- Normal 2 -->
        <template v-if="typeTask == 2">
            <tr>
              <td class="cel-no">{{ taskNo }}</td>
              <td>
                <div class="row justify-content-between align-items-center">
                    <div class="col-7">
                        <span>{{ task }}</span>
                    </div>
                    <div class="col-5">
                        <el-input v-model="dummyInput" placeholder="Additional Information" size="small"/>
                    </div>
                </div>
              </td>
              <td>
                <el-select v-model="dummySelect" placeholder="Choose one" size="small">
                    <el-option
                    v-for="item in optionsSelectCondition"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
              </td>
            </tr>
        </template>
        <!-- Normal 3 -->
        <template v-if="typeTask == 3">
            <tr>
              <td class="cel-no">{{ taskNo }}</td>
              <td>
                <div class="row justify-content-between align-items-center">
                    <div class="col-7" style="word-wrap:break-word;">
                        {{ task }}
                    </div>
                    <div class="col-5">
                        <div class="row justify-content-between align-items-center">
                        <div class="col-8">
                            <el-input v-model="dummyInput" placeholder="Input Value" size="small"/>
                        </div>
                        <div class="col-4">
                            <span class="me-1">{{ uom }}</span>
                        </div>
                        </div>
                    </div>
                </div>
              </td>
              <td>
                <el-select v-model="dummySelect" placeholder="Choose one" size="small">
                    <el-option
                    v-for="item in optionsSelectCondition"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
              </td>
            </tr>
        </template>
        <!-- Normal 4 -->
        <template v-if="typeTask == 4">
            <tr>
              <td class="cel-no">{{ taskNo }}</td>
              <td>
                <div class="row justify-content-between align-items-center">
                    <div class="col-5">
                        <span>{{ task }}</span>
                    </div>
                    <div class="col-7">
                        <div class="row justify-content-between align-items-center">
                            <div class="col-5">
                                <el-input v-model="dummyInput" placeholder="Input Value" size="small"/>
                            </div>
                            <div class="col-7">
                                <el-input v-model="dummyInput2" placeholder="Additional Information" size="small"/>
                            </div>
                        </div>
                    </div>
                </div>
              </td>
              <td>
                <el-select v-model="dummySelect" placeholder="Choose one" size="small">
                    <el-option
                    v-for="item in optionsSelectCondition"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
              </td>
            </tr>
        </template>
        <!-- CBM Measurement 1 -->
        <template v-if="typeTask == 7">
          <tr>
              <td class="cel-no">{{ taskNo }}</td>
              <td>
                <div>
                    <span>{{ task }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex">
                  <div class="col-8 me-6">
                    <el-select v-model="dummySelect2" placeholder="Choose one" size="small">
                        <el-option
                        v-for="item in optionsSelect2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                  </div>
                  <div class="col-2">
                    <button class="btn btn-sm btn-icon btn-bg-light">
                      <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" style="height: 12px; width: 14px;" alt="camera" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
        </template>
        <!-- CBM Measurement 2 -->
        <template v-if="typeTask == 8">
          <tr>
              <td class="cel-no">{{ taskNo }}</td>
              <td>
                <div>
                    <span>{{ task }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex">
                  <div class="col-8 me-6">
                    <el-select v-model="dummySelect2" placeholder="Choose one" size="small">
                        <el-option
                        v-for="item in optionsSelect2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                  </div>
                  <div class="col-2">
                    <button class="btn btn-sm btn-icon btn-bg-light">
                      <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" style="height: 12px; width: 14px;" alt="camera" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
        </template>
        <!-- CBM Measurement 3 -->
        <template v-if="typeTask == 9">
            <tr>
                <td class="cel-no">{{ taskNo }}</td>
              <td>
                <div class="row justify-content-between align-items-center">
                    <div class="col-7">
                        <span style="word-wrap:break-word;">{{ task }}</span>
                    </div>
                    <div class="col-5">
                        <div class="row justify-content-between align-items-center">
                            <div class="col-9">
                                <el-select v-model="dummySelect2" placeholder="Choose one" size="small">
                                    <el-option
                                    v-for="item in optionsSelect2"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    />
                                </el-select>
                            </div>
                            <div class="col-3">
                                <button class="btn btn-sm btn-icon btn-bg-light">
                                <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" style="height: 12px; width: 14px;" alt="camera" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              </td>
              <td>
                <el-select v-model="dummySelect" placeholder="Choose one" size="small">
                  <el-option
                  v-for="item in optionsSelectCondition"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  />
                </el-select>
              </td>
            </tr>
        </template>
        <!-- CBM Measurement 4 -->
        <template v-if="typeTask == 10">
            <tr>
              <td class="cel-no">{{ taskNo }}</td>
              <td>
                <div class="row justify-content-between align-items-center">
                    <div class="col-7" style="word-wrap:break-word;">
                        {{ task }}
                    </div>
                    <div class="col-5">
                        <div class="row justify-content-between align-items-center">
                            <div class="col-8">
                                <el-input v-model="dummyInput" placeholder="Input Value" size="small"/>
                            </div>
                            <div class="col-4">
                                <span class="me-1">{{ uom }}</span>
                            </div>
                        </div>
                    </div>
                </div>
              </td>
              <td>
                <div class="d-flex">
                  <div class="col-8 me-6">
                    <el-select v-model="dummySelect2" placeholder="Choose one" size="small">
                        <el-option
                        v-for="item in optionsSelect2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                  </div>
                  <div class="col-2">
                    <button class="btn btn-sm btn-icon btn-bg-light">
                      <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" style="height: 12px; width: 14px;" alt="camera" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import {
  defineProps,
  ref,
  watch,
  PropType
} from 'vue'
import { Option } from "@/core/types/misc/Option";

const props = defineProps({
  taskNo: {
    type: Number,
    default: 1
  },
  typeTask: {
    type: Number,
    default: 0
  },
  task: {
    type: String,
    default: ""
  },
  optionsSelectCondition: {
    default: [],
    type: Array as PropType<Option[]>
  },
  uom: {
    type: String,
    default: ''
  }
});
const dummySelect = ref('');
const dummySelect2 = ref('');
const dummyInput = ref('');
const dummyInput2 = ref('');
const optionsSelect2 = ref([
  {
    label: 'A',
    value: 'A'
  },
  {
    label: 'B',
    value: 'B'
  },
  {
    label: 'C',
    value: 'C'
  },
  {
    label: 'X',
    value: 'X'
  }
]);
watch(() => {
  return props.taskNo
}, () => {
  dummySelect.value = ''
  dummySelect2.value = ''
  dummyInput.value = ''
  dummyInput2.value = ''
})
</script>

<style lang="scss" scoped>
.table-preview {
  overflow-x: auto;
}

.table-preview table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.table-preview th, td {
  padding: 8px;
  text-align: left;
}

.table-preview th {
  background-color: #F4F6F8;
}
th.no-column {
  text-align: center;
  width: 7%
}
.cel-no {
  text-align: center;
}
.col-condition{
    text-align: right;
}
.col-task{
    width: 60%
}
.col-condition{
    width: 25%
}
</style>
