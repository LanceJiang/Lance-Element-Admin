<template>
	<p>default (默认使用collapse-tags)</p>
  <LeSelect
    v-model="value"
    :options="options"
    placeholder="Please select"
    style="width: 240px"
    multiple
  />
	<p>使用 collapse-tags-tooltip</p>
  <LeSelect
    v-model="value"
    :options="options"
    placeholder="Please select"
    style="width: 240px"
		collapseTagsTooltip
    multiple
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const value = ref([])
const options = ref(
  Array.from({ length: 1000 }).map((_, idx) => ({
    value: `value ${idx + 1}`,
    label: `${initials[idx % 10]}${idx}`,
  }))
)
</script>
