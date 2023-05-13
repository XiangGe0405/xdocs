---
sidebar_position: 2
---

# 使用electron-builder集成electron

## 自动安装

进入项目根目录（electron-vue-cloudmusic），然后执行下列命令：

``` bash
vue add electron-builder
```

在安装过程中，很可能会卡在这一步不动了：

node ./download-chromedriver.js
没关系，我们先强制结束掉。再执行一次vue add electron-builder，然后就可以顺利通过了。

接下来出现配置选项：

``` bash
? Choose Electron Version (Use arrow keys)
  ^11.0.0
  ^12.0.0
> ^13.0.0
```

选择Electron版本。选择 “^13.0.0”。

然后耐心等待安装完成。如果中间出现错误中断了，请重复此步骤。

安装完成后会自动在src目录下生成background.js并修改了package.json。

++※注：由于网络原因，如果中间出现过中断失败，再次重新安装可能会很快完成，但实际上electron可能并未安装完全。建议完成以上步骤后，直接删除项目根目录的node_modules/，并且执行cnpm install，从国内镜像重新安装所有依赖包。++

## 手动安装electron

修改package.json，添加以下7行：

``` bash
...
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
+   "electron:build": "vue-cli-service electron:build",
+   "electron:serve": "vue-cli-service electron:serve",
+   "postinstall": "electron-builder install-app-deps",
+   "postuninstall": "electron-builder install-app-deps"
  },
+ "main": "background.js",
  "dependencies": {
    "core-js": "^2.6.5",
    "vue": "^2.6.6",
    "vue-router": "^3.0.1",
    "vuex": "^3.0.1"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^3.8.0",
    "@vue/cli-plugin-eslint": "^3.8.0",
    "@vue/cli-service": "^3.8.0",
    "@vue/eslint-config-standard": "^4.0.0",
    "babel-eslint": "^10.0.1",
+   "electron": "^5.0.6",
    "eslint": "^5.16.0",
    "eslint-plugin-vue": "^5.0.0",
    "stylus": "^0.54.5",
    "stylus-loader": "^3.0.2",
+   "vue-cli-plugin-electron-builder": "^1.3.5",
    "vue-template-compiler": "^2.6.10"
  },
  ...
```

新建src/background.js

在src目录下新建background.js，复制以下代码：

``` bash
'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
```

安装依赖包
在项目根目录执行，安装全部依赖包：

``` bash
cnpm install
```

如果安装过程中报错：Error: post install error, please remove node_modules before retry!可以忽略，不影响后续使用。

1.7 编译并启动APP
执行以下命令，开始编译APP，并启动开发环境APP：

``` bash
npm run electron:serve
```

首次启动可能会等待很久，出现以下信息：

``` bash
INFO  Launching Electron...
Failed to fetch extension, trying 4 more times
Failed to fetch extension, trying 3 more times
Failed to fetch extension, trying 2 more times
...
```

这是因为在请求安装vuejs devtools插件。需要科学上网才能安装成功。如果不能科学上网也没关系，耐心等待5次请求失败后会自动跳过。

编译成功后，就会出现开发环境的APP了。

---

## APP窗口大小

修改background.js：

``` bash
function createWindow () {
      // Create the browser window.
      win = new BrowserWindow({
M       width: 1200,
M       height: 620,
        webPreferences: {
          nodeIntegration: true
        }
      })
```

## 取消跨域限制

修改background.js：

``` bash
function createWindow () {
      // Create the browser window.
      win = new BrowserWindow({
        width: 1200,
        height: 620,
        webPreferences: {
+         webSecurity: false,
          nodeIntegration: true
        }
      })
```

## 取消菜单栏

在我们生成的桌面APP中，我们可以看到默认的菜单栏。

在windows中，菜单栏在APP窗口内的顶部；在macOS中，菜单栏位于电脑屏幕顶部。

为了方便项目将来也能直接生成纯web应用，尽量把APP的全部功能都做到渲染进程里，这里我们取消菜单栏。

