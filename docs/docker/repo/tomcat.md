---
# sidebar_position: 1
---

# Tomcat

1、拉取tomcat镜像，这里以tomcat:latest为例

``` bash
docker pull tomcat
```

2、后台运行tomcat镜像

``` bash
docker run -d -p 8080:8080 --name=mytomcat -v $(pwd)/webapps:/usr/local/tomcat/webapps -v $(pwd)/logs:/usr/local/

tomcat/logs tomcat
```

注意：如果出现Docker挂载宿主机目录显示cannot open directory .:Permission denied
解决办法：在挂载目录后面 多加一个--privileged=true参数即可

``` bash
-d：表示后台运行容器

-p：指定端口映射，第一个8080 表示对外暴露的端口
(即：应用服务端口)，第二个8080 表示tomcat容器端口

--name：指定容器名称

-v $(pwd)/webapps:/usr/local/tomcat/webapps：将宿主机当前目录下的webapps目录 映射到 tomcat容器的应用配置程序目录，注意：这样映射会导致tomcat的/webapps目录下的文件或目录全部被清空，如果不想这样，可以映射到tomcat的/webapps目录下的自定义文件夹，如：/usr/local/tomcat/webapps/web

-v $(pwd)/logs:/usr/local/tomcat/logs：将宿主机当前目录下的logs目录 映射到 tomcat容器的日志目录
```

``` bash
docker run -d -p 8080:8080 --name=mytomcat -v D:\apache\Tomcat\apache-tomcat-8.5.31\webapps:/usr/local/tomcat/webapps -v D:\apache\Tomcat\apache-tomcat-8.5.31\logs:/usr/local/tomcat/logs tomcat
```
