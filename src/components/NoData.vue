<template>
	<div @click="$emit('click')" :class="['ad-no-data', size, isFull ? 'ad-no-data--full' : '']">
		<img class="ad-no-data__img" v-if="isShow" src="~@/assets/images/img_nodata.svg" />
		<div class="message" v-html="message" />
		<!-- 额外处理 -->
		<slot name="extraContent" />
	</div>
</template>
<script setup name="AdNoData" lang="ts">
import { defineProps, defineEmits } from 'vue'
defineEmits(['click'])
const props = defineProps({
	message: {
		default: '暂无数据'
	},
	size: {
		type: String, // [large, default, small]
		default: 'default'
	},
	isFull: {
		type: Boolean,
		default: false
	},
	isShow: {
		type: Boolean,
		default: true
	}
})
</script>
