<template>
    <div>
        <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            type="primary"
            :color="getColor(activity.action, index)"
            hide-timestamp="true">
            <div class="history-wrapper d-flex flex-column">
                <div class="d-flex">
                    <span>{{ `${getActions(activity.action, index)} by ${activity.pic}`}} <span class="badge" v-if="capitalizeFirstLetter(activity.role) != 'Fitter'">{{ capitalizeFirstLetter(activity.role) }}</span></span>
                </div>
                <div>
                    <span>{{ activity.createdDate }}</span>
                </div>
                <div v-if="activity.declineReason && getActions(activity.action, index) == 'Declined'" class="comment">
                    {{  activity.declineReason }}
                </div>
                <div v-if="activity.approveReason" class="comment">
                    {{  activity.approveReason }}
                </div>
            </div>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script lang="ts" setup>
import { HeaderHistory } from '@/core/types/entities/dma/defects/Header';
import { defineProps, PropType } from 'vue'

const props = defineProps({
  activities: {
    required: true,
    type: Object as PropType<HeaderHistory[]>
  },
})

const getCorrectedAction = (action: string) => {
  switch (action) {
    case 'Submited':
    case 'Submitted':
      return 'Submitted';
    case 'Decline':
    case 'Declined':
      return 'Declined';
    default:
      return action;
  }
}

function capitalizeFirstLetter(string) {
  if (!string) return string; // Return the original string if it's falsy (e.g., "", null, undefined)
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getActions = (action: string, index: number) => {
  let correctedAction = getCorrectedAction(action)
  return correctedAction
}


const getColor = (status: string, index: number) => {
  if ((index >= 0 && index < props.activities.length - 1) && [
    'Submitted',
    'Submited'
  ].includes(status)) {
    return '#FFC107'
  }
  switch (status) {
    case 'Revised':
      return '#FFC107'
    case 'Decline':
      return '#FF4842'
    default:
      return '#18AF4A'
  }
}

</script>

<style scoped>
 .comment {
    border: 2px solid lightgray;
    padding: 10px;
    border-radius: 8px;
    margin-top: 8px;
 }
 .badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  color: gray;
  background-color: lightgrey; /* Example blue background */
  border: 1px solid transparent; /* Optional: in case you want a border */
}
</style>
