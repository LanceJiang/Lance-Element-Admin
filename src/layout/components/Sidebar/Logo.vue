<template>
	<div class="sidebar-logo-container" :class="{ collapse: isCollapse }">
		<transition name="sidebarLogoFade">
			<router-link v-if="false" key="collapse" class="sidebar-logo-link" to="/">
				<Svg-Icon class="sidebar-logo" icon-class="logo" />
			</router-link>
			<router-link v-else key="expand" class="sidebar-logo-link" to="/">
				<SvgIcon class="sidebar-logo" icon-class="logo" />
				<h1 class="sidebar-title">{{ title }}</h1>
			</router-link>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'

const props = defineProps({
	collapse: {
		type: Boolean,
		required: true
	}
})

const state = reactive({
	isCollapse: props.collapse
})

const { isCollapse } = toRefs(state)

const title = ref('vue3_element_admin')
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
	transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
	opacity: 0;
}

.sidebar-logo-container {
	position: relative;
	width: 100%;
	height: 50px;
	line-height: 50px;
	text-align: center;
	overflow: hidden;
	&::before {
		z-index: auto;
		content: '';
		background-color: var(--el-menu-active-color);
		opacity: 0.01;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		pointer-events: none;
		transition: background-color .3s cubic-bezier(.4, 0, .2, 1);
	}
	& .sidebar-logo-link {
		height: 100%;
		width: 100%;

		& .sidebar-logo {
			margin-right: 0;
			width: 36px;
			height: 36px;
			vertical-align: middle;
		}

		& .sidebar-title {
			display: inline-block;
			margin: 0;
			color: var(--el-color-primary);
			font-weight: 600;
			line-height: 50px;
			font-size: 14px;
			font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
			vertical-align: middle;
		}
	}

	&.collapse {
		.sidebar-logo {
			margin-right: 0;
		}
	}
}
</style>
