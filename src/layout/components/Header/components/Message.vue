<template>
	<el-popover placement="bottom" :width="310" trigger="click">
		<template #reference>
			<div class="menu--message-trigger">
				<el-tooltip :content="$t('le.message.txt')" effect="dark" placement="bottom">
					<div class="menu--message menu-item le-hover-effect--bg">
						<el-badge :value="total" :max="99">
							<i class="le-iconfont le-notice"></i>
						</el-badge>
					</div>
				</el-tooltip>
			</div>
		</template>
		<el-tabs class="message-tabs" v-model="activeTab">
			<el-tab-pane v-for="v of tabsConfig" :key="v.name" :name="v.name">
				<template #label> {{ v.label }}({{ v.list.length }}) </template>
				<template v-if="v.list.length">
					<div class="message-list">
						<div v-for="item of v.list" :key="item.id" class="message-item">
							<!--<img src="" alt="" class="message-icon" />-->
							<div class="message-content">
								<div class="message-title">
									<span class="txt text-overflow_ellipsis" :title="item.title">{{ item.title }}</span>
									<span class="message-date">{{ item.createTime }}</span>
								</div>
								<span class="message-txt">{{ item.content }}</span>
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<LeNoData />
				</template>
			</el-tab-pane>
		</el-tabs>
	</el-popover>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getMessage } from '@/api/system/message'
// noticeList  通知     messageList   消息     todoList   待办
const tabsConfig = reactive({
	noticeList: {
		name: 'noticeList',
		label: '通知',
		list: []
	},
	messageList: {
		name: 'messageList',
		label: '消息',
		list: []
	},
	todoList: {
		name: 'todoList',
		label: '代办',
		list: []
	}
})
const activeTab = ref('noticeList')
const total = ref(0)
getMessage().then(res => {
	console.error(res, 'getMessage api res')
	let _total = 0
	Object.keys(tabsConfig).map(key => {
		if (res[key]) {
			tabsConfig[key].list = res[key]
			_total += res[key].length
		} else {
			res[key].list = []
		}
	})
	total.value = _total
})
</script>

<style scoped lang="scss">
.message-list {
	display: flex;
	flex-direction: column;
	max-height: 390px;
	overflow-y: auto;
	.message-item {
		display: flex;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid var(--el-border-color-light);
		&:last-child {
			border: none;
		}
		.message-content {
			display: flex;
			flex-direction: column;
			width: 100%;
			.message-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 5px;
				font-weight: 600;
				color: var(--el-text-color-primary);
			}
			.message-date {
				font-size: 12px;
				color: var(--el-text-color-secondary);
				margin-left: 10px;
				font-weight: 400;
				flex-shrink: 0;
			}
			.message-txt {
				//margin-bottom: 5px;
				color: var(--el-text-color-regular);
			}
		}
	}
}
.menu--message-trigger {
	height: 100%;
}
.menu--message {
	width: 40px;
	justify-content: center;
	//.le-notice {
	//.le-iconfont {
	//}
}
</style>
