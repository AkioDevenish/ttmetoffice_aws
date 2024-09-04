<template>
  <div :class="{ 'dark': isDark }">
    <slot></slot>
  </div>
</template>

<script>
import { ref, provide, onMounted } from 'vue';

export default {
  name: 'ThemeProvider',
  setup() {
    const isDark = ref(false);

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    };

    provide('theme', {
      isDark,
      toggleTheme
    });

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark.value = savedTheme === 'dark';
      } else {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    });

    return {
      isDark
    };
  }
};
</script>