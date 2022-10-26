# vite-plugin-vue-element-plus-icon

a vite plugin to load svg icon for element-plus

## Why

Importing a svg file, you would get a url of file in vite

In most cases, we want a Vue component to render in page directly.

In element-plus, it supply a `el-icon` Element, and a built-in Svg resource library

Use your svg file, it`s not render properly, such as not supporting color attribute

So I create thie vite plugin to svg file, import as vue component, and optimize using for element-plus icon

## Relative Resourece

- [element-plus icon](https://element-plus.org/en-US/component/icon.html)
- [svgo](https://github.com/svg/svgo)
- [vite](https://vitejs.dev/)
- [vue](https://vuejs.org/)

## Requirements

- vite: ^3.0.0
- vue: ^3.2.13

## Install

```bash
// pnpm
pnpm add vite-plugin-vue-element-plus-icon -D

// npm
npm install vite-plugin-vue-element-plus-icon -D

// yarn
yarn add vite-plugin-vue-element-plus-icon --D
```

## Setup

#### `vite.config.ts`

```ts
import vpvepi from 'vite-plugin-vue-element-plus-icon'

export default defineConfig({
  plugins: [vpvepi()],
})
```

## Use

```vue
<script setup lang="ts">
import Coffee from './coffee.svg'
import CoffeeRaw from './coffee.svg?raw'
import CoffeeUrl from './coffee.svg?url'
</script>
<template>
  <div>
    <!-- used in element-plus, support color, size attrs and etc -->
    <el-icon color="red" class="is-loading" :size="100">
      <Coffee />
    </el-icon>
  </div>
  <div>
    <CoffeeRaw />
  </div>
  <div>
    {{ CoffeeUrl }}
  </div>
</template>
```

## Query Options

### component

default value

svg file will be imported as Vue component, with optimized for element-plus

```ts
import CoffeeComp from './coffee.svg?component'
// <CoffeeComp />
```

### raw

svg file will be imported as Vue component, without optimized for element-plus

```ts
import CoffeeRaw from './coffee.svg?raw'
// <CoffeeRaw />
```

### url

svg file will be imported as file path

```ts
import CoffeeUrl from './coffee.svg?url'
// {{ CoffeeUrl }}
```

## Plugin Options

### defaultQuery

```ts
import vpvepi from 'vite-plugin-vue-element-plus-icon'

export default defineConfig({
  plugins: [
    vpvepi({
      defaultQuery: 'raw', // component(default value), url, raw
    }),
  ],
})
```

### svgoConfig

```ts
import vpvepi from 'vite-plugin-vue-element-plus-icon'

export default defineConfig({
  plugins: [
    vpvepi({
      svgoConfig(path) {
        // svgo config options
        return {
          multipass: true,
        }
      },
    }),
  ],
})
```

use `getDefaultSvgoOptions` to get default svgo options, you can merge options from the return value

```ts
import vpvepi, { getDefaultSvgoOptions } from 'vite-plugin-vue-element-plus-icon'

export default defineConfig({
  plugins: [
    vpvepi({
      svgoConfig(path) {
        // svgo config options
        const ops = getDefaultSvgoOptions(path)
        return {
          ...ops,
          multipass: false,
        }
      },
    }),
  ],
})
```

## Svgo Plugin

you can use svg plugin `svgo-plugin-replace-fill` separately

it would replace `fill` attr directly

```ts
import sprf from 'vite-plugin-vue-element-plus-icon/dist/svgo-plugin-replace-fill.cjs'

vpvepi({
  svgoConfig() {
    return {
      plugins: [sprf],
    }
  },
}),
```

## Inspired by vite-svg-loader

[vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader)
