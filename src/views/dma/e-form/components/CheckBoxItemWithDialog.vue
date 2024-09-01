<template>
  <div
    class="ps-2 justify-content-start"
  >
    <div class="p-2 row justify-content-between">
      <div class="col-7 form-check checkbox-success">
        <input
          class="form-check-input"
          type="checkbox"
          :disabled="checkBoxDisabledCondition"
          :id="item.caption"
          v-model="itemValue"
          @change="handleChange"
        />
        <label class="form-check-label subtitle" :for="item.caption">
          {{ item.caption }}
        </label>
      </div>
    </div>
    <template v-if="(itemRef.value == 'true' || itemRef.value) && itemRef.reason != ''">
      <Textarea
        :value="viewReason || ''"
        label-class="dma--textarea-label reason_skip--label"
        text-class="dma--textarea-input h-100px reason_skip--text--disabled"
        label="Reason"
        name="reason"
        :disabled="true"
      ></Textarea>
      <div class="text-end reason_skip--updateBy">
        {{ timeStamp }}
      </div>
    </template>
    <template v-if="!lastIndex">
      <div class="border my-3"></div>
    </template>
    <ReasonDialog :options="item.reasonList" :visibility="viewReasonDialog" @on-save="handleSaveReason" @on-close="handleCloseReason" @on-cancel="handleCancel" />
  </div>
</template>

<script lang='ts' setup>
import { Item } from '@/core/types/entities/dma/e-form/Item'
import {
  defineProps,
  PropType,
  computed,
  toRef,
  ref,
  watch,
  onUnmounted,
} from 'vue'
import { cloneDeep, isUndefined } from 'lodash'
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form/useGeneralFormStore';
import {
  useEFormStore
} from '@/store/pinia/dma/e-form/useEFormStore';
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import { ElLoading } from 'element-plus';
import Textarea from "@/components/inputs/dma/Textarea.vue";
import ReasonDialog from '@/views/dma/e-form/components/ReasonDialog.vue';
import { Employee } from '@/core/types/entities/dma/Payload';

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<Item>
  },
  lastIndex: {
    type: Boolean,
  },
  isAggrementChecked: {
    type: Boolean,
    default: false,
  }
})

const itemRef = toRef(props, 'item')
const viewReasonDialog = ref(false)
const generalFormStore = useGeneralFormStore()
const eFormStore = useEFormStore()
const authStore = useAuthenticationStore()
let localStateSelectedReason = {} as Item
let stateSkipReasonVisible = false

const toggleSkipReasonVisible = (status: boolean): void => {
  stateSkipReasonVisible = status
}

const itemValue = computed({
  get: () => {
    return props.item.value
  },
  set: (val) => {
    toggleCheckStatus(val as string)
  }
})

const toggleCheckStatus = (status: string | boolean): void => {
  let objCheckbox = eFormStore.generalForm.checkBeforeTruck.items.find((obj) => {
    return obj.key == props.item.key
  });
  if (objCheckbox) {
    objCheckbox.value = status;
  }
}

const handleChange = (e) => {
  if (e.target.checked == true) {
    viewReasonDialog.value = true
    toggleSkipReasonVisible(true)
  } else {
    onCheckboxChanges({ selectedReason: "", desc: "", reset: true })
  }
}

const viewReason = computed(() => {
  if (itemRef.value.reason) {
    if (itemRef.value.reason.includes("Other")) {
      return itemRef.value.reason.split(";;")[1]
    } else {
      return itemRef.value.reason.split(";;")[0]
    }
  }
  return ""
})

const checkBoxDisabledCondition = computed(() => {
  // const isChecked = itemRef.value.value == 'true'
  const isSubmited = generalFormStore.generalForm && generalFormStore.generalForm.status == "Submited"
  return !props.isAggrementChecked || generalFormStore.AllWashChecked || generalFormStore.generalUpdated || isSubmited
})

const handleSaveReason = (reason: { selectedReason: string, desc: string} | null) => {
  if (reason) {
    onCheckboxChanges(reason)
  }
}

const handleCloseReason = () => {
  viewReasonDialog.value = false
}

