<template>
  <div class="row my-5 justify-content-between">
    <div class="col-6 col-md-4 mr-auto">
      <SearchForm />
    </div>
    <div class="col-3 col-md-2">
      <Sort />
    </div>
    <div class="col-6 col-md-2">
      <FilterModalButton />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SearchForm from "./SearchForm.vue"
import Sort from "./Sort.vue"
import FilterModalButton from "./FilterModalButton.vue"

export default defineComponent({
  components: {
    SearchForm,
    Sort,
    FilterModalButton
  }
})
</script>

<style scoped>
.mr-auto {
  margin-right: auto;
}
</style>
