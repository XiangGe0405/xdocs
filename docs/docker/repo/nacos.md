---
# sidebar_position: 1
---
# Nacos

1、拉取nacos镜像

``` bash
  docker pull nacos/nacos-server
```

2、后台运行nacos镜像
WIN命令

``` bash
docker run -d -p 8848:8848 -p 9848:9848 -p 9849:9849 -e MODE=standalone -v G:\gitee\small-platform-cloud\docker\nacos\conf\application.properties:/home/nacos/conf/application.properties -v G:\gitee\small-platform-cloud\docker\nacos\logs:/home/nacos/logs --restart always --name smallplatform-nacos nacos/nacos-server
```

linux命令

``` bash
docker run -d -p 8848:8848 -p 9848:9848 -p 9849:9849 -e MODE=standalone -v /opt/nacos/conf/application.properties:/home/nacos/conf/application.properties -v /opt/nacos/logs:/home/nacos/logs --restart always --name smallplatform-nacos nacos/nacos-server
```

//注意：如果出现Docker挂载宿主机目录显示cannot open directory .:Permission denied
解决办法：在挂载目录后面 多加一个--privileged=true参数即可

-d：表示后台运行容器

-p：指定端口映射，第一个8848 表示对外暴露的端口
(即：应用服务端口)，第二个8848 表示nacos容器端口

--name：指定容器名称
-v /opt/nacos/logs：将宿主机当前目录下的logs目录 映射到容器的应用配置程序目录

访问地址：<http://localhost:8848/nacos>

## application.properties

``` text
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://wengtx.cn:3306/smallplatform_nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user=root
db.password=wengtx@cn199845

nacos.naming.empty-service.auto-clean=true
nacos.naming.empty-service.clean.initial-delay-ms=50000
nacos.naming.empty-service.clean.period-time-ms=30000

management.endpoints.web.exposure.include=*

management.metrics.export.elastic.enabled=false
management.metrics.export.influx.enabled=false

server.tomcat.accesslog.enabled=true
server.tomcat.accesslog.pattern=%h %l %u %t "%r" %s %b %D %{User-Agent}i %{Request-Source}i

server.tomcat.basedir=

nacos.security.ignore.urls=/,/error,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-ui/public/**,/v1/auth/**,/v1/console/health/**,/actuator/**,/v1/console/server/**

nacos.core.auth.system.type=nacos
nacos.core.auth.enabled=false
nacos.core.auth.default.token.expire.seconds=18000
nacos.core.auth.default.token.secret.key=SecretKey012345678901234567890123456789012345678901234567890123456789
nacos.core.auth.caching.enabled=true
nacos.core.auth.enable.userAgentAuthWhite=false
nacos.core.auth.server.identity.key=serverIdentity
nacos.core.auth.server.identity.value=security

nacos.istio.mcp.server.enabled=false
```
