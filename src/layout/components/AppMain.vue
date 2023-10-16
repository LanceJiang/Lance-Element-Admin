<template>
	<section class="app-main">
		<MaximizeQuit v-show="setting.contentMaximize" />
		<Tabs v-show="tabsVisible" />
		<router-view v-slot="{ Component, route }">
			<transition :name="pageAnimateMode" mode="out-in">
				<keep-alive :include="cachedViews">
					<component :is="Component" :key="route.fullPath" />
				</keep-alive>
			</transition>
		</router-view>
		<div v-show="setting.footer" class="le-layout-footer">
			<Footer />
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import useStore from '@/store'
import Footer from '@/layout/components/Footer/index.vue'
import Tabs from '@/layout/components/Tabs/index.vue'
import MaximizeQuit from './MaximizeQuit.vue'
const { tagsView, setting } = useStore()
const tabsVisible = computed(() => setting.tabsVisible)
const cachedViews = computed(() => tagsView.cachedViews)
const pageAnimateMode = computed(() => (setting.animate ? setting.animateMode : undefined))
watch(
	() => setting.contentMaximize,
	() => {
		const app = document.querySelector('#app') as HTMLElement
		if (setting.contentMaximize) app.classList.add('le-app-maximize')
		else app.classList.remove('le-app-maximize')
	},
	{
		immediate: true
	}
)
</script>

<style lang="scss" scoped>
.app-main {
	/* 50= navbar  50  */
	display: flex;
	flex-direction: column;
	//min-height: calc(100vh - 50px);
	min-height: 100%;
	height: 100%;
	width: 100%;
	position: relative;
	//z-index: 0; // 不能有
	overflow: hidden;
	transition: all var(--el-transition-duration);
}

.fixed-header + .app-main {
	padding-top: 50px;
}

.hasTagsView {
	//.app-main {
	//	/* 84 = navbar + tags-view = 50 + 34 */
	//	min-height: calc(100vh - 84px);
	//}

	.fixed-header + .app-main {
		padding-top: 84px;
	}
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
	.fixed-header {
		padding-right: 15px;
	}
}
.layout-footer {
	position: relative;
	z-index: 1;
}
</style>
