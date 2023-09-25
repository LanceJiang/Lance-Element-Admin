<template>
	<div class="drawer-container">
		<h3 class="drawer-title">主题配置</h3>
		<el-divider class="local-divider">
			<el-icon><Operation /></el-icon>主题模式
		</el-divider>
		<div class="drawer-item">
			<span>主题颜色</span>
			<div style="float: right; height: 26px; margin: -3px 8px 0 0">
				<theme-picker @change="themeChange" />
			</div>
		</div>
		<div class="drawer-item" @click.stop="">
			<span>暗黑主题</span>
			<el-switch v-model="isDark" inline-prompt class="drawer-switch" active-icon="Sunny" inactive-icon="Moon" @change="switchDark" />
		</div>

		<el-divider class="local-divider">
			<el-icon><Menu /></el-icon>布局模式
		</el-divider>
		<div class="layout-box">
			<el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
				<div :class="['layout-item layout-classic', { 'is-active': layout == 'classic' }]" @click="setLayout('classic')">
					<div class="layout-dark"></div>
					<div class="layout-container">
						<div class="layout-light"></div>
						<div class="layout-content"></div>
					</div>
					<el-icon v-if="layout == 'classic'">
						<CircleCheckFilled />
					</el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
				<div :class="['layout-item layout-transverse', { 'is-active': layout == 'transverse' }]" @click="setLayout('transverse')">
					<div class="layout-dark"></div>
					<div class="layout-content"></div>
					<el-icon v-if="layout == 'transverse'">
						<CircleCheckFilled />
					</el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
				<div :class="['layout-item layout-vertical', { 'is-active': layout == 'vertical' }]" @click="setLayout('vertical')">
					<div class="layout-dark"></div>
					<div class="layout-container">
						<div class="layout-light"></div>
						<div class="layout-content"></div>
					</div>
					<el-icon v-if="layout == 'vertical'">
						<CircleCheckFilled />
					</el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
				<div :class="['layout-item layout-columns', { 'is-active': layout == 'columns' }]" @click="setLayout('columns')">
					<div class="layout-dark"></div>
					<div class="layout-light"></div>
					<div class="layout-content"></div>
					<el-icon v-if="layout == 'columns'">
						<CircleCheckFilled />
					</el-icon>
				</div>
			</el-tooltip>
		</div>

		<el-divider class="local-divider">
			<el-icon><Operation /></el-icon>界面功能
		</el-divider>
		<div class="drawer-item">
			<span>开启 Tags-View</span>
			<el-switch v-model="tagsView" class="drawer-switch" />
		</div>

		<div class="drawer-item">
			<span>固定 Header</span>
			<el-switch v-model="fixedHeader" class="drawer-switch" />
		</div>

		<div class="drawer-item">
			<span>侧边栏 Logo</span>
			<el-switch v-model="sidebarLogo" class="drawer-switch" />
		</div>
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
const { switchDark } = useTheme()
// const isDark = useDark()
// const toggleDark = () => useToggle(isDark)

// const state = reactive({
// 	fixedHeader: setting.fixedHeader,
// 	tagsView: setting.tagsView,
// 	sidebarLogo: setting.sidebarLogo
// })

const { layout, fixedHeader, tagsView, sidebarLogo, isDark } = storeToRefs(setting)

function themeChange(val: any) {
	setting.changeSetting('themeColor', val)
}

// 设置布局方式
const setLayout = (val: LayoutType) => {
	setting.changeSetting('layout', val)
	// setAsideTheme()
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
.drawer-container {
	padding: 0 24px 16px 24px;
	//padding-top: 0;
	font-size: 14px;
	line-height: 1.5;
	word-wrap: break-word;

	.drawer-title {
		padding: 16px 24px;
		margin: 0 -24px;
		height: 55px;
		//margin-bottom: 12px;
		//color: rgba(0, 0, 0, 0.85);
		font-size: 16px;
		//line-height: 22px;
		border-bottom: 1px solid var(--el-border-color-lighter);
	}

	.local-divider {
		.el-icon {
			position: relative;
			top: 2px;
			right: 5px;
		}
	}

	.drawer-item {
		//color: rgba(0, 0, 0, 0.65);
    color: var(--el-text-color-primary);
		font-size: 14px;
		padding: 12px 0;
	}

	.drawer-switch {
		float: right;
	}

	.job-link {
		display: block;
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
	}

	.layout-box {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 12px 6px 0;
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
		.layout-vertical {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20px;
			.layout-dark {
				width: 20%;
			}
			.layout-container {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 72%;
				.layout-light {
					height: 20%;
				}
				.layout-content {
					height: 67%;
				}
			}
		}
		.layout-classic {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-bottom: 20px;
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
		.layout-transverse {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-bottom: 15px;
			.layout-dark {
				height: 20%;
			}
			.layout-content {
				height: 67%;
			}
		}
		.layout-columns {
			display: flex;
			justify-content: space-between;
			margin-bottom: 15px;
			.layout-dark {
				width: 14%;
			}
			.layout-light {
				width: 17%;
			}
			.layout-content {
				width: 55%;
			}
		}
	}
}
</style>
