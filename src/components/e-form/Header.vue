<template>
  <div class="row w-100 pe-0 header-form">
    <!-- Title -->
    <div class="col-3">
      <h4 class="title">{{ title }}</h4>
    </div>

    <div :class="{'d-flex justify-content-between mt-1 mb-4': isGeneralUpdated, 'col-9 text-right': !isGeneralUpdated}">
      <!-- Fitter Name -->
      <FitterBadge v-if="isGeneralUpdated" :mechanicName="mechanicName" />
      <!-- Form Name -->
      <div class="text-right">
        <h4 class="form-name" v-html="formNameAndStatusBadge"></h4>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {
  computed,
  defineProps,
} from 'vue';
import {
  statusBadge,
  statusBadgeColor
} from "@/store/pinia/dma/e-form/helpers"
import FitterBadge from '../e-form/FitterBadge.vue';

const props = defineProps({
  formName: {
    required: true,
    type: String
  },
  title: {
    required: false,
    type: String,
    default: "Digital Service"
  },
  htmlFormName: {
    required: false,
    type: String,
    default: ""
  },
  formStatus: {
    required: true,
    type: String
  },
  percentageProgress: {
    required: true,
    type: Number
  },
  mechanicName: {
    required: false,
    type: String,
    default: ""
  },
  isGeneralUpdated: {
    required: true,
    type: Boolean,
  },
});

const status = computed(() => {
  return statusBadge(props.formStatus, props.percentageProgress)
})

const formNameAndStatusBadge = computed(() => {
  let badge;
  let form;
  if (status.value) {
    badge = `<span class='status-badge p-1 ${statusBadgeColor(status.value)}'>${status.value}</span>`
  }
  if (props.formName) {
    form = props.formName
  } else {
    form = props.htmlFormName
  }
  return badge + form
})

</script>

<style scoped>
    .title {
        font-size: 20px !important;
        line-height: 30px;
    }
    .form-name {
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0px;
        text-align: right;
    }
</style>

<style lang="scss">
.header-form {
    .yellow {
        color: #CC9A06;
    }
    .red {
        color: #FF4842;
    }
}
</style>
./FitterBadge.vue