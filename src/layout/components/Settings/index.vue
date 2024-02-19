<template>
	<el-drawer v-model="settingsVisible" class="theme-setting-wrap" :title="$t('le.layout.setting.title')" size="280px">
		<div class="drawer-wrap">
			<el-scrollbar class="drawer-content">
				<el-divider class="local-divider">
					<el-icon><SetUp /></el-icon>{{ $t('le.layout.setting.themeModeTitle') }}
				</el-divider>
				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.themeColor') }}</span>
					<ThemePicker />
				</div>
				<div class="drawer-item" @click.stop="">
					<span>{{ $t('le.layout.setting.themeDark') }}</span>
					<el-switch v-model="isDark" inline-prompt active-icon="Sunny" inactive-icon="Moon" @change="switchDark" />
				</div>
				<div class="drawer-item" @click.stop="">
					<span>{{ $t('le.layout.setting.themeGray') }}</span>
					<el-switch v-model="isGrey" inline-prompt @change="changeGreyOrWeak('grey', $event)" />
				</div>
				<div class="drawer-item" @click.stop="">
					<span>{{ $t('le.layout.setting.themeWeak') }}</span>
					<el-switch v-model="isWeak" inline-prompt @change="changeGreyOrWeak('weak', $event)" />
				</div>
				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.sideDark') }}</span>
					<el-switch v-model="asideInverted" @change="setAsideTheme" />
				</div>
				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.headDark') }}</span>
					<el-switch v-model="headerInverted" @change="setHeaderTheme" />
				</div>
				<div v-show="footer" class="drawer-item">
					<span>{{ $t('le.layout.setting.footDark') }}</span>
					<el-switch v-model="footerInverted" @change="setFooterTheme" />
				</div>

				<el-divider class="local-divider">
					<el-icon><Menu /></el-icon>{{ $t('le.layout.setting.layoutMode') }}
				</el-divider>
				<div class="layout-box">
					<el-tooltip effect="dark" :content="$t('le.layout.setting.layoutLeftMenuMode')" placement="top" :show-after="200">
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
					<el-tooltip effect="dark" :content="$t('le.layout.setting.layoutLeftMenuBlendingMode')" placement="top" :show-after="200">
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
					<el-tooltip effect="dark" :content="$t('le.layout.setting.layoutTopMenuMode')" placement="top" :show-after="200">
						<div :class="['layout-item layout-top', { 'is-active': layout == 'top' }]" @click="setLayout('top')">
							<div class="layout-dark"></div>
							<div class="layout-content"></div>
							<el-icon v-if="layout == 'top'">
								<CircleCheckFilled />
							</el-icon>
						</div>
					</el-tooltip>
					<el-tooltip effect="dark" :content="$t('le.layout.setting.layoutTopMenuBlendingMode')" placement="top" :show-after="200">
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
					<el-icon><Operation /></el-icon>{{ $t('le.layout.setting.pageFunctions') }}
				</el-divider>
				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.footerVisible') }}</span>
					<el-switch v-model="footer" />
				</div>
				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.crumbVisible') }}</span>
					<el-switch v-model="breadcrumb" />
				</div>
				<div v-show="breadcrumb" class="drawer-item">
					<span>{{ $t('le.layout.setting.crumbIconVisible') }}</span>
					<el-switch v-model="breadcrumbIcon" />
				</div>

				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.tabsVisible') }}</span>
					<el-switch v-model="tabsVisible" />
				</div>

				<div v-show="tabsVisible" class="drawer-item">
					<span>{{ $t('le.layout.setting.tabsIcon') }}</span>
					<el-switch v-model="tabsIcon" />
				</div>

				<div v-show="tabsVisible" class="drawer-item">
					<span>{{ $t('le.layout.setting.tabsMode') }}</span>
					<el-select v-model="tabsMode" style="width: 130px">
						<el-option v-for="v of tabsModeList" :key="v.value" :value="v.value" :label="$t(v.label)" />
					</el-select>
				</div>

				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.pageAnimate') }}</span>
					<el-switch v-model="animate" />
				</div>

				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.pageAnimateMode') }}</span>
					<el-select v-model="animateMode" style="width: 100px">
						<el-option v-for="v of animateList" :key="v.value" :value="v.value" :label="$t(v.label)" />
					</el-select>
				</div>

				<div class="drawer-item">
					<span>{{ $t('le.layout.setting.isWatermark') }}</span>
					<el-switch v-model="isWatermark" inline-prompt @change="watermarkChange" />
				</div>

				<div v-show="isWatermark" class="drawer-item">
					<span>{{ $t('le.layout.setting.watermarkText') }}</span>
					<el-input v-model="watermarkText" style="width: 160px" @input="watermarkTextChange" />
				</div>

				<el-divider class="local-divider">
					<el-icon><Setting /></el-icon>{{ $t('le.layout.setting.title') }}
				</el-divider>

				<div class="drawer-item">
					<el-button type="warning" style="width: 100%" @click="handle_resetTheme"> {{ $t('le.layout.setting.reset') }} </el-button>
				</div>
			</el-scrollbar>
		</div>
	</el-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { LayoutType } from '@/store/interface'
