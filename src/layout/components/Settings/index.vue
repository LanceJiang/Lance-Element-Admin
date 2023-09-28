<template>
	<div class="drawer-container">
		<h3 class="drawer-title">主题配置</h3>
		<el-scrollbar class="drawer-content">
			<el-divider class="local-divider">
				<el-icon><Operation /></el-icon>主题模式
			</el-divider>
			<div class="drawer-item">
				<span>主题颜色</span>
				<theme-picker @change="themeChange" />
			</div>
			<div class="drawer-item" @click.stop="">
				<span>暗黑主题</span>
				<el-switch v-model="isDark" inline-prompt active-icon="Sunny" inactive-icon="Moon" @change="switchDark" />
			</div>
			<div class="drawer-item" @click.stop="">
				<span>灰色模式</span>
				<el-switch v-model="isGrey" inline-prompt @change="changeGreyOrWeak('grey', $event)" />
			</div>
			<div class="drawer-item" @click.stop="">
				<span>色弱模式</span>
				<el-switch v-model="isWeak" inline-prompt @change="changeGreyOrWeak('weak', $event)" />
			</div>
			<div class="drawer-item">
				<span>侧边栏深色</span>
				<el-switch v-model="asideInverted" @change="setAsideTheme" />
			</div>
			<div class="drawer-item">
				<span>头部深色</span>
				<el-switch v-model="headerInverted" @change="setHeaderTheme" />
			</div>
			<div v-show="footer" class="drawer-item">
				<span>底部深色</span>
				<el-switch v-model="footerInverted" @change="setFooterTheme" />
			</div>

			<el-divider class="local-divider">
				<el-icon><Menu /></el-icon>布局模式
			</el-divider>
			<div class="layout-box">
				<el-tooltip effect="dark" content="左侧菜单模式" placement="top" :show-after="200">
					<div :class="['layout-item layout-left', { 'is-active': layout == 'left' }]" @click="setLayout('left')">
						<div class="layout-light"></div>
						<div class="layout-container">
							<div class="layout-dark"></div>
							<div class="layout-content"></div>
						</div>
						<el-icon v-if="layout == 'left'">
							<CircleCheckFilled />
						</el-icon>
					</div>
				</el-tooltip>
				<el-tooltip effect="dark" content="左侧菜单混合模式" placement="top" :show-after="200">
					<div :class="['layout-item layout-leftMix', { 'is-active': layout == 'leftMix' }]" @click="setLayout('leftMix')">
						<div class="layout-light"></div>
						<div class="layout-light light-2"></div>
						<div class="layout-container">
							<div class="layout-dark"></div>
							<div class="layout-content"></div>
						</div>
						<el-icon v-if="layout == 'leftMix'">
							<CircleCheckFilled />
						</el-icon>
					</div>
				</el-tooltip>
				<el-tooltip effect="dark" content="顶部菜单模式" placement="top" :show-after="200">
					<div :class="['layout-item layout-top', { 'is-active': layout == 'top' }]" @click="setLayout('top')">
						<div class="layout-dark"></div>
						<div class="layout-content"></div>
						<el-icon v-if="layout == 'top'">
							<CircleCheckFilled />
						</el-icon>
					</div>
				</el-tooltip>
				<el-tooltip effect="dark" content="顶部菜单混合模式" placement="top" :show-after="200">
					<div :class="['layout-item layout-topMix', { 'is-active': layout == 'topMix' }]" @click="setLayout('topMix')">
						<div class="layout-dark"></div>
						<div class="layout-container">
							<div class="layout-light"></div>
							<div class="layout-content"></div>
						</div>
						<el-icon v-if="layout == 'topMix'">
							<CircleCheckFilled />
						</el-icon>
					</div>
				</el-tooltip>
			</div>

			<el-divider class="local-divider">
				<el-icon><Operation /></el-icon>界面功能
			</el-divider>
			<div class="drawer-item">
				<span>显示底部</span>
				<el-switch v-model="footer" />
			</div>
			<div class="drawer-item">
				<span>面包屑</span>
				<el-switch v-model="breadcrumb" />
			</div>
			<div v-show="breadcrumb" class="drawer-item">
				<span>面包屑图标</span>
				<el-switch v-model="breadcrumbIcon" />
			</div>

			<div class="drawer-item">
				<span>多页签</span>
				<el-switch v-model="tagsView" />
			</div>

			<div class="drawer-item">
				<span>页面切换动画</span>
				<el-switch v-model="animate" />
			</div>

			<div class="drawer-item">
				<span>页面切换动画类型</span>
				<el-select v-model="animateMode" style="width: 100px;">
					<el-option v-for="v of animateList" :key="v.value" :value="v.value" :label="v.label" />
				</el-select>
			</div>
		</el-scrollbar>


		<!--
				<div class="drawer-item">
					<span>固定 Header</span>
					<el-switch v-model="fixedHeader" />
				</div>
		-->

		<!--		<div class="drawer-item">
					<span>侧边栏 Logo</span>
					<el-switch v-model="sidebarLogo" />
				</div>-->
	</div>
</template>

