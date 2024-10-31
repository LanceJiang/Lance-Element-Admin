<template>
	<div ref="monacoRef" :style="{ height }" :class="['le-monaco-editor', { 'is-disabled': disabled }]" />
</template>
<script setup lang="ts">
import * as monaco from 'monaco-editor'
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { ref, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
// 解决vite Monaco提示错误
import editWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		// console.error(moduleId, label, 'moduleId, label')
		/*if (label === 'json') {
			return './json.worker.bundle.js'
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.bundle.js'
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.bundle.js'
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js'
		}*/
		// return './editor.worker.bundle.js'
		// return 'editor.worker.js'
		return editWorker
	}
}
defineOptions({ name: 'MonacoEditor' })
const props = defineProps({
	height: {
		type: String,
		default: '100%'
	},
	theme: {
		type: String,
		default: 'vs-light'
	},
	language: {
		type: String,
		default: 'javascript'
		// default: 'verilog'
	},
	disabled: {
		type: Boolean,
		default: false
	},
	modelValue: {
		type: String,
		default: ''
	}
})
const emits = defineEmits(['update:modelValue', 'change', 'editorDidMount'])
const monacoRef = ref<HTMLElement>()
const editor = shallowRef()
const _getValue = () => {
	return editor.value?.getValue()
}
const _setValue = (value: string) => {
	return editor.value?.setValue(value)
}
onMounted(() => {
	const _editor = monaco.editor.create(monacoRef.value, {
		value: props.modelValue,
		language: props.language,
		theme: props.theme,
		readOnly: props.disabled,
		automaticLayout: true,
		wordWrap: 'on'
	})
	editor.value = _editor
	_editor.onDidChangeModelContent(event => {
		const curValue = _editor?.getValue()
		if (props.modelValue !== curValue) {
			emits('change', curValue, event)
			emits('update:modelValue', curValue)
		}
	})
	emits('editorDidMount', _editor)
})
watch(
	() => props.modelValue,
	(value: string) => {
		// console.error('modelValue ////', value, _getValue())
		if (value !== _getValue()) {
			_setValue(value || '')
		}
	}
)
watch(
	() => props.language,
	(lang: string) => {
		// console.error('watch', lang)
		monaco.editor.setModelLanguage(editor.value.getModel(), lang)
	}
)
watch(
	() => props.disabled,
	(readOnly: boolean) => {
		editor.value.updateOptions({ readOnly })
	}
)
watch(
	() => props.theme,
	(theme: string) => {
		monaco.editor.setTheme(theme)
	}
)
onBeforeUnmount(() => {
	editor.value?.dispose()
	editor.value = null
})
defineExpose({
	getValue: _getValue
})
</script>
<style lang="scss">
.le-monaco-editor {
	width: 100%;
	height: 100%;
	min-height: 160px;
	border: 1px solid var(--el-border-color-light);
	border-radius: var(--el-border-radius-base);
	&:hover {
		border: 1px solid var(--el-color-primary);
		border-radius: var(--el-border-radius-base);
	}
	&.is-disabled {
		border: 1px solid var(--el-border-color-light);
	}
	.monaco-editor {
		height: 100%;
		border-radius: var(--el-border-radius-base);
		.overflow-guard {
			border-radius: var(--el-border-radius-base);
		}
		.decorationsOverviewRuler,
		.scrollbar,
		.slider {
			border: 0 !important;
			width: 6px !important;
			color: var(--el-text-color-primary) !important;
			border-radius: 6px !important;
		}
		.decorationsOverviewRuler,
		.minimap-decorations-layer {
			//height: 100% !important;
		}
	}
}
</style>
