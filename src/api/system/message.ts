import request from '@/utils/request'

/**
 * 获取路由列表
 */
export function getMessage() {
	return new Promise(resolve => {
		setTimeout(
			resolve({
				noticeList: [
					{
						id: '1709154417339256833',
						createTime: '2023-10-03 10:32',
						title: '通知 6',
						content: '通知 6 内容'
					},
					{
						id: '1709154394996199425',
						createTime: '2023-10-03 10:32',
						title: '通知 5',
						content: '通知 5 内容'
					}
				],
				messageList: [
					{
						id: '1709154583970566146',
						createTime: '2023-10-03 10:33',
						title: '消息 1',
						content: '消息 1 内容'
					}
				],
				todoList: []
			}),
			500
		)
	})
	/*return request({
		url: '/sys/message/inform',
		method: 'get'
		// extraConfig: { showFullscreenLoading: true }
	})*/
}
