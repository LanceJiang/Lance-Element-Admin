interface onImgLoadType {
	index: number
	url: string
	dom: HTMLImageElement
}

export interface Options {
	show?: boolean
	imageList: string[]
	index?: number
	scaleStep?: number
	defaultWidth?: number
	maskClosable?: boolean
	rememberState?: boolean
	onImgLoad?: (params: onImgLoadType) => void
	onImgError?: (params: onImgLoadType) => void
}

export interface Props {
	show: boolean
	instance: Props
	imageList: string[]
	index: number
	scaleStep: number
	defaultWidth: number
	maskClosable: boolean
	rememberState: boolean
}

export interface PreviewActions {
	resume: () => void
	close: () => void
	prev: () => void
	next: () => void
	setScale: (scale: number) => void
	setRotate: (rotate: number) => void
}
