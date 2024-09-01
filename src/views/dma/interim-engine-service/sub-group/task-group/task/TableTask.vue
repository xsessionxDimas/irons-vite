<template>
<div class="row w-100 mx-0 mb-5">
  <template v-if="!isUndefined(task.style) && task.style.category == 'taskTable'">
    <div class="col-1 px-2"></div>
  </template>
  <div class="task-table" style="font-size: 12px !important" :class="!isUndefined(task.style) && task.style.category == 'taskTable' ? 'col-11 px-0' : 'col-12 pe-0'">
    <label>{{ task.description }}</label>
    <div class="row text-center task-table__header py-2 w-100">
      <div v-for="header in headers" class="col font-weight-normal task-table__header__item" :key="header">
        {{ header }}
      </div>
    </div>
    <div v-for="(row, index) in task.items" :key="row.key" class="row w-100 task-table__body d-flex align-items-start" :class="taskRowBorder(index)">
      <TableRow :item="row" :task="task" :item-loading="itemLoading" :general-submitted="generalSubmitted"/>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
  watch,
  ref
} from 'vue'
import TableRow from './item/TableRow.vue'
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { isUndefined } from "lodash"
import {
  useInterimEngineStore
} from '@/store/pinia/dma/interim-engine-service/useInterimEngineStore';
import { Item } from '@/core/types/entities/dma/e-form/Item';
import {
  UpdateParam
} from '@/core/types/entities/dma/e-form/update-data/updateParam';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  }
});

const headers = computed(() => {
  return props.task.header.replaceAll("'", '').replace('[', '').replace(']', '').split(", ")
})

const taskRowBorder = (index: number) => {
  let className = ''
  if (!isUndefined(props.task.style) && !isUndefined(props.task.style.borderBottom) && props.task.style.borderBottom == "none") {
    className = ""
  } else {
    className = "border-bottom-table"
  }
  if ((index + 1) == props.task.items.length) className = "border-bottom-table"
  return className
}

const store = useInterimEngineStore()

const task = computed(() => {
  return props.task
})

const itemLoading = ref(false)

// ------------------------------------------ PENJELASAN ------------------------------------------- //
// computed target value digunakan untuk nangkep value item yang ngetrigger disable                  //
// watch targetValue, kalo nilainya 3 , jalananin fungsi triggerClearDataByDisabledItemValue         //
// ------------------------------------------ PENJELASAN ------------------------------------------- //
const targetValue = computed(() => {
  let value = ''
  if (isUndefined(props.task.disabledByItemKey)) return value
  const disabledItem = store.stateStoredDisableKeyValue.find((item) => {
    return item.key == props.task.disabledByItemKey
  })
  if (!isUndefined(disabledItem)) {
    value = disabledItem.value
  }
  return value
})

watch(targetValue, async (newVal) => {
  if (newVal == "3") {
    triggerClearDataByDisabledItemValue()
  }
}, { deep: true })

// ------------------------------------------ PENJELASAN ------------------------------------------- //
// fungsi bakal dijalanin kalo di task dikasi key disabledByItemKey                                  //
// disabledItem nyari disabled value dari disable key item yang disimpen di store                    //
// kalo gaketemu, hit API buat dapetin value, trus disimpen di store, n di find lagi                 //
// cek value dari yang di find apa isinya 3 "NA"                                                     //
// kalo bener, loop item task, cari yang di itemnya ada disabledByItemKey, cek valuenya              //
// kalo valunye ga kosong, buat object lalu push ke array                                            //
// kalo arraynya > 0 update data array tadi ke array                                                 //
// ------------------------------------------ PENJELASAN ------------------------------------------- //
const triggerClearDataByDisabledItemValue = async () => {
  if (!isUndefined(props.task.disabledByItemKey)) {
    let disabledItem = store.stateStoredDisableKeyValue.find((disabled) => {
      return disabled.key == props.task.disabledByItemKey
    })
    if (isUndefined(disabledItem)) {
      const value = await store.getValueFromItemKey(props.task.disabledByItemKey)
      store.pushStoredDisabledItems({
        key: props.task.disabledByItemKey,
        value: value
      })
    }
    disabledItem = store.stateStoredDisableKeyValue.find((disabled) => {
      return disabled.key == props.task.disabledByItemKey
    })

    // cek apakah 3
    if (disabledItem?.value == '3') {
      const updateParams: UpdateParam[] = []
      // kalo 3 loop semua task
      props.task.items.forEach((itemProp) => {
        for (var prop in itemProp) {
          const item = itemProp[prop] as Item
          // kalo ketemu item yang ada disabledbyitemkey, cek valuenya
          if (!isUndefined(item.disabledByItemKey)) {
            if (item.value) {
              // crate object
              const propertyParam = {
                keyValue: item.key,
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
                    propertyValue: ""
                  },
                ]
              }
              // kalo ada value tambah json
              updateParams.push(propertyParam)
            }
          }
        }
      })
      // json yg kekumpul diupdate
      if (updateParams.length > 0) {
        itemLoading.value = true
        await store.updateItemFromTask(updateParams)
        itemLoading.value = false
      }
      // (low) coba trigger loading
    }
  }
}

</script>

<style lang="scss" scoped>
  .task-table {
    .task-table__header {
      background-color: #F9FAFB;
      border: 1px solid #919eab3d ;
    }
    .task-table__body {
      border-left: 1px solid #919eab3d ;
      border-right: 1px solid #919eab3d ;
    }

    .border-bottom-table {
      border-bottom: 1px solid #919eab3d ;
    }
  }
</style>
