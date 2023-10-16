<template>
	<div class="flex-column-page-wrap">
		<span class="text">我是menu2-3 </span>
		<el-alert :closable="false" title="菜单2级">
			route.name: {{ $route.name }} <br />
			route.path: {{ $route.path }}
		</el-alert>
	</div>
</template>

<script setup lang="ts" name="menu23"></script>
