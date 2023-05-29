<template>
	<svg class="ad-icon" aria-hidden="true" @click="$emit('click', $event)">
		<use :xlink:href="`#${iconClass}`" :fill="color" />
	</svg>
</template>

<script lang="ts" setup name="AdIcon">
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
defineEmits(['click'])
</script>
