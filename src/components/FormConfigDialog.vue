<script lang="jsx">
import FormConfig from './FormConfig'

const render = function() {
	const { title, modelValue, width, changeVisible, formOptions, formData } = this
	return <el-dialog
		title={title}
		modelValue={modelValue}
		props={this.$attrs}
		closeOnClickModal={false}
		width={width}
		class="ad-dialog ad-form-config-dialog"
		// on={on}
		onClose={changeVisible}
		onUpdate:modelValue={changeVisible}
	>
		{
			modelValue && <FormConfig
				ref="configForm"
				{...formOptions}
				form-data={formData}
				onSubmit={this.onSubmit}
				onCancel={changeVisible}
				v-slots={this.$slots}
			/>
		}
	</el-dialog>
}

export default {
	name: 'AdFormConfigDialog',
	components: {
		FormConfig
	},
	render,
	emits: ['submit', 'update:modelValue'],
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
		modelValue: {
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
			this.$emit('update:modelValue', bool)
		},
		onSubmit(events) {
			this.$emit('submit', events)
		}
	}
}
</script>

