<template>
  <div v-if="bannerOpen" class="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-50">
    <div class="bg-gray-800 border border-transparent dark:border-gray-700/60 text-gray-50 text-sm p-3 md:rounded shadow-lg flex justify-between">
      <div class="text-gray-500 inline-flex">
        <a class="font-medium hover:underline text-gray-50" :href="liteLink" target="_blank" rel="noreferrer">
          Download<span class="hidden sm:inline"> on GitHub</span>
        </a>
        <span class="italic px-1.5">or</span>
        <a class="font-medium hover:underline text-emerald-400" href="https://cruip.com/mosaic/" target="_blank" rel="noreferrer">
          Check Premium Version
        </a>
      </div>
      <button class="text-gray-500 hover:text-gray-400 pl-2 ml-3 border-l border-gray-700/60" @click="bannerOpen = false">
        <span class="sr-only">Close</span>
        <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 16 16">
          <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Banner',
  setup() {
    const bannerOpen = ref(true)
    const route = useRoute()

    const liteLink = computed(() => {
      const template = route.query.template
      return template === 'laravel'
        ? 'https://github.com/cruip/laravel-tailwindcss-admin-dashboard-template'
        : 'https://github.com/cruip/tailwind-dashboard-template'
    })

    return {
      bannerOpen,
      liteLink
    }
  }
}
</script>