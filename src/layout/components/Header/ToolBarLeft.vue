<template>
	<div class="tool-bar-lf">
		<CollapseIcon id="collapseIcon" />
		<Breadcrumb v-show="setting.breadcrumb" id="breadcrumb" />
	</div>
</template>

<script setup lang="ts">
// import { useGlobalStore } from '@/stores/modules/global'
import useStore from '@/store'
import CollapseIcon from './components/CollapseIcon.vue'
import Breadcrumb from './components/Breadcrumb.vue'
const { setting } = useStore()
</script>

<style scoped lang="scss">
.tool-bar-lf {
	display: flex;
	align-items: center;
	justify-content: center;
  height: 100%;
	overflow: hidden;
	white-space: nowrap;
}
</style>
