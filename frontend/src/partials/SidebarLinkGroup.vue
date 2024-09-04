<template>
  <li :class="[
    'pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))]',
    { 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]': activecondition }
  ]">
    <slot :handleClick="handleClick" :open="open"></slot>
  </li>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SidebarLinkGroup',
  props: {
    activecondition: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const open = ref(props.activecondition)

    const handleClick = () => {
      open.value = !open.value
    }

    return {
      open,
      handleClick
    }
  }
}
</script>