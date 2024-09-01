<template>
  <el-dialog
    v-model="showDialog"
    width="50%"
    :show-close="false"
    custom-class="oil-not-in-range__header defect__confirmation_container"
    top="30vh" :center="true"
    @close="handleClose"
  >
    <div class="row pt-3 pb-3 text-dark modal-title">
      <h3>
        Please select if any of the questions below are applicable to this defect before submitting. Please note neither may be applicable and you can still submit and continue.
      </h3>
      <el-checkbox-group v-model="checkList" class="d-flex flex-column defect-checkbox">
        <el-checkbox label="Does the defect identified require > 30 minutes in labour to repair?">
          <template #default>
            <span v-html="`Does the defect identified require > 30 minutes in labour to repair?`"></span>
          </template>
        </el-checkbox>
        <el-checkbox label="Does the defect identified require > $250 in parts to repair?" />
      </el-checkbox-group>
    </div>
    <template #footer>
      <span class="dialog-footer" style="display:block; text-align:right">
        <el-button @click="handleClose" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">Cancel</el-button>
        <el-button class="button-OK-confirmation" type="success" @click.prevent="handleSubmit" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['show', 'checkListArr']);

const emits = defineEmits(["close", "updateCheckList", "submit"]);

const checkList = computed({
  get: () => {
    return props.checkListArr
  },
  set: (val) => {
    emits('updateCheckList', val)
  }
})

const handleSubmit = () => {
  emits('submit')
}

// const checkList = ref([])

const showDialog = computed(() => {
  return props.show
});
const handleClose = () => {
  emits("close")
}
</script>

<style lang="scss">
  .oil-not-in-range__header {
    .el-dialog__header {
      border-bottom: none !important;
    }
  }
  .defect__confirmation_container {
    @media only screen and (max-device-width: 1199px) {
      width: 70% !important;
    }
  }
  .ok-button {
    background-color: #18AF4A;
  }
  .defect-checkbox {
    .el-checkbox {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      color: black;

      .el-checkbox__label {
        white-space: break-spaces;
      }

      &.is-checked {
        .el-checkbox__inner {
          background-color: #4CAF50 !important;
          border-color: #4CAF50 !important;
          &::after{
            cursor: pointer;
          }
        }

        .el-checkbox__label {
          color: black!important;;
        }
      }
    }
  }
</style>
