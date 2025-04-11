# WebTodoList

一个采用自然增值法管理的 Todo list 本地可离线的 WebAPP

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app

# 可以看到安装日志
npm install --verbose 

# 通过命令行参数修改端口
npm run dev -- --port 3000
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

如果你希望永久修改端口号，可以在项目的 vite.config.js 或 svelte.config.js 中配置 server.port。

在 vite.config.js 中配置：

```js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3000, // 修改为你想要的端口号
  },
});
```

在 svelte.config.js 中配置：

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    vite: {
      server: {
        port: 3000, // 修改为你想要的端口号
      },
    },
  },
};

export default config;
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
