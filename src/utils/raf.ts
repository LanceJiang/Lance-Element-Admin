// cancelAnimationFrame
export const cancelAnimationFrame = window.cancelAnimationFrame
// 使用 requestAnimationFrame 模拟 setTimeout 和 setInterval
export function rafTimeout(callback: () => void, delay = 0, interval = false): object {
	const requestAnimationFrame = typeof window !== 'undefined' ? window.requestAnimationFrame : () => {}
	let start = performance.now()
	const raf = {
		// 引用类型保存，方便获取 requestAnimationFrame()方法返回的 ID.
		id: requestAnimationFrame(loop)
	}
	function loop(timestamp: number) {
		/**
			timestamp参数：与performance.now()的返回值相同，它表示requestAnimationFrame() 开始去执行回调函数的时刻
		*/

		const elapsed = timestamp - start
		if (elapsed >= delay) {
			callback() // 执行目标函数func
			if (interval) {
				start = timestamp
				raf.id = requestAnimationFrame(loop)
			}
		} else {
			raf.id = requestAnimationFrame(loop)
		}
	}

	return raf
}
// 用于取消 rafTimeout 函数
export function cancelRaf(raf: { id?: number }): void {
	const cancelAnimationFrame = typeof window !== 'undefined' ? window.cancelAnimationFrame : () => {}
	if (raf && raf.id) cancelAnimationFrame(raf.id)
}
