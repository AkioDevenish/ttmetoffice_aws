<template>
  <div>
    <!-- Modal backdrop -->
    <Transition name="fade">
      <div
        v-if="modalOpen"
        class="fixed inset-0 bg-gray-900 bg-opacity-30 z-50 transition-opacity"
        aria-hidden="true"
      ></div>
    </Transition>
    <!-- Modal dialog -->
    <Transition name="fade">
      <div
        v-if="modalOpen"
        :id="id"
        class="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
      >
        <!-- Rest of your modal content -->
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  id: String,
  searchId: String,
  modalOpen: Boolean,
});

const emit = defineEmits(['update:modalOpen']);

const modalContent = ref(null);
const searchInput = ref(null);

const recentSearches = ref([
  'Form Builder - 23 hours on-demand video',
  'Access Mosaic on mobile and TV',
  'Product Update - Q4 2024',
  'Master Digital Marketing Strategy course',
  'Dedicated forms for products',
]);

const recentPages = ref([
  { title: 'Messages', description: 'Conversation / … / Mike Mills' },
  { title: 'Messages', description: 'Conversation / … / Eva Patrick' },
]);

const toggleModal = () => {
  emit('update:modalOpen', !props.modalOpen);
};

const clickHandler = ({ target }) => {
  if (!props.modalOpen || modalContent.value.contains(target)) return;
  emit('update:modalOpen', false);
};

const keyHandler = ({ keyCode }) => {
  if (!props.modalOpen || keyCode !== 27) return;
  emit('update:modalOpen', false);
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
  document.addEventListener('keydown', keyHandler);
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keyHandler);
});

watch(() => props.modalOpen, (newVal) => {
  if (newVal) {
    searchInput.value?.focus();
  }
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