const handleCancel = () => {
  itemValue.value = "false"
  toggleSkipReasonVisible(false)
  handleCloseReason()
}

const onCheckboxChanges = async (reason: { selectedReason: string, desc: string, reset?: boolean}) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Updating',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  let reasonValue = `${reason.selectedReason};;${reason.desc}`
  let checkBoxValue = "true"
  let updateDate = '<<ServerDateTime>>'
  if (reason.reset) {
    reasonValue = ""
    checkBoxValue = "false"
    updateDate = ""
    localStateSelectedReason.updatedBy = {} as Employee
    localStateSelectedReason.updatedDate = ""
  }
  localStateSelectedReason = cloneDeep(itemRef.value)
  localStateSelectedReason.value = cloneDeep(checkBoxValue)
  localStateSelectedReason.reason = cloneDeep(reasonValue)
  let updateParam = {
    keyValue: itemRef.value.key,
    propertyParams: [
      {
        propertyName: 'value',
        propertyValue: checkBoxValue
      },
      {
        propertyName: 'reason',
        propertyValue: reasonValue
      },
      {
        propertyName: 'updatedDate',
        propertyValue: updateDate
      }
    ]
  }
  const isError = await generalFormStore.postCheckBeforeTruckItem(updateParam, itemRef.value.key, reason.reset)
  if (!isError) {
    itemValue.value = checkBoxValue
    itemRef.value.reason = reasonValue
    generalFormStore.setSkipWash(checkBoxValue)
    loading.close()
    if (!reason.reset) {
      generalFormStore.setReasonUpdated(true)
    } else {
      generalFormStore.setReasonUpdated(false)
    }
  } else {
    if (!reason.reset) {
      itemValue.value = "false"
      // document.getElementById("skipWash").checked = false
    } else {
      itemValue.value = "true"
      // document.getElementById("skipWash").checked = true
    }
    handleCloseReason();
    await eFormStore.postGenerateServiceSheet(authStore.user.EmployeeId, authStore.user.Name, authStore.user.SiteId)
    loading.close()
  }
}

const timeStamp = computed(() => {
  let timeStamp = ''
  if (!isUndefined(itemRef.value.updatedDate) && !isUndefined(itemRef.value.updatedBy?.name)) {
    timeStamp = `${itemRef.value.updatedBy?.name}, ${itemRef.value.updatedDate}`
  }
  return timeStamp
})

watch(itemValue, (newVal, oldVal) => {
  if ((!newVal || newVal == 'false') && oldVal) {
    if (stateSkipReasonVisible) {
      toggleCheckStatus(oldVal)
    } else {
      handleCancel()
    }
  }
}, { deep: true })

watch(viewReason, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    if (localStateSelectedReason) {
      itemRef.value.value = localStateSelectedReason.value
      itemRef.value.reason = localStateSelectedReason.reason
      itemRef.value.updatedBy = localStateSelectedReason.updatedBy
      itemRef.value.updatedDate = localStateSelectedReason.updatedDate
      if (itemRef.value.value && itemRef.value.value == "true") {
        generalFormStore.setSkipWash("true")
      }
    }
  }
}, { deep: true })

watch(timeStamp, (newVal, oldVal) => {
  if (newVal) {
    localStateSelectedReason.updatedBy = cloneDeep(props.item.updatedBy)
    localStateSelectedReason.updatedDate = cloneDeep(props.item.updatedDate)
  }
}, { deep: true })

onUnmounted(() => {
  toggleSkipReasonVisible(false)
  localStateSelectedReason = {} as Item
})

// watch(() => {
//   return generalFormStore.AllWashChecked
// }, (newVal) => {
//   if (newVal && itemRef.value.value == "true") {
//     onCheckboxChanges({ selectedReason: "", desc: "", reset: true })
//   }
// })
</script>

<style scoped lang="scss">
.form-check-input:checked {
  background-color: #18af4a;
  border-color: #18af4a;
}
</style>

<style lang="scss">

.reason_skip {
  &--label {
    color: #637381;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  }
  &--text {
    color: #212B36;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    &--disabled {
      color: #919EAB;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }
  &--updateBy{
    color: #919EAB;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
