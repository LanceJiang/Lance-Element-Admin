<script lang="tsx" setup>
import type { UploadFile, UploadRawFile, UploadInstance } from 'element-plus'
import { ElIcon, ElMessageBox, ElProgress, ElUpload } from 'element-plus'
import { computed, ref, useAttrs } from 'vue'
import type { EmitStatus } from './index'
import { commonDownload, t } from '@/utils'
import LeIcon from '@/components/Icon.vue'
import { ElMessage } from 'element-plus'
import { getHeaders } from '@/utils/request'
import { getFileExt, isImageByExt } from '@/utils/file'

defineOptions({ name: 'LeUpload' })

const props = defineProps({
	value: {
		type: Array as PropType<UploadFile[]>
	},
	// 接受的文件类型
	accept: {
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
		type: String
	},
	fileType: {
		/**
		 *  image: 默认所有图片
		 *  fileExt: 传递具体.xxx(.文件扩展名) 校验需要配置 `accept` 配合使用 如: .jpg,.pdf 或 .doc
		 *  all: 所有
		 */
		type: String as PropType<'all' | 'image' | 'fileExt'>,
		default: 'all'
	},
	// 文件上传大小限制(MB)
	fileLimit: {
		type: Number,
		default: 10
	},
	text: {
		type: String,
		// default: '上传'
		default: t('le.el.upload.upload')
	},
	uploadUrl: {
		type: String,
		default: `${import.meta.env.VITE_APP_BASE_API}/file/upload`
	},
	// 提示
	tips: {
		type: String
	},
	// 最大上传数量
	maxCount: {
		type: Number
	},
	multiple: {
		type: Boolean,
		default: true
	},
	disabled: {
		type: Boolean,
		default: false
	},
	// 删除时是否显示确认框
	removeConfirm: {
		type: Boolean,
		default: false
	},
	size: {
		type: String as PropType<'small' | 'default' | 'large'>,
		default: 'large'
	}
})
const emit = defineEmits<{
	change: [value: UploadFile[]]
	'update:value': [value: UploadFile[]]
	fileChange: [file: UploadFile, status: EmitStatus]
}>()
const prefixCls = `le-upload`
const attrs = useAttrs()
const headers = getHeaders()
// refs
const uploadRef = ref<UploadInstance>()
// 是否达到了最大上传数量
const isMaxCount = computed(() => props.maxCount > 0 && props.value?.length >= props.maxCount)
// 合并 props 和 attrs
const bindProps = computed(() => {
	const bind: any = Object.assign({ name: 'file' }, props, attrs)
	// console.log(bind, 'bind.......')
	/* biz:这个属性用于控制文件上传的业务路径 */
	bind.data = { biz: 'temp', ...bind.data }
	if (bind.fileType === 'image' && !bind.listType) {
		// picture text picture-card
		bind.listType = 'picture-card'
	}
	if (bind.listType === 'picture-card' && !bind.accept) bind.accept = 'image/*'
	// 用于 渲染自定义图标
	if (!bind.iconRender) {
		bind.iconRender = ({ file }) => {
			const isLoading = file.status === 'uploading'
			const ext = getFileExt(file.url)
			let type = 'ep:document'
			if (isLoading) type = 'eos-icons:bubble-loading'
			else if (isImageByExt(file.url)) return <img class="local_icon-image" src={file.url} />
			else if (['.pdf', '.ppt', '.pptx'].includes(ext)) type = 'vscode-icons:file-type-powerpoint2'
			else if (['.doc', '.docx'].includes(ext)) type = 'vscode-icons:file-type-word'
			else if (['.xls', '.xlsx'].includes(ext)) type = 'vscode-icons:file-type-excel'
			return <LeIcon icon={type} />
		}
	}
	return bind
})
// 当前是否是上传图片模式
const isPictureCard = computed(() => bindProps.value.listType === 'picture-card')
function getAccepts(accept: string) {
	return accept.replace(/\s/g, '').split(',')
}

// 默认 文件上传之前的操作 若有 其他判断 建议自行传beforeUpload 自定义
// function defaultBeforeUpload(file: UploadFile) {
function defaultBeforeUpload(file: UploadRawFile) {
	let bool = true
	// console.error('defaultBeforeUpload', file, JSON.stringify(fileList))
	const fileType = props.fileType
	if (bindProps.value.accept === 'image/*') {
		// 当前是否是上传图片模式
		if (!file.type!.includes('image')) {
			ElMessage.warning(t('le.el.upload.acceptImage'))
			bool = false
		}
	} else if (fileType === 'fileExt') {
		const fileSuffix = getFileExt(file.name)
		if (props.accept) {
			const accepts = getAccepts(props.accept)
			if (!accepts.includes(fileSuffix)) {
				// 只能上传 {.ppt,.pptx,.doc,.docx,.xls,.xlsx,.pdf,.txt,.jpg,.jpeg,.png,.gif,.bmp}格式文件
				ElMessage.warning(t('le.el.upload.acceptUpload', [accepts.join(',')]))
				bool = false
			}
		}
	}
	if (bool && props.fileLimit && file.size / 1024 / 1024 > props.fileLimit) {
		// 单个文件大小不超过{0}MB
		ElMessage.warning(t('le.el.upload.maxSize', [props.fileLimit]))
		bool = false
	}
	return bool
}

