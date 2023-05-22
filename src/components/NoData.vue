<template>
	<div :class="size" class="noDataWrap">
		<img v-if="isShow" src="~@/assets/images/img_nodata.svg" />
		<div class="message" v-html="message" />
		<!-- 额外处理 -->
		<slot name="extraContent" />
	</div>
</template>
<script setup name="NoData" lang="ts">
import { defineProps, toRefs } from 'vue'
const props = defineProps({
	size: {
		type: String, // [large, middle, small, mini]
		default: 'middle'
	},
	message: {
		default: '暂无数据'
	},
	isShow: {
		type: Boolean,
		default: true
	}
})
const { size, message, isShow } = toRefs(props)
</script>

<style scoped lang="scss">
.noDataWrap {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #999;
	&.large {
		img {
			width: 162px;
		}
		//transform: scale(1.2);
	}
	// middle
	&.middle {
		img {
			width: 135px;
			//transform: scale(1);
		}
	}
	&.small {
		img {
			width: 108px;
			//height: 80%;
			//transform: scale(0.8);
		}
		.message {
			margin-top: 0;
		}
	}
	// 用于超小的 内容区域
	&.mini {
		transform: scale(0.8);
	}
	.message {
		margin-top: 10px;
		font-size: 12px;
	}
}
</style>
