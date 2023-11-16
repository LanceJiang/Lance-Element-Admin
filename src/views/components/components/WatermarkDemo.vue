<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useWatermark } from '@/hooks/useWatermark'
const watermarkRef = ref()
const textStyles = reactive({
	text: '水印测试',
	color: '#ff0000',
	fontSize: 12,
	rotate: 20,
	width: 200,
	height: 140
})
let watermark_obj = {}
onMounted(() => {
	watermark_obj = useWatermark({ appendEl: watermarkRef.value })
	update_watermark()
})

const update_watermark = () => {
	watermark_obj.setWatermark?.(textStyles.text, {
		textStyles: {
			fillStyle: textStyles.color,
			font: `${textStyles.fontSize}px Vedana`,
			rotate: textStyles.rotate,
			width: textStyles.width,
			height: textStyles.height
		},
		styles: { position: 'relative' }
	})
}
watch(
	textStyles,
	update_watermark /*, {
	immediate: true
}*/
)
</script>

<template>
	<div class="common_title">水印文案 使用</div>
	<div class="content">
		<div class="watermark-wrap">
			<div ref="watermarkRef" class="watermark" />
			<div class="actions">
				<el-form label-position="top" label-width="100px" :model="textStyles">
					<el-form-item label="文字">
						<el-input v-model="textStyles.text" />
					</el-form-item>
					<el-form-item label="字体颜色">
						<el-color-picker v-model="textStyles.color" />
					</el-form-item>
					<el-form-item label="字体大小">
						<el-slider v-model="textStyles.fontSize" />
					</el-form-item>
					<el-form-item label="字体旋转">
						<el-slider v-model="textStyles.rotate" :min="-60" :max="60" />
					</el-form-item>
					<el-form-item label="canvas 宽">
						<el-slider v-model="textStyles.width" :max="500" />
					</el-form-item>
					<el-form-item label="canvas 高">
						<el-slider v-model="textStyles.height" :max="500" />
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.watermark {
	flex: 1;
	min-width: 500px;
	height: 500px;
	background: #000;
}
.watermark-wrap {
	display: flex;
	.actions {
		flex: 1;
		max-width: 460px;
		margin-left: 10px;
		padding-left: 10px;
		border-left: 1px dashed var(--el-color-primary);
	}
}
</style>