由于macOS的特殊性，顶部菜单栏无法删除，所以我们针对macOS特殊处理，把菜单栏只保留“关于”和“退出”。

修改background.js：


``` bash
M   import { app, protocol, BrowserWindow, Menu } from 'electron'
    ...
    function createWindow () {
        ...
        win.on('closed', () => {
            win = null
        })

+       createMenu()
    }

+   // 设置菜单栏
+   function createMenu() {
+       // darwin表示macOS，针对macOS的设置
+       if (process.platform === 'darwin') {
+           const template = [
+           {
+               label: 'App Demo',
+               submenu: [
+                   {
+                       role: 'about'
+                   },
+                   {
+                       role: 'quit'
+                   }]
+           }]
+           let menu = Menu.buildFromTemplate(template)
+           Menu.setApplicationMenu(menu)
+       } else {
+           // windows及linux系统
+           Menu.setApplicationMenu(null)
+       }
+   }
```

## 设置APP窗口图标

准备windows和macOS两版图标。

> windows: app.ico 最小尺寸：256x256
> macOS: app.png或app.icns 最小尺寸：512x512

把图标文件放到public/目录下，项目结构如下：

``` bash
|- /dist_electron
  （略）
|- /public
   |- app.icns  <-- 本教程暂时未使用icns
   |- app.ico
   |- app.png
   |- favicon.ico
   |- index.html
|- /src
  （略）
|- .editorconfig    
|- .eslintrc.js
|- .gitignore
|- babel.config.js
|- package.json
|- package-lock.json
|- README.md
```

可以顺便把favicon.ico也修改一下，但是在桌面版APP上是用不到的。如果以后生成纯web项目才会用到。

修改background.js，让APP窗口应用图标：

``` bash
function createWindow () {
      // Create the browser window.
      win = new BrowserWindow({
        width: 1200,
        height: 620,
        webPreferences: {
          nodeIntegration: true
        },
+       // eslint-disable-next-line no-undef
+       icon: `${__static}/app.ico`
      })
```

> 这里的${__static}对应的是public目录

现在，Windows系统上可以看到开发环境的APP窗口图标已经生效了。

## 设置APP窗口标题栏名称

修改public/index.html:

我们把electron-vue-demo改为App Demo。

``` bash
<head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="icon" href="<%= BASE_URL %>favicon.ico">
M       <title>App Demo</title>
  </head>
```

## 设置APP及安装包图标

在3.5章节，我们的图标生效于运行APP的窗口。本小节将生效于最终生成的可执行文件和安装包图标。需要准备的图标文件请回看3.5章节。

修改vue.config.js

``` bash
chainWebpack: config => {...},
+   pluginOptions: {
+       electronBuilder: {
+           builderOptions: {
+               win: {
+                   icon: './public/app.ico'
+               },
+               mac: {
+                   icon: './public/app.png'
+               }
+           }
+       }
+   }
    ...
```

## 设置APP名称

APP名称包括安装包中APP的名称、可执行文件的文件名。

修改vue.config.js:

``` bash
pluginOptions: {
        electronBuilder: {
            builderOptions: {
                win: {
                    icon: './public/app.ico'
                },
                mac: {
                    icon: './public/app.png'
                },
+               productName: 'AppDemo'
            }
        }
    }
```

## 打包APP

执行以下命令，可以build工程：


``` bash
npm run electron:build
```

最终在dist_electron目录下生成build后的产品。

## windows版本

目录如下：

``` bash
/dist_electron
|- /bundled
  （略）
|- /win-unpacked  <-- 绿色版
  （略）
|- AppDemo Setup 0.1.0.exe  <-- 安装文件
|- AppDemo Setup 0.1.0.exe.blockmap
|- builder-effective-config.yaml
|- index.js
```

这里其实就win-unpacked和AppDemo Setup 0.1.0.exe有用。

> ※注：在32位环境下打包生成的是32位APP，在64位环境下打包生成的是64位APP。

## mac版本

