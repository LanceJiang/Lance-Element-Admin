<template>
	<el-popover
		v-bind="$attrs"
		:trigger="$attrs.trigger || 'click'"
		:width="$attrs.width || '240px'"
		popper-class="le-edit-popper"
		:visible="comp_visible"
		@update:visible="visibleChange"
	>
		<template #reference>
			<slot name="reference">
				<el-button icon="Edit" />
			</slot>
		</template>
		<div class="le-edit-popper_content-wrap">
			<slot>
				<div class="title">模拟标题</div>
				<el-scrollbar max-height="400px">
					<div class="content">
						<div v-for="(_, i) of Array.from({ length: 40 })" :key="i">
							我是内容 <br />
							{{ i }}
						</div>
					</div>
				</el-scrollbar>
			</slot>
			<div v-if="showFooter" class="footer">
				<el-button @click="onCancel">{{ $t('le.btn.cancel') }}</el-button>
				<el-button type="primary" style="margin-left: 8px" @click="onSubmit">{{ $t('le.btn.confirm') }}</el-button>
			</div>
		</div>
	</el-popover>
</template>
<script setup name="LeEditPopover" lang="ts">
defineOptions({ name: 'LeEditPopover' })
import { computed, ref, watch } from 'vue'

const emit = defineEmits(['update:visible', 'getCurRow'])
const props = defineProps({
	visible: {
		type: Boolean,
		default: null
	},
	showFooter: {
		type: Boolean,
		default: true
	},
	submit: {
		type: Function,
		default: () => console.warn('请添加 submit 进行确定')
	},
	cancel: {
		type: Function
	}
})
const localVisible = ref(false)
const comp_visible = computed(() => {
	if (typeof props.visible !== 'boolean') return localVisible.value
	return props.visible
})
watch(
	comp_visible,
	(bool: boolean) => {
		// 提示更新当前row数据
		if (bool) {
			emit('getCurRow')
		}
	},
	{
		immediate: true
	}
)
const visibleChange = (visible: boolean) => {
	emit('update:visible', visible)
	localVisible.value = visible
}
const onCancel = () => {
	if (props.cancel) props.cancel()
	visibleChange(false)
}
const onSubmit = () => {
	props.submit?.()
	visibleChange(false)
}
</script>
<style lang="scss">
// le-edit-popper
.#{$prefix}edit-popper {
	&_content-wrap {
		position: relative;
		.title {
			//border-bottom: 1px solid
			//border-bottom: 1px solid var(--el-card-border-color);
			border-bottom: 1px solid var(--el-border-color-light);
			margin: -12px;
			margin-bottom: 12px;
			font-size: 15px;
			padding: 10px 12px;
			color: var(--el-text-color-primary);
			font-weight: 500;
			//margin-right: -12px;
			//margin-left: - var(--el-popover-padding);
			//margin-right: - var(--el-popover-padding);
		}
		.footer {
			padding-top: 10px;
			text-align: right;
		}
	}
}
</style>
