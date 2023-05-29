<template>
	<div class="testTable column-page-wrap">
		<!--  form配置组件  -->
		    <FormConfig
      style="background: #fff;"
        ref="form"
        v-bind="formOptions"
        :form-data="formData"
    >
      <!-- 若有必要可以塞入额外内容 -->
<!--      <template #extraContent>
        <el-col key='extraContent' :span='24'>
          额外内容
        </el-col>
      </template>-->
    </FormConfig>
    <el-row>
      <el-col :span="8" :xs="{span: 11, offset:2}">
        <el-button type="primary" size="small" @click="filterHandler">查找</el-button>
        <el-button type="primary" size="small" @click="resetHandler">重置</el-button>
      </el-col>
    </el-row>
		<!-- 公用搜索组件 -->
		<SearchForm ref="searchForm" v-model:searchParams="searchParams" :forms="forms" />
		<el-button @click="toggleForm">toggleForm</el-button>
		<!--  TableComponent 组件使用 示例：  -->
		<TableComponent
			v-model:searchParams="searchParams"
			:list="list"
			:total="total"
			:options="options"
			:columns="columns"
			:check-selected-key="checkSelectedKey"
		>
			<template #toolLeft>
				<el-button type="primary" @click="addHandler">
					新增<el-icon class="btn-icon"><Plus /></el-icon>
				</el-button>
				<el-button type="danger">
					删除<el-icon class="btn-icon"><Delete /></el-icon>
				</el-button>
				<el-button>
					Upload<el-icon class="btn-icon"><Upload /></el-icon>
				</el-button>
			</template>
			<template #testHeader="{ column }">
				<!-- 如果是自己定义header 时 需要自己添加 header的相关填充 -->
				<div class="slot_title-wrap">
					<el-tooltip placement="top" :content="column.label">
						<span class="label">{{ column.label }}自定义header</span>
					</el-tooltip>
				</div>
			</template>
			<template #testDefault="{ row, column, $index }">
				<div>
					我是 testDefault
					<br />
					value:{{ row[column.property] }}
					<br />
					index: {{ $index }}
				</div>
			</template>
		</TableComponent>
		<AdFormConfigDialog
			ref="dialogRef"
			v-if="visible"
			v-model="visible"
			:title="`${isCreate ? '新增' : '编辑'}配置`"
			width="1200px"
			:formData="activeData"
			:formOptions="formOptions"
			@submit="submitHandler"
		/>
	</div>
</template>

<script lang="tsx">
// eslint-disable-next-line
// @ts-ignore
import FormConfig from '@/components/FormConfig'
import SearchForm from '@/components/SearchForm'
import TableComponent from '@/components/Table'
import {defineComponent, nextTick} from 'vue'
import { getAdminList } from '@/api/personManage'

