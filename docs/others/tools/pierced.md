---
sidebar_position: 1
---

# 内网穿透

[钉钉开放平台](https://developers.dingtalk.com/document/resourcedownload/http-intranet-penetration?pnamespace=app)

## 内网穿透之HTTP穿透

更新时间：2021-06-21
鉴于很多开发者在临时体验开发时往往没有公网域名或者公网IP，本工具提供了一个公网代理服务，目的是方便开发测试。

注意 本工具不保证稳定性，仅适用于开发测试阶段，禁止当作公网域名使用。如线上应用使用本工具造成稳定性问题，后果由自己承担。如使用本工具传播违法不良信息，钉钉将追究法律责任。

## 内网穿透示意图

![image](https://static-aliyun-doc.oss-accelerate.aliyuncs.com/assets/img/zh-CN/9904269951/p163821.png)

## 场景介绍

案例一：ISV三方企业小程序的回调地址必须是公网域名或IP，对于大部分开发者来说，开发者无法在本地调试远程代码，对于回调URL校验不通过之类的问题无法追踪，只能不断远程部署查看log日志来调试修改。

案例二：企业通讯录同步过程中需要注册一个公网域名(或IP)的回调地址，用来接收钉钉上的企业通讯录信息变更。
内网穿透工具可以实现将一个公网域名映射到本地的localhost域名。

## 启动内网穿透

### 1.下载工具

``` bash
git clone https://github.com/open-dingtalk/pierced.git
```

或者用gitee下载

``` bash
https://gitee.com/wengtianxiang/pierced.git
```

### 2.执行以下命令，启动工具

Windows执行以下命令：
说明 Windows需使用cmd工具打开命令行。

``` bash
cd windows_64
ding -config=ding.cfg -subdomain=abcde 8080
```

MAC执行以下命令：

``` bash
cd mac_64
chmod 777 ./ding
./ding -config=./ding.cfg -subdomain=abcde 8080
```

启动后界面如下图所示：
![image](https://static-aliyun-doc.oss-accelerate.aliyuncs.com/assets/img/zh-CN/9904269951/p163822.png)

参数说明：

参数 | 说明
---|---
-config | 内网穿透的配置文件，按照命令示例固定为钉钉提供的./ding.cfg，无需修改
-subdomain | 您需要使用的域名前缀，该前缀将会匹配到“vaiwan.com”前面，例如你的subdomain是abcde，启动工具后会将abcde.vaiwan.com映射到本地。
端口 | 您需要代理的本地服务http-server端口，例如你本地端口为8080等

启动完客户端后，你访问<http://abcde.vaiwan.com/xxxxx>都会映射到 <http://127.0.0.1:8080/xxxxx>。

#### 注意

需要访问的域名是<http://abcde.vaiwan.com/xxxxx> 而不是<http://abcde.vaiwan.com:8080/xxxxx>
启动命令的subdomain参数有可能被别人占用，尽量不要用常用字符，可以用自己公司名的拼音，例如：alibaba、dingding等。
可以在本地起个http-server服务，放置一个index.html文件，然后访问<http://abcde.vaiwan.com/index.html>测试一下。
