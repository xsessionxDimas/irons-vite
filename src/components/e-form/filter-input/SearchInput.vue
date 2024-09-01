<template>
  <div class="px-5 mt-3 w-100 top-0">
    <div class="input-group col-md-4">
      <span class="input-group-append">
        <button class="p-5 btn btn-outline-secondary border-right-0 border" type="button">
          <em class="fa fa-search"></em>
        </button>
      </span>
      <input class="form-control py-2 border-left-0 border" v-model="queryRef" type="text" placeholder="Search Here.." >
    </div>
  </div>
  <hr style="background: lightgray;" />
</template>
<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  computed
} from "vue"

// -------- DATA FROM PARENT ---------
const props = defineProps({
  query: {
    type: String,
    required: true
  },
})
const emits = defineEmits(['handle-set-query'])
// -------- DATA FROM PARENT ---------

// -------- COMPUTED ---------
const queryRef = computed({
  get: () => {
    return props.query
  },
  set: (val) => {
    emits("handle-set-query", val)
  }
})
// -------- COMPUTED ---------
</script>
