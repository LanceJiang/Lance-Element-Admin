<template>
	<div class="navbar">
		<hamburger id="hamburger-container" :is-active="isCollapse" class="hamburger-container" @toggleClick="toggleSideBar" />

		<breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

		<div class="right-menu">
			<template v-if="device !== 'mobile'">
				<!--        <search id="header-search" class="right-menu-item" />
                <error-log class="errLog-container right-menu-item hover-effect" />-->
				<Screenfull id="screenfull" class="right-menu-item hover-effect" />
				<template v-if="true">
					<el-tooltip content="布局大小" effect="dark" placement="bottom">
						<SizeSelect id="size-select" class="right-menu-item hover-effect" />
					</el-tooltip>
					<LangSelect class="right-menu-item hover-effect" />
				</template>
			</template>

			<el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" size="default">
				<div class="avatar-wrapper">
					<span class="nickname">{{ user.nickname || '' }}</span>
					<img :src="user.avatar" class="user-avatar" />
					<ArrowDown style="width: 0.6em; height: 0.6em; margin-left: 5px; font-size: 24px" />
				</div>

				<template #dropdown>
					<el-dropdown-menu>
						<!--						<router-link to="/">
							<el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
						</router-link>-->
						<el-dropdown-item @click="logout">
							{{ $t('navbar.logout') }}
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

import useStore from '@/store'
// import { ls } from '@/utils'

// 组件依赖
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'

// 图标依赖
import { ArrowDown } from '@element-plus/icons-vue'

const { setting, app, user } = useStore()

const route = useRoute()
const router = useRouter()

// const sidebar = computed(() => setting.isCollapse)
const isCollapse = computed(() => setting.isCollapse)
const device = computed(() => app.device)

function toggleSideBar() {
	// app.toggleSidebar()
	setting.changeSetting('isCollapse', !isCollapse.value)
}

function logout() {
	ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		user.logout().then(() => {
			router.push(`/login?redirect=${route.fullPath}`)
		})
	})
}
</script>

<style lang="scss" scoped>
ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
.navbar {
	height: 50px;
	display: flex;
	align-items: center;
	overflow: hidden;
	position: relative;
	background: #fff;
	box-shadow: 0 1px 2px #00152914;

	.hamburger-container {
		line-height: 46px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		flex: 1;
	}

	.right-menu {
		flex: 1 1 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100%;
		line-height: 50px;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			.avatar-wrapper {
				display: flex;
				align-items: center;
				white-space: nowrap;
				.nickname {
					font-size: 14px;
				}
				.user-avatar {
					cursor: pointer;
					width: 26px;
					height: 26px;
					border-radius: 50%;
					margin-left: 8px;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
