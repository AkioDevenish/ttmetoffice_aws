<template>
  <div
    :class="`relative ${className}`"
    @mouseenter="setInfoOpen(true)"
    @mouseleave="setInfoOpen(false)"
    @focus="setInfoOpen(true)"
    @blur="setInfoOpen(false)"
  >
    <button
      class="block"
      aria-haspopup="true"
      :aria-expanded="infoOpen"
      @click.prevent
    >
      <svg class="w-4 h-4 fill-current text-gray-400" viewBox="0 0 16 16">
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
      </svg>
    </button>
    <div class="z-10 absolute bottom-full left-1/2 transform -translate-x-1/2">
      <Transition
        :show="infoOpen"
        tag="div"
        :class="`bg-white border border-gray-200 p-3 rounded shadow-lg overflow-hidden mb-2 ${containerClassName}`"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <slot></slot>
      </Transition>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Transition from './Transition.vue' // Make sure to import your Vue version of the Transition component

export default {
  name: 'Info',
  components: {
    Transition
  },
  props: {
    className: {
      type: String,
      default: ''
    },
    containerClassName: {
      type: String,
      default: ''
    }
  },
  setup() {
    const infoOpen = ref(false)

    const setInfoOpen = (value) => {
      infoOpen.value = value
    }

    return {
      infoOpen,
      setInfoOpen
    }
  }
}
</script>