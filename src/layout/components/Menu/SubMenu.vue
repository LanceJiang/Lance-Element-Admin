<template>
	<template v-for="subItem in menuList" :key="subItem.path">
		<el-sub-menu v-if="subItem.children?.length" popperClass="layout-menu-popper-wrap" :index="subItem.path">
			<template #title>
				<MenuIcon v-if="subItem.meta.icon" :icon-class="subItem.meta.icon" />
				<!--				<el-icon v-if="subItem.meta.icon">
					<component :is="subItem.meta.icon" />
				</el-icon>-->
				<span class="sle">{{ generateTitle(subItem.meta?.title) }}</span>
			</template>
			<SubMenu :menu-list="subItem.children" />
		</el-sub-menu>
		<el-menu-item v-else popperClass="layout-menu-popper-wrap" :index="subItem.path" @click="handleClickMenu(subItem)">
			<MenuIcon v-if="subItem.meta.icon" :icon-class="subItem.meta.icon" />
			<!--      <el-icon>
				<component :is="subItem.meta.icon"></component>
			</el-icon>-->
			<template #title>
				<span class="sle">{{ generateTitle(subItem.meta?.title) }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { generateTitle } from '@/utils/i18n'
import MenuIcon from './MenuIcon.vue'

defineProps<{ menuList: Menu.MenuOptions[] }>()

const router = useRouter()
const handleClickMenu = (subItem: Menu.MenuOptions) => {
	if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank')
	router.push(subItem.path)
	// router.push({ name: subItem.name })
	// router.push('/404')
}
</script>

<style lang="scss">
.el-menu--collapse {
	.el-sub-menu__title {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}
	.is-active {
		.el-sub-menu__title {
			&::before {
				background-color: var(--el-color-primary) !important;
			}
		}
	}
}
.el-menu-item {
	/*&:hover {
		color: var(--el-menu-hover-text-color);
	}*/
	&.is-active {
		color: var(--el-menu-active-color) !important;
	}
}
</style>
