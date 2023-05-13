---
# sidebar_position: 1
---
# Draw.io

官网：<https://www.draw.io/>

一、在线方式：
开源地址：<https://github.com/fjudith/docker-draw.io>

二、桌面端安装包：
<https://github.com/jgraph/drawio-desktop/releases/download/v16.1.2/draw.io-16.1.2-windows-installer.exe>

三、docker运行：
拉取对应最新镜像：

`docker pull fjudith/draw.io`

然后直接运行：

`docker run -dit --restart=always --name=draw -p 8080:8080 fjudith/draw.io`