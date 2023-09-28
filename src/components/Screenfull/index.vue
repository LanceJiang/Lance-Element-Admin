<template>
	<el-tooltip placement="top" :content="$t(isFullscreen ? 'le.exitFullscreen' : 'le.fullscreen')">
		<div class="right-menu-item le-hover-effect--bg">
			<LeIcon :icon-class="isFullscreen ? 'le-suoxiao1' : 'le-fangda1'" @click="toggle" />
		</div>
	</el-tooltip>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
const { isFullscreen, toggle } = useFullscreen()
</script>