// 用于 file slot 中的删除
async function handleRemove(file: UploadFile) {
	// emit('remove', file) // todo...
	const before = await beforeRemove() //  fileList
	if (before) {
		const fileList = props.value || []
		const idx = fileList.findIndex(f => f.uid === file.uid)
		idx >= 0 && fileList.splice(idx, 1)
	}
}

// 删除处理事件
function beforeRemove(/* file: UploadFile, uploadFiles: UploadFile[] */) {
	if (props.removeConfirm) {
		return ElMessageBox.confirm(t('le.el.upload.delConfirm'), t('le.el.upload.del'), {
			// confirmButtonText: '确定',
			// cancelButtonText: '取消',
			type: 'warning'
		})
			.then(() => {
				return true
			})
			.catch(() => {
				return false
			})
	}
	return true
}

function getFileIdx(file: UploadFile, fileList: UploadFile[]): number {
	const uid = file.uid
	return fileList.findIndex(f => f.uid === uid)
}

// upload组件change事件
// function handleChange(params: UploadChangeParam) {
// const { file /* , event */ } = params
// const fileList = params.fileList
function handleChange(file: UploadFile, fileList: UploadFile[]) {
	const status = file.status
	// 文件刚上传时 emit('uploading')
	if (status === 'uploading' && !file.percentage) emit('fileChange', file, 'uploading')

	if (['done', 'error'].includes(status as string)) {
		const idx = getFileIdx(file, fileList)
		if (idx === -1) return
		// 成功处理
		if (file.status === 'success') {
			const { code, data, msg } = file.response
			let emitStatus: EmitStatus = 'success'
			// 错误处理 code !== 200: 有错误
			if (code !== 200) {
				ElMessage.error(msg || t('le.el.upload.uploadErrorTip'))
				emitStatus = 'fail'
				fileList.splice(idx, 1)
			} else {
				fileList[idx].url = data
			}
			emit('fileChange', file, emitStatus)
		} else {
			// 失败
			if (file.status === 'fail') {
				ElMessage.error(t('le.el.upload.uploadErrorTip', [file.name]))
				emit('fileChange', file, 'fail')
			}
			fileList.splice(idx, 1)
		}
	}
	emitValue(fileList)
}

// 预览文件、图片
function handlePreview(file) {
	if (file.type?.indexOf('image') >= 0 || isImageByExt(file.url)) {
		console.error('图片', file.url)
		// createImgPreview({ imageList: [file.url], maskClosable: true })
	} else {
		window.open(file.url)
	}
}
function handleDownload(file: UploadFile) {
	commonDownload(file.url as string, file.name)
}
function emitValue(value: UploadFile[]) {
	emit('change', value)
	emit('update:value', value)
}

defineExpose({
	uploadRef
})
</script>

