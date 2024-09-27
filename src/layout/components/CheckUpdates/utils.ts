// 创建worker
export const createWorker = (func: () => void, deps?: Array<() => void>) => {
	// work 依赖 fns
	const depsFncStr = `${deps?.map(dep => dep.toString()).join(';\n\n') || ''}`
	const blob = new Blob(
		[
			`
				${depsFncStr};
				(${func.toString()})();
			`
		],
		{
			type: 'application/javascript'
		}
	)
	return new Worker(window.URL.createObjectURL(blob))
}
export const createWorkFn = () => {
	const opts = {
		immediate: true,
		intervalTime: 5000, // 毫秒
		fetchUrl: '/'
	}
	let timer: any = null
	const stop = () => {
		clearInterval(timer)
	}
	const temp: Worker = self as any
	let lastVersionTag = ''
	const getVersionTag = async () => {
		return fetch(opts.fetchUrl, { method: 'HEAD', cache: 'no-cache' })
			.then(res => res.headers.get('etag') || res.headers.get('last-modified'))
			.catch(e => {
				console.error('Failed to fetch version tag', e)
				return null
			})
	}
	const doFetch = async () => {
		const versionTag = await getVersionTag()
		if (!versionTag) return
		// 首次运行时不提示更新
		if (!lastVersionTag) {
			lastVersionTag = versionTag
			return
		}
		if (lastVersionTag !== versionTag) {
			stop()
			temp.postMessage({ type: 'showNotice', data: versionTag })
		}
	}
	temp.addEventListener('message', async (event: any) => {
		// { type: 'start' | 'stop' }
		switch (event.data.type) {
			case 'start':
			{
				const data = event.data.data
				if (data.intervalTime) opts.intervalTime = data.intervalTime
				if (data.fetchUrl) opts.fetchUrl = data.fetchUrl
				if (data.immediate) {
					await doFetch()
				}
				if (timer) stop()
				timer = setInterval(doFetch, opts.intervalTime)
			}
				break
			case 'stop': {
				stop()
				break
			}
		}
	})
	return temp
}
