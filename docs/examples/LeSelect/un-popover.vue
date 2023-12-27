<template>
	<div class="flex">
		<LeSelect
			class="mr-2"
			v-model="value"
			:options="options"
			placeholder="Select"
			:is-popover="false"
			style="width:240px"
		/>
		<LeSelect
			v-model="value2"
			:options="options"
			placeholder="Select"
			:is-popover="false"
			style="width:240px"
			multiple
		/>
	</div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
const value = ref()
const value2 = ref()
watchEffect(() => {
	console.log('当前value值：', value.value)
	console.log('当前value2值：', value2.value)
})
const options = Array.from({length: 600}).map((_, i) => ({ label: `label_${i}`, value: `value_${i}` }))
</script>
<style scoped>

</style>
