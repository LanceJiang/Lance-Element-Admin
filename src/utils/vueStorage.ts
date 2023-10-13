import Storage from 'vue-ls'
import defaultSettings from '@/settings'
const options = {
	namespace: `${defaultSettings.title}_`, // key prefix
	name: 'ls', // name variable Vue.[ls] or this.[$ls],
	storage: 'local' // storage name session, local, memory
}
export const { ls } = Storage.useStorage(options)
export default ls