import ThemePicker from '@/components/ThemePicker/index.vue'
// import { useDark, useToggle } from '@vueuse/core'
import { useTheme } from '@/hooks/useTheme'

import useStore from '@/store'
import { ElMessage } from 'element-plus'

// const isDark = useDark()
// const toggleDark = () => useToggle(isDark)
const { setting } = useStore()
const { switchDark, changeGreyOrWeak, setAsideTheme, setHeaderTheme, setFooterTheme, resetTheme, watermarkChange, watermarkTextChange } = useTheme()
const handle_resetTheme = () => {
	resetTheme()
	ElMessage.success('le.message.resetSuccess')
}

const prefix = 'le.layout.setting.'
const animateList = [
	{
		label: `${prefix}animate_fade`,
		value: 'fade'
	},
	{
		label: `${prefix}animate_fadeSlide`,
		value: 'fade-slide'
	},
	{
		label: `${prefix}animate_fadeBottom`,
		value: 'fade-bottom'
	},
	{
		label: `${prefix}animate_fadeScale`,
		value: 'fade-scale'
	},
	{
		label: `${prefix}animate_zoomFade`,
		value: 'zoom-fade'
	},
	{
		label: `${prefix}animate_zoomOut`,
		value: 'zoom-out'
	}
]
const tabsModeList = [
	{
		label: `${prefix}tabsMode_chrome`,
		value: 'chrome'
	},
	{
		label: `${prefix}tabsMode_card`,
		value: 'card'
	},
	{
		label: `${prefix}tabsMode_rectangle`,
		value: 'rectangle'
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
	footer,
	breadcrumb,
	breadcrumbIcon,
	tabsVisible,
	tabsIcon,
	tabsMode,
	animate,
	animateMode,
	settingsVisible,
	isWatermark,
	watermarkText
} = storeToRefs(setting)

/*
function themeChange(val: any) {
	setting.changeSetting('themeColor', val)
}
*/

// 设置布局方式
const setLayout = (val: LayoutType) => {
	setting.changeSetting('layout', val)
	setAsideTheme()
}

// watch(
// 	() => state.tabsVisible,
// 	value => {
// 		setting.changeSetting('tabsVisible', value)
// 	}
// )
</script>

<style lang="scss">
$header_height: 55px;
.theme-setting-wrap {
	.el-drawer__header {
		padding: 16px 24px;
		//margin: 0 -24px;
		//padding: 16px 0;
		height: $header_height;
		font-size: 16px;
		border-bottom: 1px solid var(--el-border-color-lighter);
		margin-bottom: 0;
	}
	.el-drawer__body {
		padding: 0;
	}

	.drawer-wrap {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		//padding: 0 24px 16px 24px;
		padding-bottom: 10px;
		font-size: 14px;
		line-height: 1.5;
		word-wrap: break-word;

		.local-divider {
			margin: 24px;
			width: auto;
			.el-icon {
				position: relative;
				top: 2px;
				right: 5px;
			}
			:deep(.el-divider__text) {
				width: max-content;
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
}
</style>
