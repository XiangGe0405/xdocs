---
# sidebar_position: 1
---
# Nginx

1、拉取nginx镜像，这里以nginx:latest为例

``` bash
docker pull nginx
```

2、后台运行redis:3.2镜像

``` bash
docker run -d -p 80:80  \
 -p 443:443  \
 --name nginxweb \
 --link answer-server:answerserver \
 -v /usr/local/docker/nginx/html:/usr/share/nginx/html \
 -v /usr/local/docker/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
 -v /usr/local/docker/nginx/conf/conf.d:/etc/nginx/conf.d \
 -v /usr/local/docker/nginx/logs:/var/log/nginx \
 nginx 
```

//注意：如果出现Docker挂载宿主机目录显示cannot open directory .:Permission denied
解决办法：在挂载目录后面 多加一个--privileged=true参数即可

``` text
-d # 表示在一直在后台运行容器
-p 80:80 # 对端口进行映射，将本地8081端口映射到容器内部的80端口
--name # 设置创建的容器名称
-v # 将本地目录(文件)挂载到容器指定目录；
--link answer-server:answerserver 这计划是指需要转向本机docker容器的别名
```

第一步：`docker run -d -p 80:80  -p 443:443 --name nginxweb  nginx`
第二步：`docker exec -it nginxweb /bin/bash` （进入容器 获取文件）
第三步：`cd /etc/nginx/` （这里主要获取配置文件路径的）
第四步：`exit`
第五步：`cd /docker/nginx/conf/`
第六步：`docker cp nginxweb:/etc/nginx/nginx.conf .`
ps：文件copy成功后 把nginx容器先删除掉
第七步：`docker rm -f nginxweb`
第八步：
`docker run -d -p 80:80  -p 443:443 --name nginxweb -v D:\nginx\html:/usr/share/nginx/html -v D:\nginx\conf\nginx.conf:/etc/nginx/nginx.conf -v D:\nginx\conf\conf.d:/etc/nginx/conf.d -v D:\nginx\logs:/var/log/nginx --privileged=true nginx`

## nginx.conf

``` bash
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```
