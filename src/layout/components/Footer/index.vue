<template>
	<div class="layout-footer">
		<a href="https://github.com/LanceJiang" target="_blank"> 2028 © vue3_element_admin By LanceJiang. </a>
	</div>
</template>

<style scoped lang="scss">
.layout-footer {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30px;
	background-color: var(--el-footer-bg-color);
	border-top: 1px solid var(--el-border-color-light);
	a {
		font-size: 14px;
		//color: var(--el-text-color-secondary);
		color: var(--el-footer-text-color);
		text-decoration: none;
		letter-spacing: 0.5px;
	}
}
</style>
