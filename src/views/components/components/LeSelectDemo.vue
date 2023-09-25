<template>
	<div class="common_title">LeSelect 使用</div>
	<div class="content">
		<div style="color: var(--el-color-danger)">testValue:{{ testValue }}</div>
<!--		el-select
		<ElSelect v-model="testValue" filterable multiple collapseTags isPopover>
			&lt;!&ndash;				<template #prefix>
				<LeIcon icon-class="icon-logo"/>
			</template>&ndash;&gt;
			<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
		</ElSelect>-->
		el-select-v2
		<el-select-v2 v-model="testValue" :options="options" style="width: 200px" filterable multiple isPopover collapseTags>
			<!--				<template #prefix>
								<LeIcon icon-class="icon-logo"/>
							</template>-->
		</el-select-v2>
		LeSelect(cust_label 多语言)<span style="color: var(--el-color-danger);">(测试valueKey 变更)</span>
		<!--			3labelKey="obj.label"-->
		<LeSelect
			v-model="testValue"
			:options="options"
			style="width: 200px"
			i18n
			:valueKey="valueKey"
			collapseTagsTooltip
			labelKey="cust_label"
			filterable multiple isPopover>
<!--				<template #prefix>
					<LeIcon icon-class="icon-logo"/>
				</template>
				<template #default="{ item, index, disabled }">
					<LeIcon icon-class="icon-logo" />
					{{ item.le_label }}
				</template>-->
		</LeSelect>
		LeSelect单选(value)
		<LeSelect
			v-model="testValue"
			:options="options"
			labelKey="cust_label"
			valueKey_5555="value"
			multiple2
			i18n
			style="width: 200px" filterable isPopover>
			<template #default="{ item, index, disabled }"> <LeIcon icon-class="icon-logo" /> {{ item.le_label }} </template>
		</LeSelect>
		valueKey(obj.value) <span style="color: var(--el-color-primary);">(测试labelKey 变更)</span>
		<!-- 读取option 非value 的数据 作为value 储蓄 -->
		<LeSelect
			v-model="testValue"
			:options="options"
			:labelKey="labelKey"
			:i18n="false"
			valueKey="obj.value"
			style="width: 200px"
			filterable
			multiple
			isPopover
			:collapseT2ags="false"
		>
<!--			<template #prefix>
				<LeIcon icon-class="icon-logo"/>
			</template>-->
			<template #default="{ item, index, disabled }">
				<LeIcon icon-class="icon-logo" /> {{ item.le_label }}
			</template>
		</LeSelect>
		<div>-------LeSelect 无弹窗(isPopover false)--------</div>
		<LeSelect
			style="width: 200px"
			v-model="testValue"
			:options="options3"
			filterable multiple :isPopover="false">
		</LeSelect>
	</div>
</template>
<script setup lang="ts">
import {defineComponent, ref, toRefs, reactive, computed, watch, onMounted, nextTick} from 'vue'
// const testValue = ref()
const testValue = ref('value_1')
const options = ['add', 'restore', 'confirm', 'save', 'cancel', 'reset'].map((t, i) => {
	// return 'le.btn.' + t
	return {
		value: 'value_' + i,
		label: 'label_' + i,
		cust_value: 'cust_选项' + i,
		cust_label: 'le.btn.' + t,
		obj: {
			label: 'obj_label' + i,
			value: 'obj_value' + i
		}
	}
})
const labelKey = ref('cust_label')
window.change_labelKey = () => {
	labelKey.value = (labelKey.value === 'cust_label' ? 'obj.label' : 'cust_label')
	const last = testValue.value
	testValue.value = undefined
	nextTick().then(() => {
		testValue.value = last
	})
}
const valueKey = ref('cust_value')
/*window.change_valueKey = () => {
	valueKey.value = (valueKey.value === 'cust_value' ? 'obj.value' : 'cust_value')
	const last = testValue.value
	testValue.value = undefined
	nextTick().then(() => {
		testValue.value = last
	})
}*/
const options3 = ref(Array.from({length: 50}).map((_, i) => {
	return {
		value: 'value_' + i,
		label: 'label_' + i,
		cust_value: 'cust_选项' + i,
		cust_label: 'le.btn.' + i,
		obj: {
			label: 'obj_label' + i,
			value: 'obj_value' + i
		}
	}
}))
// const testValue = ref(['value_1', 'value_2'])
</script>
<style scoped lang="scss">

</style>