---
sidebar_position: 2
---

# 安装RabbitMQ(云安装)

## 1、 添加EPEL源

``` bash
dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
```

## 2、 安装 Erlang

``` bash
dnf -y install wget
wget https://github.com/rabbitmq/erlang-rpm/releases/download/v21.3.8.6/erlang-21.3.8.6-1.el7.x86_64.rpm
dnf install -y erlang-21.3.8.6-1.el7.x86_64.rpm
erl
```

## 3、 添加RabbitMQ仓库

``` bash
vi /etc/yum.repos.d/rabbitmq-server.repo
```

``` bash
[rabbitmq-server]
name=rabbitmq-server
baseurl=https://packagecloud.io/rabbitmq/rabbitmq-server/el/7/$basearch
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300
```

## 4、 安装RabbitMQ

``` bash
dnf makecache -y --disablerepo='*' --enablerepo='rabbitmq-server'
dnf install -y rabbitmq-server
rpm -qi rabbitmq-server
```

## 5、 配置防火墙

``` bash
firewall-cmd --zone=public --permanent --add-port={4369,25672,5671,5672,15672,61613,61614,1883,8883}/tcp

firewall-cmd --reload
```

## 5、启动RabbitMQ服务和管理界面

``` bash
systemctl start rabbitmq-server.service

systemctl enable rabbitmq-server.service

systemctl status rabbitmq-server.service 
rabbitmqctl status

rabbitmq-plugins enable rabbitmq_management
chown -R rabbitmq:rabbitmq /var/lib/rabbitmq/
rabbitmqctl add_user admin mypassword
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

## 6、访问RabbitMQ管理界面

用浏览器访问<http://localhost:15672>打开管理界面，使用上一步配置好的admin账号登录。
