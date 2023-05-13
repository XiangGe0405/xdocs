---
# sidebar_position: 1
---
# Mysql

* 最好先建立共享网络

``` bash
docker network create sqlNet
```

## docker 中下载 mysql

``` bash
docker pull mysql
```

## 启动mysql

``` bash
docker run --name mysql -p 5502:3306 -e MYSQL_ROOT_PASSWORD=mysql123456  --net=sqlNet --network-alias mysql -d mysql
```

``` bash
docker run --name mysql -p 5502:3306 -e MYSQL_ROOT_PASSWORD=mysql123456 -v M:\Docker\Data\mysql\data:/var/lib/mysql  --net=sqlNet --network-alias mysql -d mysql
```

建立远程用户

``` bash
create user 'renren'@'%' identified by '123456';

grant all privileges   on *.* to 'renren'@'%' identified by '123456'  WITH GRANT OPTION; 

flush privileges;
```
