---
# sidebar_position: 1
---
# OracleSQL

## 1.开始拉取镜像-执行命令

``` bash
docker pull oracleinanutshell/oracle-xe-11g
```

==最好先建立共享网络==

``` bash
docker network create sqlNet
```

## 2.创建容器

``` bash
docker run -d --shm-size=2g -p 5504:1521 -p 5580:8080 --net=sqlNet --network-alias oracle --name oracleex11g oracleinanutshell/oracle-xe-11g
```

## 3.启动容器

``` bash
 docker start oracleex11g
```

## 4.进入镜像进行配置

* 1、进入镜像进行配置

``` bash
docker exec -it oracleex11g bash
```

* 2、进行软连接

``` bash
sqlplus system/oracle@//localhost:1521/xe
```

* 3、重新启动

``` bash
docker restart oracleex11g
```

登录

``` bash
hostname: localhost
port: 5504
sid: xe
username: system
password: oracle
```

后台管理页面

``` bash
Login :http://localhost:5580/apex/apex_admin
username: ADMIN
password: admin
```
