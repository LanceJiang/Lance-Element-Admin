<template>
	<div class="menu--search-wrap">
		<el-tooltip :content="$t('le.menuSearch')" effect="dark" placement="bottom">
			<div class="menu--search menu-item le-hover-effect--bg" @click="handleOpen">
				<LeIcon icon-class="le-search" />
			</div>
		</el-tooltip>
		<el-dialog
			v-model="isShowSearch"
			class="le-search-menu-dialog"
			destroy-on-close
			:modal="false"
			:show-close="false"
			fullscreen
			@click="closeSearch"
		>
			<el-autocomplete
				ref="menuInputRef"
				v-model="searchMenu"
				value-key="path"
				placeholder="菜单搜索"
				:fetch-suggestions="searchMenuList"
				@select="handleClickMenu"
				@click.stop
			>
				<template #prefix>
					<LeIcon icon-class="le-search" />
				</template>
				<template #default="{ item }">
					<PickerIcon v-if="item.meta?.icon" class="icon" :icon-class="item.meta.icon" />
					<span class="title"> {{ item.meta.local_title }} </span>
				</template>
			</el-autocomplete>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="SearchMenu">
import { ref, computed, nextTick } from 'vue'
import { AppRouteRecordRaw } from '@/router/types'
import PickerIcon from '@/components/IconPicker/PickerIcon.vue'
import { useRouter } from 'vue-router'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import useStore from '@/store'
const router = useRouter()
const { permission } = useStore()
const menuList = computed(() => {
	return permission.showMenuListFlat.map(v => {
		return {
			...v,
			meta: {
				...v.meta,
				local_title: generateTitle(v.meta.title)
			}
		}
	})
})
const searchMenuList = (queryString: string, cb: () => {}) => {
	const _menuList = queryString ? menuList.value.filter(filterNodeMethod(queryString)) : menuList.value
	cb(_menuList)
}

// 打开搜索框
const isShowSearch = ref(false)
const menuInputRef = ref()
const searchMenu = ref('')
const handleOpen = () => {
	isShowSearch.value = true
	nextTick(() => {
		setTimeout(() => {
			menuInputRef.value.focus()
		})
	})
}

// 搜索窗关闭
const closeSearch = () => {
	isShowSearch.value = false
}

// 筛选菜单
const filterNodeMethod = (queryString: string) => {
	return (restaurant: AppRouteRecordRaw) => {
		return restaurant.meta.local_title.toLowerCase().indexOf(queryString.toLowerCase()) > -1
	}
}

// 点击菜单跳转
const handleClickMenu = (menuItem: AppRouteRecordRaw | Record<string, any>) => {
	searchMenu.value = ''
	if (isExternal(menuItem.path)) window.open(menuItem.path, '_blank')
	else router.push(menuItem.path)
	closeSearch()
}
</script>
<style scoped lang="scss">
.menu--search-wrap {
	height: 100%;
}
:deep(.el-dialog) {
	background-color: rgb(0 0 0 / 50%);
	border-radius: 0 !important;
	box-shadow: unset !important;
	.el-dialog__header {
		border-bottom: none !important;
	}
	.el-autocomplete {
		position: absolute;
		top: 100px;
		left: 50%;
		width: 550px;
		transform: translateX(-50%);
		.el-input__wrapper {
			background-color: var(--el-bg-color);
		}
	}
}
.el-autocomplete__popper {
	.icon {
		position: relative;
		top: 2px;
		font-size: 16px;
	}
	.title {
		margin: 0 0 0 10px;
		font-size: 14px;
	}
}
</style>
