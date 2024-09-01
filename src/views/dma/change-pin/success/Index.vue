<template>
  <div style="width: 100vw; height: 100vh; background-color: white;"></div>
  <SubmitComplete :show="showSubmit"  @close="handleCloseDialog"/>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import SubmitComplete from './Success.vue'
import { usePINStore } from '@/store/pinia/dma/pin/usePINStore'

const showSubmit = ref(true)
const router = useRouter()

const pinStore = usePINStore()

onBeforeMount(() => {
  if (!pinStore.isChangePinComplete) router.push({ name: 'changepin' })
})

const handleCloseDialog = () => {
  router.push({ name: 'changepin' })
}
</script>
