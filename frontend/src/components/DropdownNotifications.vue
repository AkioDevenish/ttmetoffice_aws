<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      :class="[
        'w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full',
        dropdownOpen ? 'bg-gray-200 dark:bg-gray-800' : ''
      ]"
      aria-haspopup="true"
      @click="toggleDropdown"
      :aria-expanded="dropdownOpen"
    >
      <span class="sr-only">Notifications</span>
      <svg
        class="fill-current text-gray-500/80 dark:text-gray-400/80"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 0a7 7 0 0 0-7 7c0 1.202.308 2.33.84 3.316l-.789 2.368a1 1 0 0 0 1.265 1.265l2.595-.865a1 1 0 0 0-.632-1.898l-.698.233.3-.9a1 1 0 0 0-.104-.85A4.97 4.97 0 0 1 2 7a5 5 0 0 1 5-5 4.99 4.99 0 0 1 4.093 2.135 1 1 0 1 0 1.638-1.148A6.99 6.99 0 0 0 7 0Z" />
        <path d="M11 6a5 5 0 0 0 0 10c.807 0 1.567-.194 2.24-.533l1.444.482a1 1 0 0 0 1.265-1.265l-.482-1.444A4.962 4.962 0 0 0 16 11a5 5 0 0 0-5-5Zm-3 5a3 3 0 0 1 6 0c0 .588-.171 1.134-.466 1.6a1 1 0 0 0-.115.82 1 1 0 0 0-.82.114A2.973 2.973 0 0 1 11 14a3 3 0 0 1-3-3Z" />
      </svg>
      <div class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 dark:border-gray-900 rounded-full"></div>
    </button>

    <Transition name="fade">
      <div
        v-if="dropdownOpen"
        ref="dropdown"
        :class="[
          'origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1',
          align === 'right' ? 'right-0' : 'left-0'
        ]"
        @focus="setDropdownOpen(true)"
        @blur="setDropdownOpen(false)"
      >
        <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-4">Notifications</div>
        <ul>
          <li v-for="(notification, index) in notifications" :key="index" class="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
            <router-link
              class="block py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/20"
              :to="notification.link"
              @click="toggleDropdown"
            >
              <span class="block text-sm mb-2">{{ notification.icon }} <span class="font-medium text-gray-800 dark:text-gray-100">{{ notification.title }}</span> {{ notification.description }}</span>
              <span class="block text-xs font-medium text-gray-400 dark:text-gray-500">{{ notification.date }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  align: {
    type: String,
    default: 'left',
  },
});

const dropdownOpen = ref(false);
const trigger = ref(null);
const dropdown = ref(null);

const notifications = [
  {
    icon: '📣',
    title: 'Edit your information in a swipe',
    description: 'Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
    date: 'Feb 12, 2024',
    link: '#0'
  },
  {
    icon: '📣',
    title: 'Edit your information in a swipe',
    description: 'Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
    date: 'Feb 9, 2024',
    link: '#0'
  },
  {
    icon: '🚀',
    title: 'Say goodbye to paper receipts!',
    description: 'Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
    date: 'Jan 24, 2024',
    link: '#0'
  },
];

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