export default defineComponent({
	name: 'testTable',
	components: {
		FormConfig,
		SearchForm,
		TableComponent
	},
	data() {
		const _this = this
		const forms = [
			{
				prop: 'projectType',
				label: '项目类型',
				itemType: 'select',
				// span: 8,
				// xs: { span: 23 },
				placeholder: '请选择项目类型',
				options: [
					{ value: '类型one', label: '类型一' },
					{ value: '类型two', label: '类型二' }
				]
				/* rules: [
                          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
                      ]*/
			},
			{
				prop: 'projectStage',
				label: '项目阶段',
				itemType: 'select',
				span: 8,
				xs: { span: 23 },
				placeholder: '请选择项目阶段',
				options: [
					{ value: '项目阶段one', label: '项目阶段一' },
					{ value: '项目阶段two', label: '项目阶段二' }
				],
				rules: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
			},
			{
				prop: 'custFullName',
				label: '客户名称',
				itemType: 'input',
				span: 8,
				xs: { span: 23 },
				placeholder: '请输入客户名称Test..............'
				/* rules: [
                          { required: true, message: '请输入客户名称 邮箱', trigger: 'blur' },
                          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                      ]*/
			},

			{
				prop: 'participants',
				label: '参与人员',
				itemType: 'select',
				span: 8,
				xs: { span: 23 },
				placeholder: '请选择参与人员',
				options: [
					{ value: '参与人员one', label: '参与人员一' },
					{ value: '参与人员two', label: '参与人员二' }
				]
				/*  rules: [
                          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
                      ]*/
			},
			{
				prop: 'department',
				label: '所属部门',
				itemType: 'select',
				span: 8,
				xs: { span: 23 },
				placeholder: '请选择所属部门',
				options: [
					{ value: '所属部门one', label: '所属部门一' },
					{ value: '所属部门two', label: '所属部门二' }
				]
				/* rules: [
                          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
                      ]*/
			},
			{
				prop: 'province',
				label: '省份',
				itemType: 'select',
				span: 8,
				xs: { span: 23 },
				placeholder: '请选择省份',
				options: [
					{ value: '省份one', label: '省份一' },
					{ value: '省份two', label: '省份二' }
				]
				/* rules: [
                          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
                      ]*/
			},

			{
				prop: 'industry',
				label: '所属行业',
				itemType: 'select',
				span: 8,
				xs: { span: 23 },
				placeholder: '请选择所属行业',
				options: [
					{ value: '所属行业one', label: '所属行业一' },
					{ value: '所属行业two', label: '所属行业二' }
				],
				rules: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
			},
			{
				prop: 'projectName',
				label: '项目名称',
				itemType: 'input',
				span: 8,
				xs: { span: 23 },
				placeholder: '请输入项目名称'
				/* rules: [
                          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
                      ]*/
			},
			{
				prop: 'securitiesCode',
				label: '证券代码',
				itemType: 'input',
				span: 8,
				xs: { span: 23 },
				placeholder: '请输入证券代码',
				rules: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
			},
			{
				prop: 'bondCode', // 默认走bondCode 对应的  bondCodeStart, bondCodeEnd 两个字段取值 若有不同 请 使用 startKey, endKey 作定义
				// startKey: 'woCaoStart',
				// endKey: 'woCaoEnd',
				label: '债券代码 dateRange',
				itemType: 'dateRange',
				span: 8,
				xs: { span: 23 },
				startPlaceholder: '请输入债券代码dateRangeStart',
				endPlaceholder: '请输入债券代码dateRangeEnd',
				placeholder: '请输入债券代码dateRange',
				rules: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
			},

			{
				prop: 'projectManager',
				label: '时间 Date',
				itemType: 'date',
				span: 8,
				xs: { span: 23 },
				placeholder: '请输入项目经办人',
				rules: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
				/*format: (value, key) => {
          // form表单提交时候 调用的....
          console.warn(value, key, 'value, key')
          return 'value:' + value
        }*/
			},
			{
				prop: 'dataType',
				label: '导出数据',
				itemType: 'radio',
				span: 8,
				xs: { span: 23 },
				placeholder: '是否推荐挂牌转IPO项目',
				options: [
					// '导出当前页面数据',
					// '导出所有数据'
					{ value: 'Y', label: '导出当前页面数据' },
					{ value: 'N', label: '导出所有数据' }
				],
				change(value, options, params) {
					console.warn('dataType change  value, options, params', value, options, params)
				}
			},
			{
				prop: 'resource',
				label: '特殊资源',
				itemType: 'radio',
				span: 15,
				xs: { span: 23 },
				// disabled: true,
				options: [
					{ value: '0', label: '所有状态' },
					{ value: '1', label: '正常' },
					{ value: '2', label: '暂停' },
					{ value: '3', label: '失败' },
					{ value: '4', label: '撤回' },
					{ value: '5', label: '合同终止' }
					// { value: '6', label: '内部终止' },
					// { value: '7', label: '终止(入终止库)' },
					// { value: '8', label: '完成' }
				],
				rules: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]
			}
		]
		const labelWidth = 80
		const span = 23
		const xs = { span: 23 }
		const showResetBtn = true
		return {
			checkSelectedKey: 'id', // 'customerSn', // 查询当前页面数据是否被选中 筛选的唯一key值 【有多选数据不传默认 为 ‘id'】
			isCreate: true,
			visible: false,
			activeData: {},
			// forms,
			// labelWidth,
			// span,
			// xs,
			// showResetBtn,
			forms,
			formOptions: {
				forms,
				labelWidth,
				span,
				xs,
				showResetBtn
			},
			formData: {
				// bondCode: ['2020-09-10', '2020-10-10'],
				securitiesCode: 'securitiesCode',
				dataType: '导出当前页面数据'
			},
			// table 参数
			total: 0, // table数据总条数
			searchParams: {
				page: 1,
				size: 10
			},
			// table数据
			list: [],
			// table 的参数
			options: {
				loading: false,
				showOverflowTooltip: false,
				// stripe: true, // 是否为斑马纹 table
				// loading: false, // 是否添加表格loading加载动画
				// highlightCurrentRow: true, // 是否支持当前行高亮显示
				showIndex: true, // 是否展示 列表序列号
				// showIndex: true, // 是否展示 列表序列号
				// indexLabel: '编号',
				// multipleSelect: true, // 是否支持列表项选中功能
				multipleSelectIndexKey: 'id' // test 根据 id 查找对应的 index
			},
			// 需要展示的列
			columns: [
				{
					// prop: 'name',
					prop: 'username',
					label: '角色',
					// resizable:false,
					slots: {
						header: 'testHeader'
						// default: 'testDefault'
					},
					minWidth: 10
					// formatter: (row, column) => {
					//   console.log(row, column, 'row, column   角色');
					//   return row.name || '- 66666 -'
					// },
					/*params: {
            ellipsis_line: '3'
          }*/
				},
				{
					// slots.default > formatter
					prop: 'add_time',
					label: '创建日期',
					sortable: true,
					minWidth: 100,
					titleHelp: {
						message: 'todo:我是问号提示测试'
					},
					slots: {
						// header: 'testDefault',
						// default: 'testDefault'
					},
					formatter: (row: any, column: any) => {
						// console.log(row, column, 'row, column');
						/** 若在内部用到jsx写法 需要在 script 新增 lang 为 jsx || tsx */
						return <div style="background: #f0f;">${row.name || '- 66666 -'}</div>
						// return row.name || '- 66666 -'
					}
				},
				{
					prop: 'describe',
					label: '备注信息',
					width: 100,
					slots: {
						header: '备注信息header'
						// default: '备注信息default',
						// default: ({ column, row, $index }) => {
						//   return `value: ${row[column.property]} index: ${$index} default function 自定义`
						//   // console.warn(...args, 'test....')
						// },
						// default: 'testDefault'
					}
				},
				{
					prop: 'describe',
					label: '操作',
					width: 100
				}
			]
		}
	},
	watch: {
		searchParams() {
			console.log(this.searchParams, 'searchParams 更新')
			this.queryList()
		}
	},
	created() {
		// this.queryList()
		setTimeout(() => {
			this.searchParams = {
				page: 1,
				size: 10,
				projectType: '类型one'
			}
			// debugger
			const ref = this.$refs.searchForm
			ref.forceUpdateInitParams() // (this.searchParams)
		})
		nextTick(() => {
			console.error(this.$refs.searchForm, 'this.$refs.searchForm')
			window.searchForm = this.$refs.searchForm

		})
	},
	methods: {
		addHandler() {
			this.isCreate = true
			this.activeData = {}
			this.visible = true
		},
		toggleForm() {
			const idx = this.forms.findIndex((v) => v.prop === 'projectType')
			if(idx >= 0) {
				this.forms.splice(idx, 1)
			} else {
				this.forms.unshift({
					prop: 'projectType',
					label: '项目类型',
					itemType: 'select',
					// span: 8,
					// xs: { span: 23 },
					placeholder: '请选择项目类型',
					options: [
						{ value: '类型one', label: '类型一' },
						{ value: '类型two', label: '类型二' }
					]
					/* rules: [
														{ required: true, message: '请输入邮箱地址', trigger: 'blur' }
												]*/
				})
			}
		},
		// 重置form表单参数
		resetHandler() {
			// @ts-ignore
			// window.form = this.$refs['form']
			this.$refs['form']!.resetHandler()
		},
		filterHandler() {
			const _form = this.$refs['form']
			console.error(_form, '_form')
			// @ts-ignore
			_form.getParams((error: any, params: any) => {
				if (!error) {
					console.warn(params, 'filterHandler  form 参数获取 测试')
					this.formData = params
					// this.queryList()
				} else {
					console.log('error filterHandler', error)
				}
			})
		}, // 查找
		// 初始化列表
		queryList() {
			const _this = this
			const { options, formData } = this
			// console.error(formData, 'formData todo...')
			options.loading = true
			console.log('搜索参数： ', this.searchParams)
			getAdminList(this.searchParams)
				.then((data: any) => {
					// const { total, list } = data
					const { total, data: list } = data
					this.total = total
					list.push({})
					_this.list = list
				})
				.finally(() => {
					_this.options.loading = false // 更改加载中的 loading值
				})
		},
		testClick() {
			console.error('我曹 竟然 click 了...')
		},
		submitHandler(params) {
			this.formOptions.loading = true
			// const submitParams = {
			//   ...params
			// }
			const addConfig = () =>
				new Promise(resolve => {
					setTimeout(() => {
						resolve({ data: true, code: 200 })
					}, 1000)
				})
			const editConfig = addConfig
			;(this.isCreate ? addConfig : editConfig)(params)
				.then(data => {
					this.$message.success(`${this.isCreate ? '新增' : '修改'}成功~`)
					// ElMessage.success(`${this.isCreate ? '新增' : '修改'}成功~`)
					this.visible = false
					// this.searchParams = {
					//   ...this.searchParams,
					//   page: 1
					// }
				})
				.finally(() => {
					this.formOptions.loading = false
				})
		}
	}
})
</script>

<style scoped lang="scss">
.testTable {
	padding: 10px;
}
</style>
