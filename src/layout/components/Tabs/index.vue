<template>
	<div class="tags-view-wrap">
		<div class="tabs-menu">
			<el-tabs v-model="tabsMenuValue" :class="tabsModeClass" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane v-for="item in tabsMenuList" :key="item.path" :label="item.fullPath" :name="item.path" :item="item" :closable="!item.meta.affix">
					<template #label>
						<!--@click="tabClick2(item)"-->
						<div class="le-tabs__item">
							<PickerIcon v-if="tabsIcon && item.meta?.icon" class="tabs-icon" :icon-class="item.meta.icon" />
							{{ generateTitle(item.title) }}
						</div>
					</template>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
import Sortable from 'sortablejs'
import { generateTitle } from '@/utils/i18n'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PickerIcon from '@/components/IconPicker/PickerIcon.vue'
import { TabsPaneContext, TabPaneName } from 'element-plus'
import { AppRouteRecordRaw } from '@/router/types'
import useStore from '@/store'
import { TagView } from '@/types'

const route = useRoute()
const router = useRouter()
const { tagsView, setting, permission } = useStore()
const tabsMenuValue = ref(route.fullPath)
const tabsMenuList = computed(() => tagsView.visitedViews)
const tabsIcon = computed(() => setting.tabsIcon)
const tabsModeClass = computed(() => {
	return `tabs-${setting.tabsMode}`
})
const isAffix = (tag: TagView) => {
	return tag.meta && tag.meta.affix
}
const isActive = (tag: TagView) => {
	return tag.path === route.path
}
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
		onMove(event) {
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
</script>

<style lang="scss">
$transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), border 0s, color 0.1s, font-size 0s;
.tags-view-wrap {
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
			.more-button {
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
			}
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
					width: calc(100% - 70px);
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
							/*.le-tabs__item {
               !* &:nth-child(2):not(.is-active).is-closable:hover {
                  padding-left: 0;
                }*!
                padding: 0 20px;
                //margin: 0 -20px;
              }
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
									//background: var(--el-color-primary-light-9);
									background: var(--el-border-color-light);
									//color: var(--el-color-primary-light-3);
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
}
</style>
