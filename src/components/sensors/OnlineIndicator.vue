<template>
  <div class="w-100 p-4" id="fixedbutton">
    <div class="w-100 online-indicator py-2 px-4 d-flex" :class="[onlineValue ? 'online-label' : 'offline-label']">
      <img :src="onlineValue ? '/media/icons/bumaau/check_circle.png' : '/media/icons/bumaau/error.png'">
      <div class="d-flex flex-fill">
        <span class="ms-4 text-bold"> {{ onlineValue ? 'Your network is already online.' : 'Your network is unavailable,' }}</span> {{ !onlineValue ? ' but you can continue with offline mode.' : '' }}
      </div>
      <img @click="toggleShowOnlineIndicator(false)" class="button-behavior" :src="onlineValue ? '/media/icons/bumaau/close-success.png' : '/media/icons/bumaau/close-danger.png'">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits } from 'vue'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const emits = defineEmits(["onToggleIndicator"])

const toggleShowOnlineIndicator = (status) => {
  emits("onToggleIndicator", status)
}

const onlineValue = computed(() => {
  return !isOfflineOrSlowInternetConnection()
})
</script>

<style lang="scss" scoped>
#fixedbutton {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2147483647;

  .online-indicator {
    border-radius: 12px;
    font-size: 16px;
    white-space: break-spaces;
  }
  .offline-label {
    background: #FFDAD9;
    color: #661D1A;
  }
  .online-label {
    background: #DDF7D5;
    color: #225612;
  }

  .button-behavior {
    cursor: pointer;
  }
}
</style>
