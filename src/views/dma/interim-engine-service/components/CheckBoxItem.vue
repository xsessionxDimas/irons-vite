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
          v-model="itemValue"
          :id="item.caption"
        />
        <label class="form-check-label subtitle" :for="item.caption">
          {{ item.caption }}
        </label>
      </div>
      <div class="col-5 text-end">
        {{ timeStamp }}
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { Item } from '@/core/types/entities/dma/e-form/Item'
import {
  defineProps,
  PropType,
  computed,
  toRef
} from 'vue'
import { isUndefined } from 'lodash'
import {
  useInterimGeneralFormStore
} from '@/store/pinia/dma/interim-engine-service/useInterimGeneralFormStore';
import { ElLoading } from 'element-plus';

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<Item>
  },
  index: {
    type: Number
  },
  isAggrementChecked: {
    type: Boolean,
    default: false,
  }
})

const itemRef = toRef(props, 'item')
const generalFormStore = useInterimGeneralFormStore()

const checkBoxDisabledCondition = computed(() => {
  const isChecked = itemRef.value.value == 'true'
  return !props.isAggrementChecked || isChecked
})

const itemValue = computed({
  get: () => {
    return props.item.value
  },
  set: (val) => {
    itemRef.value.value = `${val}`
    onCheckboxChanges()
  }
})

const onCheckboxChanges = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Updating',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const updateParam = {
    keyValue: itemRef.value.key,
    propertyParams: [
      {
        propertyName: 'value',
        propertyValue: itemRef.value.value
      },
      {
        propertyName: 'updatedDate',
        propertyValue: '<<ServerDateTime>>'
      },
    ]
  }
  await generalFormStore.postCheckBeforeTruckItem(updateParam, itemRef.value.key)
  loading.close()
}

const timeStamp = computed(() => {
  let timeStamp = ''
  if (!isUndefined(props.item.updatedDate)) {
    timeStamp = `${props.item.updatedBy?.name}, ${props.item.updatedDate}`
  }
  return timeStamp
})
</script>

<style scoped>
.form-check-input:checked {
  background-color: #18af4a;
  border-color: #18af4a;
}
</style>
