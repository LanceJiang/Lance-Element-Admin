<template>
	<div class="le-maximize-quit" @click="maximizeQuit">
		<LeIcon class="icon_quit" iconClass="icon-back"></LeIcon>
	</div>
</template>

<script setup lang="ts">
import useStore from '@/store'
const { setting } = useStore()
const maximizeQuit = () => {
	setting.contentMaximize = false
}
</script>

<style scoped lang="scss">
.#{$prefix}maximize-quit {
	position: fixed;
	top: -30px;
	right: -30px;
	z-index: 999;
	width: 60px;
	height: 60px;
	cursor: pointer;
	background-color: var(--el-color-info-light-5);
	border-radius: 50%;
	opacity: 0.9;
	&:hover {
		background-color: var(--el-color-info-light-3);
	}
	.icon_quit {
		position: relative;
		top: 60%;
		left: 16%;
		font-size: 18px;
		color: #fff;
	}
}
</style>
