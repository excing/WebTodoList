# WebTodoList

一个采用自然增值法管理的 Todo list 本地可离线的 WebAPP

其核心功能如下：
* 自然增值法：每分钟该任务的分值增加 n 点，n 为任务当前的支持点数
* 用户每发布或支持一个任务，即消耗一个支持点数
* 用户每天（00:00）可获得 5 个支持点数
* 减少对一个任务的支持，可获得一个支持点数
* 当一个任务支持点数为 0 时，该任务将被取消
* 有一个取消列表
* 任务详细支持 markdown 文本格式
* 可编辑任务
* 使用 tailwindcss 处理UI样式
* Todo list 为主要界面
* 支持标签和支持按标签查看任务列表
* 支持活动图表（类似 github 贡献图表），展示了用户在 app 上的活动情况，包括每天的todo/done/support 数量、创建/完成/支持的任务等。
* 支持数据同步，采用 github api （gist） 实现。
 * 当添加相关设置后，则隐藏相关配置界面
* 使用 ts 编写，使用 svelte 框架。 

## CHANGLOG

### 4/13/2025

- 添加打开 github gist 页面链接
- 用户每天（00:00）可获得 5 个支持点数，不可叠加

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
