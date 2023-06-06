<template>
	<div ref="rightPanel" :class="{ show }" class="rightPanel-container">
		<div class="rightPanel-background" />
		<div class="rightPanel">
			<div class="handle-button" :style="{ top: buttonTop + 'px', 'background-color': theme }" @click="show = !show">
				<Close class="icon" v-show="show" />
				<Setting class="icon" v-show="!show" />
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

const theme = computed(() => setting.theme)
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

<style>
.showRightPanel {
	overflow: hidden;
	position: relative;
	width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-background {
	position: fixed;
	top: 0;
	left: 0;
	opacity: 0;
	transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	background: rgba(0, 0, 0, 0.2);
	z-index: -1;
}

.rightPanel {
	width: 100%;
	max-width: 260px;
	height: 100vh;
	position: fixed;
	top: 0;
	right: 0;
	box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
	transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
	transform: translate(100%);
	background: #fff;
	z-index: 40000;
}

.show {
	transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

	.rightPanel-background {
		z-index: 20000;
		opacity: 1;
		width: 100%;
		height: 100%;
	}

	.rightPanel {
		transform: translate(0);
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
		//font-size: 24px;
		//line-height: 32px;
		width: 18px;
		height: 18px;
	}
}
</style>
