import { Ref, ref, shallowRef, unref } from 'vue'
import { debounce } from '@/utils'
type Attrs = {
	textStyles?: {
		font?: string
		fillStyle?: string
		rotate?: number
		width?: number
		height?: number
		// [key: string]: any
	}
	styles?: { [key: string]: any }
	// [key: string]: any
}
type WatermarkOpts = {
	appendEl?: Ref<HTMLElement | null>
	id?: string
}
export function useWatermark(opts: WatermarkOpts = {}) {
	// const id = `waterMark_${Math.random().toString().slice(-10)}_${+new Date()}`
	const appendEl = opts.appendEl || (ref(document.body) as Ref<HTMLElement>)
	const watermarkEl = shallowRef<HTMLElement>()
	// 绘制canvas文字背景图
	const createCanvasBase64 = (str: string, attrs: Attrs = {}) => {
		const can = document.createElement('canvas')
		const { rotate, font, fillStyle, width = 200, height = 140 } = attrs.textStyles || {}
		Object.assign(can, { width, height })
		const cans = can.getContext('2d')
		if (cans) {
			cans.rotate((-(rotate ?? 20) * Math.PI) / 180)
			cans.font = font || '12px Vedana'
			cans.fillStyle = fillStyle || 'rgba(200, 200, 200, 0.3)'
			cans.textAlign = 'left'
			cans.textBaseline = 'middle'
			cans.fillText(str, can.width / 10, can.height / 2)
		}
		return can.toDataURL('image/png')
	}

	// 绘制水印层
	const createWatermark = (str: string, attrs?: Attrs) => {
		if (watermarkEl.value) {
			updateWatermark({ str, attrs })
			return watermarkEl
		}
		const div = document.createElement('div')
		watermarkEl.value = div
		if (opts.id) {
			const last_el = document.getElementById(opts.id)
			if (last_el) {
				document.body.removeChild(last_el)
			}
			div.id = opts.id
		}
		Object.assign(
			div.style,
			{
				pointerEvents: 'none',
				top: '0px',
				left: '0px',
				position: 'fixed',
				zIndex: '100000'
			},
			attrs.styles || {}
		)
		const el = unref(appendEl)
		if (!el) return watermarkEl
		const { clientHeight: height, clientWidth: width } = el
		updateWatermark({ str, attrs, width, height })
		el.appendChild(div)
		return watermarkEl
	}

	// 页面随窗口调整更新水印
	const updateWatermark = (
		opts: {
			str?: string
			attrs?: Attrs
			width?: number
			height?: number
		} = {}
	) => {
		const el = unref(watermarkEl)
		if (!el) return
		if (typeof opts.width !== 'undefined') {
			el.style.width = `${opts.width}px`
		}
		if (typeof opts.height !== 'undefined') {
			el.style.height = `${opts.height}px`
		}
		if (typeof opts.str !== 'undefined') {
			el.style.background = `url(${createCanvasBase64(opts.str, opts.attrs)}) left top repeat`
		}
	}

	const debounceUpdateResize = debounce(
		() => {
			const el = unref(appendEl)
			if (!el) return
			const { clientHeight: height, clientWidth: width } = el
			updateWatermark({ width, height })
		},
		30,
		false
	)

	// 对外提供的设置水印方法
	const setWatermark = (str: string, attrs: Attrs = {}) => {
		createWatermark(str, attrs)
		window.addEventListener('resize', debounceUpdateResize)
	}

	// 清除水印
	const clearWatermark = () => {
		let domId = unref(watermarkEl)
		if (!domId && opts.id) {
			domId = document.getElementById(opts.id)
		}
		watermarkEl.value = undefined
		const el = unref(appendEl)
		if (!el) return
		domId && el.removeChild(domId)
		window.removeEventListener('resize', debounceUpdateResize)
	}

	return { setWatermark, clearWatermark }
}
