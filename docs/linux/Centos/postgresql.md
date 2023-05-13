---
sidebar_position: 7
---

# 安装PostgreSQL 数据库

## 在CentOS 8上安装PostgreSQL 数据库

有两个版本的PostgreSQL服务器可从标准CentOS存储库中安装：版本9.6和10.0。
要列出可用的PostgreSQL模块流，请输入：

``` bash
dnf module list postgresql
```

输出显示可用的两个postgresql。每个个都包含服务器和客户端。postgresql 10 是默认设置。

``` bash
CentOS-8 - AppStream
Name          Stream    Profiles              Summary                                                 
postgresql    10 [d]    client, server [d]    PostgreSQL server and client module                     
postgresql    9.6       client, server [d]    PostgreSQL server and client module 
```

01、要安装默选项的PostgreSQL服务器版本10.0，直接如下安装命令：

``` bash
sudo dnf install @postgresql:10
```

02、要安装PostgreSQL服务器9.6版，请输入：

``` bash
sudo dnf install @postgresql:9.6
```

你可能还需要安装contrib软件包，该软件包为PostgreSQL数据库提供了一些附加功能：

``` bash
sudo dnf install postgresql-contrib
```

安装完成后，使用以下命令初始化PostgreSQL数据库：

``` bash
sudo postgresql-setup initdb
```

输出：

``` bash
Initializing database ... OK
```

启动PostgreSQL服务，并配置为其能够在系统启动时启动：

``` bash
sudo systemctl enable --now postgresql
```

使用该psql工具通过连接到PostgreSQL数据库服务器来验证安装并打印其版本：

``` bash
sudo -u postgres psql -c "SELECT version();"
```

输出：

``` bash
PostgreSQL 10.6 on x86_64-redhat-linux-gnu, compiled by gcc (GCC) 8.2.1 20180905 (Red Hat 8.2.1-3), 64-bit
```

## PostgreSQL角色和验证方法

PostgreSQL使用角色的概念来处理数据库访问权限。角色可以代表一个数据库用户或一组数据库用户。
PostgreSQL支持多种身份验证方法。最常用的方法是：

- 信任-只要符合定义的条件，角色就可以不使用密码进行连接pg_hba.conf。
- 密码-角色可以通过提供密码进行连接。密码可以存储为scram-sha-256，md5和password（明文）。
 标识符-仅在TCP/IP连接上受支持。它通过获取客户端的操作系统用户名以及可选的用户名映射来工作。
- 对等-与Ident相同，但仅在本地连接上受支持。

PostgreSQL客户端身份验证在名为==pg_hba.conf==的配置文件中定义。默认情况下，对于本地连接，PostgreSQL设置为使用对等身份验证方法。
在你安装PostgreSQL服务器过程中==postgres==用户会被自动创建。该用户是PostgreSQL实例的超级用户，你可以看成等效于MySQL的root用户。
要以==postgres==用户身份登录到PostgreSQL服务器，需要首先切换到该用户，然后运行psql命令程序访问PostgreSQL提示符：

``` bash
sudo su - postgres
psql
```

从这里，可以与PostgreSQL实例进行交互。要退出PostgreSQL shell，请输入：

``` bash
\q
```

还可以访问PostgreSQL提示符，而无需使用以下sudo命令切换用户：

``` bash
sudo -u postgres psql
```

通常，==postgres==仅从本地主机使用该用户。

## 创建PostgreSQL角色和数据库

只有超级用户和具有CREATEROLE特权的角色才能创建新角色。

在以下示例中，我们将创建一个名为john的新角色，一个名johndb为的数据库，并授予该数据库的特权。

01、首先，连接到PostgreSQL shell：

``` bash
sudo -u postgres psql
```

02、使用以下命令创建一个新的PostgreSQL角色：

``` bash
create role John;
```

03、创建一个新的数据库：

``` bash
create database johndb;
```

04、通过运行以下查询，向数据库上的用户授予特权：

``` bash
grant all privileges on database johndb to John;
```

## 启用对PostgreSQL服务器的远程访问

默认情况下，PostgreSQL服务器仅供本地(127.0.0.1)访问。

要启用对PostgreSQL服务器的远程访问，请打开配置文件：

``` bash
sudo vim /var/lib/pgsql/data/postgresql.conf
```

在打开文件中找到==CONNECTIONS AND AUTHENTICATION==部分，然后添加/编辑以下行：

``` bash
#------------------------------------------------------------------------------
# CONNECTIONS AND AUTHENTICATION
#------------------------------------------------------------------------------

# - Connection Settings -

listen_addresses = '*'     # what IP address(es) to listen on;
```

保存文件，并使用以下命令重新启动PostgreSQL服务：

``` bash
sudo systemctl restart postgresql
```

使用ss实用程序验证更改：

``` bash
ss -nlt | grep 5432
```

如果已经正常启动，会输出如下内容:

``` bash
LISTEN   0    128    0.0.0.0:5432    0.0.0.0:*       
LISTEN   0    128    [::]:5432      [::]:*
```

上面的输出显示PostgreSQL服务器正在所有接口（0.0.0.0）的默认端口上侦听。

最后一步是通过编辑`/var/lib/pgsql/data/pg_hba.conf`文件将服务器配置为接受远程连接。

``` bash
vim /var/lib/pgsql/data/pg_hba.conf
```

``` bash
host    all             all             0.0.0.0/0                md5
```

以下是一些显示不同用例的示例：

``` bash
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# The user jane can access all databases from all locations using an md5 password
host    all             jane            0.0.0.0/0                md5

# The user jane can access only the janedb database from all locations using an md5 password
host    janedb          jane            0.0.0.0/0                md5

# The user jane can access all databases from a trusted location (192.168.1.134) without a password
host    all             jane            192.168.1.134            trust
```

设置数据库实例超级管理员账户"postgres"的口令

``` bash
passwd postgres

su postgres

bash-4.4$ psql
psql (12.3)
Type "help" for help.

postgres=# alter user postgres with password 'gis';
ALTER ROLE
postgres=# \q
bash-4.4$ exit
```

数据库启动、停止、重启、查看状态、开机自启动、禁用开机自启动

``` bash
# 启动数据库
systemctl start postgresql-10.service

# 停止数据库
systemctl stop postgresql-10.service

# 重启数据库
systemctl restart postgresql-10.service

# 查看数据库状态
systemctl status postgresql-10.service

# 开启数据库开机自启动
systemctl enable postgresql-10.service

# 禁用数据库开机自启动
systemctl disable postgresql-10.service
```
