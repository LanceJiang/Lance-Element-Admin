<!--<script setup lang="tsx">-->
<script lang="tsx">
import { defineComponent, ref, watchEffect, withDefaults } from 'vue'
// interface Props {
// 	msg?: string
// 	labels: string[]
// }
// const props = withDefaults(defineProps<Props>(), {
// 	msg: 'hello',
// 	labels: () => ['one', 'two']
// })
// const props = defineProps({
// 	msg: {
// 		type: String,
// 		default: 'msg....'
// 	},
// 	labels: {
// 		type: Array,
// 		default: () => ['one', 'two']
// 	}
// })
export default defineComponent({
	name: 'setupComponent',
	props: {
		msg: {
			type: String,
			default: 'msg....'
		},
		labels: {
			type: Array,
			default: () => ['one', 'two']
		}
	},
	setup(props, ctx) {
		// const testValue = ref('test')
		const testValue = ref('test')
		watchEffect(() => {
			console.error(testValue.value, 'testValue')
		})
		console.log(testValue, 'testValue')
		// return {
		// 	testValue
		// }
		/*{labels}<br/>
			{msg}<br/>*/
		return () => {
			return (
				<div style="background: var(--el-color-danger)">
					{JSON.stringify(props)}
					<br />
					{/*{labels}<br/>
				{msg}<br/>*/}
					<el-input v-model={testValue.value}></el-input>
				</div>
			)
		}
	}
})
// const testValue = ref('test')
// watchEffect(() => {
// 	console.error(testValue.value, 'testValue')
// })
// console.log(testValue, 'testValue')
</script>

<!--<template>-->
<!--	<div style="background: var(--el-color-danger)">-->
<!--		{{props}}<br>-->
<!--		{{labels}}<br>-->
<!--		{{msg}}<br>-->
<!--		<el-input v-model="testValue"></el-input>-->
<!--	</div>-->
<!--</template>-->

<style scoped lang="scss"></style>
