<template>
<!--	<el-config-provider :locale="locale">-->
		<p>
			labelKey: <el-select v-model="curLabelKey">
			<el-option v-for="option of labelOptions" :key="option" :label="option" :value="option"></el-option>
		</el-select>
		</p>
		<div>
			valueKey: <el-select v-model="curValueKey">
			<el-option v-for="option of valueOptions" :key="option" :label="option" :value="option"></el-option>
		</el-select>
		</div>
		<div style="background: #fafafa">
			<p>开启 i18n(多语言): <el-switch v-model="is_i18n" /></p>
			<p v-if="is_i18n">
				当前语言： {{language}}
				<el-select v-model="language">
					<el-option v-for="option of langOptions" :key="option" :label="option" :value="option"></el-option>
				</el-select>
			</p>
		</div>
		{{value}}
		<LeSelect
			v-model="value"
			:options="options"
			placeholder="Please select"
			:label-key="curLabelKey"
			:value-key="curValueKey"
			:i18n="is_i18n"
		/>
<!--	</el-config-provider>-->
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElConfigProvider } from "element-plus";
// 导入 Element Plus 语言包
import { messages } from '@/lang'
import { useI18n } from "vue-i18n";
const { locale } = useI18n()
const langOptions = Object.keys(messages)
const language = ref('zh-cn')
// const locale = ref()
watch(language, (val) => {
	locale.value = val // === 'en' ? messages.en : messages['zh-cn']
}, {
	immediate: true
})
console.error(messages, 'messages')
console.error(locale, 'locale')
const value = ref<any>()
const options = ['add', 'restore', 'confirm', 'save', 'cancel', 'reset'].map((t, i) => ({
	value: 'value_' + i,
	label: 'label_' + i,
	cust_value: 'cust_value_' + i,
	cust_label: 'cust_label_' + i,
	i18n_value: i,
	i18n_label: 'le.btn.' + t,
	obj: {
		label: 'obj.l_' + i,
		value: 'obj.val_' + i
	}
}))
const labelOptions = ['label', 'cust_label', 'i18n_label', 'obj.label']
const curLabelKey = ref('label')
const is_i18n = ref(true)
watch(curLabelKey, (val) => {
	is_i18n.value = val === 'i18n_label'
})
const valueOptions = ['value', 'cust_value', 'i18n_value', 'obj.value']
const curValueKey = ref('value')
watch(curValueKey, (val) => {
	value.value = undefined
})
</script>

<style scoped>
.example-showcase .el-select-v2 {
  margin-right: 20px;
}
</style>
