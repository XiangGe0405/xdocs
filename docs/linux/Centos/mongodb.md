---
sidebar_position: 6
---

# 安装Mongodb

## 1、制作 repo 文件

参考 mongodb 官方的安装文档，使用下面的脚本制作Yum库安装mongodb4.2，但安装过程提示 "Failed to synchronize cache for repo 'mongodb-org-4.2'"

``` bash
[mongodb-org-4.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
```

原因是官方还未提供centos8的安装包，因为 $releasever 变量是8，所以尝试把地址写死为7，看能不能安装基于centos7的版本。

使用 vim 创建repo文件

```bash
sudo vim /etc/yum.repos.d/mongodb-org-4.2.repo
```

输入如下配置到repo文件，然后保存，退出vim

``` bash
[mongodb-org-4.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/4.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
```

## 2、使用yum 命令安装

``` bash
sudo yum install -y mongodb-org
```

安装过程曾经因为网络太慢，下载不成功，执行多一次就可以了。一段时间后提示安装成功，过程顺利的。

## 3、启动mongodb

安装完启动服务则可以使用
启动、停止、重启命令如下：

``` bash
sudo service mongod start
sudo service mongod stop
sudo service mongod restart
```

## 4、开放 mongodb 的远程连接

mongodb的配置文件是 `/etc/mongod.conf`

如果要开放远程访问需要修改该文件的 bindIp值为: 0.0.0.0 ，否则通过其它电脑是连接不到的。

``` bash
sudo vim /etc/mongod.conf
```

 文件修改后要执行 restart 使配置生效

``` bash
sudo service mongod restart
```

如果仍不能远程连接，可让防火墙打开 27017 端口（该端口是mongodb的默认端口，可通过配置文件修改mongodb的端口）

``` bash
firewall-cmd --permanent --zone=public --add-port=27017/tcp
firewall-cmd --reload
```

参考官方安装说明文档：

<https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#run-mongodb-community-edition>