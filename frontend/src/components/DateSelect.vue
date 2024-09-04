<template>
  <div class="relative">
    <button
      ref="trigger"
      class="btn justify-between min-w-44 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
      aria-label="Select date range"
      aria-haspopup="true"
      @click="toggleDropdown"
      :aria-expanded="dropdownOpen"
    >
      <span class="flex items-center">
        <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-2" width="16" height="16" viewBox="0 0 16 16">
          <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
          <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
        </svg>
        <span>{{ options[selected].period }}</span>
      </span>
      <svg class="shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" width="11" height="7" viewBox="0 0 11 7">
        <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
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
        class="z-10 absolute top-full right-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1"
        @focus="setDropdownOpen(true)"
        @blur="setDropdownOpen(false)"
      >
        <div class="font-medium text-sm text-gray-600 dark:text-gray-300">
          <button
            v-for="option in options"
            :key="option.id"
            tabindex="0"
            class="flex items-center w-full hover:bg-gray-50 hover:dark:bg-gray-700/20 py-1 px-3 cursor-pointer"
            :class="{ 'text-violet-500': option.id === selected }"
            @click="selectOption(option.id)"
          >
            <svg
              class="shrink-0 mr-2 fill-current text-violet-500"
              :class="{ 'invisible': option.id !== selected }"
              width="12"
              height="9"
              viewBox="0 0 12 9"
            >
              <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
            </svg>
            <span>{{ option.period }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'DateSelect',
  setup() {
    const options = [
      { id: 0, period: 'Today' },
      { id: 1, period: 'Last 7 Days' },
      { id: 2, period: 'Last Month' },
      { id: 3, period: 'Last 12 Months' },
      { id: 4, period: 'All Time' },
    ];

    const dropdownOpen = ref(false);
    const selected = ref(2);
    const trigger = ref(null);
    const dropdown = ref(null);

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const setDropdownOpen = (value) => {
      dropdownOpen.value = value;
    };

    const selectOption = (id) => {
      selected.value = id;
      dropdownOpen.value = false;
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
      options,
      dropdownOpen,
      selected,
      trigger,
      dropdown,
      toggleDropdown,
      setDropdownOpen,
      selectOption,
    };
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s ease-out, transform 0.1s ease-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>