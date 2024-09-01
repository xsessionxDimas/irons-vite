<template>
    <div class="online-indicator" :class="onlineStatus ? 'green' : 'red'">
        <span class="blink" :class="onlineStatus ? 'green' : 'red'"></span>
    </div>
    <h2 class="online-text">{{ onlineStatus ? 'Online' : 'No connection' }}</h2>
</template>

<script lang="ts" setup>
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore.ts';
import { watch, computed } from 'vue';
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection.ts";

/* online sensor */
const onlineStatus = computed(() => {
  return !isOfflineOrSlowInternetConnection();
})
const globalConnectionStore = useGlobalConnectionStore();

watch(onlineStatus, (value) => {
  globalConnectionStore.setConnectionStatus(value);
})
</script>

<style>
.successBox {
  background-color: #95d475 !important;
}
.errorBox {
  background-color: #f89898 !important;
}
</style>

<style scoped>
.green {
  background-color: #0fcc45;
}
.red {
  background-color: #FF4842;
}
div.online-indicator {
  display: inline-block;
  margin-top:-3px;
  width: 15px;
  height: 15px;
  margin-right: 10px;
  border-radius: 50%;
  position: relative;
}
span.blink {
  display: block;
  width: 15px;
  height: 15px;
  opacity: 0.7;
  border-radius: 50%;
  animation: blink 1s linear infinite;
}
h2.online-text {
  display: inline;
  font-weight: 400;
  text-shadow: 0px 3px 6px rgba(150, 150, 150, 0.2);
  position: relative;
  cursor: pointer;
  font-size: 15px;
}
/*Animations*/
@keyframes blink {
  100% { transform: scale(2, 2);
          opacity: 0;
    }
}
</style>
