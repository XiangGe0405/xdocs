---
# sidebar_position: 1
---

# Shadowsocks

## 拉取图像

``` bash
docker pull shadowsocks/shadowsocks-libev
```

## 启动容器

``` bash
docker run -p 8388:8388 -p 8388:8388/udp -d --restart always shadowsocks/shadowsocks-libev:latest
```

这将启动具有所有默认设置的最新版本的容器，该容器等效于

``` bash
ss-server -s 0.0.0.0 -p 8388 -k "$(hostname)" -m aes-256-gcm -t 300 -d "8.8.8.8,8.8.4.4" -u
```

注意：用作密码的是容器中的主机名，而不是主机的主机名。

## 带自定义端口

在大多数情况下，您需要更改一两件事，例如服务器侦听的端口。这是通过更改参数来完成的。-p

下面是启动侦听的容器（TCP 和 UDP）的示例：28388

``` bash
docker run -p 28388:8388 -p 28388:8388/udp -d --restart always shadowsocks/shadowsocks-libev
```

使用自定义密码
您可能想要更改的另一件事是密码。若要更改此设置，可以在启动容器时将自己的密码作为环境变量传递。

下面是使用作为密码启动容器的示例：`9MLSpPmNt`

``` bash
docker run -e PASSWORD=9MLSpPmNt -p 8388:8388 -p 8388:8388/udp -d --restart always shadowsocks/shadowsocks-libev
```

⚠️单击此处生成强密码以保护您的服务器。

使用密码作为挂载文件或 Docker 机密（仅限群）
您可以将密码硬编码到 docker 撰写文件或命令中，而不是将密码硬编码到包含密码的文件中。为此，请将挂载到容器的路径作为环境变量传递。`docker runPASSWORD_FILE`

如果您正在运行泊坞群，您还可以利用泊坞程序机密。为此，请将密钥的名称作为环境变量传递。如果同时指定 和 ，则后者将生效。`PASSWORD_SECRETPASSWORD_FILEPASSWORD_SECRET`

这是一个示例文件，它使用名为密码的外部 Docker 机密。docker-compose.ymlshadowsocks

```  bash
shadowsocks:
  image: shadowsocks/shadowsocks-libev
  ports:
    - "8388:8388"
  environment:
    - METHOD=aes-256-gcm
    - PASSWORD_SECRET=shadowsocks
  secrets:
    - shadowsocks
```

这是一个示例命令，它使用名为密码的外部 Docker 密钥。docker service createshadowsocks

``` bash
docker service create -e PASSWORD_SECRET=shadowsocks -p 8388:8388 -p 8388:8388/udp --secret shadowsocks shadowsocks/shadowsocks-libev
```

使用其他自定义项
此外，该映像还定义了以下可自定义的环境变量：PASSWORD

``` text
SERVER_ADDR：要绑定到的 IP/域，默认为0.0.0.0
SERVER_ADDR_IPV6：要绑定到的 IPv6 地址，默认为::0
METHOD：要使用的加密方法，默认为aes-256-gcm
TIMEOUT：默认为300
DNS_ADDRS：要将 NS 查找请求重定向到的 DNS 服务器，默认为8.8.8.8,8.8.4.4
TZ：时区，默认为UTC
支持 的其他参数可以与环境变量 一起传递，例如以详细模式启动：ss-serverARGS
```

``` bash
docker run -e ARGS=-v -p 8388:8388 -p 8388:8388/udp -d --restart always shadowsocks/shadowsocks-libev:latest
```

使用docker-compose（可选）

模板：<https://github.com/docker/compose/releases> 下载二进制文件。

这是一个示例文件。`docker-compose.yml`

``` bash
shadowsocks:
  image: shadowsocks/shadowsocks-libev
  ports:
    - "8388:8388"
  environment:
    - METHOD=aes-256-gcm
    - PASSWORD=9MLSpPmNt
  restart: always
```

强烈建议您设置目录树，以便于管理。

``` bash
mkdir -p ~/fig/shadowsocks/
cd ~/fig/shadowsocks/
curl -sSLO https://github.com/shadowsocks/shadowsocks-libev/raw/master/docker/alpine/docker-compose.yml
docker-compose up -d
docker-compose ps
```

完成
最后，在这里下载影子袜子客户端。不要忘记与您的朋友分享互联网。

``` config
{
    "server": "your-vps-ip",
    "server_port": 8388,
    "local_address": "0.0.0.0",
    "local_port": 1080,
    "password": "9MLSpPmNt",
    "timeout": 600,
    "method": "aes-256-gcm"
}
```

## shadowsocks-windows

下载地址： <https://github.com/shadowsocks/shadowsocks-windows/releases>