<script setup lang="ts">
// import { reactive, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { LayoutType } from '@/store/interface'
import ThemePicker from '@/components/ThemePicker/index.vue'
// import { useDark, useToggle } from '@vueuse/core'
import { useTheme } from '@/hooks/useTheme'

import useStore from '@/store'

const { setting } = useStore()
const { switchDark, changeGreyOrWeak, setAsideTheme, setHeaderTheme, setFooterTheme } = useTheme()
// const isDark = useDark()
// const toggleDark = () => useToggle(isDark)

// const state = reactive({
// 	fixedHeader: setting.fixedHeader,
// 	tagsView: setting.tagsView,
// 	sidebarLogo: setting.sidebarLogo
// })
const animateList = [
	{
		label: '消退',
		value: 'fade'
	},
	{
		label: '滑动',
		value: 'fade-slide'
	},
	{
		label: '底部消退',
		value: 'fade-bottom'
	},
	{
		label: '缩放消退',
		value: 'fade-scale'
	},
	{
		label: '渐变',
		value: 'zoom-fade'
	},
	{
		label: '闪现',
		value: 'zoom-out'
	}
]
const {
	isDark,
	isGrey,
	isWeak,
	layout,
	asideInverted,
	headerInverted,
	footerInverted,
	fixedHeader,
	footer,
	breadcrumb,
	breadcrumbIcon,
	tagsView,
	animate,
	animateMode,
	sidebarLogo
} = storeToRefs(setting)

function themeChange(val: any) {
	setting.changeSetting('themeColor', val)
}

// 设置布局方式
const setLayout = (val: LayoutType) => {
	setting.changeSetting('layout', val)
	setAsideTheme()
}

// watch(
// 	() => state.fixedHeader,
// 	value => {
// 		setting.changeSetting('fixedHeader', value)
// 	}
// )

// watch(
// 	() => state.tagsView,
// 	value => {
// 		setting.changeSetting('tagsView', value)
// 	}
// )

// watch(
// 	() => state.sidebarLogo,
// 	value => {
// 		setting.changeSetting('sidebarLogo', value)
// 	}
// )
</script>

<style lang="scss" scoped>
$header_height: 55px;
.drawer-container {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	//padding: 0 24px 16px 24px;
	padding-bottom: 10px;
	font-size: 14px;
	line-height: 1.5;
	word-wrap: break-word;

	.drawer-title {
		padding: 16px 24px;
		//margin: 0 -24px;
		//padding: 16px 0;
		height: $header_height;
		font-size: 16px;
		border-bottom: 1px solid var(--el-border-color-lighter);
	}

	/*.drawer-content {
		height: calc(100% - $header_height);
	}*/

	.local-divider {
		margin: 24px;
		width: auto;
		.el-icon {
			position: relative;
			top: 2px;
			right: 5px;
		}
	}

	.drawer-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: var(--el-text-color-primary);
		font-size: 14px;
		padding: 4px 24px;
	}

	.layout-box {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		//padding: 12px 6px 0;
		padding: 4px 24px;
		.layout-item {
			position: relative;
			box-sizing: border-box;
			width: 100px;
			height: 70px;
			padding: 6px;
			cursor: pointer;
			border-radius: 5px;
			box-shadow: 0 0 5px 1px var(--el-border-color-dark);
			transition: all 0.2s;
			.layout-dark {
				background-color: var(--el-color-primary);
				border-radius: 3px;
			}
			.layout-light {
				background-color: var(--el-color-primary-light-5);
				border-radius: 3px;
			}
			.layout-content {
				background-color: var(--el-color-primary-light-8);
				//border: 1px dashed var(--el-color-primary);
				border: 1px solid var(--el-color-primary);
				border-radius: 3px;
			}
			.el-icon {
				position: absolute;
				right: 10px;
				bottom: 10px;
				color: var(--el-color-primary);
				transition: all 0.2s;
			}
			&:hover {
				box-shadow: 0 0 5px 1px var(--el-text-color-secondary);
			}
		}
		.is-active {
			box-shadow: 0 0 0 2px var(--el-color-primary) !important;
		}
		.layout-left {
			display: flex;
			justify-content: space-between;
			margin-bottom: 12px;
			.layout-light {
				width: 20%;
			}
			.layout-container {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 72%;
				.layout-dark {
					height: 20%;
				}
				.layout-content {
					height: 67%;
				}
			}
		}
		.layout-leftMix {
			display: flex;
			justify-content: space-between;
			margin-bottom: 12px;
			.layout-light {
				width: 14%;
				&.light-2 {
					width: 17%;
				}
			}
			.layout-container {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 55%;
				.layout-dark {
					height: 20%;
				}
				.layout-content {
					height: 67%;
					width: 100%;
				}
			}
		}
		.layout-top {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			//margin-bottom: 12px;
			.layout-dark {
				height: 20%;
			}
			.layout-content {
				height: 67%;
			}
		}
		.layout-topMix {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			//margin-bottom: 12px;
			.layout-dark {
				height: 22%;
			}
			.layout-container {
				display: flex;
				justify-content: space-between;
				height: 70%;
				.layout-light {
					width: 20%;
				}
				.layout-content {
					width: 70%;
				}
			}
		}
	}
}
</style>
