<template>
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
</template>
<script setup lang="ts">
// import { ArrowDown } from '@element-plus/icons-vue'
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

<!--
<template>
	<el-dropdown trigger="click">
		<div class="avatar">
			<img src="@/assets/images/avatar.gif" alt="avatar" />
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="openDialog('infoRef')">
					<el-icon><User /></el-icon>{{ $t('header.personalData') }}
				</el-dropdown-item>
				<el-dropdown-item @click="openDialog('passwordRef')">
					<el-icon><Edit /></el-icon>{{ $t('header.changePassword') }}
				</el-dropdown-item>
				<el-dropdown-item divided @click="logout">
					<el-icon><SwitchButton /></el-icon>{{ $t('header.logout') }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	&lt;!&ndash; infoDialog &ndash;&gt;
	<InfoDialog ref="infoRef"></InfoDialog>
	&lt;!&ndash; passwordDialog &ndash;&gt;
	<PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LOGIN_URL } from '@/config'
import { useRouter } from 'vue-router'
import { logoutApi } from '@/api/modules/login'
import { useUserStore } from '@/stores/modules/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import InfoDialog from './InfoDialog.vue'
import PasswordDialog from './PasswordDialog.vue'

const router = useRouter()
const userStore = useUserStore()

// 退出登录
const logout = () => {
	ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(async () => {
		// 1.执行退出登录接口
		await logoutApi()

		// 2.清除 Token
		userStore.setToken('')

		// 3.重定向到登陆页
		router.replace(LOGIN_URL)
		ElMessage.success('退出登录成功！')
	})
}

// 打开修改密码和个人信息弹窗
const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null)
const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null)
const openDialog = (ref: string) => {
	if (ref == 'infoRef') infoRef.value?.openDialog()
	if (ref == 'passwordRef') passwordRef.value?.openDialog()
}
</script>

<style scoped lang="scss">
.avatar {
	width: 40px;
	height: 40px;
	overflow: hidden;
	cursor: pointer;
	border-radius: 50%;
	img {
		width: 100%;
		height: 100%;
	}
}
</style>
-->
<style lang="scss" scoped>
.right-menu-item {
	padding: 0 8px;
	height: 100%;
	font-size: 18px;
	//color: #5a5e66;
	//color: var(--el-header-text-color);
	color: var(--el-color-info);

	&.hover-effect {
		cursor: pointer;
		transition: background 0.3s;

		&:hover {
			//background: rgba(0, 0, 0, 0.025);
			background: var(--el-fill-color);
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
</style>
