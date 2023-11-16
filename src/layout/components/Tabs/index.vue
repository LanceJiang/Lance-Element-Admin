<template>
	<div class="le-tabs-menu-wrap">
		<div class="tabs-menu">
			<el-tabs v-model="tabsMenuValue" :class="tabsModeClass" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane v-for="item in tabsMenuList" :key="item.path" :label="item.fullPath" :name="item.path" :item="item" :closable="!item.meta.affix">
					<template #label>
						<!--@click="tabClick2(item)"-->
						<div class="le-tabs__item" @contextmenu.prevent="openDropMenu(item, $event)">
							<PickerIcon v-if="tabsIcon && item.meta?.icon" class="tabs-icon" :icon-class="item.meta.icon" />
							{{ generateTitle(item.title) }}
						</div>
					</template>
				</el-tab-pane>
			</el-tabs>
			<ul v-show="dropVisible" ref="dropdownMenu" :style="`left: ${dropLeft}px; top: ${dropTop}px`" class="local-contextmenu el-dropdown-menu">
				<li class="el-dropdown-menu__item" @click="contentMaximizeChange">
					<le-icon icon-class="icon-fullscreen"></le-icon>
					<span>{{ $t('le.tabs.opts.contentMax') }}</span>
				</li>
				<li class="el-dropdown-menu__item" @click="refreshSelectedTag(selectedTag)">
					<le-icon icon-class="icon-refresh"></le-icon>
					<span>{{ $t('le.refresh') }}</span>
				</li>
				<li role="separator" class="el-dropdown-menu__item--divided"></li>
				<li class="el-dropdown-menu__item" @click="closeOtherTags">
					<le-icon icon-class="icon-close_other" style="transform: rotate(90deg)"></le-icon>
					<span>{{ $t('le.tabs.opts.closeOther') }}</span>
				</li>
				<li v-if="!isFirstView" class="el-dropdown-menu__item" @click="closeSideTags('left')">
					<le-icon icon-class="icon-close_left"></le-icon>
					<span>{{ $t('le.tabs.opts.closeOther') }}</span>
				</li>
				<li v-if="!isLastView" class="el-dropdown-menu__item" @click="closeSideTags('right')">
					<le-icon icon-class="icon-close_right"></le-icon>
					<span>{{ $t('le.tabs.opts.closeRight') }}</span>
				</li>
				<li class="el-dropdown-menu__item" @click="closeAllTags">
					<le-icon icon-class="icon-close_all"></le-icon>
					<span>{{ $t('le.tabs.opts.closeAll') }}</span>
				</li>
			</ul>

			<el-dropdown popper-class="le-tabs-fast-dropdown-popper" trigger="hover" @visible-change="fastDropVisibleChange">
				<div class="fast-drop-wrap">
					<span class="fast-drop-button"><i class="box box-t"></i><i class="box box-b"></i></span>
					<!--					<i :class="'iconfont icon-xiala'"></i>-->
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="contentMaximizeChange">
							<le-icon icon-class="icon-fullscreen"></le-icon>
							<span>{{ $t('le.tabs.opts.contentMax') }}</span>
						</el-dropdown-item>
						<el-dropdown-item @click="refreshSelectedTag(selectedTag)">
							<le-icon icon-class="icon-refresh"></le-icon>
							<span>{{ $t('le.refresh') }}</span>
						</el-dropdown-item>
						<el-dropdown-item divided @click="closeOtherTags">
							<le-icon icon-class="icon-close_other" style="transform: rotate(90deg)"></le-icon>
							<span>{{ $t('le.tabs.opts.closeOther') }}</span>
						</el-dropdown-item>
						<el-dropdown-item v-if="!isFirstView" @click="closeSideTags('left')">
							<le-icon icon-class="icon-close_left"></le-icon>
							<span>{{ $t('le.tabs.opts.closeOther') }}</span>
						</el-dropdown-item>
						<el-dropdown-item v-if="!isLastView" @click="closeSideTags('right')">
							<le-icon icon-class="icon-close_right"></le-icon>
							<span>{{ $t('le.tabs.opts.closeRight') }}</span>
						</el-dropdown-item>
						<el-dropdown-item @click="closeAllTags">
							<le-icon icon-class="icon-close_all"></le-icon>
							<span>{{ $t('le.tabs.opts.closeAll') }}</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script setup lang="ts">
