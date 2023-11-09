<template>
	<component :is="LayoutComponents[layout]" />
	<ThemeSettings v-if="showSettings" />
</template>

<script setup lang="ts" name="layout">
import { computed, type Component } from 'vue'
import { LayoutType } from '@/store/interface'
import useStore from '@/store'
// import RightPanel from '@/components/RightPanel/index.vue'
import LayoutLeft from './LayoutLeft/index.vue'
import LayoutLeftMix from './LayoutLeftMix/index.vue'
import LayoutTop from './LayoutTop/index.vue'
import LayoutTopMix from './LayoutTopMix/index.vue'
import { ThemeSettings } from '@/layout/components'

const LayoutComponents: Record<LayoutType, Component> = {
	left: LayoutLeft,
	leftMix: LayoutLeftMix,
	topMix: LayoutTopMix,
	top: LayoutTop
}
const { setting } = useStore()
const layout = computed(() => setting.layout)
const showSettings = computed(() => setting.showSettings)
</script>

<style scoped lang="scss">
.layout {
	min-width: 600px;
}
</style>
