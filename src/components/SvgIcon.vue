<template>
	<svg class="le-icon" aria-hidden="true">
		<use :xlink:href="`#${iconClass}`" :fill="color" />
	</svg>
</template>

<script lang="ts" setup name="LeIcon">
const props = defineProps({
	iconClass: {
		type: String,
		require: true
	},
	color: {
		type: String,
		default: ''
	}
})
</script>