import Sortable from 'sortablejs'
import { generateTitle } from '@/utils/i18n'
import { ref, computed, watch, onMounted, getCurrentInstance, ComponentInternalInstance, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PickerIcon from '@/components/IconPicker/PickerIcon.vue'
import { TabsPaneContext, TabPaneName } from 'element-plus'
// import { AppRouteRecordRaw } from '@/router/types'
import useStore from '@/store'
import { TagView } from '@/types'

const { proxy } = getCurrentInstance() as ComponentInternalInstance // 获取当前组件实例
const route = useRoute()
const router = useRouter()
const { tagsView, setting, permission } = useStore()
const tabsMenuValue = ref(route.fullPath)
const tabsMenuList = computed(() => tagsView.visitedViews)
const tabsIcon = computed(() => setting.tabsIcon)
const tabsModeClass = computed(() => {
	return `tabs-${setting.tabsMode}`
})
const selectedTag = ref<any>({})
const dropVisible = ref(false)
const dropLeft = ref(0)
const dropTop = ref(0)
const isAffix = (tag: TagView) => {
	return tag.meta && tag.meta.affix
}
// todo TagView
const isActive = (tag: TagView) => {
	return tag.path === route.path
}
const isFirstView = computed(() => {
	try {
		const cur_path = selectedTag.value.path as string
		const curIdx = tabsMenuList.value.findIndex(v => v.path === cur_path)
		// console.error(cur_path, 'cur curIdx', curIdx)
		return tabsMenuList.value.slice(0, curIdx).every(v => {
			return v.meta?.affix
		})
	} catch (err) {
		return false
	}
})

const isLastView = computed(() => {
	try {
		const cur_path = selectedTag.value.path as string
		return cur_path === tabsMenuList.value[tabsMenuList.value.length - 1].path
	} catch (err) {
		return false
	}
})
// delAllViews
const addTab = () => {
	if (route.name) {
		tagsView.addView(route)
		tabsMenuValue.value = route.path
	}
}
onMounted(() => {
	tabsDrop()
	initTabs()
	addTab()
})

watch(route, () => {
	addTab()
	// console.error(route, 'cur route')
})

// 多页签初始化
const initTabs = () => {
	// 初始化: 将固定的 tabs(多页签)
	// const affixTabs = []
	permission.showMenuList.forEach(route => {
		const meta = route.meta || {}
		// affix 固定钉子
		if (meta?.affix && !meta.hidden) {
			const affixItem = {
				fullPath: route.path,
				path: route.path,
				name: route.name,
				meta: route.meta
			}
			tagsView.addView(affixItem)
		}
	})
}

// 标签 拖拽排序
const tabsDrop = () => {
	Sortable.create(document.querySelector('.el-tabs__nav') as HTMLElement, {
		// draggable: '.el-tabs__item',
		draggable: '.el-tabs__item.is-closable', // .is-closable 表示可以关闭(非affix)
		animation: 200,
		onEnd({ newIndex, oldIndex }) {
			const tabsList = [...tagsView.visitedViews]
			const currRow = tabsList.splice(oldIndex as number, 1)[0]
			tabsList.splice(newIndex as number, 0, currRow)
			tagsView.setViews(tabsList)
		},
		onMove(event: any) {
			console.log(event.related, 'onMove', event.relatedRect)
			return event.related.className.indexOf('is-closable') !== -1
		}
	})
}
window.router = router
// Tab Click
const tabClick = (tabItem: TabsPaneContext) => {
	const fullPath = tabItem.props.label as string
	router.push(fullPath)
}

/*const tabClick2 = (tabItem: any) => {
	console.error(tabItem, 'tabClick2 tabItem')
	// const fullPath = tabItem.props.name as string
	const routeParams = {
		path: tabItem.path,
		fullPath: tabItem.fullPath,
		query: tabItem.query
	}
	router.push(routeParams)
}*/

// Remove Tab
const tabRemove = (path: TabPaneName) => {
	console.error('tabRemove', path)
	const curTab = tabsMenuList.value.find(v => v.path === path)
	tagsView.delView(curTab).then((res: any) => {
		// if (isActive(curTab)) {
		if (path === route.path) {
			toLastView(res.visitedViews, curTab)
		}
	})
}

function toLastView(visitedViews: TagView[], view?: any) {
	const latestView = visitedViews.slice(-1)[0]
	if (latestView && latestView.fullPath) {
		router.push(latestView.fullPath)
	} else {
		// now the default is to redirect to the home page if there is no tags-view,
		// you can adjust it according to your needs.
		if (view.name === 'dashboard') {
			// to reload home page
			router.replace({ path: '/redirect' + view.fullPath })
		} else {
			router.push('/')
		}
	}
}

function openDropMenu(tag: TagView, e: MouseEvent) {
	// console.error(tag, e, 'test openDropMenu')
	const menuMinWidth = 107
	const el_rect = proxy?.$el.getBoundingClientRect()
	const offsetWidth = proxy?.$el.offsetWidth // container width
	const maxLeft = offsetWidth - menuMinWidth // left boundary
	const l = e.clientX - el_rect.left + 15 // 15: margin right
	const t = e.clientY - el_rect.top + 8 // 8: margin top
	if (l > maxLeft) {
		dropLeft.value = maxLeft
	} else {
		dropLeft.value = l
	}
	dropTop.value = t
	dropVisible.value = true
	selectedTag.value = tag
}
const fastDropVisibleChange = (visible: boolean) => {
	if (visible) {
		const activeTag = tabsMenuList.value.find(v => v.fullPath === route.fullPath)
		if (activeTag) {
			selectedTag.value = activeTag
		}
		dropVisible.value = false
	}
}

watch(dropVisible, value => {
	if (value) {
		document.body.addEventListener('click', closeDrop)
	} else {
		document.body.removeEventListener('click', closeDrop)
	}
})
const closeDrop = () => {
	dropVisible.value = false
}

// 刷新
function refreshSelectedTag(view: TagView) {
	tagsView.delCachedView(view)
	const { fullPath } = view
	nextTick(() => {
		router.replace({ path: '/redirect' + fullPath }).catch(err => {
			console.warn(err)
		})
	})
}

// 关闭其他
function closeOtherTags() {
	tagsView.delOtherViews(selectedTag.value).then(() => {
		// moveToCurrentTag()
		const remain = tagsView.visitedViews
		const hasTab = remain.some(v => v.path === route.path)
		if (!hasTab) {
			toLastView(tagsView.visitedViews, selectedTag.value)
			// const activePath = remain[remain.length - 1].fullPath
			// router.push(activePath)
		}
	})
}

function closeSideTags(side: 'left' | 'right' = 'left') {
	tagsView.closeSideTags(selectedTag.value, side).then((res: any) => {
		// console.error(res.visitedViews, 'visitedViews')
		if (!res.visitedViews.find((item: any) => item.path === route.path)) {
			toLastView(res.visitedViews)
		}
	})
}

function closeAllTags() {
	tagsView.delAllViews().then((res: any) => {
		// console.error(res.visitedViews, 'visitedViews')
		if (!res.visitedViews.find((item: any) => item.path === route.path)) {
			toLastView(res.visitedViews)
		}
	})
}

const contentMaximizeChange = () => {
	setting.contentMaximize = !setting.contentMaximize
}
</script>

<style lang="scss">
$transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), border 0s, color 0.1s, font-size 0s;
.#{$prefix}tabs-menu-wrap {
	background-color: var(--el-bg-color);

	.sortable-ghost {
		box-shadow: inset 1px 1px 5px 2px rgba(0, 0, 0, 0.15);
		transition: 0.18s ease;
	}

	.sortable-chosen {
		//box-shadow: 1px 1px 5px 2px rgba(0,0,0,.15);
		box-shadow: inset 0 0 6px -2px rgba(0, 0, 0, 0.15);
	}

	.tabs-menu {
		position: relative;
		width: 100%;

		.el-dropdown {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 1;

			/*.fast-drop-button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 43px;
				cursor: pointer;
				border-left: 1px solid var(--el-border-color-light);
				transition: all 0.3s;

				&:hover {
					background-color: var(--el-color-info-light-9);
				}

				.iconfont {
					font-size: 12.5px;
				}
			}*/
		}

		.el-tabs {
			.el-tabs__header {
				box-sizing: border-box;
				height: 40px;
				padding: 0 10px;
				//padding: 0;
				margin: 0;
				border-bottom: 0;
				//box-shadow: 0 1px 4px -1px var(--el-border-color-light);
				box-shadow: 0 -1px 0 2px var(--el-border-color-light);
				z-index: 1;
				/*.el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: 40px;
        }*/
				.el-tabs__nav-wrap {
					position: absolute;
					width: calc(100% - 50px);

					.el-tabs__nav {
						display: flex;
						border: none;

						.el-tabs__item {
							display: flex;
							align-items: center;
							justify-content: center;
							color: var(--el-text-color-regular);
							padding: 0 20px;
							//padding: 0 !important;
							border: 0;

							.le-tabs__item {
								height: 100%;
								display: inline-flex;
								align-items: center;
								/* &:nth-child(2):not(.is-active).is-closable:hover {
                  padding-left: 0;
                }*/
								//padding: 0 20px;
								//margin: 0 -20px;
							}

							/*
              .is-icon-close {
                //right: -2px;
                right: 18px;
                //margin-left: -20px;
              }*/
							.tabs-icon {
								margin: 1.5px 4px 0 0;
								font-size: 15px;
							}

							.is-icon-close {
								margin-top: 1px;
							}

							.is-icon-close {
								&:hover {
									background-color: var(--el-color-primary-light-3);
								}
							}

							&:hover {
								color: var(--el-color-primary);
							}

							&.is-active {
								color: var(--el-color-primary) !important;
								background: var(--el-color-primary-light-9);

								.is-icon-close {
									&:hover {
										background-color: var(--el-color-primary);
									}
								}
							}
						}
					}
				}
			}

			// 风格1 谷歌风格
			&.tabs-chrome {
				.el-tabs__header {
					/*.el-tabs__nav-next,
          .el-tabs__nav-prev {
            line-height: 52px;
          }*/
					.el-tabs__nav-wrap {
						.el-tabs__nav {
							.el-tabs__item {
								margin-left: -12px;
								/*border-bottom: 0;
                &::before {
                  display: none;
                }*/
								&:first-child {
									margin-left: 0;
								}

								&:hover {
									z-index: 1;
									background: var(--el-border-color-light);
									color: var(--el-color-primary-light-3);
								}

								margin-top: 6px;
								//height: 36px;
								height: calc(var(--el-tabs-header-height) - 6px);
								mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAkCAYAAADvhSSyAAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nO3d4U3CUBSG4beJA9QNcAJhAtnAOoGOwCaOoBvoCDgBOIHdQDbAH7cJMaHtxcJB6/skJ6Thptw/H+cSktOCn5kCc+AWKJtraaxqYA28A8/N9cktgE9ga1n/tBYcqDhw/QtQHfoh0gitgdkpbrzg/N8klvWbKruz5Xa0CbAi/R6TtDMjdbdOF5k3qzBk0j4VRwzazbC9SKN1nbMo9+j4QTo+SvpuA1z2LcoN2nbYXqRR681R7tFR0gAGTQpg0KQABk0KYNCkAAZNCmDQpAAGTQpg0KQABk0KYNCkAAZNCmDQpAAGTQpg0KQABk0KYNCkAAZNGq4kjTRolRM0x31L3Sb0TMLKCZqTiaVu9/QErW+oyAQHp0p9NqRBqnXbgq6glcATdjQpRw1ctb3ZFrQSeAQejr8fabRegbvcxXPScfHcDxCwrL9YK/Y0qILdgwSnpNHfHhWl4ZbAW/O6LEgplHRC/mEtBfgClkhxraFbr7gAAAAASUVORK5CYII=);
								//mask-size: 100% 100%;
								mask-size: 100% calc(100% + 1px);
								mask-repeat: no-repeat;
								//mask-position: bottom;

								&.is-active {
									background: var(--el-color-primary-light-9);

									.is-icon-close {
										&:hover {
											background-color: var(--el-color-primary);
										}
									}
								}
							}
						}
					}
				}
			}

			// 风格2 卡片风格
			&.tabs-card {
				.el-tabs__header {
					.el-tabs__nav-wrap {
						.el-tabs__nav {
							.el-tabs__item {
								border: 1px solid var(--el-border-color);
								border-radius: 4px;
								margin-left: 4px;

								&:first-child {
									margin-left: 0;
								}

								&:hover {
									color: var(--el-color-primary);
									border-color: var(--el-color-primary-light-7);
								}

								margin-top: 6px;
								//height: 36px;
								height: calc(var(--el-tabs-header-height) - 12px);
								padding: 0 4px;
								/*.le-tabs__item {
                  padding: 0 4px;
                }*/
								&.is-active {
									background-color: var(--el-color-primary-light-9);

									.is-icon-close {
										&:hover {
											background-color: var(--el-color-primary);
										}
									}

									color: var(--el-color-primary);
									border-color: var(--el-color-primary-light-5);
								}
							}
						}
					}
				}
			}

			// 风格3 矩形
			&.tabs-rectangle {
				.el-tabs__header {
					.el-tabs__nav-wrap {
						.el-tabs__nav {
							.el-tabs__item {
								//margin-left: 2px;
								transition: $transition;

								&:first-child {
									margin-left: 0;
								}

								&::before {
									position: absolute;
									bottom: 0;
									left: 0;
									width: 0;
									height: 0;
									content: '';
									//border-bottom: 2px solid var(--el-color-primary-light-5);
									border-bottom: 2px solid var(--el-color-primary);
									transition: $transition;
								}

								&:hover {
									&::before {
										width: 100%;
										transition: $transition;
									}
									//background: var(--el-border-color-lighter);
									background: var(--el-fill-color-light);
								}

								&.is-active {
									background: var(--el-color-primary-light-9);

									&::before {
										width: 100%;
										border-bottom-color: var(--el-color-primary);
									}

									.is-icon-close {
										&:hover {
											background-color: var(--el-color-primary);
										}
									}

									color: var(--el-color-primary);
								}
							}
						}
					}
				}
			}
		}
	}

	.local-contextmenu {
		//--el-dropdown-menu-box-shadow: var(--el-box-shadow-light);
		//box-shadow: var(--el-dropdown-menu-box-shadow);
		box-shadow: var(--el-box-shadow-light);
		position: absolute;
		//position: fixed;
		top: 0;
		left: 0;
		z-index: 10;

		.el-dropdown-menu__item {
			//padding: 4px 12px;
			/*.le-icon {
				margin-right: 5px;
			}*/

			&:hover {
				color: var(--el-color-primary);
				background-color: var(--el-color-primary-light-9);
			}
		}
		.el-dropdown-menu__item {
			//padding: 4px 12px;
			.le-icon {
				margin-right: 5px;
			}
		}
		.el-dropdown-menu__item--divided {
			margin: 2px 0;
		}
	}
	.fast-drop-wrap {
		position: relative;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		&:hover,
		&[aria-expanded='true'] {
			.fast-drop-button {
				transform: rotate(90deg);
				.box-t:before {
					transform: rotate(45deg);
				}
				.box:before,
				.box:after {
					background: var(--el-color-primary);
				}
			}
		}
	}
	.fast-drop-button {
		display: inline-block;
		color: var(--el-text-color-regular);
		cursor: pointer;
		transition: transform 0.3s ease-out;
		.box {
			position: relative;
			display: block;
			width: 14px;
			height: 8px;
			&::before {
				position: absolute;
				top: 2px;
				left: 0;
				width: 6px;
				height: 6px;
				content: '';
				background: var(--el-text-color-regular);
			}
			&::after {
				position: absolute;
				top: 2px;
				left: 8px;
				width: 6px;
				height: 6px;
				content: '';
				background: var(--el-text-color-regular);
			}
		}
		.box-t::before {
			transition: transform 0.3s ease-out 0.3s;
		}
	}
}
.le-tabs-fast-dropdown-popper {
	.el-dropdown-menu__item {
		//padding: 4px 12px;
		.le-icon {
			margin-right: 5px;
		}
	}
	.el-dropdown-menu__item--divided {
		margin: 2px 0;
	}
}
</style>
