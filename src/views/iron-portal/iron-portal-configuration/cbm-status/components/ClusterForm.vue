<template>
    <div class="row">
        <el-divider />
        <label class="form-label fs-2 fw-bolder text-dark">{{ name }}</label>
        <div class="col-md-6 fv-row fv-plugins-icon-container">
         <NumberInput
            :value="clusterData.sampleCount"
            placeholder="Add Sample Count"
            label="Sample Count"
            name="sampleCount"
            :max="20"
            @handleChange="val => handleChange(val,'sampleCount')"/>
        </div>
        <div class="col-md-6 fv-row fv-plugins-icon-container">
        <PercentInput
            :value="clusterData.sampleWeight"
            placeholder="Add Weight"
            label="Weight"
            name="sampleWeight"
            :max="20"
            @handleChange="val => handleChange(val,'sampleWeight')"/>
        </div>
        <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DecimalInput
            :value="clusterData.cautionLimit"
            placeholder="Add Caution Limit"
            label="Caution Limit"
            name="cautionLimit"
            :max="20"
            @handleChange="val => handleChange(val,'cautionLimit')"/>
        </div>
        <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DecimalInput
            :value="clusterData.criticalLimit"
            placeholder="Add Critical Limit"
            label="Critical Limit"
            name="criticalLimit"
            :max="20"
            @handleChange="val => handleChange(val,'criticalLimit')"/>
        </div>
        <!-- <div class="col-md-6 fv-row fv-plugins-icon-container">
        <NumberInput
            :value="clusterData.summaryWeight"
            placeholder="Add Summary Weight"
            label="Summary Weight"
            name="summaryWeight"
            :max="20"
            @handleChange="val => handleChange(val,'summaryWeight')"/>
        </div> -->
    </div>
</template>

<script lang="ts" setup>
import {
  ref,
  defineProps,
  defineEmits,
  defineExpose
} from 'vue'
import NumberInput from "@/components/inputs/NumberInput.vue";
import DecimalInput from "@/components/inputs/DecimalInput.vue";
import PercentInput from "@/components/inputs/PercentInput.vue";
import {
  ClusterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/UpsertItem";

import useCalculate from "../composeable/useCalculate";

const calHelper = useCalculate()

const props = defineProps({
  name: {
    type: String,
    default: ""
  },
});

const emits = defineEmits(["handle-change"]);

const clusterData = ref<ClusterData>({
  cluster: "",
  sampleCount: "",
  sampleWeight: "",
  cautionLimit: "",
  criticalLimit: "",
  summaryWeight: "",
})

const handleChange = (val, model) => {
  if (model === 'sampleCount' && val) {
    const cautionLimit = calHelper.calCautionLimit(val);
    const criticalLimit = calHelper.calCriticalLimit(val);
    clusterData.value.cautionLimit = cautionLimit;
    clusterData.value.criticalLimit = criticalLimit;
  }
  clusterData.value = {
    ...clusterData.value,
    "cluster": props.name,
    [model]: val,
  }
  emits("handle-change", clusterData.value);
}


const handleResetForm = () => {
  clusterData.value = {
    cluster: "",
    sampleCount: "",
    sampleWeight: "",
    cautionLimit: "",
    criticalLimit: "",
    summaryWeight: "",
  }
}

const setClusterData = (data) => {
  clusterData.value = data
}

defineExpose({ handleResetForm, setClusterData })

</script>

<style scoped>

</style>
