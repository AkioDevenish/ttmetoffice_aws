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
      <span class="sr-only">Need help?</span>
      <svg
        class="fill-current text-gray-500/80 dark:text-gray-400/80"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 7.5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4ZM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
        <path
          fill-rule="evenodd"
          d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm6-8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z"
        />
      </svg>
    </button>

    <Transition name="fade">
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
        <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">Need help?</div>
        <ul>
          <li v-for="item in helpItems" :key="item.text">
            <router-link
              class="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
              :to="item.link"
              @click="toggleDropdown"
            >
              <svg class="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12" v-html="item.icon"></svg>
              <span>{{ item.text }}</span>
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

const helpItems = [
  {
    text: 'Documentation',
    link: '#0',
    icon: '<rect y="3" width="12" height="9" rx="1" /><path d="M2 0h8v2H2z" />',
  },
  {
    text: 'Support Site',
    link: '#0',
    icon: '<path d="M10.5 0h-9A1.5 1.5 0 000 1.5v9A1.5 1.5 0 001.5 12h9a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 0zM10 7L8.207 5.207l-3 3-1.414-1.414 3-3L5 2h5v5z" />',
  },
  {
    text: 'Contact us',
    link: '#0',
    icon: '<path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" />',
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