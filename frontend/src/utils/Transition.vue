<template>
  <component
    :is="tag"
    v-show="isShow"
    ref="nodeRef"
    :style="{ display: !removeFromDom && !isShow ? 'none' : null }"
  >
    <slot></slot>
  </component>
</template>

<script>
import { ref, onMounted, provide, inject, computed, watch } from 'vue'

const TransitionSymbol = Symbol('Transition')

export default {
  name: 'Transition',
  props: {
    show: {
      type: Boolean,
      default: undefined
    },
    enter: {
      type: String,
      default: ''
    },
    enterStart: {
      type: String,
      default: ''
    },
    enterEnd: {
      type: String,
      default: ''
    },
    leave: {
      type: String,
      default: ''
    },
    leaveStart: {
      type: String,
      default: ''
    },
    leaveEnd: {
      type: String,
      default: ''
    },
    appear: {
      type: Boolean,
      default: false
    },
    unmountOnExit: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  setup(props) {
    const parent = inject(TransitionSymbol, null)
    const isInitialRender = ref(true)
    const nodeRef = ref(null)
    const removeFromDom = props.unmountOnExit

    const isShow = computed(() => {
      return props.show !== undefined ? props.show : parent?.show.value
    })

    const enterClasses = computed(() => props.enter.split(' ').filter(s => s.length))
    const enterStartClasses = computed(() => props.enterStart.split(' ').filter(s => s.length))
    const enterEndClasses = computed(() => props.enterEnd.split(' ').filter(s => s.length))
    const leaveClasses = computed(() => props.leave.split(' ').filter(s => s.length))
    const leaveStartClasses = computed(() => props.leaveStart.split(' ').filter(s => s.length))
    const leaveEndClasses = computed(() => props.leaveEnd.split(' ').filter(s => s.length))

    const addClasses = (classes) => {
      nodeRef.value?.classList.add(...classes)
    }

    const removeClasses = (classes) => {
      nodeRef.value?.classList.remove(...classes)
    }

    watch(isShow, (newValue, oldValue) => {
      if (newValue === oldValue) return

      if (newValue) {
        if (!removeFromDom) nodeRef.value.style.display = null
        addClasses([...enterClasses.value, ...enterStartClasses.value])
        requestAnimationFrame(() => {
          removeClasses(enterStartClasses.value)
          addClasses(enterEndClasses.value)
          nodeRef.value.addEventListener('transitionend', () => {
            removeClasses([...enterEndClasses.value, ...enterClasses.value])
          }, { once: true })
        })
      } else {
        addClasses([...leaveClasses.value, ...leaveStartClasses.value])
        requestAnimationFrame(() => {
          removeClasses(leaveStartClasses.value)
          addClasses(leaveEndClasses.value)
          nodeRef.value.addEventListener('transitionend', () => {
            removeClasses([...leaveEndClasses.value, ...leaveClasses.value])
            if (!removeFromDom) nodeRef.value.style.display = 'none'
          }, { once: true })
        })
      }
    })

    onMounted(() => {
      isInitialRender.value = false
    })

    provide(TransitionSymbol, {
      show: isShow,
      isInitialRender,
      appear: props.appear
    })

    return {
      nodeRef,
      isShow,
      removeFromDom
    }
  }
}
</script>