---
# sidebar_position: 1
---
# PostgresSQL

## 一、安装

``` bash
docker pull postgres
```

==最好先建立共享网络==

``` bash
docker network create sqlNet
```

## 二、运行

``` bash
docker run --name postgres -e POSTGRES_PASSWORD=pgsql123456 --net=sqlNet --network-alias postgres -p 5506:5432 -d postgres

docker run --name postgres  -v E:\Docker\Data\postgresql\data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=pgsql123456 -p 5506:5432 --net=sqlNet --network-alias postgres -d postgres

docker run --name postgres  -v /Data/Docker/postgresql/data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=pgsql123456 -p 5506:5432 --net=sqlNet --network-alias postgres -d postgres
```

解释：

```text
run:创建并运行一个容器；
--name:指定创建的容器的名字；
-e POSTGRES_PASSWORD=password:设置环境变量，指定数据库的登录口令为 password；
-p 54321:5432:端口映射将容器的5432端口映射到外部机器的54321端口；
-d postgres:9.4:指定使用 postgres:9.4作为镜像。
```

注意：
postgres镜像默认的用户名为`postgres`， 登陆口令为创建容器是指定的值。
