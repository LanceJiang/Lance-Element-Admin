<template>
	<div class="flex-column-page-wrap pageWrap">
		<div class="actions m-2">
			<el-switch
				v-model="editOpts.disabled"
				inline-prompt
				active-text="禁用"
				inactive-text="启用"
			/>
			<span class="ml-2">
				主题：
				<el-switch
					v-model="editOpts.theme"
					inline-prompt
					active-text="vs-light"
					inactive-text="vs-dark"
					active-value="vs-light"
					inactive-value="vs-dark"
				/>
			</span>
			<span class="ml-2">
				切换语言：
				<el-switch
					v-model="editOpts.language"
					inline-prompt
					active-text="typescript"
					inactive-text="html"
					active-value="typescript"
					inactive-value="html"
				/>
			</span>

			<el-button class="ml-2" @click="setCode">
        设置code
			</el-button>
		</div>
		<div class="m-2">
			<MonacoEditor v-bind="editOpts" v-model="editOpts.code" height="calc(100vh - 200px)" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const editOpts = ref({
	code: `import { defineComponent } from 'vue'`,
	disabled: false,
	theme: 'vs-dark',
	language: 'typescript',
})
const setCode = () => {
	editOpts.value.code = `<template>
		\t<div class="flex-column-page-wrap pageWrap">
		\t\t<div class="actions my-2">
		\t\t\t<el-button @click="editOpts.disabled = !editOpts.disabled">
		\t\t\t\t {{ editOpts.disabled ? '启用' : '禁用' }}
		\t\t\t</el-button>
		\t\t\t<el-button @click="editOpts.theme = editOpts.theme === 'vs-dark' ? 'vs-light' : 'vs-dark'">
		\t\t\t\t主题：{{editOpts.theme === 'vs-dark' ? 'vs-dark' : 'vs-light' }}
		\t\t\t</el-button>
		\t\t\t<el-button @click="editOpts.language = editOpts.language === 'html' ? 'typescript' : 'html'">
		\t\t\t\t主题：{{editOpts.language === 'html' ? 'html' : 'typescript' }}
		\t\t\t</el-button>
		\t\t\t<el-button @click="setCode">
		\t\t\t\t 设置code
		\t\t\t</el-button>
		\t\t</div>
		\t\t<div class="m-2">
		\t\t\t<MonacoEditor v-bind="editOpts" v-model="editOpts.code" height="calc(100vh - 200px)" />
		\t\t</div>
		\t</div>
		</template>

		<script setup lang="ts">
		import { ref } from 'vue'
		const editOpts = ref({
		\tcode: \`import { defineComponent } from 'vue'\`,
		\tdisabled: false,
		\ttheme: 'vs-dark',
		\tlanguage: 'typescript',
		})
		const setCode = () => {
		\teditOpts.value.code = \`function test() { console.log("hello word") }\`
		}
		<\/script>

		<style scoped lang="scss">
		.test {
			background: #f00;
		}
		<\/style>
	`
}
</script>

<style scoped lang="scss">

</style>
