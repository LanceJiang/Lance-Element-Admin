import type { UploadFile } from 'element-plus'

let uidIndex = 0

export function getUid() {
	return +new Date() + uidIndex++
}

// 获取文件名称
export function getFileNameByUrl(url?: string) {
	return url?.match(/\/([^\/\?]+)(\?|$)/)?.[1] || ''
}

// 获取文件扩展名: eg: '.png'
export function getFileExt(url?: string) {
	return url?.match(/(\.[0-9a-z]+)([\?#]|$)/i)?.[1] || ''
}

// 通过带有扩展名的url 或 名称 判断是否图片
export function isImageByExt(url: string) {
	return /\.(jpg|jpeg|jfif|png|gif|bmp|tiff|webp|svg|dpg|ico)$/i.test(url)
}

// export function getFileExt 文件扩展名 filename extension
export function fileItemGenerator(itemOrUrl: string | UploadFile): UploadFile {
	if (typeof itemOrUrl === 'string') {
		return {
			uid: getUid(),
			name: getFileNameByUrl(itemOrUrl),
			url: itemOrUrl,
			status: 'success',
			response: { status: 'history', data: itemOrUrl }
		}
	}
	return {
		...itemOrUrl,
		uid: itemOrUrl.uid || getUid(),
		name: itemOrUrl.name || getFileNameByUrl(itemOrUrl.url),
		url: itemOrUrl.url,
		status: itemOrUrl.status || 'success',
		response: itemOrUrl.response || { status: 'history', data: itemOrUrl.url }
	}
}

/**
 * 'url1,url2,url3' => {url,name...}[]
 * @param paths
 */
export function parsePathToFiles(paths?: string): UploadFile[] {
	if (!paths) return []
	return paths.split(',').map(url => fileItemGenerator(url))
}

// {name, url, status, uid...}[]
export function getFileList(files: UploadFile[], keys: (keyof UploadFile)[] = ['name', 'url']) {
	if (!Array.isArray(files)) return
	return files.map(item => {
		return keys.reduce((res, key) => {
			// eslint-disable-next-line
			// @ts-ignore
			res[key] = item[key]
			return res
		}, {} as Partial<UploadFile>)
	})
}

// url[]|string url1,url2
export function getFileListUrls(files: UploadFile[], isArray = false): undefined | string | string[] {
	if (!Array.isArray(files)) return
	const urls = files.map(item => {
		return item.url as string
	})
	return isArray ? urls : urls.join(',')
}
