---
# sidebar_position: 1
---

# RabbitMQ

* 拉取RabbitMQ镜像的时候，选择带有"management"版本的，不要选择latest版本的，因为带有"management"版本的才带有管理界面。

 ``` bash
docker pull rabbitmq:management
```

* 此方式的默认账号密码为：guest：guest，默认虚拟机为：/
  
``` bash
docker run -d --name=rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq rabbitmq:management
```

或者

``` bash
docker run -d -p 15672:15672  -p  5672:5672  -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin --name rabbitmq --hostname=rabbitmqhostone  rabbitmq:management
```

* -d 后台运行
* -p 隐射端口
* –name 指定rabbitMQ名称
RABBITMQ_DEFAULT_USER 指定用户账号
RABBITMQ_DEFAULT_PASS 指定账号密码
执行如上命令后访问：<http://ip:15672/>

默认账号密码：`guest/guest`
