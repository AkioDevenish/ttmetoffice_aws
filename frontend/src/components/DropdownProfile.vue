<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
      aria-haspopup="true"
      @click="toggleDropdown"
      :aria-expanded="dropdownOpen"
    >
      <span class="sr-only">Profile</span>
      <wbr />
      <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16">
        <path d="M0 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1ZM3 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM7 12a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Z" />
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
          'origin-top-right z-10 absolute top-full left-0 right-auto min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1',
          align === 'right' ? 'md:left-auto md:right-0' : 'md:left-0 md:right-auto'
        ]"
        @focus="setDropdownOpen(true)"
        @blur="setDropdownOpen(false)"
      >
        <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">
          Profile
        </div>
        <ul class="mb-4">
          <li class="py-1 px-3" v-for="(ref, key) in profileRefs" :key="key">
            <label class="flex items-center">
              <input
                ref="ref"
                type="checkbox"
                class="form-checkbox"
              />
              <span class="text-sm font-medium ml-2">{{ key }}</span>
            </label>
          </li>
        </ul>
        <div class="py-2 px-3 border-t border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-700/20">
          <ul class="flex items-center justify-between">
            <li>
              <button
                @click="handleProfile"
                class="btn-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500"
              >
                Clear
              </button>
            </li>
            <li>
              <button
                class="btn-xs bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                @click="applyProfile"
                @blur="setDropdownOpen(false)"
              >
                Apply
              </button>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'DropdownProfile',
  props: {
    align: {
      type: String,
      default: 'left',
    },
  },
  setup() {
    const dropdownOpen = ref(false);
    const trigger = ref(null);
    const dropdown = ref(null);

    const profileRefs = {
      'Option 1': ref(null),
      'Option 2': ref(null),
      'Option 3': ref(null),
    };

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const setDropdownOpen = (value) => {
      dropdownOpen.value = value;
    };

    const handleProfile = () => {
      Object.keys(profileRefs).forEach((key) => {
        if (profileRefs[key].value && profileRefs[key].value.checked) {
          profileRefs[key].value.checked = false;
        }
      });
    };

    const applyProfile = () => {
      setDropdownOpen(false);
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

    const enter = () => {
      // Your enter logic here
    };

    const leave = () => {
      // Your leave logic here
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
      profileRefs,
      toggleDropdown,
      setDropdownOpen,
      handleProfile,
      applyProfile,
      enter,
      leave,
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