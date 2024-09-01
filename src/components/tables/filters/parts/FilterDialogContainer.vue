<template>
  <el-dialog
    v-model="isDialogVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal"
  >
    <div class="row">
      <Form
        class="form w-100 px-5"
        id="kt_filter_form"
        :validation-schema="filterValidation">
        <div class="col-6">

        </div>
      </Form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCloseModal">Cancel</el-button>
        <el-button type="primary" @click="handleExecuteFilter">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRef } from 'vue'
import { Form } from "vee-validate"
import * as Yup from "yup"

interface IFilterFormInput {
  requestedBy: string | null,
}

export default defineComponent({
  props: ['dialogVisible'],
  emits: ['handle-close'],
  components: {
    Form
  },
  setup(props, { emit }) {
    // vars start
    const isDialogVisible = toRef(props, "dialogVisible")
    const filterForm = ref<IFilterFormInput>({
      requestedBy: ''
    })
    const filterValidation = Yup.object().shape({
      requestedBy: Yup.string().min(4).required().label("Requested by"),
    })

    // methods start
    const handleCloseModal = () => {
      emit('handle-close', false)
    }
    const handleExecuteFilter = (async () => {
      await filterValidation.validate(filterValidation, {
        abortEarly: false
      }).catch((error) => {
        console.log(error.errors)
      })
    })

    return {
      isDialogVisible,
      filterForm,
      filterValidation,
      handleCloseModal,
      handleExecuteFilter
    }
  }
})
</script>

<style lang="scss">
.el-dialog__title {
  font-weight: 600;
  font-size: 16px;
}
.el-dialog__header {
  border-bottom: 1px solid #eff2f5;
}
</style>
