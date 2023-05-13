---
# sidebar_position: 1
---
# MSSql-Linux

## 一、查找镜像

在 docker hub(<https://hub.docker.com/_/microsoft-mssql-server>)上找到sqlserver 镜像。

## 二、拉取镜像

powershell 鼠标右键 以管理员身份运行，输入 官网给出的命令：

``` bash
docker pull microsoft/mssql-server-linux:latest

docker pull mcr.microsoft.com/mssql/server:2019-latest
```

* 最好先建立共享网络

``` bash
docker network create sqlNet
```

## 三、运行sqlserver 数据库容器

运行如下命令，开启容器：

``` bash
docker run  -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=mssql@123456" -p 5603:1433  -v M:\Docker\Data\mssql\data:/var/opt/mssql/data --memory 2000M --name mssqlLinux --net=sqlNet --network-alias mssqlLinux -d microsoft/mssql-server-linux
```

``` bash
docker run --restart=always  -v M:\Docker\Data\mssql\data:/var/opt/mssql/data  -v M:\Docker\Data\mssql\log:/var/opt/mssql/log  -v M:\Docker\Data\mssql\secrets:/var/opt/mssql/secrets -e TZ="Asia/Shanghai" -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=mssql@123456' -p 5603:1433 --name mssqlLinux --hostname mssqlLinux --network-alias mssqlLinux -m 2000m -d microsoft/mssql-server-linux
```

``` bash
docker run --restart=always  -v D:\Docker\Data\mssql\data:/var/opt/mssql/data  -v D:\Docker\Data\mssql\log:/var/opt/mssql/log  -v D:\Docker\Data\mssql\secrets:/var/opt/mssql/secrets -e TZ="Asia/Shanghai" -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=mssql@123456' -p 5603:1433 --name mssqlLinux --hostname mssqlLinux --network-alias mssqlLinux -m 2000m -d microsoft/mssql-server-linux
```

其中，有几个坑点：不处理这些坑点，会导致你的 sqlserver 容器不能正常运行。

* 1."ACCEPT_EULA=Y"  和 "SA_PASSWORD=Fyy@12345678" ： windows docker，这里必须是双引号。

* 2."SA_PASSWORD=Fyy@12345678"  密码复杂度，要有大小写、特殊符号 和 数字

* 3.-v /data/mssql:/var/opt/mssql 将物理机的 /data/mssql 目录映射到容器中

Windows 上的 Docker 的主机卷映射当前不支持映射完整的 /var/opt/mssql 目录 。 但是，你可以将子目录（如 /var/opt/mssql/data）映射到主机

目前不支持 Mac 上的 Docker 与 Linux 映像上的 SQL Server 之间的主机卷映射 。 请改为使用数据卷容器。 此限制特定于 /var/opt/mssql 目录。 从已装载目录进行读取操作可正常运行。 例如，可在 Mac 上使用 –v 装载主机目录，并通过驻留在主机上的 .bak 文件还原备份。

1. --memory 2000M：sqlserver 的容器运行时，内存要>=2000MB,因此，要指定 容器运行时内存。否则容器已启动就推出，且不会有任何异常信息。

当容器不能启动，或者启动就退出时，可以 用命令 `docker logs <container>` 查看日志，根据日志信息解决问题（\<container\> 为需要操作的 容器ID或者 name，后面不再说明）。

数据库链接：

``` bash
Data Source=localhost,5503;Initial Catalog=ProGet;User ID=sa;Password=wengtx@cn199845;
```

用root用户启动

``` bash
docker exec -it  -u root mssqlLinux /bin/bash
```

启用 SQL Server 代理

``` bash
/opt/mssql/bin/mssql-conf set sqlagent.enabled true
```

重启 SQL Server 服务

``` bash
systemctl restart mssql-server.service
```
