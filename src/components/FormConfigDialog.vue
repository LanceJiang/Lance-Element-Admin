<script lang="tsx">
import { defineComponent, ref, reactive, watch, toRefs, PropType } from 'vue'
import FormConfig, { FormConfigProps } from './FormConfig/index.vue'
import { ObjectOpts } from '@/components/FormConfig/formConfig.types.ts'

const formConfigDialogProps = {
	title: {
		type: String,
		default: '请输入 title 标题'
	},
	formOptions: {
		required: true,
		type: Object as PropType<FormConfigProps>,
		default: () => ({
			// form配置数组
			forms: [],
			// form的配置项对象
			formConfig: {}
		})
	},
	// 初始化数据对象
	formData: {
		type: Object as PropType<ObjectOpts>,
		default: () => ({})
	},
	modelValue: {
		type: Boolean,
		required: true
	},
	width: {
		type: String
	}
}
const formConfigDialogEmits = ['submit', 'update:modelValue']

export default defineComponent({
	name: 'LeFormConfigDialog',
	components: {
		FormConfig
	},
	emits: formConfigDialogEmits,
	props: formConfigDialogProps,
	setup(props, { emit, slots, attrs, expose }) {
		const formConfigRef = ref(/*formConfigRef*/)
		const changeVisible = (bool = false) => {
			emit('update:modelValue', bool)
		}
		const onSubmit = (params) => {
			emit('submit', params)
		}
		expose({
			formConfigRef,
			changeVisible
		})
		// render
		return () => {
			const { title, modelValue, width, formOptions, formData } = props
			return (
				<el-dialog
					title={title}
					modelValue={modelValue}
					{...attrs}
					closeOnClickModal={false}
					width={width}
					class="le-dialog le-form-config-dialog"
					onClose={changeVisible}
					onUpdate:modelValue={changeVisible}
				>
					{modelValue && <FormConfig
						ref={formConfigRef}
						{...formOptions}
						formData={formData}
						onSubmit={onSubmit}
						onCancel={changeVisible}
						v-slots={slots}
					/>}
				</el-dialog>
			)
		}
	}
})
</script>
