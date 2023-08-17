<template>
	<div @click="$emit('click')" :class="['le-no-data', size, isFull ? 'le-no-data--full' : '']">
		<Icon iconClass="le-no_data" class="le-no-data__img" v-if="isShow" />
		<div class="message" v-html="message || $t('le.noData')" />
		<!-- 额外处理 -->
		<slot name="extraContent" />
	</div>
</template>
<script setup name="LeNoData" lang="ts">
import Icon from '@/components/Icon.vue'
defineEmits(['click'])
const props = defineProps({
	message: {
		default: ''
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
