<template>
  <div>
		<p>size</p>
		<div class="flex items-center m-2" v-for="size of ['small', 'default', 'large']" :key="size">
			<LeInputNumber
				v-model="num"
				:min="1"
				:max="10"
				@change="handleChange"
				:size="size"
			/> <span class="ml-1">{{size}}</span>
		</div>
		<p>prefixIcon & suffixIcon</p>
		<LeInputNumber
			class="m-2"
			v-model="num"
			:min="1"
			:max="10"
			prefixIcon="#"
		/>
		<LeInputNumber
			class="m-2"
			v-model="num"
			:min="1"
			:max="10"
			suffixIcon="￥"
		/>
		<LeInputNumber
			class="m-2"
			v-model="num"
			:min="1"
			:max="10"
			prefixIcon="#"
			suffixIcon="￥"
		/>
		<p>prefix 插槽 & suffix 插槽</p>
		<LeInputNumber
			style="width: 300px;"
			class="m-2"
			v-model="num"
			:min="1"
			:max="10"
		>
			<template #prefix>
				<span class="le-addon le-input-number__prefix" style="background: #f00;color: #fff;">prefix插槽</span>
			</template>
			<template #suffix>
				<span class="le-addon le-input-number__suffix" style="background: #00f;color: #fff;">suffix插槽</span>
			</template>
		</LeInputNumber>
	</div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, h } from 'vue'
// import { Edit, Share } from '@element-plus/icons-vue'
const num = ref(1)
// const customPrefix = shallowRef({
// 	render() {
// 		return h('p', 'pre')
// 	},
// })
const handleChange = (value: number) => {
  console.log(value)
}
</script>
