<template>
  <div class="wrapper d-flex flex-column flex-fill">
    <div class="d-flex justify-content-between align-items-center">
        <p class="title">Change PIN</p>
        <div>
          <online-status></online-status>
        </div>
    </div>
    <div class="col-12 w-100% bg-white">
      <h1 class="my-6"></h1>
      <div class="row mx-0">
        <form>
          <div class="col-12">
            <PasswordInput placeholder="Old PIN" :value="oldPin" @change-val="changeOldPin" :is-loading="oldPinLoading" />
          </div>
          <div class="col-12">
            <PasswordInput placeholder="New PIN" :value="newPin" @change-val="changeNewPin" />
          </div>
          <div class="col-12">
            <PasswordInput placeholder="Re-type New PIN" :value="retypeNewPin" @change-val="changeRetypeNewPin" />
          </div>
        </form>

        <p class="validation-message">{{ validation }}</p>

        <hr class="mt-2">
        <div class="row justify-content-end">
          <div class="col-3 col-sm-2 col-xl-1">
            <div class="d-flex row justify-contend-end">
              <button
                :disabled="disable" type="button"
                class="btn btn-success btn-submit-password"
                style="background-color: #18AF4A;"
                @click="handleChangePinConfirmation"
              > Submit </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Confirmation :visibility="confirmExitVisibility"
    caption="Are you sure want to change your PIN?"
    @on-no-confirm="onConfirmExitCancel"
    @on-yes-confirm="onExitConfirmSubmit" />
</template>

<script setup lang="ts">
import { usePINStore } from '@/store/pinia/dma/pin/usePINStore'
import PasswordInput from './PasswordInput.vue'
import { computed, onUnmounted, ref } from 'vue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import { useRouter } from 'vue-router'
import OnlineStatus from '@/components/sensors/OnlineStatus.vue'

const pinStore = usePINStore()
const router = useRouter()
const confirmExitVisibility = ref(false)
const oldPinLoading = ref(false)

const oldPin = computed(() => {
  return pinStore.oldPin
})
const newPin = computed(() => {
  return pinStore.newPin
})
const retypeNewPin = computed(() => {
  return pinStore.retypeNewPin
})

const validation = computed(() => {
  return pinStore.validaiton
})

const handleChangePinConfirmation = () => {
  confirmExitVisibility.value = true
}

const onConfirmExitCancel = () => {
  confirmExitVisibility.value = false;
}

const onExitConfirmSubmit = () => {
  confirmExitVisibility.value = false
  handleSubmit()
}

const checkPINValidity = (pin: string) => {
  const filled = pin != ''
  const alreadySix = pin.length == 6
  return filled && alreadySix
}

const disable = computed(() => {
  const oldPinFilled = checkPINValidity(oldPin.value.value)
  const newPinFilled = checkPINValidity(newPin.value.value)
  const retypeNewPinFilled = checkPINValidity(retypeNewPin.value.value)
  const noValidation = validation.value != ''
  const allInputNoError = oldPin.value.isError || newPin.value.isError || retypeNewPin.value.isError
  return oldPinFilled && newPinFilled && retypeNewPinFilled && !noValidation && !allInputNoError ? false : true
})

const changeOldPin = async (pin) => {
  pinStore.setOldPin(pin)
  if (pin.length == 6) {
    oldPinLoading.value = true
    const status = await pinStore.validatePin(pin)
    oldPinLoading.value = false
    if (!status) {
      pinStore.setValidationMessage("Old PIN doesn't match")
      oldPin.value.toggleIsError(true)
    } else {
      if (validation.value == "Old PIN doesn't match") pinStore.setValidationMessage("")
      oldPin.value.toggleIsError(false)
    }
  }
  if (pin.length == 0) {
    pinStore.setValidationMessage('')
    oldPin.value.toggleIsError(false)
  }
}

const checkNewAndRetypePIN = () => {
  if (newPin.value.value.length == 6 && retypeNewPin.value.value.length == 6) {
    if (newPin.value.value == retypeNewPin.value.value) {
      if (!oldPin.value.isError) {
        if (newPin.value.value != oldPin.value.value) {
          pinStore.setValidationMessage("")
          newPin.value.toggleIsError(false)
          retypeNewPin.value.toggleIsError(false)
        } else {
          pinStore.setValidationMessage("old and new PIN can't be the same number")
          newPin.value.toggleIsError(true)
          retypeNewPin.value.toggleIsError(true)
        }
      } else {
        newPin.value.toggleIsError(false)
        retypeNewPin.value.toggleIsError(false)
      }
    } else {
      pinStore.setValidationMessage("new PIN doesn't match")
      newPin.value.toggleIsError(true)
      retypeNewPin.value.toggleIsError(true)
    }
  }
}

const changeNewPin = async (pin) => {
  pinStore.setNewPin(pin)
  if (pin.length == 6) {
    checkNewAndRetypePIN()
  }
  if (pin.length == 0) {
    pinStore.setValidationMessage("")
    newPin.value.toggleIsError(false)
    retypeNewPin.value.toggleIsError(false)
  }
}
const changeRetypeNewPin = async (pin) => {
  pinStore.setRetypeNewPin(pin)
  if (pin.length == 6) {
    checkNewAndRetypePIN()
  }
  if (pin.length == 0) {
    pinStore.setValidationMessage("")
    newPin.value.toggleIsError(false)
    retypeNewPin.value.toggleIsError(false)
  }
}

const handleSubmit = async () => {
  const status = await pinStore.changePIN()
  if (status) {
    pinStore.toggelIsChangePinComplete(true)
    router.push({ name: 'changepinsuccess' })
  }
}

onUnmounted(() => {
  pinStore.resetPIN()
})
</script>
<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect-review.scss";
</style>

<style lang="scss" scoped>
@media (min-width: 992px) {
  .aside-enabled.aside-fixed .wrapper {
    transition: padding-left 0.3s ease;
    padding-left: 0;
  }
}
.btn-submit-password {
  &:disabled {
    color: rgba(145, 158, 171, 0.8) !important;
    background-color: rgba(145, 158, 171, 0.24) !important;
    &:hover {
     cursor:not-allowed;
    }
  }
}

.validation-message {
  color: #FF4842;
  font-weight: 400;
  font-size: 14px;
}
</style>
