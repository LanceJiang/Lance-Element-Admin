<template>
	<div ref="rightPanel" :class="{ show }" class="rightPanel-wrap">
		<div class="rightPanel-background" />
		<div class="rightPanel">
			<div class="handle-button" :style="{ top: buttonTop + 'px', 'background-color': themeColor }" @click="show = !show">
				<Close v-show="show" class="icon" />
				<Setting v-show="!show" class="icon" />
			</div>
			<div class="rightPanel-items">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import useStore from '@/store'

// 图标依赖
import { Close, Setting } from '@element-plus/icons-vue'
import { ElColorPicker } from 'element-plus'

const { setting } = useStore()

const themeColor = computed(() => setting.themeColor)
const show = ref(false)

defineProps({
	buttonTop: {
		default: 250,
		type: Number
	}
})

watch(show, value => {
	if (value) {
		addEventClick()
	}
	document.body.classList.toggle('showRightPanel', !!value)
})

function addEventClick() {
	window.addEventListener('click', closeSidebar)
}

function closeSidebar(evt: any) {
	// 主题选择点击不关闭
	let parent = evt.target.closest('.theme-picker-dropdown')
	if (parent) {
		return
	}

	parent = evt.target.closest('.rightPanel')
	if (!parent) {
		show.value = false
		window.removeEventListener('click', closeSidebar)
	}
}

const rightPanel = ref(ElColorPicker)

function insertToBody() {
	const elx = rightPanel.value as any
	const body = document.querySelector('body') as any
	body.insertBefore(elx, body.firstChild)
}

onMounted(() => {
	insertToBody()
})

onBeforeUnmount(() => {
	const elx = rightPanel.value as any
	elx.remove()
})
</script>

<style lang="scss">
.showRightPanel {
	overflow: hidden;
	position: relative;
	//width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel {
	width: 100%;
	max-width: 280px;
	height: 100vh;
	position: fixed;
	top: 0;
	right: 0;
	z-index: 99;
	//box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
	//transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
	transform: translate(100%);
	//background-color: var(--el-drawer-bg-color);
	background-color: var(--el-bg-color);
	//box-shadow: var(--el-box-shadow-dark);
	box-shadow: var(--el-box-shadow-lighter);
	transition: all var(--el-transition-duration);
	&-items {
		display: none;
		height: 100%;
	}
	&-background {
		position: fixed;
		top: 0;
		left: 0;
		opacity: 0;
		transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
		background: var(--el-fill-color-darker);
		z-index: -1;
	}
}
.show {
	transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

	.rightPanel {
		transform: translate(0);
		&-items {
			display: block;
		}
		&-background {
			z-index: 88;
			opacity: 0.5;
			width: 100%;
			height: 100%;
		}
	}
}

.handle-button {
	width: 32px;
	height: 32px;
	position: absolute;
	left: -32px;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	//font-size: 24px;
	border-radius: 6px 0 0 6px !important;
	z-index: 0;
	pointer-events: auto;
	cursor: pointer;
	color: #fff;
	line-height: 32px;

	.icon {
		width: 18px;
		height: 18px;
	}
}
</style>
