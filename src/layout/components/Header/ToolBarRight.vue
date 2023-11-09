<template>
	<div class="tool-bar-right">
		<div class="header-icon">
			<SearchMenu />
			<ScreenFull />
			<SwitchDarkTheme />
			<SizeSelect />
			<Language />
			<Message />
			<ThemeSetting />
		</div>
		<Avatar />
	</div>
</template>

<script setup lang="ts">
import Language from './components/Language.vue'
import ScreenFull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import SearchMenu from './components/SearchMenu.vue'
import Message from './components/Message.vue'
import Avatar from './components/Avatar.vue'
import SwitchDarkTheme from './components/SwitchDarkTheme.vue'
import ThemeSetting from './components/ThemeSetting.vue'
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
	.menu-item {
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
