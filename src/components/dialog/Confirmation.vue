<template>
  <!-- Vertically centered modal -->
  <el-dialog v-model="dialogVisible" center top="30vh" :close-on-click-modal="false" :show-close="showClose"
    :width="widthDialog ? `${widthDialog}% !important` : ''" :custom-class="'Confirmation'" append-to-body
    @closed="onCloseConfirmation" :close-on-press-escape="false">
    <span class="caption" v-html="caption"></span>

    <p v-if="footerTemplate === 'defect' || footerTemplate === 'crack'" class="confirmation-text">
      Please confirm this {{ footerTemplate }} information is correct.
    </p>

    <template v-if="footerTemplate === 'defect' || footerTemplate === 'crack'" v-slot:footer>
      <span class="dialog-footer" style="display: flex; justify-content: space-between;">
        <el-button :disabled="disableAddPart" @click="addPartConfirm" :style="addPartButtonStyle">{{ addPartButtonLabel }}</el-button>
        <div style="display: flex; gap: 10px;">
          <el-button :disabled="disableNo" @click="noConfirm" :style="noButtonStyle">Cancel</el-button>
          <el-button :disabled="disableYes" @click="yesConfirm" :style="yesButtonStyle">{{ yesLabel }}</el-button>
        </div>
      </span>
    </template>

    <template v-else-if="footerTemplate === 'default'" v-slot:footer>
      <span class="dialog-footer" style="display:block; text-align:right">
        <el-button :disabled="disableNo" v-if="!hideNo" @click="noConfirm"
          style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">{{ noLabel }}</el-button>
        <el-button :disabled="disableYes" class="button-OK-confirmation" v-if="!hideYes" type="success"
          @click.prevent="yesConfirm"
          :style="`background:${yesButtonBackroundColor}; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white`">{{
            yesLabel }}</el-button>
      </span>
    </template>

    <template v-else-if="footerTemplate === '50-50'" v-slot:footer>
      <span class="dialog-footer" style="display: flex; justify-content: space-around;">
        <el-button :disabled="disableNo" v-if="!hideNo" @click="noConfirm"
          style="width: 50%; box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">{{ noLabel }}</el-button>
        <el-button :disabled="disableYes" class="button-OK-confirmation" v-if="!hideYes" type="success"
          @click.prevent="yesConfirm"
          :style="`background:${yesButtonBackroundColor}; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white; width: 50%;`">{{
            yesLabel }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  caption: {
    required: true,
    type: String
  },
  showClose: {
    default: false,
  },
  yesLabel: {
    default: 'Yes',
  },
  noLabel: {
    default: 'No'
  },
  hideNo: {
    default: false
  },
  hideYes: {
    default: false
  },
  disableYes: {
    default: false
  },
  disableNo: {
    default: false
  },
  yesButtonBackroundColor: {
    default: '#18AF4A'
  },
  widthDialog: {
    default: 0
  },
  footerTemplate: {
    default: "default"
  },
  addPartLabel: {
    default: 'Add part'
  },
  disableAddPart: {
    default: false
  },
  addPartButtonBackroundColor: {
    default: '#18AF4A'
  },
  partsExist: {
    required: false,
    type: Boolean,
    default: false
  },
});

const emits = defineEmits([
  "onNoConfirm",
  "onYesConfirm",
  "onClose",
  "onAddPart"
]);

const dialogVisible = computed(() => {
  return props.visibility;
});

/* methods */
const noConfirm = () => {
  emits("onNoConfirm");
}
const yesConfirm = () => {
  emits("onYesConfirm");
}
const onCloseConfirmation = () => {
  emits("onClose");
}
const addPartConfirm = () => {
  emits("onAddPart");
}


const yesButtonStyle = computed(() => {
  const defaultStyle = {
    background: 'white',
    color: '#18AF4A',
    border: '2px solid #18AF4A',
    boxShadow: ''
  };

  const activeStyle = {
    background: props.yesButtonBackroundColor,
    color: 'white',
    border: '',
    boxShadow: '0px 8px 16px rgba(0, 171, 85, 0.24)'
  };

  return props.partsExist ? activeStyle : defaultStyle;
});


const noButtonStyle = computed(() => {
  return {
    background: 'white',
    color: 'black',
    boxShadow: '0px 24px 48px rgba(145, 158, 171, 0.2)'
  };
});

const addPartButtonStyle = computed(() => {
  const defaultStyle = {
    width: '25%',
    background: props.addPartButtonBackroundColor,
    color: 'white',
    boxShadow: '0px 8px 16px rgba(0, 171, 85, 0.24)',
    border: ''
  };

  const activeStyle = {
    width: '35%',
    background: 'white',
    color: '#18AF4A',
    boxShadow: '',
    border: '2px solid #18AF4A'
  };

  return props.partsExist ? activeStyle : defaultStyle;
});


const addPartButtonLabel = computed(() => {
  return props.partsExist ? 'Add more part' : props.addPartLabel;
});
</script>

<style lang="scss">
.Confirmation {
  width: 460px !important;
  padding: 10px 0px 0px;
  gap: 8px;

  .confirmation .el-dialog__header {
    display: none;
    padding: 0 !important;
  }

  .caption {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #212B36;
    flex: none;
    order: 0;
    flex-grow: 0;
    word-break: break-word;
  }

  .confirmation-text {
    margin-top: 10px;
    font-size: 14px;
    color: #4d4d4d;
  }

  .is-disabled {
    &.is-disabled {
      opacity: 0.6;
    }
  }
}
</style>
