---
sidebar_position: 4
---

# 安装SQLite3

## 下载安装包

sqlite3下载地址：<https://www.sqlite.org/download.html>

wget下载：

``` bash
wget -O sqlite-autoconf-3280000.tar.gz   https://www.sqlite.org/2019/sqlite-autoconf-3280000.tar.gz
```

解压并安装（依次执行下面命令）：

``` bash
tar zxvf sqlite-autoconf-3280000.tar.gz
cd sqlite-autoconf-3280000
 
./configure
make
make install
```

对于centos7以上版本，如果版本还是默认的低的版本，需要把解压目录中的sqlite3 覆盖 ==/usr/bin/sqlite3==

``` bash
cp sqlite3 /usr/bin/sqlite3
```

方法二：

``` bash
 sudo yum install sqlite-devel
```

方法三：

``` bash
sudo gem install sqlite3-ruby
```

检查版本：

``` bash
[root@VM_0_8_centos ~]# sqlite3 -version
3.28.0 2019-04-16 19:49:53 884b4b7e502b4e991677b53971277adfaf0a04a284f8e483e2553d0f83156b50
```

或者直接输入sqlite3也行，输入“.quit”退出sqlite3：

``` bash
[root@VM_0_8_centos ~]# sqlite3
SQLite version 3.28.0 2019-04-16 19:49:53
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite> .quit
[root@VM_0_8_centos ~]#
```