<template>
	<div :class="`${prefixCls}-container ${prefixCls}-container--${size}`">
		<slot name="tips">
			<div v-if="tips" class="tip my-7px text-12px text-#8a8886">
				{{ tips }}
			</div>
		</slot>
		<ElUpload
			ref="uploadRef"
			:headers="headers"
			:action="uploadUrl"
			v-bind="bindProps"
			:before-upload="bindProps.beforeUpload || defaultBeforeUpload"
			:file-list="value"
			:before-remove="beforeRemove"
			@change="handleChange"
		>
			<!-- @preview="handlePreview" -->
			<slot>
				<template v-if="isPictureCard">
					<div v-if="!isMaxCount" class="text-center">
						<LeIcon size="18" icon="ant-design:plus-outlined" />
						<div class="ant-upload-text">
							{{ text }}
						</div>
					</div>
				</template>
				<el-button v-else :disabled="isMaxCount || disabled">
					<LeIcon size="18" icon="ant-design:upload-outlined" />
					<span>{{ text }}</span>
				</el-button>
			</slot>
			<!-- 自定义file 渲染: 目前仅针对 picture-card 做自定义渲染 -->
			<!--     v-if="$slots.file || isPictureCard"     -->
			<template #file="{ file, index }">
				<slot name="file" :file="file" :index="index">
					<!-- picture/picture-card 图片渲染 -->
					<div
						v-if="bindProps.listType === 'picture' || /*file.status !== 'uploading' &&*/ bindProps.listType === 'picture-card'"
						class="el-upload-list__item-thumbnail-wrap"
					>
						<component :is="bindProps.iconRender({ file })" />
					</div>
					<!--              <img
											v-if="
						listType === 'picture' ||
						(file.status !== 'uploading' && listType === 'picture-card')
					"
											:class="nsUpload.be('list', 'item-thumbnail')"
											:src="file.url"
											:crossorigin="crossorigin"
											alt=""
							/> -->
					<!-- el-upload-list__item-thumbnail -->

					<!--           常规文件渲染 todo... -->
					<div v-if="file.status === 'uploading' || bindProps.listType !== 'picture-card'" class="el-upload-list__item-info">
						<a class="el-upload-list__item-name" @click.prevent="handlePreview(file)">
							<div v-if="bindProps.listType === 'text'" class="el-upload-upload-text-icon">
								<component :is="bindProps.iconRender({ file })" />
							</div>
							<!-- todo delete
							<el-icon class="el-icon&#45;&#45;document">
								&lt;!&ndash;                        <Document /> &ndash;&gt;
								<LeIcon icon="ep:document" />
							</el-icon> -->
							<span class="el-upload-list__item-file-name" :title="file.name">
								{{ file.name }}
							</span>
						</a>
						<!--            <el-progress
							v-if="file.status === 'uploading'"
							:type="bindProps.listType === 'picture-card' ? 'circle' : 'line'"
							:stroke-width="bindProps.listType === 'picture-card' ? 6 : 2"
							:percentage="+file.percentage"
							:style="bindProps.listType === 'picture-card' ? '' : 'margin-top: 0.5rem'"
						/> -->
						<el-progress v-if="file.status === 'uploading'" type="line" :stroke-width="2" :percentage="+file.percentage" />
					</div>
					<!-- 文件-状态 -->
					<label class="el-upload-list__item-status-label">
						<el-icon v-if="bindProps.listType === 'text'" class="el-icon--upload-success el-icon--circle-check">
							<LeIcon icon="ep:circle-check" />
							<!-- <circle-check /> -->
						</el-icon>
						<el-icon v-else-if="['picture-card', 'picture'].includes(bindProps.listType)" class="el-icon--upload-success el-icon--check">
							<LeIcon icon="ep:check" />
							<!-- <Check /> -->
						</el-icon>
					</label>
					<div class="el-upload-list__item-actions">
						<!-- action.下载 -->
						<LeIcon v-if="file.status === 'success'" class="action action--download" icon="ep:download" @click="handleDownload(file)" />
						<!-- action.删除 -->
						<LeIcon v-if="!disabled" class="action action--close" icon="ep:close" @click="handleRemove(file)" />
					</div>
					<!--  todo -->
					<i v-if="!disabled" class="el-icon--close-tip">按 delete 键可删除</i>
					<!-- picture-card actions -->
					<div v-if="bindProps.listType === 'picture-card'" class="el-upload-list__item-actions actions--picture-card">
						<!-- 查看 -->
						<LeIcon class="action action--view" icon="ep:view" @click="handlePreview(file)" />
						<!-- 下载 -->
						<LeIcon v-if="file.status === 'success'" class="action action--download" icon="ep:download" @click="handleDownload(file)" />
						<!-- 删除 -->
						<LeIcon v-if="!disabled" class="action action--delete" icon="ep:delete" @click="handleRemove(file)" />
					</div>
				</slot>
			</template>
		</ElUpload>
	</div>
</template>

<style lang="scss">
$prefix-cls: '#{$prefix}upload';

