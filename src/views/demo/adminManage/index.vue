<template>
	<div class="column-page-wrap">
		<!-- 公用搜索组件 -->
		<LeSearchForm v-model:searchData="searchData" :forms="searchForms" :loading="tableOpts.options.loading" />
		<!-- 公用Table组件 -->
		<LeTable v-model:searchParams="tableOpts.searchParams" v-bind="tableOpts">
			<template #toolLeft>
				<el-button type="primary" size="default" @click="addItem">
					新增<el-icon><Plus /></el-icon>
				</el-button>
			</template>
			<template #谷歌验证状态="{ row }">
				<el-tag :type="['info', 'success'][row.google_key]" @click="changGooGleKey(row.id, row.google_key)">
					{{ { 0: '未绑定', 1: '已绑定' }[row.google_key] }}
				</el-tag>
			</template>
			<template #账号状态="{ row }">
				<el-tag :type="['success', 'info', 'warning'][row.status]">
					{{ { 0: '禁用', 1: '正常', 2: '锁定' }[row.status] || '-' }}
				</el-tag>
			</template>
			<template #角色="{ row }">
				<template v-if="row.roles.length">
					<span v-for="item in row.roles" :key="item.id" style="margin-left: 5px">{{ item.name }}</span>
				</template>
				<template>-</template>
			</template>
			<template #操作="{ row }">
				<el-button size="small" type="danger" @click.prevent="changGooGleKey(row.id)"> 删除</el-button>
				<el-button size="small" @click="changeItem(row)"> 修改</el-button>
			</template>
		</LeTable>
		<!-- 编辑表单弹窗 -->
		<LeFormConfigDialog
			v-if="dialog.visible"
			ref="dialogRef"
			v-model="dialog.visible"
			v-bind="dialog"
			:formData="activeData"
			:title="`${dialog.isCreate ? '新增' : '编辑'}管理员`"
			@submit="submitHandler"
		/>
	</div>
</template>
<script setup lang="ts" name="adminManage">
import { ref, reactive, watch, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminList, queryEdit } from '@/api/demo'
import { forms, search_forms, columns } from './config.data.ts'
import { useTablePage } from '@/hooks/useTablePage'
import { SearchParams } from '@/components/Table'

// todo ... 尝试调整 state 编写 合适的 Hooks 进行替换
// 搜索配置
const searchForms = ref(search_forms)
const state: any = reactive({
	// 需要展示的列
	columns,
	activeData: {},
	// 弹窗配置
	dialog: {
		visible: false,
		isCreate: true,
		formOptions: {
			forms,
			formConfig: {
				labelWidth: 80,
				itemWidth: '100%',
				submitLoading: false
			}
			// isEdit: false
		}
	}
})
const updateParams = () => {
	const { dateRange, ...opts } = searchData.value || {}
	// 时间区间
	if (Array.isArray(dateRange) && dateRange.length) {
		opts.search_begin_date = `${dateRange[0]} 00:00:00`
		opts.search_end_date = `${dateRange[1]} 23:59:59`
	} else {
		opts.search_begin_date = opts.search_end_date = undefined
	}
	tableOpts.searchParams = {
		...(tableOpts.searchParams as SearchParams),
		...opts,
		page: 1
	}
}
//获取管理员列表
const queryList = () => {
	// const params = getRequestParams() // todo...
	const params = tableOpts.searchParams
	console.error(JSON.stringify(params), '请求参数')
	tableOpts.options.loading = true
	getAdminList(params)
		.then((data: any) => {
			console.error(data, 'data...')
			tableOpts.list = data.data
			tableOpts.total = data.total
		})
		.finally(() => {
			tableOpts.options.loading = false // 更改加载中的 loading值
		})
}
const { tableOpts, searchData } = useTablePage(
	{
		// 搜索数据
		searchParams: {
			page: 1,
			size: 20
		},
		columns,
		options: {
			// showOverflowTooltip: false,
			loading: false,
			showIndex: true,
			size: 'small'
		}
	},
	{
		searchData: {
			search_word: 'search_word',
			search_google_key: 1,
			search_status: 1,
			// dateRange: undefined
			dateRange: ['06/29/2023', '06/30/2023']
		},
		updateParams,
		queryList
	}
)
/*const getRequestParams = () => {
	const { dateRange, ...opts } = tableOpts?.searchParams || {}
	// 时间区间
	if (Array.isArray(dateRange) && dateRange.length) {
		opts.search_begin_date = `${dateRange[0]} 00:00:00`
		opts.search_end_date = `${dateRange[1]} 23:59:59`
	} else {
		opts.search_begin_date = opts.search_end_date = undefined
	}
	state.query = {
		...state.query,
		...opts
	}
	return state.query
}*/

const { dialog, activeData } = toRefs(state)
const submitHandler = params => {
	dialog.value.formOptions.formConfig.submitLoading = true
	if (!dialog.value.isCreate) {
		// 编辑
		params.id = activeData.value.id
	}
	queryEdit(params)
		.then(data => {
			ElMessage.success(`${dialog.value.isCreate ? '新增' : '修改'}成功~`)
			dialog.value.visible = false
			updateParams()
		})
		.finally(() => {
			dialog.value.formOptions.formConfig.submitLoading = false
		})
}
const dialogRef = ref()
const addItem = () => {
	activeData.value = {}
	dialog.value.isCreate = true
	dialog.value.visible = true
	// window.dialogRef = dialogRef // 测试ref
}

const changeItem = (value: any) => {
	console.log('修改', value)
	const info = { ...value, roles: (value.roles || []).map(v => v.id) }
	activeData.value = info
	dialog.value.isCreate = false
	dialog.value.visible = true
}
const changGooGleKey = (_id: any, key?: any) => {
	if (key === 0) {
		return ElMessage({
			message: '该用户未绑定谷歌验证,请该用户绑定后,在进行此操作!',
			type: 'error'
		})
	}
	if (key) {
		ElMessageBox.confirm('是否解除该账号谷歌验证绑定？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			// type: 'info',
			buttonSize: 'default'
		}).then(() => {
			ElMessage({
				message: '解绑成功!',
				type: 'success'
			})
		})
	} else {
		ElMessageBox.confirm('是否删除该用户？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'info',
			buttonSize: 'default'
		})
			.then(() => {
				ElMessage({
					message: '删除成功!',
					type: 'success'
				})
				updateParams()
			})
			.catch(() => {
				console.log('取消')
			})
	}
}
</script>

<style lang="scss" scoped></style>
