<template>
	<template v-for="subItem in menuList" :key="subItem.path">
		<el-sub-menu v-if="subItem.children?.length" :index="subItem.path">
			<template #title>
				<SvgIcon v-if="subItem.meta.icon" :icon-class="subItem.meta.icon" />
				<!--				<el-icon v-if="subItem.meta.icon">
					<component :is="subItem.meta.icon" />
				</el-icon>-->
				<span class="sle">{{ generateTitle(subItem.meta?.title) }}</span>
			</template>
			<SubMenu :menu-list="subItem.children" />
		</el-sub-menu>
		<el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
			<!--      <el-icon>
        <component :is="subItem.meta.icon"></component>
      </el-icon>-->
			<SvgIcon v-if="subItem.meta.icon" :icon-class="subItem.meta.icon" />
			<template #title>
				<span class="sle">{{ generateTitle(subItem.meta?.title) }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { generateTitle } from '@/utils/i18n'

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
.el-sub-menu .el-sub-menu__title:hover {
	color: var(--el-menu-hover-text-color) !important;
	background-color: transparent !important;
}
.el-menu--collapse {
	.el-sub-menu__title {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		.svg-icon {
			font-size: 18px;
		}
	}
	.is-active {
		.el-sub-menu__title {
			&::before {
				background-color: var(--el-color-primary) !important;
			}
			//color: #ffffff !important;
			//background-color: var(--el-color-primary) !important;
		}
	}
}
.el-menu-item {
	&:hover {
		color: var(--el-menu-hover-text-color);
	}
	&.is-active {
		color: var(--el-menu-active-color) !important;
		//background-color: var(--el-menu-active-bg-color) !important;
		/*&::before {
			position: absolute;
			top: 0;
			bottom: 0;
			width: 4px;
			content: '';
			background-color: var(--el-color-primary);
		}*/
	}
}
.vertical,
.classic,
.transverse {
	.el-menu-item {
		&.is-active {
			&::before {
				left: 0;
			}
		}
	}
}
.columns {
	.el-menu-item {
		&.is-active {
			&::before {
				right: 0;
			}
		}
	}
}
</style>
