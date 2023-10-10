<template>
	<el-tooltip placement="top" :content="$t(isFullscreen ? 'le.exitFullscreen' : 'le.fullscreen')">
		<div class="menu--screen menu-item le-hover-effect--bg" @click="toggle">
			<LeIcon :icon-class="isFullscreen ? 'le-suoxiao1' : 'le-fangda1'" />
		</div>
	</el-tooltip>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
const { isFullscreen, toggle } = useFullscreen()
</script>
