<template>
  <el-dialog
    v-model="dialogVisible"
    width="90%"
    center
    :lock-scroll="false"
    @closed="onFormClosed"
    @opened="onFormOpened"
    custom-class="el-defect-crack-form-custom"
    :destroy-on-close="true"
  >
    <template #title>
      <span class="el-dialog__title">Not Applicable</span>
      <span class="el-dialog__title task-title" v-html="displayDesc(title)" ref="defectDetailRef" ></span>
    </template>
    <div>
      <div class="mt-1 p-2">
        <div class="d-flex flex-column">
          <label>Why could you not complete the required service item?</label>
          <el-select
            v-model="naDesc"
            filterable
            @change="onReasonChange"
            class="w-100"
          >
            <template v-for="opt in masterStore.NAConditions" :key="opt.id">
              <el-option :label="opt.naCondition" :value="opt.naCondition" />
            </template>
          </el-select>
          <template v-if="showOptionValidation">
            <label class="px-1 text-danger">Required</label>
          </template>
        </div>
      </div>
      <div class="mt-1 p-2" v-if="descVisibility">
        <Textarea
          :value="desc"
          label="Description"
          name="Description"
          @handleChange="onDescInput"
        ></Textarea>
      </div>
      <div class="my-5 w-100">
        <button class="btn btn-success w-100" @click="onSubmitDefects" :disabled="btnDisabled"
        style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
      </div>
    </div>
    <Confirmation :visibility="confirmVisible"
      caption="Please confirm this is the reason you could not do the service item."
      @on-no-confirm="onCancel"
      @on-yes-confirm="onSave" />
    <MessageBox :show="messageBoxVisible" />
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  ref,
  toRef,
  watch
} from 'vue'
import { useEFormStore } from '@/store/pinia/dma/e-form-offline/useEFormStore'
import {
  UpdateParam
} from '@/core/types/entities/dma/e-form/update-data/updateParam'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  useNAFormStore
} from '@/store/pinia/dma/e-form-offline/na/useNAFormStore'
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import Confirmation from '@/components/dialog/Confirmation.vue'
import MessageBox from '@/components/dialog/OfflineMessageBoxOnly.vue'
import { ElLoading } from 'element-plus'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import { useOnline } from '@vueuse/core'
import {
  setAllDefectIsActiveByTaskId
} from '@/core/helpers/ironforms/offline/defect-form'
import {
  getTitle,
  disabledHyperlink
} from '@/store/pinia/dma/e-form/helpers'
import {
  useOfflineCameraStore
} from '@/store/pinia/application/useOfflineCameraStore';
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  }
});

/* stores */
const formStore = useNAFormStore()
const authStore = useAuthenticationStore()
const store = useEFormStore()
const masterStore = useMasterStore()
const cameraStore = useOfflineCameraStore()


/* refs */
const dialogVisible = toRef(props, "visibility")
const messageBoxVisible = ref(false)
const errorBoxVisible = ref(false)
const confirmVisible = ref(false)
const isCancelled = ref(true)
const loading = ref(false)
const naDesc = ref<string>("")
const desc = ref<string>("")
const descVisibility = ref<boolean>(false)
const btnDisabled = ref<boolean>(true)
const showOptionValidation = ref(false)
const defectDetailRef = ref(null) as any

const taskUpdate = computed(() => {
  return store.taskUpdated
});
const isFormAlreadySubmitted = computed(() => {
  return store.formAlreadySubmitted
});
const title = computed(() => {
  return getTitle(formStore.stateTask)
})

/* watchers */
watch(isFormAlreadySubmitted, (newValue) => {
  if (newValue) {
    formStore.toggleIsVisible(false)
    store.resetTaskUpdated()
    messageBoxVisible.value = false
    isCancelled.value = false
    loading.value = false
    loading.value = false
    formStore.setCancelledState(true)
  }
})

/* watchers */
const isTaskAlreadyUpdated = computed(() => {
  return store.taskAlreadyUpdated
});

/* watchers */
watch(isTaskAlreadyUpdated, (newValue) => {
  if (newValue) {
    formStore.toggleIsVisible(false);
    store.resetTaskUpdated();
    messageBoxVisible.value = false;
    isCancelled.value = false;
    loading.value = false;
    loading.value = false;
    formStore.setCancelledState(true)
  }
});

watch(taskUpdate, (newValue) => {
  if (formStore.Visible != true) return
  if (newValue === false) {
    loading.value = true
  }
  if (newValue === true) {
    if (!store.stateItemKey) messageBoxVisible.value = true
    if (messageBoxVisible.value) {
      setTimeout(() => {
        onOk()
      }, 2000);
    }
  }
})

