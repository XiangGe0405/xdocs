---
sidebar_position: 1
---

# Vue-Cli

## 1.1 使用cnpm加速下载

npm有时下载速度很慢，可以安装cnpm，从国内淘宝镜像下载，执行以下命令：

``` bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

以后npm直接替换成cnpm使用。

## 1.2 安装cli

先查看是否已经安装了vue-cli，vue-cli的版本是什么

``` bash
vue -V
```

如果版本叫老，可以直接卸载，再安装最新版本

卸载

``` bash
npm uninstall vue-cli -g
```

安装

``` bash
install @vue/cli -g
```

## 1.4 创建vue项目

选取一个项目存放的路径，然后开始创建项目 例如：

``` bash
vue create electron-vue-cloudmusic
```

会出现以下选项：

``` bash
Vue CLI v4.5.15
? Please pick a preset: (Use arrow keys)
> Default ([Vue 2] babel, eslint)
  Default (Vue 3) ([Vue 3] babel, eslint)
  Manually select features
```

第一个选项是 “default” 默认，只包含babel和eslint
第二个选项是 “Manually select features”自定义安装

选择自定义安装，进入下一步选择

``` bash
Vue CLI v4.5.15
? Please pick a preset: Manually select features
? Check the features needed for your project:
>(*) Choose Vue version
 (*) Babel
 ( ) TypeScript
 ( ) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
 (*) CSS Pre-processors
 (*) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing
```

这里我们选择 1. babel（高级的语法转换为 低级的语法）
2. Router（路由）
3. Vuex（状态管理器）
4. CSS Pre-processors（css预处理器）
5. Linter / Formatter（代码风格、格式校验）

然后进入下一步

``` bash
Vue CLI v4.5.15
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, Router, Vuex, CSS Pre-processors, Linter
? Choose a version of Vue.js that you want to start the project with (Use arrow keys)
  2.x
> 3.x
```

``` bash
? Use history mode for router? (Requires proper server setup for index fallback 
in production) (Y/n)  n
```

这一步是设置router是否使用history模式，这里我们选n，接着进入下一步

``` bash
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported 
by default): (Use arrow keys)
  Sass/SCSS (with dart-sass) 
  Sass/SCSS (with node-sass) 
  Less 
❯ Stylus
```

这里是设置css预处理模块，在这里我要强调一下，不需要乱选，选择我们熟悉的一种，在这里我们选择 Stylus ，然后进入下一步

``` bash
? Pick a linter / formatter config: (Use arrow keys)
  ESLint with error prevention only 
  ESLint + Airbnb config 
❯ ESLint + Standard config 
  ESLint + Prettier
```

这一步是选择ESLint代码检查工具的配置，这里我们选择标准配置“ESLint + Standard config”，然后进入下一步

``` bash
? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i
> to invert selection)
❯◉ Lint on save
 ◯ Lint and fix on commit
```

这一步是选择什么时候执行ESLint检查，这里我们选择保存时检查“Lint on save”,然后进入下一步

``` bash
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? 
  In dedicated config files 
❯ In package.json
```

这一步是询问 babel, postcss, eslint这些配置是单独的配置文件还是放在package.json 文件中，这里我们选择“In package.json”，然后进入下一步

``` bash
? Save this as a preset for future projects? (y/N) N
```
