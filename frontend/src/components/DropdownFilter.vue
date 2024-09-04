<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="inline-flex justify-center items-center group"
      aria-haspopup="true"
      @click="toggleDropdown"
      :aria-expanded="dropdownOpen"
    >
      <img class="w-8 h-8 rounded-full" :src="userAvatar" width="32" height="32" alt="User" />
      <div class="flex items-center truncate">
        <span class="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">Acme Inc.</span>
        <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12">
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
        </svg>
      </div>
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
          'origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1',
          align === 'right' ? 'right-0' : 'left-0'
        ]"
        @focus="setDropdownOpen(true)"
        @blur="setDropdownOpen(false)"
      >
        <div class="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
          <div class="font-medium text-gray-800 dark:text-gray-100">Acme Inc.</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 italic">Administrator</div>
        </div>
        <ul>
          <li>
            <router-link
              class="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
              to="/settings"
              @click.native="toggleDropdown"
            >
              Settings
            </router-link>
          </li>
          <li>
            <router-link
              class="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
              to="/signin"
              @click.native="toggleDropdown"
            >
              Sign Out
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import userAvatar from '../images/user-avatar-32.png';

export default {
  name: 'DropdownProfile',
  props: {
    align: {
      type: String,
      default: 'left',
    },
  },
  setup(props) {
    const dropdownOpen = ref(false);
    const trigger = ref(null);
    const dropdown = ref(null);
    const router = useRouter();

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
      toggleDropdown,
      setDropdownOpen,
      enter,
      leave,
      userAvatar,
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