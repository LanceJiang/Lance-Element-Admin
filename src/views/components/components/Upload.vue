<script name="Upload" lang="tsx" setup>
import { ref, watch } from 'vue'
import { ElIcon, ElUpload } from 'element-plus'
import { ElMessage } from 'element-plus'

import UploadEl from '@/components/Upload/index.vue'

import { getHeaders } from '@/utils/request'

const uploadUrl = `${import.meta.env.VITE_APP_BASE_API}/file/upload`

function fileChange(file, status) {
	const name = file.name
	const url = file.url

	console.log(name, url, 'name url', status, file.response)
}
const fileOpts = ref({
	action: uploadUrl,
	// disabled: true,
	// accept: '*'
	// maxCount: 2,
	// fileType: 'image',
	fileType: 'fileExt',
	// listType: 'text',
	// listType: 'picture',
	listType: 'picture-card',
	// accept: '.png,.jpg',
	// accept: '.png',
	// accept: '.xlsx,.xls',
	// accept: 'audio/*',
	fileLimit: 1
	// beforeUpload(file: UploadRawFile) {
	//   const fileSuffix = file.name.substring(file.name.lastIndexOf('.'))
	//   const accepts = ['.jpg', '.jpeg', '.png']
	//   const file_true = accepts.includes(fileSuffix)
	//   if (!file_true) {
	//       ElMessage.warning(`上传文件只能是 ${accepts.join(',')} 格式!`)
	//       return false
	//   }
	//   const isLt5M = file.size / 1024 / 1024 < 5
	//   if (!isLt5M) {
	//       ElMessage.error('上传的文件不能超过 5MB!')
	//       return false
	//   }
	//   return true
	// }
	// multiple: false,
})

const headers = getHeaders()

const importLoading = ref(false)
const fileValue32 = ref([
	{
		uid: 1,
		name: 'a8bda957f9fab23a71abfb98b4288965e13edd54505ac9bee6d93cb246fd83d1.docx',
		status: 'success',
		url: 'https://gooles.oss-cn-hongkong.aliyuncs.com/a8bda957f9fab23a71abfb98b4288965e13edd54505ac9bee6d93cb246fd83d1.docx'
	},
	{
		uid: 2,
		name: '正方形image.png',
		status: 'success',
		url: 'https://ww3.sinaimg.cn/mw690/c86cd298ly1i2bhirc014j20xs0xse1d.jpg'
	},
	{
		uid: 3,
		name: 'pdf.pdf',
		status: 'success',
		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.pdf'
	},
	{
		uid: 4,
		name: 'xls.xls',
		status: 'success',
		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.xls'
	},
	{
		uid: 5,
		// percent: 89, // ant-design-vue
		percentage: 89, // element-plus
		name: 'image.png',
		status: 'uploading',
		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
	},
	{
		uid: 6,
		name: 'image-fail.png',
		status: 'fail',
		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
	},
	{
		uid: 7,
		name: 'height-2.png',
		status: 'success',
		// url: 'https://gooles.oss-cn-hongkong.aliyuncs.com/21872c5cffd457e723605d653345da763824ce3794e6c84d52423a4f8bc99b56.png'
		// url: 'https://fuwu.jlc.com/nw/thumbnail/8613816169529511936'
		url: 'https://b0.bdstatic.com/ugc/YUZi7pgLi9vjKaaNgDurrwa7294572ae0e68ee10242e1b50f8cf9d.jpg'
	},
	{
		uid: 8,
		name: 'width-2.png',
		status: 'success',
		// url: 'https://gooles.oss-cn-hongkong.aliyuncs.com/84acb98b6042691f5940f7cc887ad0c022cecc21c85022358acad13f5809d2bf.png'
		// url: 'https://img1.baidu.com/it/u=2554362709,1009261076&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500'
		url: 'https://imgu.xinnet.com/d/file/20171130/6cb9b5b73d61894d032003f68f3ffff5.png'
	},
	{
		uid: 9,
		name: 'random-photo.png',
		status: 'success',
		url: 'https://picsum.photos/200/100?random=1'
	}
])
watch(fileValue32, val => {
	console.log(val, 'fileValue32   val')
})

// 文件上传结果
function handleChange(file, fileList) {
	console.error(JSON.stringify(file), 'file fileList', fileList)
	// debugger
	const status = file.status
	if (status === 'uploading') {
		importLoading.value = true
		return
	}
	if (status === 'success') {
		importLoading.value = false
		// eg: {data: ["当前SPU编码11已经存在,已创建新SPU"]}
		if (file.response.code !== 200) {
			return Array.isArray(file.response.msg) && file.response.msg.length
				? ElMessage.error(file.response.msg)
				: ElMessage.error(file.response.msg || ['失败'])
		}
		file.url = file.response.data
		// // 文件url
		// emit('update:value', [file])
		/* triggerChange([file]) */ // 出发修改
		// modalChange() // modal.value.visible = false
		// 导入文件成功
		ElMessage.success('导入文件成功')
	}
	if (status === 'fail') {
		// importLoading.value = false
		ElMessage.error('导入失败')
	}
}
</script>

<template>
	<div class="p-2">
		<div class="common_title">ElUpload</div>
		<UploadEl v-bind="fileOpts" :value="fileValue32" @file-change="fileChange" />
		<UploadEl v-bind="fileOpts" size="default" :value="fileValue32" @file-change="fileChange" />
		<UploadEl v-bind="fileOpts" size="small" :value="fileValue32" @file-change="fileChange" />

		<div class="">
			<div class="bg-[red]">ElUpload</div>
			<ElUpload v-model:file-list="fileValue32" v-bind="fileOpts" :headers="headers" @change="handleChange">
				<el-icon><LeIcon icon="ant-design:plus-outlined" /></el-icon>
			</ElUpload>
			<!--			<ElUpload v-model:file-list="fileValue32" v-bind="fileOpts" list-type="picture" @change="handleChange">
				<el-icon><LeIcon icon="ant-design:plus-outlined" /></el-icon>
			</ElUpload>
			<ElUpload v-model:file-list="fileValue32" v-bind="fileOpts" list-type="text" @change="handleChange">
				<el-icon><LeIcon icon="ant-design:plus-outlined" /></el-icon>
			</ElUpload>-->
		</div>
	</div>
</template>

<style scoped lang="scss"></style>
