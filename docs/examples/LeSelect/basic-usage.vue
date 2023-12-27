<template>
	<div>
		<LeSelect
			class="m-2"
			v-model="value"
			:options="options"
			placeholder="Select"
			size="large"
		/>
		<LeSelect
			class="m-2"
			v-model="value"
			:options="options"
			placeholder="Select"
		/>
		<LeSelect
			class="m-2"
			v-model="value"
			:options="options"
			placeholder="Select"
			size="small"
		/>
	</div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
const value = ref()
watchEffect(() => {
	console.log('当前value值：', value.value)
})
const options = Array.from({length: 600}).map((_, i) => ({ label: `label_${i}`, value: `value_${i}` }))
</script>
<style scoped>

</style>
