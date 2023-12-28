<template>
	<div>
		<p>size</p>
		<div class="flex items-center m-2" v-for="size of ['small', 'default', 'large']" :key="size">
			<LeInputNumberRange
				v-model="numberRangeParams"
				v-bind="numberRangeForm"
				@change="rangeChange"
				@blur="rangeBlur"
				@focus="rangeFocus"
				:size="size"
			/> <span class="ml-1">{{size}}</span>
		</div>
		<p>prefixIcon & suffixIcon</p>
		<LeInputNumberRange
			class="m-2"
			v-model="numberRangeParams"
			:min="1"
			:max="10"
			prefixIcon="Start"
		/>
		<LeInputNumberRange
			class="m-2"
			v-model="numberRangeParams"
			:min="1"
			:max="10"
			suffixIcon="End"
		/>
		<LeInputNumberRange
			class="m-2"
			v-model="numberRangeParams"
			v-bind="prefix_suffixIcon"
			:min="1"
			:max="10"
		/>
		<p>prefix 插槽 & suffix 插槽</p>
		<LeInputNumberRange
			itemStyle="width: 250px;"
			class="m-2"
			v-model="numberRangeParams"
			:min="1"
			:max="10"
		>
			<template #prefix>
				<span class="le-addon le-input-number__prefix" style="background: #f00;color: #fff;">prefix</span>
			</template>
			<template #suffix>
				<span class="le-addon le-input-number__suffix" style="background: #00f;color: #fff;">suffix</span>
			</template>
		</LeInputNumberRange>
		<p>prepend 插槽 & append 插槽</p>

		<LeInputNumberRange
			style="width: 200px;"
			class="m-2"
			v-model="numberRangeParams"
			:min="1"
			:max="10"
		>
			<template #prepend><span class="le-input-number-range_addon local_prepend" style="background: #0f0;">prepend</span></template>
			<template #append><span class="le-input-number-range_addon local_append" style="background: var(--el-color-danger)">append</span></template>
<!--			<template #suffix>
				<span class="le-addon le-input-number__suffix" style="background: #00f;color: #fff;">suffix插槽</span>
			</template>-->
		</LeInputNumberRange>
	</div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, h } from 'vue'
// import { Edit, Share } from '@element-plus/icons-vue'
const numberRangeParams = ref({
	numberRangeStart: 2,
	numberRangeEnd: 50
})

const numberRangeForm = {
	prop: 'numberRange', // (numberRangeStart,  numberRangeEnd)
	// propStart: 'numberRange__min', // 仅仅于isValueArray: false 生效
	// propEnd: 'numberRange__max', // 仅仅于isValueArray: false 生效
	// isValueArray: true

	// prefixIcon: '$',
	// suffixIcon: '￥',
	// prepend: 'Prepend',
	// append: 'Append',
	min: 0,
	max: 19
	// controlsPosition: 'right' // 默认
}
const prefix_suffixIcon = {
	prefixIcon: '$',
	suffixIcon: '￥',
}
const rangeChange = (value, prop) => {
	console.error(value, prop, 'value, prop')
}
const rangeBlur = (ev, prop) => {
	console.log(ev, prop, 'rangeBlur event, prop')
}
const rangeFocus = (ev, prop) => {
	console.log(ev, prop, 'rangeFocus event, prop')
}
</script>
