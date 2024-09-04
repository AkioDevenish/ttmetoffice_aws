<template>
  <div v-bind="rest">
    <button
      ref="trigger"
      :class="[
        'rounded-full',
        dropdownOpen
          ? 'bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400'
          : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
      ]"
      aria-haspopup="true"
      @click="toggleDropdown"
      :aria-expanded="dropdownOpen"
    >
      <span class="sr-only">Menu</span>
      <svg class="w-8 h-8 fill-current" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="2" />
        <circle cx="10" cy="16" r="2" />
        <circle cx="22" cy="16" r="2" />
      </svg>
    </button>
    <transition
      name="fade"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-if="dropdownOpen"
        ref="dropdown"
        :class="[
          'origin-top-right z-10 absolute top-full min-w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1',
          align === 'right' ? 'right-0' : 'left-0'
        ]"
        @focus="setDropdownOpen(true)"
        @blur="setDropdownOpen(false)"
      >
        <ul>
          <slot></slot>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'DropdownEditMenu',
  props: {
    align: {
      type: String,
      default: 'left',
    },
    rest: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const dropdownOpen = ref(false);
    const trigger = ref(null);
    const dropdown = ref(null);

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const setDropdownOpen = (value) => {
      dropdownOpen.value = value;
    };

    const clickHandler = ({ target }) => {
      if (!dropdown.value) return;
      if (!dropdownOpen.value || dropdown.value.contains(target) || trigger.value.contains(target)) return;
      dropdownOpen.value = false;
    };

    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen.value || keyCode !== 27) return;
      dropdownOpen.value = false;
    };

    onMounted(() => {
      document.addEventListener('click', clickHandler);
      document.addEventListener('keydown', keyHandler);
    });

    onUnmounted(() => {
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', keyHandler);
    });

    return {
      dropdownOpen,
      trigger,
      dropdown,
      toggleDropdown,
      setDropdownOpen,
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