import { CustomPlugin } from 'svgo'

const plugin: CustomPlugin = {
  name: 'svgo-plugin-element-plus',
  type: 'perItem',
  fn: ast => {
    if (ast.name == 'path') {
      ast.attributes.fill = 'currentColor'
    }
  },
}

export default plugin