/* event handlers */
const onReasonChange = () => {
  if (naDesc.value) showOptionValidation.value = false
  descVisibility.value = naDesc.value.includes("Other");
  if (descVisibility.value) {
    desc.value = "";
    btnDisabled.value = true;
  } else {
    btnDisabled.value = false;
  }
  formStore.setReason(naDesc.value);
}
const onDescInput = (param: TextareaParam) => {
  desc.value = param.value
  btnDisabled.value = desc.value === "";
}
const updateTask = async () => {
  // -------- case reset na field -------
  let resetOtherItemFieldParam = {} as UpdateParam
  let taskNormalValueParam = {} as UpdateParam
  let cameraValueParam = {} as UpdateParam
  if (formStore.stateItem.categoryItemType == "resultStatus") {
    taskNormalValueParam = {
      keyValue: formStore.stateTask!.key,
      propertyParams: [
        {
          propertyName: 'taskNormalValue',
          propertyValue: formStore.stateTask.category === "NORMAL" || formStore.stateTask.category === "CBM" ? "3" : "4"
        },
      ]
    }
    formStore.stateTask.items.forEach((searchItem) => {
      if (searchItem.categoryItemType == "resultRating") {
        resetOtherItemFieldParam = {
          keyValue: searchItem!.key,
          propertyParams: [
            {
              propertyName: 'value',
              propertyValue: ""
            },
            {
              propertyName: 'updatedBy',
              propertyValue: ""
            },
            {
              propertyName: 'updatedDate',
              propertyValue: ''
            },
          ]
        }
      }
      if (searchItem.itemType == "smallCamera") {
        cameraValueParam = {
          keyValue: searchItem!.key,
          propertyParams: [
            {
              propertyName: 'value',
              propertyValue: ""
            },
            {
              propertyName: 'updatedBy',
              propertyValue: ""
            },
            {
              propertyName: 'updatedDate',
              propertyValue: ''
            },
          ]
        }
      }
    })
  }
  // -------- case reset na field -------
  const payload: UpdateParam[] = []
  if (formStore.stateItem.categoryItemType == "resultStatus") {
    payload.push(resetOtherItemFieldParam)
    payload.push(taskNormalValueParam)
    payload.push(cameraValueParam)
    cameraStore.clearImageById(cameraValueParam.keyValue)
  }
  store.setStateItemKey("")
  if (payload.length > 0) {
    if (!isOfflineOrSlowInternetConnection()) {
      await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name);
    } else {
      await store.updateServiceSheetTaskOnLocalDB(payload, formStore.stateTask.key, `reset-${formStore.stateTask.key}`, false, formStore.stateTask.key)
    }
  } else {
    store.resetTaskUpdated()
    setTimeout(() => {
      store.setTaskUpdated()
    }, 50);
    if (!isOfflineOrSlowInternetConnection()) {
      store.getTaskProgress()
      store.updateGroupByParam(store.stateSelectedGroup!.groupName)
    }
  }
  const disabledItems = store.stateStoredDisableKeyValue.filter((disabled) => {
    return disabled.key == formStore.ItemKey
  })
  if (disabledItems.length < 1) {
    store.pushStoredDisabledItems({
      key: formStore.ItemKey,
      value: formStore.stateTask.category === "NORMAL" || formStore.stateTask.category === "CBM" ? "3" : "4"
    })
  } else {
    store.updateAllItems(formStore.ItemKey, formStore.stateTask.category === "NORMAL" || formStore.stateTask.category === "CBM" ? "3" : "4")
  }
}
const onSubmitDefects = () => {
  if (!naDesc.value) {
    showOptionValidation.value = true
  } else {
    confirmVisible.value = true;
  }
}
const onSave = async () => {
  confirmVisible.value = false
  if (formStore.Reason.includes("Other")) {
    formStore.setReason(`${formStore.Reason}:${desc.value}`)
  }
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const previousInputIsDefect = formStore.stateTask.taskValue == "2"
  const previousInputIsCBMDefect = formStore.stateTask.taskValue == "C" || formStore.stateTask.taskValue == "X"
  if (previousInputIsDefect || previousInputIsCBMDefect) {
    await setAllDefectIsActiveByTaskId(store.stateGeneralForm.workOrder, formStore.stateTask.key, "false")
  }
  let updateNaSuccess
  if (!isOfflineOrSlowInternetConnection()) {
    updateNaSuccess = await formStore.createNA()
  } else {
    updateNaSuccess = await formStore.updateNAToLocalDB()
  }
  if (updateNaSuccess) await updateTask()
  else if (store.taskErrorDialog) {
    onOk()
  }
  loader.close()
}
const onCancel = () => {
  confirmVisible.value = false
}
const onOk = () => {
  /* hide form */
  formStore.toggleIsVisible(false)
  store.resetTaskUpdated()
  messageBoxVisible.value = false
  isCancelled.value = false
  loading.value = false
}
const onFormClosed = async () => {
  if (isCancelled.value === true) {
    formStore.setCancelledState(true);
    formStore.setSuccesItem("")
  } else {
    formStore.setSuccesItem(formStore.stateItemKey)
  }
  naDesc.value = ""
  desc.value = ""
  descVisibility.value = false
  showOptionValidation.value = false
  messageBoxVisible.value = false
  errorBoxVisible.value = false
  formStore.resetInstance()
}
const onFormOpened = () => {
  isCancelled.value = true
  disabledHyperlink(defectDetailRef.value)
}
</script>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
<style>
  .el-dialog__title {
    text-align: start;
  }
</style>
