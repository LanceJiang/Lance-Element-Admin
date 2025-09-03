import { createVNode, render } from 'vue'
import type { Options, Props } from '../index.d'
import ImgPreview from './Functional.vue'

let instance: ReturnType<typeof createVNode> | null = null
export function createImgPreview(options: Options) {
	const propsData: Partial<Props> = {}
	const container = document.createElement('div')
	Object.assign(propsData, { show: true, index: 0, scaleStep: 100 }, options)

	instance = createVNode(ImgPreview, propsData)
	render(instance, container)
	document.body.appendChild(container)
	return instance.component?.exposed
}
