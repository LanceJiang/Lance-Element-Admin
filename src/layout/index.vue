<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
	<component :is="LayoutComponents[layout]" />
	<!--	<ThemeDrawer />-->
	<RightPanel v-if="showSettings">
		<Settings />
	</RightPanel>
</template>

<script setup lang="ts" name="layout">
import { computed, type Component } from 'vue'
import { LayoutType } from '@/store/interface'
// import { AppMain, Navbar, Settings, TagsView } from './components/index'
import useStore from '@/store'
// import { useGlobalStore } from "@/stores/modules/global";
// import ThemeDrawer from './components/ThemeDrawer/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import LayoutClassic from './LayoutClassic/index.vue'
import LayoutTransverse from './LayoutTransverse/index.vue'
import LayoutVertical from './LayoutVertical/index.vue'
import LayoutColumns from './LayoutColumns/index.vue'
import { Settings } from '@/layout/components'

const LayoutComponents: Record<LayoutType, Component> = {
	classic: LayoutClassic,
	transverse: LayoutTransverse,
	vertical: LayoutVertical,
	columns: LayoutColumns
}
const { setting } = useStore()
// const globalStore = useGlobalStore();
// const layout = computed(() => setting.layout)
const layout = computed(() => setting.layout)
const showSettings = computed(() => setting.showSettings)
</script>

<style scoped lang="scss">
.layout {
	min-width: 600px;
}
</style>
