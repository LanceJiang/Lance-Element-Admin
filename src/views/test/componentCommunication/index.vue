<template>
	<div class="wrap">
		<div class="common_title">组件通信方式</div>
		<el-button @click="switchComponent">异步组件 切换状态 加载组件</el-button>
		<keep-alive>
			<component :is="curComponent" :ref="curComponent" />
		</keep-alive>
	</div>
</template>

<script>
// import { defineAsyncComponent } from 'vue'
// import Loading from '@/components/Loading/src/Loading'
// 异步组件
/*const AsyncComp = defineAsyncComponent({
  // loader: () => import("./LoginPopup.vue"),
  loader: () =>
    new Promise((resolve, reject) => {
      console.log('loader.................')
      setTimeout(() => {
        resolve({
          render: () => <div>I am async!</div>
        })
      }, 1600)
      // 随机 失败
      Math.random() > 0.5 && setTimeout(() => {
        reject('fetchError:失败了...')
      }, 1000)
    }),
  // 加载异步组件时要使用的组件
  // loadingComponent: Loading,
  loadingComponent: {
    render() {
      return <Loading loading/>
    }
  },
  // 加载失败时要使用的组件
  errorComponent: {
    render() {
      return <div>Error.....</div>
    }
  },
  // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
  delay: 10,
  // 如果提供了 timeout ，并且加载组件的时间超过了设定值，将显示错误组件
  // 默认值：Infinity（即永不超时，单位 ms）
  timeout: 1600,
  // 定义组件是否可挂起 | 默认值：true
  // suspensible: false,
  /!**
   *
   * @param {*} error 错误信息对象
   * @param {*} retry 一个函数，用于指示当 promise 加载器 reject 时，加载器是否应该重试
   * @param {*} fail  一个函数，指示加载程序结束退出
   * @param {*} attempts 允许的最大重试次数
   *!/
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // 请求发生错误时重试，最多可尝试 3 次
      retry()
    } else {
      // 注意，retry/fail 就像 promise 的 resolve/reject 一样：
      // 必须调用其中一个才能继续错误处理。
      fail()
    }
  }
})*/
// const Comp1 = {
//   render () {
//     return <div>我是 component 1</div>
//   }
// }
import Comp_Props from './components/Comp_Props'
import Comp_Emit from './components/Comp_Emit'
import Comp_Refs from './components/Comp_Refs'
// import Comp2 from './components/Comp2'
export default {
	name: 'componentCommunication',
	components: {
		// AsyncComp,
		// Comp1,
		// Comp2,
		// Comp2: defineAsyncComponent(() => import('./components/Comp2.vue')),
		// Comp3: defineAsyncComponent(() => import('./components/Comp2.vue'))
		Comp_Props,
		Comp_Emit,
		Comp_Refs
	},
	data() {
		return {
			comps: [
				// 'Comp1',
				// 'AsyncComp',
				// 'Comp2',
				// 'Comp3'
				'Comp_Props',
				'Comp_Emit',
				'Comp_Refs'
			],
			curComponent: 'Comp_Refs'
		}
	},
	methods: {
		switchComponent() {
			const compName = this.curComponent
			const comps = this.comps
			const idx = comps.findIndex(name => compName === name)
			if (idx >= 0 && idx < comps.length - 1) {
				this.curComponent = comps[idx + 1]
			} else {
				this.curComponent = comps[0]
			}
		}
	},
	created() {
		window.xxx = this
	}
}
</script>
<style scoped></style>
