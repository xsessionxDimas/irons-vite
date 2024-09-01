<template>
  <div class="input-eform-status">
    <el-input
      ref="cbmInput"
      :class="[dropDownColor]"
      v-model="inputValue"
      size="small"
      :disabled="true"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  ref,
  toRef,
} from 'vue'

const props = defineProps({
  item: {
    type: String,
    required: true
  }
});

const itemRef = toRef(props, 'item')

const inputValue = computed({
  get: () => {
    return itemRef.value
  },
  set: (value) => {
    itemRef.value = value;
  },
});

const dropDownColor = computed(() => {
  const val = props.item;
  let color: string | undefined
  if (val == 'A') {
    color = 'a'
  } else if (val == 'B') {
    color = 'b'
  } else if (val == 'C') {
    color = 'c'
  } else if (val == 'X') {
    color = 'x'
  }
  return color
})

const cbmInput = ref<HTMLInputElement>();
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
