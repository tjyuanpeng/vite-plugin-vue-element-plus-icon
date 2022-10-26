import type { Plugin } from 'vite'
import { readFile } from 'fs/promises'
import { compileTemplate } from 'vue/compiler-sfc'
import { optimize, OptimizeOptions } from 'svgo'
import sprf from './svgo-plugin-replace-fill'
import type { OptimizedSvg } from 'svgo'

export const getDefaultSvgoOptions = (path?: string): OptimizeOptions => {
  return {
    path: path,
    multipass: true,
    plugins: [
      'preset-default',
      'removeDimensions',
      {
        name: 'removeAttrs',
        params: {
          attrs: 'class',
        },
      },
      sprf,
    ],
  }
}

export interface Options {
  svgoConfig?: (path: string) => OptimizeOptions,
  defaultQuery?: 'component' | 'url' | 'raw'
}

export default function vpvepi(options: Options = {}): Plugin {
  const svgRegex = /\.svg(\?(raw|component|url))?$/;
  const { svgoConfig, defaultQuery = 'component' } = options

  return {
    name: 'vite-plugin-vue-element-plus',
    enforce: 'pre' as const,

    async load(id: string) {
      if (!id.match(svgRegex)) {
        return
      }
      const [path, query] = id.split('?', 2)

      const queryType = query || defaultQuery
      if (queryType === 'url') {
        return
      }

      let svgFileContent = ''
      try {
        svgFileContent = await readFile(path, 'utf-8')
      } catch (e) {
        console.warn(`#vite-plugin-vue-element-plus-icon: [${path}] couldn't be read.`, e)
        return
      }

      if (queryType !== 'raw') {
        const result = optimize(
          svgFileContent,
          svgoConfig ? svgoConfig(path) : getDefaultSvgoOptions(path)
        )
        if (result.error) {
          console.warn(
            `#vite-plugin-vue-element-plus-icon: [${path}] couldn't be handled by svgo.`,
            result.error
          )
          return
        }
        svgFileContent = (result as OptimizedSvg).data
      }

      const { code } = compileTemplate({
        id: JSON.stringify(id),
        source: svgFileContent,
        filename: path,
        transformAssetUrls: false,
      })

      return `${code} \n export default { render }`
    },
  }
}
