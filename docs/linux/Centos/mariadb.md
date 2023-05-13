---
sidebar_position: 8
---

# 安装MariaDB 数据库

## 设置数据源

<https://mariadb.com/kb/en/yum/>

这里使用的是国内源 <http://mirrors.aliyun.com/mariadb/yum/10.5/centos8-amd64/>

``` bash
cat <<EOF > /etc/yum.repos.d/mariadb.repo
[mariadb]
name = mariadb
baseurl=http://mirrors.aliyun.com/mariadb/yum/10.5/centos8-amd64/
gpgkey=https://mirrors.aliyun.com/mariadb/yum/RPM-GPG-KEY-MariaDB 
#enabled=1
gpgcheck=1
EOF
```

复制到 终端直接执行

## 更新缓存

``` bash
dnf clean all  
dnf makecache  
dnf repolist
```

## 显示可安装的版本

``` bash
# 这个可以看版本号

dnf search mariadb --showduplicates  --disablerepo=AppStream
或
dnf search mariadb
```

==--disablerepo=AppStream== 禁用仓库标识为 AppStream 的主软件仓库

## 安装

现在安装的就是 最新的版本了

``` bash
dnf -y install MariaDB-server MariaDB-client  --disablerepo=AppStream
```
==--disablerepo=AppStream== 禁用仓库标识为 AppStream 的主软件仓库

## 命令

### 设置密码

``` bash
mysql_secure_installation
```

### 设置开机启动

``` bash
systemctl enable mariadb --now
```

### 启动 mariadb

``` bash
systemctl start mariadb
```

### 创建新超级管理用户 fox

在 shell 中输入

``` bash
mysql -uroot -p
#输入 root 的 管理密码
```

下面 每次执行一条

``` sqlcmd
use mysql;

#创建用户 并设置密码
create user 'fox'@'%' identified by 'wengtx@cn199845';


#授权 fox  拥有 所有权限
grant all privileges   on *.* to 'fox'@'%' identified by 'wengtx@cn199845'  WITH GRANT OPTION; 

# 刷新权限
flush privileges;

#退出
exit;
```

### 允许 root 远程登录

``` sqlcmd
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'wengtx@cn199845' WITH GRANT OPTION;

flush privileges;
```

### MariaDB配置

``` bash
vi /etc/my.cnf.d/server.cnf
```

在[galera]标签下添加如下

``` bash
default_storage_engine=InnoDB
max_allowed_packet = 256M
innodb_log_file_size = 256M
init_connect = 'SET collation_connection = utf8_unicode_ci'
init_connect = 'SET NAMES utf8'
character-set-server = utf8
collation-server = utf8_unicode_ci
skip-character-set-client-handshake
```
