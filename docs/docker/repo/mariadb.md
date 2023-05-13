---
# sidebar_position: 1
---
# MariaDB

* 最好先建立共享网络

``` bash
docker network create sqlNet
```

## docker 中下载 mariadb

```bash
docker pull mariadb
```

## 启动mariadb

``` bash
docker run --name mariadb -p 5501:3306 -e MYSQL_ROOT_PASSWORD=mariadb123456 --net=sqlNet --network-alias mariadb -d mariadb
```

``` bash
docker run --name mariadb -p 5501:3306 -e MYSQL_ROOT_PASSWORD=mariadb123456 -v M:\Docker\Data\mariadb\data:/var/lib/mysql  --net=sqlNet --network-alias mariadb -d mariadb
```

建立远程用户

``` bash
create user 'renren'@'%' identified by '123456';

grant all privileges   on *.* to 'renren'@'%' identified by '123456'  WITH GRANT OPTION; 

flush privileges;
```
