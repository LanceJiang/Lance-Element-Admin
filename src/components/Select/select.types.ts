type OptionCommon = Record<string, any>

export type Option = OptionCommon & {
	created?: boolean
	// 本地le label 存储(结合多语言转换) 将会更新至options
	le_label: string
	// reserve for option
	[prop: string]: any
}

export type OptionGroup = OptionCommon

export type OptionType = Option | OptionGroup

export type OptionItemProps = {
	item: any
	index: number
	disabled: boolean
}
