<template>
	<div class="tool-bar-right">
		<div class="header-icon">
			<ScreenFull />
			<el-tooltip content="布局大小" effect="dark" placement="bottom">
				<SizeSelect class="right-menu-item le-hover-effect--bg" />
			</el-tooltip>
			<Language class="right-menu-item le-hover-effect--bg" />
      <SearchMenu />
			<!--			<ThemeSetting id="themeSetting" />-->
			<Message class="right-menu-item le-hover-effect--bg" />
		</div>
		<Avatar />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Language from './components/Language.vue'
import ScreenFull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import SearchMenu from './components/SearchMenu.vue'
import Message from './components/Message.vue'
// import Fullscreen from './components/Fullscreen.vue'
import Avatar from './components/Avatar.vue'

// const username = computed(() => userStore.userInfo.name)
</script>

<style lang="scss">
.tool-bar-right {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	.header-icon {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.right-menu-item {
		display: flex;
		align-items: center;
		padding: 0 8px;
		height: 100%;
		//height: 55px;
		font-size: 18px;
		color: var(--el-color-info);
	}
}
</style>
