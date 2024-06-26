<template>
	<div class="tags-view__container">
		<scroll-pane ref="scrollPaneRef" class="tags-view__wrapper" @scroll="handleScroll">
			<router-link
				v-for="tag in visitedViews"
				:key="tag.path"
				:class="isActive(tag) ? 'active' : ''"
				:to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
				class="tags-view__item"
				@click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
				@contextmenu.prevent="openMenu(tag, $event)"
			>
				{{ generateTitle(tag.meta.title) }}
				<span v-if="!isAffix(tag)" class="icon-close" @click.prevent.stop="closeSelectedTag(tag)">
					<svg-icon icon-class="close" />
				</span>
			</router-link>
		</scroll-pane>
		<ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="tags-view__menu">
			<li @click="refreshSelectedTag(selectedTag)">
				<svg-icon icon-class="refresh" />
				刷新
			</li>
			<li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
				<svg-icon icon-class="close" />
				关闭
			</li>
			<li @click="closeOtherTags">
				<svg-icon icon-class="close_other" />
				关闭其它
			</li>
			<li v-if="!isFirstView()" @click="closeLeftTags">
				<svg-icon icon-class="close_left" />
				关闭左侧
			</li>
			<li v-if="!isLastView()" @click="closeRightTags">
				<svg-icon icon-class="close_right" />
				关闭右侧
			</li>
			<li @click="closeAllTags(selectedTag)">
				<svg-icon icon-class="close_all" />
				关闭所有
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref, watch, onMounted, ComponentInternalInstance } from 'vue'

import path from 'path-browserify'

import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { TagView } from '@/types'

import ScrollPane from './ScrollPane.vue'
import { generateTitle } from '@/utils/i18n'
import useStore from '@/store'

const { tagsView, permission } = useStore()

const { proxy } = getCurrentInstance() as ComponentInternalInstance // 获取当前组件实例
const router = useRouter()
const route = useRoute()

const visitedViews = computed<any>(() => tagsView.visitedViews)
const menuList = computed<any>(() => permission.menuList)

const affixTags = ref([])
const visible = ref(false)
const selectedTag = ref({})
const scrollPaneRef = ref()
const left = ref(0)
const top = ref(0)

watch(route, () => {
	addTags()
	moveToCurrentTag()
})

watch(visible, value => {
	if (value) {
		document.body.addEventListener('click', closeMenu)
	} else {
		document.body.removeEventListener('click', closeMenu)
	}
})

function filterAffixTags(menuList: RouteRecordRaw[], basePath = '/') {
	let tags: TagView[] = []

	menuList.forEach(route => {
		// affix 固定钉子
		if (route.meta && route.meta.affix) {
			const tagPath = path.resolve(basePath, route.path)
			tags.push({
				fullPath: tagPath,
				path: tagPath,
				name: route.name,
				meta: { ...route.meta }
			})
		}

		if (route.children) {
			const childTags = filterAffixTags(route.children, route.path)
			if (childTags.length >= 1) {
				tags = tags.concat(childTags)
			}
		}
	})
	return tags
}

function initTags() {
	const res = filterAffixTags(menuList.value) as []
	affixTags.value = res
	for (const tag of res) {
		// Must have tag name
		if ((tag as TagView).name) {
			tagsView.addVisitedView(tag)
		}
	}
}

function addTags() {
	if (route.name) {
		tagsView.addView(route)
	}
}

function moveToCurrentTag() {
	const tags = getCurrentInstance()?.refs.tag as any[]
	nextTick(() => {
		if (tags === null || tags === undefined || !Array.isArray(tags)) {
			return
		}
		for (const tag of tags) {
			if ((tag.to as TagView).path === route.path) {
				// eslint-disable-next-line @typescript-eslint/no-extra-semi
				;(scrollPaneRef.value as any).value.moveToTarget(tag)
				// when query is different then update
				if ((tag.to as TagView).fullPath !== route.fullPath) {
					tagsView.updateVisitedView(route)
				}
			}
		}
	})
}

function isActive(tag: TagView) {
	return tag.path === route.path
}

function isAffix(tag: TagView) {
	return tag.meta && tag.meta.affix
}

function isFirstView() {
	try {
		return (selectedTag.value as TagView).fullPath === visitedViews.value[1].fullPath || (selectedTag.value as TagView).fullPath === '/index'
	} catch (err) {
		return false
	}
}

function isLastView() {
	try {
		return (selectedTag.value as TagView).fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath
	} catch (err) {
		return false
	}
}

