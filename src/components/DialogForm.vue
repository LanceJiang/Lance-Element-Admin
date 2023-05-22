<template>
	<!--
    申明: 弹窗的展示 visible 在父级定义
         弹窗的展示和隐藏 调用 @changeDialog='changeDialog' // 传参true/false 作为显示隐藏
         测试用例见： testForm的操作
     -->
	<el-dialog
		:title="title"
		:modelValue="visible"
		@update:modelValue="changeVisible"
		:closeOnClickModal="false"
		:width="width"
		modalClass="formDialogWrap"
		@close="changeVisible"
	>
		<FormConfig
			v-if="visible"
			ref="configForm"
			v-bind="formOptions"
			:form-data="formData"
			@submit="$emit('submit', $event)"
			@cancel="changeVisible"
		/>
	</el-dialog>
</template>

<script>
import FormConfig from './FormConfig'

export default {
	name: 'DialogForm',
	components: {
		FormConfig
	},
	emits: ['submit', 'update:visible'],
	props: {
		title: {
			type: String,
			default: '请输入 title 标题'
		},
		formOptions: {
			required: true,
			type: Object,
			default: () => ({
				// form配置数组
				forms: [],
				// form的配置项对象
				formConfig: {}
				/**formConfig: {
          size,
          labelWidth,
          itemWidth,
          span,
          submitLoading,
          submitBtnText,
          showResetBtn,
          resetBtnText,
          showCancelBtn,
        }*/
			})
		},
		// 初始化数据对象
		formData: {
			type: Object,
			default: () => ({})
		},
		visible: {
			type: Boolean,
			required: true
		},
		width: {
			type: String
		}
	},
	data() {
		return {}
	},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		changeVisible(bool = false) {
			this.$emit('update:visible', bool)
		}
	}
}
</script>

<style lang="scss">
.formDialogWrap {
	.el-dialog__body {
		height: auto;
		padding-bottom: 10px;
	}
}
</style>
