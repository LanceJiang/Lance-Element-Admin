import path from 'path'
import fs from 'fs'
import MarkdownIt from 'markdown-it'
import mdContainer from 'markdown-it-container'
// import { docRoot } from '@element-plus/build-utils'
// import externalLinkIcon from '../plugins/external-link-icon'
// import tableWrapper from '../plugins/table-wrapper'
import tooltip from '../plugins/tooltip'
// import tag from '../plugins/tag'
// import { ApiTableContainer } from '../plugins/api-table'
import { highlight } from '../utils/highlight'
import type Token from 'markdown-it/lib/token'
import type Renderer from 'markdown-it/lib/renderer'

const localMd = MarkdownIt() // .use(tag)

interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer
  ): string
}

export const mdPlugin = (md: MarkdownIt) => {
  // md.use(externalLinkIcon)
  // md.use(tableWrapper)
  md.use(tooltip)
  // md.use(tag)
  md.use(mdContainer, 'demo', {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
			/**
        :::demo Use `type`, `plain`, `round` and `circle` to define Button's style.
        button/basic
        :::
			 */
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
				// 拿到描述 Use `type`, `plain`, `round` and `circle` to define Button's style.
        const description = m && m.length > 1 ? m[1] : ''
				// 获取文件路径的 token
        const sourceFileToken = tokens[idx + 2]
        let source = ''
				// 文件路径 button/basic
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
				// console.error(sourceFile, 'sourceFile')
        if (sourceFileToken.type === 'inline') {
					// 根据路径读取 examples/button/basic.vue
          source = fs.readFileSync(
            // path.resolve(docRoot, 'examples', `${sourceFile}.vue`),
            path.resolve('./', 'examples', `${sourceFile}.vue`),
            'utf-8'
          )
        }
				// console.error(source, 'source')
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)

				// highlight 的作用就是将代码包裹一下，根据传递的语言加载该语言的样式
        return `<VPDemo :demos="demos" source="${encodeURIComponent(
          highlight(source, 'vue')
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source
        )}" description="${encodeURIComponent(localMd.render(description))}">`
      } else {
        return '</VPDemo>'
      }
    },
  } as ContainerOpts)

  // md.use(ApiTableContainer)
}
