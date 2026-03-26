import { createVNode, render } from 'vue'
/*import type { Options, Props } from '../index.d'
import ImgPreview from './Functional.vue'*/
import { ImageViewerProps } from '../index.d'
import { ElImageViewer } from 'element-plus'
let instance: ReturnType<typeof createVNode> | null = null
/*export function createImgPreview(options: Options) {
	const propsData: Partial<Props> = {}
	const container = document.createElement('div')
	Object.assign(propsData, { show: true, index: 0, scaleStep: 100 }, options)

	instance = createVNode(ImgPreview, propsData)
	render(instance, container)
	document.body.appendChild(container)
	return instance.component?.exposed
}*/

export function createImgPreview(options: Partial<ImageViewerProps>) {
	const propsData: Partial<ImageViewerProps> = {}
	const container = document.createElement('div')
	Object.assign(
		propsData,
		{
			initialIndex: 0,
			showProgress: false,
			infinite: true,
			hideOnClickModal: true,
			zoomRate: 1.2,
			minScale: 0.2,
			maxScale: 7,
			onClose() {
				instance = null
				container.remove()
			}
		},
		options
	)

	// instance = createVNode(ImgPreview, propsData)
	instance = createVNode(ElImageViewer, propsData)
	render(instance, container)
	document.body.appendChild(container)
	return instance.component?.exposed
}
