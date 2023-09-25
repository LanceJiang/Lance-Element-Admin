<template>
	<div class="common_title">LeInputNumber && LeInputNumberRange</div>
	<div class="content">
		{{ testNumber }}
		<LeInputNumber style="width: 500px" disabled v-model="testNumber" :min="0" prefixIcon="#" _controlsPosition=""></LeInputNumber>
		<LeInputNumber v-model="testNumber" :min="0" prefixIcon="#" suffixIcon="￥" size="small" _controlsPosition=""></LeInputNumber>
		<LeInputNumber v-model="testNumber" :min="0" prefixIcon="#" size="small" _controlsPosition=""></LeInputNumber>
		<LeInputNumber v-model="testNumber" :min="0" suffixIcon="￥" _controlsPosition=""></LeInputNumber>
		<LeInputNumber size="small" v-model="testNumber" :min="0" prefixIcon="#" suffixIcon="￥" _controlsPosition=""></LeInputNumber>
		<LeInputNumber v-model="testNumber" :min="0" style="width: 300px" controlsPosition="">
			<template slot="prefix"><span class="le-addon le-input-number__prefix" style="background: #0f0">prefix</span></template>
			<template slot="suffix"><span class="le-addon le-input-number__suffix" style="background: var(--el-color-danger)">suffix</span></template>
		</LeInputNumber>
		<div>-------LeInputNumberRange--------</div>
		{{ numberRangeParams }}<br />
		<LeInputNumberRange v-model="numberRangeParams" v-bind="numberRangeForm" itemStyle="width: 400px">
<!--			<template #prepend><span class="le-input-number-range_addon local_prepend" style="background: #0f0;">prepend</span></template>-->
			<template #append><span class="le-input-number-range_addon local_append" style="background: var(--el-color-danger)">append</span></template>
		</LeInputNumberRange>
	</div>
</template>
<script setup lang="ts">
import { ref, toRefs, reactive, computed, watch, onMounted } from 'vue'
const testNumber = ref(1)
const numberRangeParams = ref({
	numberRangeStart: 2,
	numberRangeEnd: 50
})
const numberRangeForm = {
	prop: 'numberRange', // (numberRangeStart,  numberRangeEnd)
	// propStart: 'numberRange__min', // 仅仅于isValueArray: false 生效
	// propEnd: 'numberRange__max', // 仅仅于isValueArray: false 生效
	// isValueArray: true,
	// todo...
	prefixIcon: '$',
	suffixIcon: '￥',
	prepend: 'Prepend',
	append: 'Append',
	min: 0,
	max: 999
	// controlsPosition: 'right' // 默认
}
</script>
<style scoped lang="scss">

</style>