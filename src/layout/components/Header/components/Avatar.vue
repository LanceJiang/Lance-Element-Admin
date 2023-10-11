<template>
	<el-dropdown class="menu--avatar-wrap" trigger="click">
		<div class="menu--avatar menu-item le-hover-effect--bg">
			<span class="nickname">{{ user.nickname || '' }}</span>
			<img :src="user.avatar" class="user-avatar" />
			<ArrowDown style="width: 0.6em; height: 0.6em; margin-left: 5px; font-size: 24px" />
		</div>

		<template #dropdown>
			<el-dropdown-menu>
				<!--						<router-link to="/">
          <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
        </router-link>-->
				<router-link to="/personal">
					<el-dropdown-item>{{ $t('route.personal') }}</el-dropdown-item>
				</router-link>
				<el-dropdown-item divided @click="logout">
					{{ $t('navbar.logout') }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>
<script setup lang="ts">
import useStore from '@/store'
import { useRoute, useRouter } from 'vue-router'

import { ElMessageBox } from 'element-plus'
const { setting, app, user } = useStore()
const router = useRouter()
const route = useRoute()

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
.menu--avatar-wrap {
	height: 100%;
	.menu--avatar {
		//height: 100%;
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
</style>
