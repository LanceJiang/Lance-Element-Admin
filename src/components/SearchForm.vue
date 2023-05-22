<script lang="jsx">
import { getDeepValue } from '@/utils'

const emits = ['update:searchParams']
import {
	defineComponent
	// PropType
} from 'vue'
const props = {
	forms: {
		type: Array,
		required: true
	},
	// 后台传递的初始值 以及 双向绑定 对象
	searchParams: {
		required: true,
		type: Object
	},
	// formModal的配置项对象
	formConfig: {
		type: Object,
		default: () => ({})
	},
	reset: {
		type: Function
	}
}
export const SearchForm = defineComponent({
	name: 'SearchForm',
	emits,
	render() {
		const _this = this
		const { forms, searchParams, formConfig = {}, searchHandler } = this
		let warpClass = 'search-form-container'
		const itemRender = form => {
			const { prop, itemType, itemWidth, options, change, itemStyle = '', ...formOthers } = form
			const _options = options || []

			let disabled = form.disabled
			if (disabled === undefined) {
				disabled = false
			}
			// 优化后的 change事件
			const formatterChange = async () => {
				if (change) {
					return change(searchParams, _options)
				}
			}
			switch (itemType) {
				// 下拉框
				case 'select':
					return (
						<el-select
							{...formOthers}
							v-model={searchParams[prop]}
							onChange={formatterChange}
							style={`${itemStyle} width:${itemWidth || '160px'};`}
							disabled={disabled}
							clearable={form.clearable !== false}
							placeholder={form.placeholder || `请选择${form.label}`}
						>
							{_options.map((option, optionIndex) => {
								const value = typeof option === 'object' ? option[form.valueKey || 'value'] : option
								const label = typeof option === 'object' ? option[form.labelKey || 'label'] : option
								return <el-option key={value} label={label} value={value} />
							})}
						</el-select>
					)
				// 单选框
				case 'radio':
					return (
						<el-radio-group
							v-model={searchParams[prop]}
							{...formOthers}
							disabled={disabled}
							onChange={formatterChange}
							style={`${itemStyle} width:${itemWidth || 'auto'};`}
						>
							{_options.map((option, optionIndex) => {
								const value = typeof option === 'object' ? option[form.valueKey || 'value'] : option
								const label = typeof option === 'object' ? option[form.labelKey || 'label'] : option
								return (
									<el-radio key={optionIndex + '_local'} label={value}>
										{label}
									</el-radio>
								)
							})}
						</el-radio-group>
					)
				// 级联
				case 'cascader':
					return (
						<el-cascader
							{...formOthers}
							v-model={searchParams[prop]}
							onChange={formatterChange}
							style={`${itemStyle} ${itemWidth && 'width: ' + itemWidth};`}
							disabled={disabled}
							clearable={form.clearable ?? true}
							filterable={form.filterable ?? true}
							options={_options}
							placeholder={form.placeholder || `请选择${form.label}`}
						/>
					)
				// 数字
				case 'inputNumber':
					return (
						<el-input-number
							class="rate100"
							{...formOthers}
							v-model={searchParams[prop]}
							onChange={formatterChange}
							style={`${itemStyle} width:${itemWidth || '130px'};`}
							disabled={disabled}
							placeholder={form.placeholder || `${form.label || ''}`}
							precision={form.precision || 0}
						/>
					)

				// 日期选择
				case 'date':
					return (
						<el-date-picker
							{...formOthers}
							v-model={searchParams[prop]}
							onChange={formatterChange}
							style={`${itemStyle} width:${itemWidth || '160px'};`}
							disabled={disabled}
							placeholder={form.placeholder || `请选择${form.label}`}
							value-format={form.valueFormat || 'YYYY-MM-DD'}
						/>
					)
				// 日期区间
				case 'dateRange':
					return (
						<el-date-picker
							type="daterange"
							{...formOthers}
							v-model={searchParams[prop]}
							onChange={formatterChange}
							startPlaceholder={form.startPlaceholder ?? '开始日期'}
							endPlaceholder={form.startPlaceholder ?? '结束日期'}
							style={`${itemStyle} width:${itemWidth || '200px'};`}
							disabled={disabled}
							value-format={form.valueFormat || 'YYYY-MM-DD'}
						/>
					)
				// switch
				case 'switch':
					return <el-switch {...formOthers} v-model={searchParams[prop]} onChange={formatterChange} disabled={disabled} />
				case 'input':
				default:
					return (
						<el-input
							{...formOthers}
							v-model={searchParams[prop]}
							onChange={formatterChange}
							disabled={disabled}
							placeholder={form.placeholder || `请输入${form.label}`}
							style={`${itemStyle} width:${itemWidth || '160px'};`}
						/>
					)
			}
		}
		return (
			<div class={warpClass}>
				<div class="search-form-flex">
					<el-form ref="baseForm" inline={true} size="default" class="search-form-flex-wrap" model={searchParams} {...formConfig}>
						{forms.map((form, idx) => {
							// 通过 form.visible 控制 是否展示
							return (
								<el-form-item v-show={form.visible !== false} key={idx} {...form}>
									{itemRender(form)}
								</el-form-item>
							)
						})}
					</el-form>
					<div class="action-wrap">
						<el-button size="default" plain onClick={this.local_resetHandler}>
							<el-icon>
								<refresh />
							</el-icon>
							重置
						</el-button>
						<el-button size="default" type="primary" onClick={this.searchHandler}>
							<el-icon>
								<search />
							</el-icon>
							查询
						</el-button>
					</div>
				</div>
			</div>
		)
	},
	props,
	data() {
		return {}
	},
	watch: {
		searchParams: {
			handler(data, old) {
				if (!this.initSearchParams) {
					this.initSearchParams = { ...data }
				}
			},
			immediate: true
		}
	},
	created() {},
	methods: {
		// 重置
		local_resetHandler() {
			// 若有reset 将不会触发默认重置的操作
			const emitReset = this.reset
			if (emitReset) {
				emitReset({ ...this.initSearchParams })
			} else {
				// this.$refs.baseForm.resetFields()
				// 撤回为初始化状态
				this.$emit('update:searchParams', { ...this.initSearchParams })
			}
		},
		searchHandler() {
			this.$emit('update:searchParams', { ...this.searchParams })
		}
	}
})
export default SearchForm
/**
 SearchForm的 组件配置
 // 表单配置
 forms > form.itemType:(包含类型)
 // ...

 forms = [
 // {
 //        label: '展示的label',
 //        // showLabel: true, // 默认不展示 (仅在有label 且 未配置 isMore=true showLabel 才进行展示)
 //        // visible: false, // 是否展示当前 form 判断
 //        prop: '提交的model prop',
 //        itemType: 'input', // 渲染类型 (见 form.itemType)
 //        itemWidth: 100, // (Number, String) 宽度设置
 //        itemStyle: 'background: #f00;color:#00f;', // 自定义设置样式
 //        placeholder: '', // 大部分情况下可以使用 label 替代 如有特殊请设置
 //        // 以上为默认公用配置
 //        // otherProps: ... 涉及到其他的配置相关 请参考对应的类型配置
 //    },
 ]
 */
/*
<SearchForm
    v-model:searchParams="searchParams"
    :reset="resetHandler" reset重置 // (initParams) => { you want to do }
/>
*/
</script>

<style scoped lang="scss">
.search-form {
	&-container {
		background-color: #fff;
		margin-bottom: 12px;
		padding: 10px 12px;
	}
	&-flex {
		display: flex;
		.action-wrap {
			padding-left: 12px;
		}
	}
	&-flex-wrap {
		flex: 1;
		flex-wrap: wrap;
	}
}
</style>
