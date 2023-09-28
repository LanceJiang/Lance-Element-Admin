<template>
	<section class="app-main">
		<TagsView v-show="needTagsView" />
		<router-view v-slot="{ Component, route }">
			<transition :name="pageAnimateMode" mode="out-in">
				<keep-alive :include="cachedViews">
					<component :is="Component" :key="route.fullPath" />
				</keep-alive>
			</transition>
		</router-view>
		<div class="layout-footer" v-show="setting.footer">
			<Footer />
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useStore from '@/store'
import Footer from '@/layout/components/Footer/index.vue'
import TagsView from '@/layout/components/TagsView/index.vue'
const { tagsView, setting } = useStore()
const needTagsView = computed(() => setting.tagsView)
const cachedViews = computed(() => tagsView.cachedViews)
const pageAnimateMode = computed(() => setting.animate ? setting.animateMode : undefined)
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