.#{$prefix-cls}-container {
	position: relative;

	.el-upload-list {
		// listType: text
		&--text {
			// 文件 自定义小图标
			.el-upload-upload-text-icon {
				color: var(--el-text-color-secondary);
				margin-right: 6px;
				.local_icon-image {
					display: block;
					width: 1.2em;
					height: 1.2em;
					overflow: hidden;
					object-fit: contain;
				}
			}
			.el-upload-list__item {
				//background-color: var(--el-fill-color-lighter);
				background-color: var(--el-fill-color-extra-light);
				&:hover {
					background-color: var(--el-fill-color-light);
				}
				&-info {
					flex: 1;
					width: 0;
					margin-left: 0;
				}
				&:hover {
					.el-upload-list__item-actions {
						opacity: 1;
					}
				}
				.el-upload-list__item-actions {
					opacity: 0;
					//padding-right: 16px;
					padding-right: 2px;
				}
			}
		}
		// listType: picture
		&--picture {
			.el-upload-list__item {
				&-thumbnail {
					&-wrap,
					&-wrap img {
						width: 70px;
						height: 70px;
						//position: static;
						//display: block;
						//width: 100%;
						//height: 1;
					}
					&-wrap {
						// 自定义小图标
						.le-icon {
							font-size: 70px;
						}
					}
				}
				&-info {
					flex: 1;
					width: 0;
					margin-left: 0;
				}
				.el-progress {
					bottom: unset;
				}
			}
			// 文件 自定义小图标
			.el-upload-upload-text-icon {
				color: var(--el-text-color-secondary);
				margin-right: 6px;
				.local_icon-image {
					display: block;
					//width: 1.2em;
					//height: 1.2em;
					width: 70px;
					height: 70px;
					overflow: hidden;
					object-fit: contain;
				}
			}
		}
		// listType: picture-card
		&--picture-card {
			gap: 6px;
			.el-upload-list__item {
				margin: 0;
				flex-direction: column;
				&-status-label {
					.le-icon {
						font-size: 12px;
						//margin-top: 11px;
						//transform: rotate(-45deg);
					}
				}
				&-actions {
					span + span {
						margin-left: 2px;
					}
				}
				.el-progress {
					//width: 126px;
					//top: 86%;
					top: unset;
					//bottom: 0;
					bottom: 2px;
					width: 100%;
					.el-progress__text {
						top: -13px;
					}
				}
			}
			// 上传按钮 禁用 隐藏
			.el-upload.el-upload--picture-card {
				&.is-disabled {
					display: none;
				}
			}
		}

		&__item {
			display: flex;
			align-items: center;
			/*.el-upload-list__item-info {
				margin-left: 0;
			}*/
			&-thumbnail {
				&-wrap,
				&-wrap img {
					position: static;
					display: block;
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
				&-wrap {
					display: flex;
					align-items: center;
					justify-content: center;
					// 自定义小图标
					.le-icon {
						font-size: 60px;
					}
				}
			}
			.el-progress {
				top: unset;
				bottom: -1px;
			}
		}
		&__item-actions {
			display: inline-flex;
			// todo...
			.action {
				width: 16px;
				//margin: 0 4px;
				font-size: 16px;
				margin: 0 2px;
				cursor: pointer;
				transition: all 0.3s;
				&:hover {
					//background-color: rgba(0, 0, 0, 0.06);
					//background-color: #f00;
					color: var(--el-color-primary);
					opacity: 1;
				}
			}
			.el-icon {
				width: 16px;
				//margin: 0 4px;
				font-size: 16px;
				//padding: 0 6px;
				margin: 0 2px;
				cursor: pointer;
				transition: all 0.3s;
				&:hover {
					//background-color: rgba(0, 0, 0, 0.06);
					//background-color: #f00;
					color: var(--el-color-primary);
					opacity: 1;
				}
			}
		}
	}

	&--default {
		.el-upload-list {
			--el-upload-list-picture-card-size: 80px;
			&--picture-card {
			}
			.el-upload--picture-card {
				--el-upload-picture-card-size: 80px;
			}
			&--picture {
				.el-upload-list__item {
					padding: 6px;
					margin-top: 6px;
					&-thumbnail {
						&-wrap,
						&-wrap img {
							width: 50px;
							height: 50px;
						}
						&-wrap {
							// 自定义小图标
							.le-icon {
								font-size: 50px;
							}
						}
					}
				}
			}
		}
	}
	&--small {
		.el-upload-list {
			--el-upload-list-picture-card-size: 52px;
			&--picture-card {
				gap: 4px;
				.el-upload-list__item {
					//margin: 0 4px 4px 0;
					//padding: 0;
					/*overflow: hidden;
					&-name {
						padding: 0 2px !important;
						bottom: 2px !important;
					}*/
					&-thumbnail {
						&-wrap {
							.le-icon {
								font-size: 30px;
							}
						}
						//line-height: 52px !important;
						//.anticon {}
					}
					/*&-progress {
						bottom: 2px !important;
						padding-inline: 2px !important;
					}
					&-actions {
						.anticon {
							margin: 0 !important;
						}
						.ant-btn {
							width: 16px;
						}
					}*/
				}
				.el-upload--picture-card {
					--el-upload-picture-card-size: 52px;
				}
			}
			&--picture {
				.el-upload-list__item {
					padding: 2px;
					margin-top: 4px;
					margin-bottom: 2px;
					&-thumbnail {
						&-wrap,
						&-wrap img {
							width: 36px;
							height: 36px;
						}
						&-wrap {
							// 自定义小图标
							.le-icon {
								font-size: 36px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
