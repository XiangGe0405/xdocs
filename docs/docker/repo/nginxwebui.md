---
# sidebar_position: 1
---
# NginxWebUI

拉取镜像:

``` bash
docker pull cym1102/nginxwebui:latest
```

启动容器:

``` bash
docker run -p 5033:8080 --name nginxWebUI -itd -v /home/nginxWebUI:/home/nginxWebUI -e BOOT_OPTIONS="--server.port=8080" --privileged=true --net=host  cym1102/nginxwebui:latest /bin/bash

docker run -p 5033:8080 --name nginxWebUI -itd -v D:\nginxWebUI:/home/nginxWebUI -e BOOT_OPTIONS="--server.port=8080" --privileged=true --net=host  cym1102/nginxwebui:latest /bin/bash
```

``` bash
docker run -itd -v G:\gitee\small-platform-cloud\docker-Bash\nginxWebUi\nginxWebUI:/home/nginxWebUI -e BOOT_OPTIONS="--server.port=8080" --privileged=true --net=host cym1102/nginxwebui:latest /bin/bash
```

注意:

启动容器时请使用--net=host参数, 直接映射本机端口, 因为内部nginx可能使用任意一个端口, 所以必须映射本机所有端口.

容器需要映射路径/home/nginxWebUI:/home/nginxWebUI, 此路径下存放项目所有数据文件, 包括数据库, nginx配置文件, 日志, 证书等, 升级镜像时, 此目录可保证项目数据不丢失. 请注意备份.

-e BOOT_OPTIONS 参数可填充java启动参数, 可以靠此项参数修改端口号

--server.port 占用端口, 不填默认以8080端口启动

日志默认存放在/home/nginxWebUI/log/nginxWebUI.log
另: 使用docker-compose时配置文件如下

``` bash
version: "3.2"
services:
  nginxWebUi-server:
    image: cym1102/nginxwebui:2.5.4
    volumes:
      - type: bind
        source: "/home/nginxWebUI"
        target: "/home/nginxWebUI"
    environment:
      BOOT_OPTIONS: "--server.port=8080"
    privileged: true
    network_mode: "host"
```

``` bash
docker run -itd --restart=always --name=nginxWebUI -v D:\nginxWebUI:/home/nginxWebUI -e BOOT_OPTIONS="--server.port=8080" --privileged=true --net=host  cym1102/nginxwebui:latest /bin/bash
```

``` bash
nohup java -jar -Xmx64m /root/nginxWebUI/nginxWebUI.jar --server.port=5033 --project.home=/root/nginxWebUI/ > /dev/null &
```

``` bash
[Unit]
Description=NginxWebUI
After=syslog.target
After=network.target
 
[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/root/nginxWebUI
ExecStart=/usr/bin/java -jar /root/nginxWebUI/nginxWebUI.jar
Restart=always
 
[Install]
WantedBy=multi-user.target
```
