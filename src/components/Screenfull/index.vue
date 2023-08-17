<template>
	<div>
		<el-tooltip placement="top" :content="$t(isFullscreen ? 'le.exitFullscreen' : 'le.fullscreen')">
			<LeIcon :icon-class="isFullscreen ? 'le-suoxiao1' : 'le-fangda1'" @click="toggle" />
		</el-tooltip>
	</div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
const { isFullscreen, toggle } = useFullscreen()
</script>
