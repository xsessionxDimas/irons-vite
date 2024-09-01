<template>
  <div class="input-eform-status">
    <el-input
      ref="cbmInput"
      :class="dropDownColor"
      v-model="inputValue"
      size="small"
      :readonly="true"
      :disabled="true">
   </el-input>
  </div>
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  toRef,
  watch
} from 'vue';

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  }
});

const itemRef = toRef(props, 'item')

const inputValue = computed({
  get: () => {
    return itemRef.value.value
  },
  set: (value) => {
    const val = value as string
    itemRef.value.value = val
  },
});

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color: string | undefined
  if (itemRef.value.categoryItemType == "targetRating" || itemRef.value.itemType == "dropDown") {
    if (val == 'A') {
      color = 'a'
    } else if (val == 'B') {
      color = 'b'
    } else if (val == 'C') {
      color = 'c'
    } else if (val == 'X') {
      color = 'x'
    }
  }
  return color
})

const cbmInput = ref<HTMLInputElement>()

onMounted(async () => {
  inputValue.value = itemRef.value.value as string
})

onUnmounted(() => {
  itemRef.value = {} as Item
})

watch(props.item, (newVal) => {
  itemRef.value = newVal
}, { deep: true })
</script>

<style lang="scss">
.service-sheet-input {
  .el-input__inner {
    border-right: 0px;
  }
  .el-input-group__append {
    background-color: transparent;
    border-left: 0px;
  }
}

.e-form-container {
  .el-input {
    .el-input__inner::placeholder {
      font-size: 0.69rem;
    }
  }
  @media (max-width:900px) {
    .eform-table-row {
      .el-input {
        .el-input__inner::placeholder{
          font-size: 0.72rem;
        }
      }
    }
  }
}
</style>
