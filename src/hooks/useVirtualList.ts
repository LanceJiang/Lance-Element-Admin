import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
// import { throttle } from '@/utils'
interface Config {
	data: Ref<any[]> // 数据源
	scrollContainer: string // 滚动容器的元素选择器
	actualHeightContainer: string // 用于撑开高度的元素选择器
	translateContainer: string // 用于偏移的元素选择器
	itemContainer: string // 列表项选择器
	itemHeight: number // 列表项高度
}

type HtmlElType = HTMLElement | null

export default function useVirtualList(config: Config) {
	// 获取元素
	let actualHeightContainerEl: HtmlElType = null,
		translateContainerEl: HtmlElType = null,
		scrollContainerEl: HtmlElType = null

	let resizeObserver: ResizeObserver | null = null
	onMounted(() => {
		console.log('useVirtualList  onMounted')
		actualHeightContainerEl = document.querySelector(config.actualHeightContainer)
		scrollContainerEl = document.querySelector(config.scrollContainer)
		translateContainerEl = document.querySelector(config.translateContainer)
	})

	// 数据源，便于后续直接访问
	let dataSource: any[] = []

	// 数据源发生变动
	watch(
		() => config.data.value,
		newVla => {
			// 更新数据源
			dataSource = newVla

			// 计算需要渲染的数据
			nextTick(() => {
				const el = document.querySelector(config.scrollContainer)
				if (el) el.scrollTop = 0
				updateRenderData(0)
			})
		}
	)

	// 更新实际高度
	const updateActualHeight = () => {
		let actualHeight = 0
		dataSource.forEach((_, i) => {
			actualHeight += getItemHeightFromCache(i)
		})
		console.log(actualHeight, 'actualHeight')
		actualHeightContainerEl!.style.height = actualHeight + 'px'
	}

	// 缓存已渲染元素的高度
	const RenderedItemsCache: any = {}

	// 更新已渲染列表项的缓存高度
	const updateRenderedItemCache = (index: number) => {
		/* // 当所有元素的实际高度更新完毕，就不需要重新计算高度
		const shouldUpdate = Object.keys(RenderedItemsCache).length < dataSource.length
		if (!shouldUpdate) return

		nextTick(() => {
			// 获取所有列表项元素
			const Items: HTMLElement[] = Array.from(document.querySelectorAll(config.itemContainer))

			// 进行缓存
			Items.forEach(el => {
				if (!RenderedItemsCache[index]) {
					RenderedItemsCache[index] = el.offsetHeight
				}
				index++
			})

			// 更新实际高度
			updateActualHeight()
		}) */
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
		console.log('handleResize', entries, RenderedItemsCache, 'RenderedItemsCache')
		entries.forEach(entry => {
			const target = entry.target as HTMLElement
			const index = target.dataset.index
			if (index) {
				RenderedItemsCache[index] = target.offsetHeight
				updateActualHeight()
			}
		})
	}
	// 提取的缓存更新方法
	const updateSingleItemCache = (el: HTMLElement, index: number) => {
		if (!RenderedItemsCache[index]) {
			RenderedItemsCache[index] = el.offsetHeight
			el.dataset.index = index.toString() // 添加索引标识
		}
	}

	// 获取缓存高度，无缓存，取配置项的 itemHeight
	const getItemHeightFromCache = (index: number | string) => {
		const val = RenderedItemsCache[index]
		return val === void 0 ? config.itemHeight : val
	}

	// 实际渲染的数据
	const actualRenderData: Ref<any[]> = ref([])

	// 更新实际渲染数据
	const updateRenderData = (scrollTop: number) => {
		console.log(scrollTop, 'scrollTop  updateRenderData')
		let startIndex = 0
		let offsetHeight = 0
		let endIndex = 0

		// 获取容器可视区域高度
		const containerHeight = scrollContainerEl?.clientHeight || 0
		let currentHeight = 0

		// 计算起始索引
		for (let i = 0; i < dataSource.length; i++) {
			offsetHeight += getItemHeightFromCache(i)

			if (offsetHeight >= scrollTop) {
				startIndex = i
				break
			}
		}

		// 计算结束索引
		for (let i = startIndex; i < dataSource.length; i++) {
			currentHeight += getItemHeightFromCache(i)
			// 额外渲染2个作为缓冲
			if (currentHeight > containerHeight) {
				endIndex = i
				break
			}
		}

		// 如果没有找到合适的结束索引，则使用数据源长度
		if (endIndex === 0) {
			endIndex = dataSource.length
		}
		// 计算得出的渲染数据(建立2条数据缓冲)
		actualRenderData.value = dataSource.slice(startIndex, endIndex + 2)

		// 缓存最新的列表项高度
		updateRenderedItemCache(startIndex)

		// 更新偏移值
		updateOffset(offsetHeight - getItemHeightFromCache(startIndex))
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
		console.log('scroll.....', e)
		animationFrameId = requestAnimationFrame(() => {
			// 渲染正确的数据
			updateRenderData(e.target.scrollTop)
		})
	}
	// 注册滚动事件
	onMounted(() => {
		console.warn(scrollContainerEl, 'scrollContainerEl')
		scrollContainerEl?.addEventListener('scroll', handleScroll)
	})

	// 移除滚动事件
	onBeforeUnmount(() => {
		scrollContainerEl?.removeEventListener('scroll', handleScroll)
		resizeObserver?.disconnect()
		resizeObserver = null
	})

	return { actualRenderData }
}
