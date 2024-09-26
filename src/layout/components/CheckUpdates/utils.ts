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
	const worker = new Worker(window.URL.createObjectURL(blob))
	/*const worker = new Worker(
		URL.createObjectURL(new Blob())
	)
	worker.onmessage = (e) => {
    console.log(e.data)
  }
  worker.postMessage(deps)*/
	return worker
}
export const createWorkFn = () => {
	const opts = {
		immediate: true,
		intervalTime: 5000, // 毫秒
		fetchUrl: '/'
	}
	// let immediate = false
	// let intervalTime = 5000
	let timer: any = null
	const stop = () => {
		console.log('执行clear (stop)')
		clearInterval(timer)
	}
	const temp: Worker = self as any
	// todo something...
	let lastVersionTag = ''
	const getVersionTag = async () => {
		return (
			fetch(opts.fetchUrl, { method: 'HEAD', cache: 'no-cache' })
				// .then(res => res.headers.get('etag') || res.headers.get('last-modified'))
				.then(res => +new Date() + '_s')
				.catch(e => {
					console.error('Failed to fetch version tag', e)
					return null
				})
		)
	}
	const doFetch = async () => {
		// temp.postMessage({
		// })
		const versionTag = await getVersionTag()
		if (!versionTag) return
		// 首次运行时不提示更新
		if (!lastVersionTag) {
			lastVersionTag = versionTag
			return
		}
		if (lastVersionTag !== versionTag) {
			stop()
			temp.postMessage({ type: 'showCheck', data: versionTag })
		}
	}

	temp.onmessage = async (event: any) => {
		// opts.immediate = event.data['immediate']
		// intervalTime = event.data['intervalTime']
		// { type: 'start' | 'stop' }
		console.error('worker 内 onmessage.... event.data.xxx', event)
		switch (event.data.type) {
			case 'start':
				{
					const data = event.data.data
					if (data.intervalTime) opts.intervalTime = data.intervalTime
					if (data.fetchUrl) opts.fetchUrl = data.fetchUrl
					console.error('start....')
					if (data.immediate) {
						await doFetch()
					}
					if (timer) stop()
					timer = setInterval(doFetch, opts.intervalTime)
				}
				break
			case 'stop':
				console.log('通过postMessage执行内部 stop')
				stop()
				break
		}
	}
	return temp
}
