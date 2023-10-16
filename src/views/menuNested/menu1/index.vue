<template>
	<div class="flex-column-page-wrap">
		<span class="text">我是menu1测试</span>
		<el-input v-model="value" placeholder="test缓存"></el-input>
	</div>
</template>

<script setup lang="ts" name="menu1">
import { ref } from 'vue'
const value = ref<string>('')
</script>
