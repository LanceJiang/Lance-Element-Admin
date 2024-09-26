<template>
	<component :is="LayoutComponents[layout]" />
	<ThemeSettings v-if="showSettings" />
	<!-- 版本校验刷新功能 -->
	<CheckUpdates />
</template>

<script setup lang="ts" name="layout">
import { computed, type Component, onMounted, onUnmounted, nextTick } from 'vue'
import { LayoutType } from '@/store/interface'
import useStore from '@/store'
// import RightPanel from '@/components/RightPanel/index.vue'
import LayoutLeft from './LayoutLeft/index.vue'
import LayoutLeftMix from './LayoutLeftMix/index.vue'
import LayoutTop from './LayoutTop/index.vue'
import LayoutTopMix from './LayoutTopMix/index.vue'
import CheckUpdates from './components/CheckUpdates/index.vue'
import { ThemeSettings } from '@/layout/components'

const LayoutComponents: Record<LayoutType, Component> = {
	left: LayoutLeft,
	leftMix: LayoutLeftMix,
	topMix: LayoutTopMix,
	top: LayoutTop
}
const { setting, app } = useStore()
const layout = computed(() => (app.isMobile ? 'left' : setting.layout))
const showSettings = computed(() => setting.showSettings)
onMounted(() => {
	window.addEventListener('resize', app.updateDevice)
	nextTick(app.updateDevice)
})
onUnmounted(() => {
	window.removeEventListener('resize', app.updateDevice)
})
</script>

<style scoped lang="scss">
.layout {
	min-width: 600px;
}
</style>
