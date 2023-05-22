<template>
	<div style="background: #f0f">我是 component 2</div>
	<div>{{ list }}</div>
	<div>{{ dataList }}</div>
</template>

<script>
import { ref } from 'vue'
export default {
	name: 'Comp2',
	setup() {
		const list = ref(['JavaScript', 'HTML', 'CSS'])
		// 只有 return 之后 才可以 通过refs. 访问
		return {
			list
		}
	},
	data() {
		return {
			dataList: ['1', '2']
		}
	}
	// render() {
	//   return <div style='background: #f0f;'>我是 component 2</div>
	// }
}
</script>

<style scoped></style>
