<template>
  <div
    :class="['relative', className]"
    @mouseenter="setTooltipOpen(true)"
    @mouseleave="setTooltipOpen(false)"
    @focus="setTooltipOpen(true)"
    @blur="setTooltipOpen(false)"
  >
    <button class="block" aria-haspopup="true" :aria-expanded="tooltipOpen" @click.prevent>
      <svg class="fill-current text-gray-400 dark:text-gray-500" width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
      </svg>
    </button>
    <div :class="['z-10 absolute', positionOuterClasses(position)]">
      <transition
        name="fade"
        @enter="enter"
        @leave="leave"
      >
        <div
          v-if="tooltipOpen"
          :class="['rounded-lg border overflow-hidden shadow-lg', sizeClasses(size), colorClasses(bg), positionInnerClasses(position)]"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Tooltip',
  props: {
    children: String,
    className: String,
    bg: String,
    size: String,
    position: String,
  },
  setup() {
    const tooltipOpen = ref(false);

    const setTooltipOpen = (value) => {
      tooltipOpen.value = value;
    };

    const positionOuterClasses = (position) => {
      switch (position) {
        case 'right':
          return 'left-full top-1/2 -translate-y-1/2';
        case 'left':
          return 'right-full top-1/2 -translate-y-1/2';
        case 'bottom':
          return 'top-full left-1/2 -translate-x-1/2';
        default:
          return 'bottom-full left-1/2 -translate-x-1/2';
      }
    };

    const sizeClasses = (size) => {
      switch (size) {
        case 'lg':
          return 'min-w-72 px-3 py-2';
        case 'md':
          return 'min-w-56 px-3 py-2';
        case 'sm':
          return 'min-w-44 px-3 py-2';
        default:
          return 'px-3 py-2';
      }
    };

    const colorClasses = (bg) => {
      switch (bg) {
        case 'light':
          return 'bg-white text-gray-600 border-gray-200';
        case 'dark':
          return 'bg-gray-800 text-gray-100 border-gray-700/60';
        default:
          return 'text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700/60';
      }
    };

    const positionInnerClasses = (position) => {
      switch (position) {
        case 'right':
          return 'ml-2';
        case 'left':
          return 'mr-2';
        case 'bottom':
          return 'mt-2';
        default:
          return 'mb-2';
      }
    };

    return {
      tooltipOpen,
      setTooltipOpen,
      positionOuterClasses,
      sizeClasses,
      colorClasses,
      positionInnerClasses,
    };
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>