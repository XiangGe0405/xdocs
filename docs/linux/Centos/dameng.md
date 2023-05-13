---
sidebar_position: 9
---

# 安装达梦数据库

官网：[http://www.dameng.com](http://www.dameng.com/)

## 1：下载安装包

天翼云下载链接：链接：<https://cloud.189.cn/t/QZFbyiYNv26f>
访问码：`5jbq`

## 2.获取安装文件

1）将"DMInstall.bin"文件上传至服务器中，并赋予执行权限：

``` bash
chmod 755 ./DMInstall.bin
```

2）命令行安装。本人是之间使用的"root"管理员用户，官方不推荐，这一步和官方的一致：

``` bash
[root@localhost software]# ./DMInstall.bin -i
请选择安装语言(C/c:中文 E/e:英文) [C/c]:c
解压安装程序......... 
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 31206
max locked memory       (kbytes, -l) 64
max memory size         (kbytes, -m) unlimited
open files                      (-n) 1024
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 31206
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited

可打开文件数过少，建议至少设置为65536或更多。

欢迎使用达梦数据库安装程序

是否输入Key文件路径? (Y/y:是 N/n:否) [Y/y]:n

是否设置时区? (Y/y:是 N/n:否) [Y/y]:y
设置时区:
[ 1]: GTM-12=日界线西
[ 2]: GTM-11=萨摩亚群岛
[ 3]: GTM-10=夏威夷
[ 4]: GTM-09=阿拉斯加
[ 5]: GTM-08=太平洋时间（美国和加拿大）
[ 6]: GTM-07=亚利桑那
[ 7]: GTM-06=中部时间（美国和加拿大）
[ 8]: GTM-05=东部部时间（美国和加拿大）
[ 9]: GTM-04=大西洋时间（美国和加拿大）
[10]: GTM-03=巴西利亚
[11]: GTM-02=中大西洋
[12]: GTM-01=亚速尔群岛
[13]: GTM=格林威治标准时间
[14]: GTM+01=萨拉热窝
[15]: GTM+02=开罗
[16]: GTM+03=莫斯科
[17]: GTM+04=阿布扎比
[18]: GTM+05=伊斯兰堡
[19]: GTM+06=达卡
[20]: GTM+07=曼谷，河内
[21]: GTM+08=中国标准时间
[22]: GTM+09=汉城
[23]: GTM+10=关岛
[24]: GTM+11=所罗门群岛
[25]: GTM+12=斐济
[26]: GTM+13=努库阿勒法
[27]: GTM+14=基里巴斯
请选择设置时区 [21]:21

安装类型:
1 典型安装
2 服务器
3 客户端
4 自定义
请选择安装类型的数字序号 [1 典型安装]:1
所需空间: 963M

请选择安装目录 [/opt/dmdbms]:/opt/dmdbms
可用空间: 174G
是否确认安装路径(/opt/dmdbms)? (Y/y:是 N/n:否)  [Y/y]:y

安装前小结
安装位置: /opt/dmdbms
所需空间: 963M
可用空间: 174G
版本信息: 
有效日期: 
安装类型: 典型安装
是否确认安装? (Y/y:是 N/n:否):y
2020-04-24 14:06:14 
[INFO] 安装达梦数据库...
2020-04-24 14:06:14 
[INFO] 安装 基础 模块...
2020-04-24 14:06:18 
[INFO] 安装 服务器 模块...
2020-04-24 14:06:19 
[INFO] 安装 客户端 模块...
2020-04-24 14:06:21 
[INFO] 安装 驱动 模块...
2020-04-24 14:06:21 
[INFO] 安装 手册 模块...
2020-04-24 14:06:22 
[INFO] 安装 服务 模块...
2020-04-24 14:06:25 
[INFO] 移动ant日志文件。
2020-04-24 14:06:25 
[INFO] 更改安装目录权限完成。
2020-04-24 14:06:25 
[INFO] 正在启动DmAPService服务...
2020-04-24 14:06:25 
[INFO] 启动DmAPService服务成功。
2020-04-24 14:06:25 
[INFO] 安装达梦数据库完成。

安装结束
```

3）初始化数据库
到前面安装数据库时指定的安装目录下初始化数据库实例

``` bash
cd /opt/dmdbms/bin
./dminit path=/opt/dmdbms/data page_size=16 log_size=2048 case_sensitive=n
```

``` bash
[root@localhost bin]# ./dminit path=/opt/dmdbms/data page_size=16 log_size=2048 case_sensitive=n
initdb V7.6.0.197-Build(2019.09.12-112648)ENT 
db version: 0x7000a
file dm.key not found, use default license!
License will expire on 2020-09-12

 log file path: /opt/dmdbms/data/DAMENG/DAMENG01.log


 log file path: /opt/dmdbms/data/DAMENG/DAMENG02.log

write to dir [/opt/dmdbms/data/DAMENG].
create dm database success. 2020-04-24 14:07:45
```

常见的初始化参数说明：

参数名称 | 作用
---|---
PATH | 初始数据库存放的路径，在该路径下存储数据库实例的数据文件。
DB_NAME | 初始化数据库名称，默认为 DAMENG。名称为字符串，长度不能超过 128 个字符。
PAGE_SIZE | 数据文件使用的页大小。取值：4、8、16、32，单位：K。默认值为 8。
EXTENT_SIZE | 数据文件使用的簇大小，即每次分配新的段空间时连续的页数。取值：16、32。单位：页数。缺省值 16。
CASE_SENSITIVE | 标识符大小写敏感。当大小写敏感时，小写的标识符应用""括起，否则被系统自动转换为大写；当大小写不敏感时，系统不会转换标识符的大小写，在标识符比较时也不能区分大小写。取值：Y、y、1 表示敏感；N、n、0 表示不敏感。默认值为 Y。
CHARSET/UNICODE_FLAG |字符集选项。取值：0 代表 GB18030，1 代表 UTF-8，2 代表韩文字符集 EUC-KR。默认为 0。
LOG_SIZE | 重做日志文件大小。取值：64~2048 之间的整数，单位 M。默认值为 256。
TIME_ZONE | 初始化时区，默认为东八区(+08:00)。
INSTANCE_NAME | 初始化数据库实例名称，默认为 DMSERVER。
BLANK_PAD_MODE | 设置字符串比较时，结尾空格填充模式是否兼容 ORACLE。取值：1 兼容；0 不兼容。默认为 0

4）注册数据库服务
切到达梦数据库安装目录的`"/script/root/"`文件夹下，注册达梦数据库：

``` bash
cd /opt/dmdbms/script/root/
./dm_service_installer.sh -t dmserver -i /opt/dmdbms/data/DAMENG/dm.ini -p DMSERVER
```

这里需要注意dm8的和7不太一样 那个-i换成-dm_ini：

``` bash
cd /opt/dmdbms/script/root/
./dm_service_installer.sh -t dmserver -dm_ini /opt/dmdbms/data/DAMENG/dm.ini -p DMSERVER
```

``` bash
[root@localhost bin]# cd /opt/dmdbms/script/root/
[root@localhost root]# ls
dm_service_installer.sh  dm_service_uninstaller.sh
[root@localhost root]# ./dm_service_installer.sh -t dmserver -i /opt/dmdbms/data/DAMENG/dm.ini -p DMSERVER
Created symlink from /etc/systemd/system/multi-user.target.wants/DmServiceDMSERVER.service to /usr/lib/systemd/system/DmServiceDMSERVER.service.
创建服务(DmServiceDMSERVER)完成
```

此时可以发现创建的服务名为DmServiceDMSERVER，接下来把该服务设置为开机自启再启动服务即可。

开机自启：

``` bash
systemctl enable DmServiceDMSERVER
```

启动达梦服务：

``` bash
systemctl start DmServiceDMSERVER
```

客户端连接试试！！！如果还是不行，则考虑是其它问题导致，具体的自行参考官方说明。

用docker出现这个

``` bash
Job for DmServiceDMSERVER.service failed because a timeout was exceeded. See "systemctl status DmServiceDMSERVER.service" and "journalctl -xe" for details.
```

可以用这个方式开启数据库实例

``` bash
    cd /opt/dmdbms/bin
   ./dmserver path=/opt/dmdbms/data/DAMENG/dm.ini  
```
