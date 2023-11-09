import { defineStore } from 'pinia'
import { SettingState } from '@/types'
import defaultSettings from '@/settings'
// import { ls } from '@/utils'

// const { layout, themeColor, isDark, showSettings, tagsView } = defaultSettings

export const useSettingStore = defineStore({
	id: 'setting',
	state: (): SettingState => defaultSettings,
	// state: (): SettingState => ({
	// 	layout,
	// 	themeColor,
	// 	isDark,
	// 	showSettings,
	// 	tagsView
	// }),
	actions: {
		async changeSetting(...payload: [string, any]) {
			const [key, value] = payload
			switch (key) {
				// case 'tagsView':
				// 	this.tagsView = value
				// 	// ls.set('tagsView', value)
				// 	break
				// case 'themeColor':
				// 	this.themeColor = value
				// 	break
				// case 'showSettings':
				// 	this.showSettings = value
				// 	break
				default:
					// eslint-disable-next-line
					// @ts-ignore
					this[key] = value
					break
			}
		}
	},
	// persist: true
	persist: {
		paths: Object.keys(defaultSettings).filter(key => key !== 'settingsVisible')
	}
})

export default useSettingStore
