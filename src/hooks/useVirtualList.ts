import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { useWindowSizeFn } from '@/hooks/useWindowSizeFn'
// import { throttle } from '@/utils'
interface Config {
	data: Ref<any[]> // 数据源
	scrollContainer: string // 滚动容器的元素选择器
	actualHeightContainer: string // 用于撑开高度的元素选择器
	translateContainer: string // 用于偏移的元素选择器
	itemContainer: string // 列表项选择器
	itemHeight: number // 列表项高度
	bufferSize?: number // 缓冲size个数(默认3个)
}

type HtmlElType = HTMLElement | null

export default function useVirtualList(config: Config) {
	// 获取元素
	let actualHeightContainerEl: HtmlElType = null,
		translateContainerEl: HtmlElType = null,
		scrollContainerEl: HtmlElType = null

	let resizeObserver: ResizeObserver | null = null
	// 缓存已渲染元素的高度
	const RenderedItemsCache: { [key: number]: { height: number; updated: boolean } } = {}
	// 重置高度updated标记
	function resetHeightUpdated() {
		// RenderedItemsCache = {}
		Object.keys(RenderedItemsCache).forEach(key => {
			if (RenderedItemsCache[key]) {
				RenderedItemsCache[key].updated = false
			}
		})
	}
	// 宽|高 变化 标记updated重置
	useWindowSizeFn(resetHeightUpdated)
	onMounted(() => {
		actualHeightContainerEl = document.querySelector(config.actualHeightContainer)
		scrollContainerEl = document.querySelector(config.scrollContainer)
		translateContainerEl = document.querySelector(config.translateContainer)
	})

	// 数据源，便于后续直接访问
	let dataSource: any[] = []
	// 前缀高度缓存，prefixHeights[i]表示前i个元素的累计高度
	let prefixHeights: number[] = [0]

	// 计算前缀高度数组
	const computePrefixHeights = () => {
		prefixHeights = [0]
		let sum = 0
		for (let i = 0; i < dataSource.length; i++) {
			sum += getItemHeightFromCache(i)
			prefixHeights.push(sum)
		}
	}

	const scrollTopReset = async (nextTick_ = true) => {
		// 计算需要渲染的数据
		if (nextTick_) await nextTick()
		const el = document.querySelector(config.scrollContainer)
		if (el) el.scrollTop = 0
		resetHeightUpdated()
		updateRenderData(0)
	}

	// 数据源发生变动
	watch(
		() => config.data.value,
		newVla => {
			// 更新数据源
			dataSource = newVla
			computePrefixHeights()
			scrollTopReset()
		}
	)

	// 更新实际高度
	const updateActualHeight = () => {
		let actualHeight = 0
		dataSource.forEach((_, i) => {
			actualHeight += getItemHeightFromCache(i)
		})
		// console.log(actualHeight, 'actualHeight')
		actualHeightContainerEl!.style.height = actualHeight + 'px'
	}

	// 更新已渲染列表项的缓存高度
	const updateRenderedItemCache = (index: number) => {
		nextTick(() => {
			const items = Array.from(document.querySelectorAll(config.itemContainer)) as HTMLElement[]

			// 初始化 ResizeObserver
			if (!resizeObserver) {
				resizeObserver = new ResizeObserver(handleResize)
			}
			// console.error(resizeObserver, 'resizeObserver')

			// 清除旧观察并设置新观察
			resizeObserver.disconnect()
			items.forEach(el => {
				resizeObserver!.observe(el)
				updateSingleItemCache(el, index++)
			})

			updateActualHeight()
		})
	}
	// 新增 resize 处理函数
	const handleResize: ResizeObserverCallback = entries => {
		// console.log('handleResize', entries, RenderedItemsCache, 'RenderedItemsCache')
		entries.forEach(entry => {
			const target = entry.target as HTMLElement
			const index = target.dataset.index
			// console.error(index, 'handleResize index')
			if (index) {
				RenderedItemsCache[index] = { height: target.offsetHeight, updated: true }
				computePrefixHeights()
				updateActualHeight()
			}
		})
	}
	// 提取的缓存更新方法
	const updateSingleItemCache = (el: HTMLElement, index: number) => {
		if (!RenderedItemsCache[index] || !RenderedItemsCache[index].updated) {
			RenderedItemsCache[index] = { height: el.offsetHeight, updated: true }
			el.dataset.index = index.toString() // 添加索引标识
		}
	}

	// 获取缓存高度，无缓存，取配置项的 itemHeight
	const getItemHeightFromCache = (index: number | string) => {
		const val = RenderedItemsCache[index]?.height
		return val === void 0 ? config.itemHeight : val
	}

	// 实际渲染的数据
	const actualRenderData: Ref<any[]> = ref([])
	const startIdx = ref(0)

	// 更新实际渲染数据
	const updateRenderData = (scrollTop: number) => {
		// 获取容器可视区域高度
		const containerHeight = scrollContainerEl?.clientHeight || 0
		const bufferSize = config.bufferSize ?? 3

		// 二分法查找起始索引
		let startIndex = 0
		if (prefixHeights.length > 1) {
			let low = 0
			let high = prefixHeights.length - 1
			startIndex = dataSource.length // 默认值

			while (low <= high) {
				const mid = Math.floor((low + high) / 2)
				if (prefixHeights[mid] >= scrollTop) {
					startIndex = mid - 1
					high = mid - 1
				} else {
					low = mid + 1
				}
			}

			startIndex = Math.max(0, Math.min(startIndex, dataSource.length - 1))
		}

		// 二分法查找结束索引
		const targetHeight = prefixHeights[startIndex + 1] + containerHeight
		let endIndex = dataSource.length
		let low = startIndex + 1
		let high = prefixHeights.length - 1

		while (low <= high) {
			const mid = Math.floor((low + high) / 2)
			if (prefixHeights[mid] > targetHeight) {
				endIndex = mid - 1
				high = mid - 1
			} else {
				low = mid + 1
			}
		}

		// 应用顶部缓冲区
		startIndex = Math.max(0, startIndex - bufferSize)
		// 应用底部缓冲区
		endIndex = Math.min(endIndex + bufferSize, dataSource.length)

		// 更新渲染数据
		actualRenderData.value = dataSource.slice(startIndex, endIndex)
		startIdx.value = startIndex
		updateRenderedItemCache(startIndex)

		// 计算精确偏移
		const totalOffset = prefixHeights[startIndex]
		updateOffset(totalOffset)
	}

	// 更新偏移值
	const updateOffset = (offset: number) => {
		translateContainerEl!.style.transform = `translateY(${offset}px)`
	}
	let animationFrameId = null

	// 滚动事件
	const handleScroll = (e: any) => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId)
		}
		animationFrameId = requestAnimationFrame(() => {
			// 渲染正确的数据
			updateRenderData(e.target.scrollTop)
		})
	}
	const handleOpen = async () => {
		scrollTopReset()
		scrollContainerEl?.addEventListener('scroll', handleScroll)
	}
	const handleClose = async () => {
		scrollTopReset(false)
		scrollContainerEl?.removeEventListener('scroll', handleScroll)
		resizeObserver?.disconnect()
		resizeObserver = null
	}

	onMounted(handleOpen)

	// 移除滚动事件
	onBeforeUnmount(handleClose)

	return { actualRenderData, startIdx, handleClose, handleOpen }
}
