<template>
	<div class="tool-bar-ri">
		<div class="header-icon">
			<!--			<AssemblySize id="assemblySize" />-->
			<Screenfull id="screenfull" class="right-menu-item hover-effect" />
			<el-tooltip content="布局大小" effect="dark" placement="bottom">
				<SizeSelect id="size-select" class="right-menu-item hover-effect" />
			</el-tooltip>
			<Language id="language" class="right-menu-item hover-effect" />
			<!--      todo...搜索 -->
			<!--			<SearchMenu id="searchMenu" />-->
			<!--			<ThemeSetting id="themeSetting" />-->
			<!--			<Message id="message" />-->
			<!--			<Fullscreen id="fullscreen" />-->
		</div>
		<Avatar />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// import { useUserStore } from '@/stores/modules/user'
// import AssemblySize from './components/AssemblySize.vue'
import Language from './components/Language.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
// import SearchMenu from './components/SearchMenu.vue'
// import ThemeSetting from './components/ThemeSetting.vue'
// import Message from './components/Message.vue'
// import Fullscreen from './components/Fullscreen.vue'
import Avatar from './components/Avatar.vue'

// const userStore = useUserStore()
// const username = computed(() => userStore.userInfo.name)
</script>

<style scoped lang="scss">
.tool-bar-ri {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	//padding-right: 25px;
	&:deep(.header-icon) {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		.right-menu-item {
			display: flex;
			align-items: center;
			padding: 0 8px;
			height: 100%;
			//height: 55px;
			font-size: 18px;
			//color: #5a5e66;
			color: var(--el-header-text-color);

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}
		//& > * {
		//	margin-left: 21px;
		//}
	}
	.header-icon {
	}
	.username {
		margin: 0 20px;
		font-size: 15px;
		color: var(--el-header-text-color);
	}
}
</style>
