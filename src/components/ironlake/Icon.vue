<template>
  <svg
    v-if="name"
    :style="{ width: `${size}px`, height: `${size}px` }"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="name !== 'loading' ? '0 0 20 20' : '0 0 24 24'"
    :fill="name !== 'loading' ? 'currentColor' : 'none'"
  >
    <svg
      v-if="name === 'cancel-red'"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z"
        fill="#FF4842"
      />
    </svg>
    <svg
      v-if="name === 'avatar-placeholder'"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_615_35972)">
        <rect width="80" height="80" rx="40" fill="#E6F6FF" />
        <rect x="24" y="12" width="32" height="32" rx="16" fill="#01A3FF" />
        <rect x="-20" y="54" width="120" height="120" rx="60" fill="#01A3FF" />
      </g>
      <defs>
        <clipPath id="clip0_615_35972">
          <rect width="80" height="80" rx="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <svg
      v-if="name === 'filter'"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16667 15H10.8333C11.2917 15 11.6667 14.625 11.6667 14.1667C11.6667 13.7083 11.2917 13.3333 10.8333 13.3333H9.16667C8.70833 13.3333 8.33333 13.7083 8.33333 14.1667C8.33333 14.625 8.70833 15 9.16667 15ZM2.5 5.83333C2.5 6.29167 2.875 6.66667 3.33333 6.66667H16.6667C17.125 6.66667 17.5 6.29167 17.5 5.83333C17.5 5.375 17.125 5 16.6667 5H3.33333C2.875 5 2.5 5.375 2.5 5.83333ZM5.83333 10.8333H14.1667C14.625 10.8333 15 10.4583 15 10C15 9.54167 14.625 9.16667 14.1667 9.16667H5.83333C5.375 9.16667 5 9.54167 5 10C5 10.4583 5.375 10.8333 5.83333 10.8333Z"
        fill="currentColor"
      />
    </svg>
    <svg
      v-if="name === 'download'"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.8263 7.91663H12.5013V3.74996C12.5013 3.29163 12.1263 2.91663 11.668 2.91663H8.33464C7.8763 2.91663 7.5013 3.29163 7.5013 3.74996V7.91663H6.1763C5.43464 7.91663 5.05964 8.81663 5.58464 9.34163L9.40964 13.1666C9.73464 13.4916 10.2596 13.4916 10.5846 13.1666L14.4096 9.34163C14.9346 8.81663 14.568 7.91663 13.8263 7.91663ZM4.16797 16.25C4.16797 16.7083 4.54297 17.0833 5.0013 17.0833H15.0013C15.4596 17.0833 15.8346 16.7083 15.8346 16.25C15.8346 15.7916 15.4596 15.4166 15.0013 15.4166H5.0013C4.54297 15.4166 4.16797 15.7916 4.16797 16.25Z"
        fill="currentColor"
      />
    </svg>
    <svg
      v-if="name === 'upload'"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.33464 13.5802H11.668C12.1263 13.5802 12.5013 13.2052 12.5013 12.7468V8.58018H13.8263C14.568 8.58018 14.943 7.68018 14.418 7.15518L10.593 3.33018C10.268 3.00518 9.74297 3.00518 9.41797 3.33018L5.59297 7.15518C5.06797 7.68018 5.43464 8.58018 6.1763 8.58018H7.5013V12.7468C7.5013 13.2052 7.8763 13.5802 8.33464 13.5802ZM5.0013 15.2468H15.0013C15.4596 15.2468 15.8346 15.6218 15.8346 16.0802C15.8346 16.5385 15.4596 16.9135 15.0013 16.9135H5.0013C4.54297 16.9135 4.16797 16.5385 4.16797 16.0802C4.16797 15.6218 4.54297 15.2468 5.0013 15.2468Z"
        fill="currentColor"
      />
    </svg>
    <svg
      v-if="name === 'template'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="{1.5}"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
    <svg
      v-if="name === 'info'"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 15C9.45 15 9 14.55 9 14V10C9 9.45 9.45 9 10 9C10.55 9 11 9.45 11 10V14C11 14.55 10.55 15 10 15ZM11 7H9V5H11V7Z"
        fill="currentColor"
      />
    </svg>
    <svg
      v-if="name === 'close'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="{1.5}"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
    <svg
      v-if="name === 'chevron-up'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="{1.5}"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </svg>

    <svg
      v-if="name === 'chevron-down'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="{1.5}"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
    <svg
      v-if="name === 'error-sign'"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM9 9.75C8.5875 9.75 8.25 9.4125 8.25 9V6C8.25 5.5875 8.5875 5.25 9 5.25C9.4125 5.25 9.75 5.5875 9.75 6V9C9.75 9.4125 9.4125 9.75 9 9.75ZM9.75 12.75H8.25V11.25H9.75V12.75Z"
        fill="#FF4842"
      />
    </svg>
    <svg
      v-if="name === 'trash'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="{1.5}"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
    <svg
      v-if="name === 'pencil-edit'"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.3"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.833252 1.92999C0.833252 1.32441 1.32417 0.833496 1.92974 0.833496H5.61242C5.83971 0.833496 5.94909 1.11233 5.78234 1.26685L5.18975 1.81608C4.95863 2.03028 4.65517 2.14928 4.34004 2.14928H2.98238C2.52214 2.14928 2.14904 2.52238 2.14904 2.98262V7.0177C2.14904 7.47795 2.52214 7.85104 2.98238 7.85104H7.01746C7.47771 7.85104 7.85079 7.47795 7.85079 7.0177V5.73008C7.85079 5.38641 7.99229 5.05795 8.24196 4.82183L8.74484 4.34633C8.90421 4.19562 9.16659 4.30862 9.16659 4.528V8.07033C9.16659 8.67591 8.67567 9.16683 8.07009 9.16683H1.92974C1.32417 9.16683 0.833252 8.67591 0.833252 8.07033V1.92999Z"
        fill="currentColor"
      />
      <path
        d="M4.55245 4.6619C4.38974 4.49919 4.38974 4.23536 4.55245 4.07263L7.52799 1.09711C7.85341 0.771668 8.38108 0.771668 8.70649 1.09711L8.90283 1.29344C9.22829 1.61888 9.22829 2.14652 8.90283 2.47196L5.92728 5.44748C5.76458 5.61019 5.50078 5.61019 5.33803 5.44748L4.55245 4.6619Z"
        fill="currentColor"
      />
      <path
        d="M3.67632 5.00284L3.37011 5.97301C3.27718 6.26743 3.52552 6.55709 3.83067 6.51026L4.95714 6.33734C5.19331 6.30109 5.28806 6.01176 5.1191 5.8428L4.1607 4.88439C4.00594 4.72964 3.7422 4.79414 3.67632 5.00284Z"
        fill="currentColor"
      />
    </svg>
    <svg
      v-if="name === 'excel-icon'"
      id="Layer_1"
      version="1.1"
      viewBox="0 0 30 30"
      xml:space="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <path
          clip-rule="evenodd"
          d="M28.705,7.506l-5.461-6.333l-1.08-1.254H9.262   c-1.732,0-3.133,1.403-3.133,3.136V7.04h1.942L8.07,3.818c0.002-0.975,0.786-1.764,1.758-1.764l11.034-0.01v5.228   c0.002,1.947,1.575,3.523,3.524,3.523h3.819l-0.188,15.081c-0.003,0.97-0.79,1.753-1.759,1.761l-16.57-0.008   c-0.887,0-1.601-0.87-1.605-1.942v-1.277H6.138v1.904c0,1.912,1.282,3.468,2.856,3.468l17.831-0.004   c1.732,0,3.137-1.41,3.137-3.139V8.966L28.705,7.506"
          fill="currentColor"
          fill-rule="evenodd"
        />
        <path
          d="M20.223,25.382H0V6.068h20.223V25.382 M1.943,23.438h16.333V8.012H1.943"
          fill="currentColor"
        />
        <polyline
          fill="currentColor"
          points="15.73,20.822 12.325,20.822 10.001,17.538 7.561,20.822 4.14,20.822 8.384,15.486 4.957,10.817    8.412,10.817 10.016,13.355 11.726,10.817 15.242,10.817 11.649,15.486 15.73,20.822  "
        />
      </g>
    </svg>
    <svg
      v-if="name === 'add-new'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="{1.5}"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
    <svg
      v-if="name === 'check'"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.75 3C11.75 3.19191 11.6768 3.38391 11.5303 3.53016L5.53027 9.53016C5.38438 9.67734 5.19219 9.75 5 9.75C4.80781 9.75 4.61609 9.67676 4.46984 9.53027L1.46984 6.53027C1.32336 6.38438 1.25 6.19219 1.25 6C1.25 5.57156 1.60039 5.25 2 5.25C2.19191 5.25 2.38391 5.32324 2.53016 5.46973L5 7.94062L10.4703 2.47031C10.6156 2.32336 10.8078 2.25 11 2.25C11.4008 2.25 11.75 2.57109 11.75 3Z"
        fill="black"
      />
    </svg>
    <svg
      v-if="name === 'reload'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="{1.5}"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  </svg>
</template>
<script lang="ts" setup>
import { defineProps } from "vue";
import { computed } from "@vue/reactivity";

const props = defineProps({
  name: {
    type: String,
  },
  size: {
    type: [String, Number],
    default: 4,
  },
});

const name = computed(() => {
  return props.name;
});
const size = computed(() => {
  return props.size;
});
</script>
