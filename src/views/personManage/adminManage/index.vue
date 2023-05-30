<template>
	<div class="column-page-wrap app-container">
		<!-- 公用搜索组件 -->
		<LeSearchForm v-model:searchParams="searchParams" :forms="forms" />
		<LeTable v-model:searchParams="searchParams" :list="list" :total="total" :options="options" :columns="columns">
			<template #toolLeft>
				<el-button type="primary" @click="testDialog">
					新增<el-icon class="btn-icon"><Plus /></el-icon>
				</el-button>
			</template>
			<template #谷歌验证状态="{ row }">
				<el-tag @click="changGooGleKey(row.id, row.google_key)">
					{{ { 0: '未绑定', 1: '已绑定' }[row.google_key] }}
				</el-tag>
			</template>
			<template #账号状态="{ row }">
				<el-tag @click="changUserStatus(row.id)">
					{{ { 0: '禁用', 1: '正常', 2: '锁定' }[row.status] || '-' }}
				</el-tag>
			</template>
			<template #角色="{ row }">
				<template v-if="row.roles.length">
					<span v-for="item in row.roles" :key="item.id" style="margin-left: 5px">{{ item.name }}</span>
				</template>
				<template>--</template>
			</template>
			<template #操作="{ row }">
				<el-button @click.prevent="changGooGleKey(row.id)"> 删除</el-button>
				<el-button @click.prevent="changeUser(row)"> 修改</el-button>
			</template>
		</LeTable>
	</div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, reactive, watch, toRefs } from 'vue'
// import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
// import md5 from 'js-md5'
import { getAdminList } from '@/api/personManage'
const testDialog = () => {
	console.error('testDialog 新增')
}
const state: any = reactive({
	// 搜索配置
	forms: [
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
			itemType: 'dateRange',
			format: 'YYYY/MM/DD',
			disabled: false
		},
		{
			prop: 'search_status',
			label: '账号状态',
			itemType: 'select',
			options: [
				{ value: 0, label: '禁用' },
				{ value: 2, label: '锁定' },
				{ value: 1, label: '正常' }
			]
		}
	],
	list: [],
	total: 0,
	searchParams: {
		page: 1,
		size: 20,
		search_word: '',
		search_google_key: '',
		search_status: '',
		dateRange: undefined
	},
	// 查询请求参数
	query: {},
	userList: [],
	changeUserList: [],
	// table 的参数
	options: {
		showOverflowTooltip: false,
		loading: false,
		showIndex: true
	},
	// 需要展示的列
	columns: [
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
			minWidth: 160
		},
		{
			prop: 'google_key',
			label: '谷歌验证状态',
			// width: 100
			slots: {
				default: '谷歌验证状态'
			}
		},
		{
			prop: 'status',
			label: '账号状态',
			// width: 100
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
			minWidth: 140
		},
		{
			prop: 'operation',
			label: '操作',
			fixed: 'right',
			width: 100,
			slots: {
				default: '操作'
			}
		}
	]
})

let changeUserVisible = ref(false)

onBeforeMount(() => {
})
// 修改用户账号状态
let changeStatusVisible = ref(false)
let userId: any = null
const changUserStatus = (id: number) => {
	changeStatusVisible.value = true
	userId = id
}

let gooGleKeyId = ref('')
let event = ref('')
const changGooGleKey = (_id: any, key?: any) => {
	if (key || key == 0) {
		if (key == 0) {
			ElMessage({
				showClose: true,
				message: '该用户未绑定谷歌验证,请该用户绑定后,在进行此操作!',
				type: 'error'
			})
			return
		} else {
			gooGleKeyId.value = _id
			event.value = key
			ElMessageBox.confirm('是否解除该账号谷歌验证绑定？', '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'info',
				buttonSize: 'default'
			})
				.then(() => {
					console.log('成功....')
					// changgooGlekey.value = true
				})
				.catch(() => {
					ElMessage({
						showClose: true,
						message: '您取消了解绑此用户谷歌状态!',
						type: 'info'
					})
				})
			// setGoogleKey(data)
		}
	} else {
		event.value = ''
		gooGleKeyId.value = _id
		ElMessageBox.confirm('是否删除该用户？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'info',
			buttonSize: 'default'
		})
			.then(() => {
				console.log('成功....')
				// changgooGlekey.value = true
			})
			.catch(() => {
				ElMessage({
					showClose: true,
					message: '您取消了删除此用户!',
					type: 'info'
				})
			})
	}
}

// const datepicker = ref(null)
//获取管理员列表
const queryList = (params: any) => {
	state.options.loading = true
	getAdminList(params)
		.then(data => {
			state.list = data.data
			state.total = data.total
		})
		.finally(() => {
			state.options.loading = false // 更改加载中的 loading值
		})
}
const updateParams = () => {
	const { dateRange, ...opts } = state.searchParams
	// 时间区间
	if (Array.isArray(dateRange) && dateRange.length) {
		opts.search_begin_date = `${dateRange[0]} 00:00:00`
		opts.search_end_date = `${dateRange[1]} 23:59:59`
	} else {
		opts.search_begin_date = opts.search_end_date = undefined
	}
	state.query = {
		...state.query,
		...opts,
		page: 1
	}
}
// 边听searchParams变化 更新query
watch(
	() => state.searchParams,
	() => {
		updateParams()
	},
	{
		immediate: true
	}
)
// 边听query变化 重新请求
watch(
	() => state.query,
	() => {
		queryList(state.query)
	},
	{
		immediate: true
	}
)

const { list, total, forms, searchParams, columns, options } = toRefs(state)

//修改用户
let changUserRuleForm = reactive({
	name: '',
	phone: '',
	email: '',
	pass: '',
	checkPass: '',
	id: ''
})
let changeUserValue: any = ref([])
let User_arr: any = ref([])
const changeUser = (value: any) => {
	changUserRuleForm.name = value.username
	changUserRuleForm.phone = value.phone
	changUserRuleForm.email = value.email
	changUserRuleForm.id = value.id
	changeUserVisible.value = true
	for (let i of value.roles) {
		changeUserValue.value.push(i.name)
		User_arr.value.push(i)
	}
}
//提交修改用户信息
let key: any = ref([])
</script>

<style lang="scss" scoped>
.button {
	height: 40px;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
</style>
