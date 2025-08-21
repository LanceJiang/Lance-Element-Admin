// import type { UploadFile, UploadProps } from 'ant-design-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
export interface Props {
	value: UploadFile[]
	// 接受的文件类型
	/**
	 * 通过,拼接的 文件类型
	 * eg:
	 * 1. 以.开头的合法文件名扩展名 如: .jpg、.pdf 或 .doc
	 * 2. MIME 类型字符串 如: image/png、audio/webm (https://developer.mozilla.org/zh-CN/docs/Web/HTTP/MIME_types)
	 * 3. 字符串 audio/*，表示“任何音频文件”
	 * 4. 字符串 video/*，表示“任何视频文件”
	 * 5. 字符串 video/*，表示“任何视频文件”
	 * 6.字符串 image/*，表示“任何图片文件”
	 * 7. 通配符 * 匹配所有类型
	 *
	 */
	accept: string
	/**
	 *  image: 默认所有图片
	 *  fileExt: 传递具体.xxx(.文件扩展名) 校验需要配置 `accept` 配合使用 如: .jpg、.pdf 或 .doc
	 *  all: 所有
	 */
	fileType: 'all' | 'image' | 'fileExt'
	// 文件上传大小限制(MB)
	fileLimit: number
	showUploadList: boolean | UploadProps['showUploadList']
	text: string
	uploadUrl: string
	// 提示
	tips?: string
	// 提示
	maxCount?: number
	multiple: boolean
	disabled: boolean
	removeConfirm: boolean
	// ??? todo
	buttonVisible: boolean
	size?: 'small' | 'default'
}

export type EmitStatus = 'uploading' | 'done' | 'error'

export interface UploadEmits {
	change: [value: UploadFile[]]
	'update:value': [value: UploadFile[]]
	fileChange: [file: UploadFile, status: EmitStatus]
}
