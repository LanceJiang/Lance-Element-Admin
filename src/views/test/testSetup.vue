<template>
	<div class="app-container">
		<!-- 搜索表单 -->
		<el-form ref="queryFormRef" :model="queryParams" :inline="true">
			<el-form-item>
				<el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
				<el-button type="danger" :icon="Delete" click="handleDelete" :disabled="multiple">删除</el-button>
			</el-form-item>

			<el-form-item prop="name">
				<el-input v-model="queryParams.name" placeholder="品牌名称" />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
				<el-button :icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>
		<Child/>
	</div>
</template>

<script setup lang="ts" name="testSetup">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Refresh, Delete } from '@element-plus/icons-vue'
const queryFormRef = ref() // 属性名必须和元素的ref属性值一致
import Child from './setupComponent.vue'
const state = reactive({
	loading: true,
	// 选中ID数组
	ids: [],
	// 非单个禁用
	single: true,
	// 非多个禁用
	multiple: true,
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		name: ''
	},
	brandList: [],
	total: 0,
	dialog: {
		title: '',
		visible: false
	},
	formData: { sort: 1 },
	rules: {
		name: [
			{
				required: true,
				message: '请输入品牌名称',
				trigger: 'blur'
			}
		]
	}
})

const { loading, multiple, queryParams, brandList, total, dialog, formData, rules } = toRefs(state)
function handleQuery() {
	state.loading = true
	// listBrandPages(state.queryParams).then(({ data }) => {
	//   state.brandList = data.list
	//   state.total = data.total
	//   state.loading = false
	// })
}
function resetQuery() {
	queryFormRef.value.resetFields()
	handleQuery()
}

function handleAdd() {
	state.dialog = {
		title: '添加品牌',
		visible: true
	}
}

function handleUpdate(row: any) {
	state.dialog = {
		title: '修改品牌',
		visible: true
	}
	const brandId = row.id || state.ids
	// getBrandFormDetail(brandId).then(({ data }) => {
	//   state.formData = data
	// })
}

/**
 * 表单提交
 */
function submitForm() {
	// dataFormRef.value.validate((isValid: boolean) => {
	//   if (isValid) {
	//     if (state.formData.id) {
	//       // updateBrand(state.formData.id, state.formData).then(() => {
	//       //   ElMessage.success('修改成功')
	//       //   cancel()
	//       //   handleQuery()
	//       // })
	//     } else {
	//       // addBrand(state.formData).then(() => {
	//       //   ElMessage.success('新增成功')
	//       //   cancel()
	//       //   handleQuery()
	//       // })
	//     }
	//   }
	// })
}

/**
 * 取消
 */
function cancel() {
	state.dialog.visible = false
}

/**
 * 删除
 */
function handleDelete(row: any) {
	// const ids = [row.id || state.ids].join(',')
	ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			// deleteBrands(ids).then(() => {
			//   ElMessage.success('删除成功')
			//   handleQuery()
			// })
		})
		.catch(() => ElMessage.info('已取消删除'))
}

onMounted(() => {
	handleQuery()
})
</script>

<style scoped></style>