``` bash
/dist_electron
|- /bundled
  （略）
|- /mac
   |- AppDemo   <-- 绿色版
|- AppDemo-0.1.0-mac.zip  <-- 绿色版压缩包
|- AppDemo-0.1.0-mac.dmg  <-- 安装包
|- AppDemo-0.1.0.dmg.blockmap
|- builder-effective-config.yaml
|- index.js
```

## src目录结构参考

``` bash
/src
|- /common
   |- /fonts
   |- /images
   |- /js
      |- api
      |- libs
   |- /stylus
   |- /components
   |- /base
   |- /modules
      |- /moduleA
      |- /moduleB
      ...
   |- /views
   |- App.vue
   |- background.js
   |- main.js
   |- router.js
   |- store.js
```

下面对部分重要目录简要说明：

``` bash
common/ - 项目公用库
common/fonts/ - 字体文件
common/images/ - 公用图片
common/js/ - 公用js目录
common/js/api/ - 把api按类别封装成函数，并export出去，减少业务逻辑中的重复代码
common/js/lib/ - 存放一些公用函数库、定义的常量库等
common/stylus/ - Stylus样式文件
components/ - vue组件目录
component/base/ - vue基础组件，例如自定义的CheckBox、日期选择器、Dialog、Toaster、分页组件等
component/modules/ - vue模块
views/ - vue页面
```

## 换肤功能的实现

项目根目录下的public目录是静态目录，也就是说在build最终产品的时候，它里面的文件将原封不动保留。所以，可以将皮肤文件放在这里。

``` bash
|- /public
+  |- /skin
+     |- /skin01
+        |- skin.css
+     |- /skin02
+        |- skin.css     
   |- app.icns
   |- app.ico
   |- app.png
   |- favicon.ico
   |- index.html
```

由于Electron的是基于chromium内核，所以不用担心代码的浏览器兼容问题。接下来就是发挥CSS3变量var(--*)的时候了。

public/skin/skin01/skin.css：


``` bash
:root {
    --color-bg: #fff;
    --color-text: #333;
}
```

public/skin/skin02/skin.css：


``` bash
:root {
    --color-bg: #263238;
    --color-text: #b2ccd6;
}
```

修改src/App.vue：

``` bash
...
    <style lang="stylus">
+   body
+     background: var(--color-bg)
+     color: var(--color-text)
    #app
      font-family 'Avenir', Helvetica, Arial, sans-serif
      -webkit-font-smoothing antialiased
      -moz-osx-font-smoothing grayscale
      text-align center
M     color: var(--color-text)

    #nav
      padding 30px
      a
        font-weight bold
M       color: var(--color-text)
        &.router-link-exact-active
          color #42b983
    </style>
```

在public/index.html引入皮肤样式，注意加上id="app-skin"：

``` bash
<head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="icon" href="<%= BASE_URL %>favicon.ico">
+       <link rel="stylesheet" href="<%= BASE_URL %>skin/skin01/skin.css" id="app-skin">
        <title>App Demo</title>
  </head>
```

## 注册快捷键打开devTools

在Electron中打开devTools是通过主线程中调用win.webContents.openDevTools()实现的。以上教程仅在开发环境初始启动的时候打开devTools，但是一旦关闭就不能再打开了。下面讲一下怎么通过快捷键打开devTools。

修改background.js:

``` bash
...
M   import { app, protocol, BrowserWindow, Menu, globalShortcut } from 'electron'
    ...
    app.on('ready', async () => {
        if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
            try {
                await installVueDevtools()
            } catch (e) {
                console.error('Vue Devtools failed to install:', e.toString())
            }
        }
        // 在开发环境和生产环境均可通过快捷键打开devTools
+       globalShortcut.register('CommandOrControl+Shift+i', function () {
+           win.webContents.openDevTools()
+       })
        createWindow()
})
```

在windows下，按Ctrl+Shift+i即可打开devTools

在macOS下，按Commond+Shift+i即可打开devTools

为什么没用F12？因为windows系统中，F12是系统保留快捷键，无法使用。
