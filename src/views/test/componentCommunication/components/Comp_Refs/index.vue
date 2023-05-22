<template>
	<div style="background: #ff0">
		父组件 (通过ref 拿值)<br />
		<!-- 父组件 -->
		<ul class="parent list-group">
			<li class="list-group-item" v-for="i in childRef ? childRef.list : []" :key="i">{{ i }}</li>
		</ul>
		<!-- 子组件 ref的值与<script>中的保持一致 -->
		<ChildComponents ref="childRef"></ChildComponents>
	</div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import ChildComponents from './child.vue'
// const list = ref([])
const childRef = ref(null)
onMounted(() => {
	console.error(childRef, 'childRef')
	window.childRef = childRef
	// list.value = childRef.list
})
</script>
