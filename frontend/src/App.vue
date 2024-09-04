<template>
  <div id="app" :class="{ 'dark': currentTheme === 'dark' }">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeProvider } from './utils/ThemeContext'; // Adjust the import path as necessary

const route = useRoute();
const { currentTheme } = useThemeProvider();

watch(() => route.path, (newPath) => {
  console.log('Route changed to:', newPath);
  document.querySelector('html').style.scrollBehavior = 'auto';
  window.scroll({ top: 0 });
  document.querySelector('html').style.scrollBehavior = '';
}, { immediate: true });
</script>
