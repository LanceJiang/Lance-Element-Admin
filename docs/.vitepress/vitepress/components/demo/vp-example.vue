<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const props = defineProps({
  file: {
    type: String,
    required: true,
  },
  demo: {
    // type: Object,
    type: Function,
    required: true,
  },
})
const AsyncComp = defineAsyncComponent(props.demo)
// console.error(props.demo, 'demo, file', props.file)
</script>

<template>
  <div class="example-showcase">
    <ClientOnly>
      <component :is="AsyncComp" v-if="AsyncComp" v-bind="$attrs" />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.example-showcase {
  padding: 1.5rem;
  margin: 0.5px;
  background-color: var(--bg-color);
}
</style>
