<template>
	<div class="flex-column-page-wrap pageWrap">
		<div class="common_title" style="padding: 12px; background: #fff">继承父元素高度 进行拆分 表格示例</div>
		<FooterSummary />
		<MergeCells />
	</div>
</template>
<script setup lang="tsx" name="resizeParentHeightTable">
import FooterSummary from '@/views/table/footerSummary.vue'
import MergeCells from '@/views/table/mergeCells.vue'
</script>
<style scoped lang="scss">
.pageWrap {
	//padding-top: 12px;
	//padding: 12px 12px 0 12px;
	overflow: auto;
	background-color: $le-bg-color_1;
	background: var(--el-bg-color);
}
</style>
