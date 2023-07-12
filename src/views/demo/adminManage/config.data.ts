import { LeFormItem } from '@/components/FormConfig/formConfig.types.ts'
import { LeTableColumnProps } from '@/components/Table'

// 状态枚举
export const statusOptions = [
	{ value: 0, label: '禁用' },
	{ value: 2, label: '锁定' },
	{ value: 1, label: '正常' }
]
export const statusOptions_config = statusOptions.reduce((res: { [key: string]: any }, { label, value }) => {
	res[value] = label
	return res
}, {})

// 角色枚举
const rolesOptions = [
	{
		label: '超级管理员',
		value: 0
	},
	{
		label: '管理员',
		value: 1
	},
	{
		label: '成员',
		value: 2
	}
]
export const forms: LeFormItem[] = [
	{
		prop: 'username',
		label: '用户名',
		itemType: 'input',
		rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
	},
	{
		prop: 'phone',
		label: '手机号',
		itemType: 'input',
		// type: 'tel',
		rules: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
	},
	{
		prop: 'email',
		label: '邮箱',
		itemType: 'input',
		rules: [
			{ required: true, message: '请输入邮箱', trigger: 'blur' },
			{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
		]
	},
	{
		prop: 'status',
		label: '账号状态',
		itemType: 'select',
		options: statusOptions
	},
	{
		prop: 'roles',
		label: '角色',
		itemType: 'select',
		options: rolesOptions,
		multiple: true,
		rules: [{ required: true, message: '请选择角色', trigger: ['blur'] }]
	}
]
export const search_forms: LeFormItem[] = [
	{
		prop: 'search_word',
		label: '查询用户名/手机号/邮箱',
		itemType: 'input',
		itemWidth: '230px'
	},
	{
		prop: 'search_google_key',
		label: '是否绑定谷歌验证器',
		itemType: 'select',
		itemWidth: '230px',
		options: [
			{ value: 1, label: '已绑定' },
			{ value: 0, label: '未绑定' }
		]
	},
	{
		prop: 'dateRange',
		label: '时间区间',
		itemType: 'datePicker',
		type: 'daterange',
		format: 'YYYY/MM/DD'
	},
	{
		prop: 'search_status',
		label: '账号状态',
		itemType: 'select',
		options: statusOptions
	}
]
export const columns: LeTableColumnProps[] = [
	{
		prop: 'username',
		label: '用户名',
		minWidth: 120
	},
	{
		prop: 'phone',
		label: '手机号',
		minWidth: 140
	},
	{
		prop: 'email',
		label: '邮箱',
		minWidth: 200
	},
	{
		prop: 'google_key',
		label: '谷歌验证状态',
		width: 120,
		slots: {
			default: '谷歌验证状态'
		}
	},
	{
		prop: 'status',
		label: '账号状态',
		width: 100,
		slots: {
			default: '账号状态'
		}
	},
	{
		prop: 'roles',
		label: '角色',
		minWidth: 180,
		slots: {
			default: '角色'
		}
	},
	{
		prop: 'add_time',
		label: '创建时间',
		minWidth: 180
	},
	{
		prop: 'operation',
		label: '操作',
		fixed: 'right',
		minWidth: 140,
		slots: {
			default: '操作'
		}
	}
]