function refreshSelectedTag(view: TagView) {
	tagsView.delCachedView(view)
	const { fullPath } = view
	nextTick(() => {
		router.replace({ path: '/redirect' + fullPath }).catch(err => {
			console.warn(err)
		})
	})
}

function toLastView(visitedViews: TagView[], view?: any) {
	const latestView = visitedViews.slice(-1)[0]
	if (latestView && latestView.fullPath) {
		router.push(latestView.fullPath)
	} else {
		// now the default is to redirect to the home page if there is no tags-view,
		// you can adjust it according to your needs.
		if (view.name === 'Dashboard') {
			// to reload home page
			router.replace({ path: '/redirect' + view.fullPath })
		} else {
			router.push('/')
		}
	}
}

function closeSelectedTag(view: TagView) {
	tagsView.delView(view).then((res: any) => {
		if (isActive(view)) {
			toLastView(res.visitedViews, view)
		}
	})
}

function closeLeftTags() {
	tagsView.delLeftViews(selectedTag.value).then((res: any) => {
		if (!res.visitedViews.find((item: any) => item.fullPath === route.fullPath)) {
			toLastView(res.visitedViews)
		}
	})
}
function closeRightTags() {
	tagsView.delRightViews(selectedTag.value).then((res: any) => {
		if (!res.visitedViews.find((item: any) => item.fullPath === route.fullPath)) {
			toLastView(res.visitedViews)
		}
	})
}

function closeOtherTags() {
	tagsView.delOtherViews(selectedTag.value).then(() => {
		moveToCurrentTag()
	})
}

function closeAllTags(view: TagView) {
	tagsView.delRightViews(selectedTag.value).then((res: any) => {
		if (affixTags.value.some((tag: any) => tag.path === route.path)) {
			return
		}
		toLastView(res.visitedViews, view)
	})
}

function openMenu(tag: TagView, e: MouseEvent) {
	const menuMinWidth = 105
	const offsetLeft = proxy?.$el.getBoundingClientRect().left // container margin left
	const offsetWidth = proxy?.$el.offsetWidth // container width
	const maxLeft = offsetWidth - menuMinWidth // left boundary
	const l = e.clientX - offsetLeft + 15 // 15: margin right

	if (l > maxLeft) {
		left.value = maxLeft
	} else {
		left.value = l
	}
	top.value = e.clientY - 40
	visible.value = true
	selectedTag.value = tag
}

function closeMenu() {
	visible.value = false
}

function handleScroll() {
	closeMenu()
}

onMounted(() => {
	initTags()
	addTags()
})
</script>

<style lang="scss" scoped>
.tags-view__container {
	position: relative;
	z-index: 1;
	height: 34px;
	width: 100%;
	background-color: var(--el-bg-color);
	//border-bottom: 1px solid #d8dce5;
	//border-bottom: 1px solid var(--el-border-color-light);
	box-shadow: 0 1px 4px -1px var(--el-border-color-light);
	//box-shadow: 0 1px 2px #00152914;
	.tags-view__wrapper {
		.tags-view__item {
			//display: inline-block;
			display: inline-flex;
			align-items: center;
			position: relative;
			cursor: pointer;
			height: 26px;
			line-height: 26px;
			//border: 1px solid #d8dce5;
			border: 1px solid var(--el-border-color);
			color: #495060;
			//background: #fff;
			background-color: var(--el-bg-color);
			padding: 0 8px;
			font-size: 12px;
			margin-left: 5px;
			margin-top: 4px;

			&:first-of-type {
				margin-left: 15px;
			}

			&:last-of-type {
				margin-right: 15px;
			}

			&:hover {
				color: var(--el-color-primary);
			}

			&.active {
				background-color: var(--el-color-primary-light-9);
				color: var(--el-color-primary);
			}

			.icon-close {
				margin-left: 4px;
				border-radius: 50%;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border: 1px solid transparent;
				width: 14px;
				height: 14px;
				//text-align: center;

				&:hover {
					//background-color: #ccc;
					//color: #fff;
					border-color: var(--el-color-primary);
					/*background-color: var(--el-button-hover-bg-color);
					color: var(--el-button-hover-text-color);*/
					/*background-color: var(--el-border-color-lighter);
					color: var(--el-text-color-primary);*/
				}
			}
		}
	}

	.tags-view__menu {
		margin: 0;
		background: #fff;
		z-index: 3000;
		position: absolute;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

		li {
			margin: 0;
			padding: 7px 16px;
			cursor: pointer;

			&:hover {
				background: #eee;
			}
		}
	}
}
</style>
