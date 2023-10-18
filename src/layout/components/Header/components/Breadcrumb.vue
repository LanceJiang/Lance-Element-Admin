<template>
	<div :class="['breadcrumb-box']">
		<el-breadcrumb separator-icon="ArrowRight">
			<transition-group name="breadcrumb">
				<!--				<el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">-->
				<el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
					<div class="el-breadcrumb__inner is-link" @click="onBreadcrumbClick(item, index)">
						<PickerIcon v-if="setting.breadcrumbIcon && item.meta?.icon" :icon-class="item.meta.icon" class="breadcrumb-icon" />
						<span class="breadcrumb-title">{{ generateTitle(item.meta.title) }}</span>
					</div>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
// import { HOME_URL } from '@/config'
import { RouteLocationMatched, useRoute, useRouter } from 'vue-router'
import useStore from '@/store'
// import router from '@/router'
import { generateTitle } from '@/utils/i18n'
import PickerIcon from '@/components/IconPicker/PickerIcon.vue'
// import { AppRouteRecordRaw } from '@/router/types'
const route = useRoute()
const router = useRouter()
const { setting } = useStore()
const currentRoute = useRoute()

const breadcrumbs = ref([] as Array<RouteLocationMatched>)

function getBreadcrumb() {
	// console.error(currentRoute, 'currentRoute')
	let matched = currentRoute.matched.filter(item => item.meta && item.meta.title)
	const first = matched[0]
	if (!isDashboard(first)) {
		matched = [{ path: '/dashboard', meta: { title: 'dashboard', icon: 'icon-homepage' } } as any].concat(matched)
	}
	breadcrumbs.value = matched
	//   .filter(item => {
	// 	return item.meta && item.meta.title && item.meta.breadcrumb !== false
	// })
}
function isDashboard(route: RouteLocationMatched) {
	const name = route && route.name
	if (!name) {
		return false
	}
	return name.toString().trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
}
watch(
	() => currentRoute.path,
	path => {
		if (path.startsWith('/redirect/')) {
			return
		}
		getBreadcrumb()
	}
)

onBeforeMount(() => {
	getBreadcrumb()
})

// Click Breadcrumb
const onBreadcrumbClick = (item: RouteMenu.Item, index: number) => {
	if (item.redirect === 'noredirect' || index !== breadcrumbs.value.length - 1) router.push(item.path)
	// if (item.redirect === 'noredirect' || index !== breadcrumbList.value.length - 1) router.push(item.path)
}
</script>

<style scoped lang="scss">
.breadcrumb-box {
	display: flex;
	align-items: center;
	overflow: hidden;
	margin-left: 6px;
	padding-right: 50px;
	//-webkit-mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);
	mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);
	.el-breadcrumb {
		white-space: nowrap;
		line-height: unset;
		.el-breadcrumb__item {
			position: relative;
			display: inline-block;
			float: none;
			.el-breadcrumb__inner {
				display: inline-flex;
				//align-items: center;
				&.is-link {
					color: var(--el-header-text-color);
					&:hover {
						color: var(--el-color-primary);
					}
				}
				.breadcrumb-icon {
					//margin-top: 2px;
					transform: translateY(2px);
					margin-right: 6px;
					//font-size: 16px;
					font-size: 14px;
				}
				.breadcrumb-title {
					//margin-top: 2px;
					//margin-top: 3px;
					//margin-top: 4px;
				}
			}
			&:last-child .el-breadcrumb__inner,
			&:last-child .el-breadcrumb__inner:hover {
				color: var(--el-header-text-color-regular);
			}
			:deep(.el-breadcrumb__separator) {
				position: relative;
				//top: -1px;
				top: 2px;
			}
		}
	}
}
</style>
