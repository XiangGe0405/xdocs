---
sidebar_position: 1
---

# 安装Redis6

## 一、redis的官网

``` bash
https://redis.io/
```

## 二、检查gcc的版本

``` bash
[root@centos8 liuhongdi]# gcc --version
gcc (GCC) 8.3.1 20190507 (Red Hat 8.3.1-4)
Copyright © 2018 Free Software Foundation, Inc.
本程序是自由软件；请参看源代码的版权声明。本软件没有任何担保；
包括没有适销性和某一专用目的下的适用性担保。
```

如果提示找不到gcc程序,说明没有安装，

可以用dnf命令安装

``` bash
[root@centos8 liuhongdi]# dnf install gcc
 ```

说明：gcc版本不宜过低，应该在gcc 5.3以上

如版本过低则建议先升级gcc

## 三、下载redis6并解压缩

下载

``` bash
[root@centos8 source]# wget http://download.redis.io/releases/redis-6.0.1.tar.gz
```

解压缩

``` bash
[root@centos8 source]# tar -zxvf redis-6.0.1.tar.gz
```

## 四、安装redis6.0.1

1,安装redis

``` bash
# PREFIX=/usr/local/soft/redis6 :用来指定安装目录，这里我们指定安装到/usr/local/soft/redis_6379

[root@centos8 source]# cd redis-6.0.1/
[root@centos8 redis-6.0.1]# make PREFIX=/usr/local/soft/redis6 install
```

2,生成配置文件
创建安装目录

``` bash
[root@centos8 redis-6.0.1]# mkdir /usr/local/soft/redis6/conf
```

把源码目录下的redis.conf复制到安装目录

``` bash
[root@centos8 redis-6.0.1]# cp redis.conf /usr/local/soft/redis6/conf/
```

## 五、创建供redis运行的目录

分别用来存放redis的日志和数据
logs:存放日志
data:存放快照数据

``` bash
[root@centos8 data]# mkdir -p /data/redis6
[root@centos8 data]# cd /data/redis6/
[root@centos8 redis6]# mkdir logs
[root@centos8 redis6]# mkdir data
```

## 六、修改redis的配置文件

``` bash
cd /usr/local/soft/redis6/conf/
[root@centos8 conf]# vi redis.conf
```

配置项：

### 绑定访问的ip

``` bash
bind 192.168.1.7
```

### 使以daemon方式运行

``` bash
daemonize yes
```

### 日志保存目录

``` bash
logfile "/data/redis6/logs/redis.log"
```

### 数据保存目录

``` bash
dir /data/redis6/data/
```

### 使用的最大内存数量

``` bash
maxmemory 128MB
```

### io线程数

#### 系统建议设置为cpu核心数量的3/4,我的机器是4核，所以这里设置为3

``` bash
io-threads 3
```

附redis.conf中的原说明：

``` bash
# So for instance if you have a four cores boxes, try to use 2 or 3 I/O
# threads, if you have a 8 cores, try to use 6 threads. In order to
# enable I/O threads use the following configuration directive:
```

如何查看核心数量:

``` bash
[root@centos8 ~]# lscpu
Architecture: x86_64
CPU op-mode(s): 32-bit, 64-bit
Byte Order: Little Endian
CPU(s): 4
On-line CPU(s) list: 0-3
...
```

CPU(s)显示是4个核心

## 七、生成供systemd使用的service文件

``` bash
[root@centos8 ~]# vi /lib/systemd/system/redis6.service
```

内容:

``` bash
[Unit]
Description=Redis
After=network.target

[Service]
Type=forking
PIDFile=/var/run/redis_6379.pid
ExecStart=/usr/local/soft/redis6/bin/redis-server /usr/local/soft/redis6/conf/redis.conf
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

重新加载service文件

``` bash
[root@centos8 ~]# systemctl daemon-reload
```

## 八、测试启动redis6

启动:

``` bash
[root@centos8 ~]# systemctl start redis6
```

停止:

``` bash
[root@centos8 ~]# systemctl stop redis6
```

## 九、测试从本地连接访问

``` bash
[root@centos8 conf]# /usr/local/soft/redis6/bin/redis-cli -h 192.168.1.7
192.168.1.7:6379> set a aaaa
OK
192.168.1.7:6379> get a
"aaaa"
```

## 十、查看已安装redis的版本

``` bash
[root@centos8 conf]# /usr/local/soft/redis6/bin/redis-server -v
Redis server v=6.0.1 sha=00000000:0 malloc=jemalloc-5.1.0 bits=64 build=0
```

## 十一、查看centos的版本

``` bash
[root@centos8 conf]# cat /etc/redhat-release 
CentOS Linux release 8.1.1911 (Core)
```
