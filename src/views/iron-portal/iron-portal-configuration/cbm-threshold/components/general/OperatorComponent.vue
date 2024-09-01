<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8"><div class="grid-content ep-bg-purple" />
                <SelectInput
                :value="inputOperator"
                :label="labelOperator"
                :name="nameOperator"
                :placeholder="placeholderOperator"
                :options="optionOperator"
                @handle-change="onOperatorSelected"
                />
            </el-col>
            <el-col :span="16"><div class="grid-content ep-bg-purple" />
            <NumberInput
                :value="inputOperatorValue"
                :margin="false"
                :placeholder="placeholderValue"
                :name="nameValue"
                label="&nbsp;"
                :max="20"
                @handleChange="onOperatorValueChange" />
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  defineEmits,
  ref
} from "vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
const props = defineProps({
  operator: {
    required: true,
    type: String,
  },
  operatorValue: {
    required: true,
    type: String,
  },
  nameOperator: {
    required: true,
    type: String,
  },
  labelOperator: {
    required: false,
    type: String,
  },
  placeholderOperator: {
    required: false,
    type: String,
  },
  nameValue: {
    required: true,
    type: String,
  },
  placeholderValue: {
    required: false,
    type: String,
  },
});

const optionOperator = ref([
  { label: '=', value: '=' },
  { label: '<', value: '<' },
  { label: '>', value: '>' },
  { label: '<=', value: '<=' },
  { label: '>=', value: '>=' },
])

const emits = defineEmits([
  "handleChangeOperator",
  "handleChangeOperatorValue"
]);
const inputOperator = computed({
  get: () => {
    return props.operator;
  },
  set: (val) => {
    emits("handleChangeOperator", val);
  },
});
const inputOperatorValue = computed({
  get: () => {
    return props.operatorValue;
  },
  set: (val) => {
    emits("handleChangeOperatorValue", val);
  },
});
const onOperatorSelected = (val) => {
  emits("handleChangeOperator", val);
}
const onOperatorValueChange = (val) => {
  emits("handleChangeOperatorValue", val);
}
</script>

<style scoped>

</style>
