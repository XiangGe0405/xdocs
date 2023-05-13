---
# sidebar_position: 1
---

# 使用 Docker 搭建图形化 Clash 服务端支持

## 一、config.yaml 配置(请修改 订阅地址)

这是我自己用的配置, 请根据自身情况进行修改

```bash
# HTTP 代理端口
#port: 7890

# SOCKS5 代理端口
#socks-port: 7891

# 混合代理端口
mixed-port: 7890

# Linux 和 macOS 的 redir 代理端口 (如需使用此功能，请取消注释)
# redir-port: 7892

# 允许局域网的连接（可用来共享代理）
allow-lan: true

# 规则模式：Global（全局代理）/ Rule（规则） / Script(腳本) / Direct（全局直连）
mode: Rule

# 设置日志输出级别 (默认级别：silent，即不输出任何内容，以避免因日志内容过大而导致程序内存溢出）。
# 5 个级别：silent / info / warning / error / debug。级别越高日志输出量越大，越倾向于调试，若需要请自行开启。
log-level: info

# clash 的 RESTful API
external-controller: '0.0.0.0:9090'


# 您可以将静态网页资源（如 clash-dashboard）放置在一个目录中，clash 将会服务于 `${API}/ui`
# 参数应填写配置目录的相对路径或绝对路径。
external-ui: /ui

# RESTful API 的口令 (可选)
secret: ""

# DNS 设置

dns:
 enable: true
 ipv6: false
 listen: 0.0.0.0:53
 enhanced-mode: redir-host
 nameserver:
  - 8.8.8.8
  - 119.29.29.29
  - 223.5.5.5
  - https://rubyfish.cn/dns-query
 fallback:
  - https://cloudflare-dns.com/dns-query
  - tls://1.0.0.1:853
  - https://dns.google/dns-query#

# 代理节点
proxy-providers:

  HaoJiaHuo:
    type: http
    path: ./Server/HaoJiaHuo.yaml # 这里文件名称需要与订阅节点名称一样
    url: xxxx # 订阅地址
    interval: 86400
    health-check:
        enable: true
        url: http://www.gstatic.com/generate_204
        interval: 300

# 代理组策略
proxy-groups:

# 策略组说明

# 「Proxy」是代理规则策略，它可以指定为某个节点或嵌套一个其他策略组，如：「url-test」（自动测试）、「Fallback」或「load-balance」（负载均衡）的策略组

  - { name: "MATCH", type: select, proxies: ["Proxy"]} 
  - { name: "Apple", type: select, proxies: ["DIRECT"], use: ["HaoJiaHuo"]}
  - { name: "Adobe", type: url-test, use: ["HaoJiaHuo"]}
  - { name: "Amazon", type: url-test, use: ["HaoJiaHuo"]}
  - { name: "China", type: select, proxies: ["DIRECT"]}
  - { name: "GitHub", type: url-test, use: ["HaoJiaHuo"]}
  - { name: "Google", type: url-test, use: ["HaoJiaHuo"]}
  - { name: "Microsoft", type: select, proxies: ["DIRECT"], use: ["HaoJiaHuo"]}
  - { name: "Netflix", type: select, use: ["HaoJiaHuo"]}
  - { name: "Speedtest", type: select, proxies: ["DIRECT"]} 
  - { name: "Steam", type: url-test, use: ["HaoJiaHuo"]}
  - { name: "Spotify", type: url-test, use: ["HaoJiaHuo"]}
  - { name: "Telegram", type: url-test, use: ["HaoJiaHuo"]}
  - { name: "Tencent", type: select, proxies: ["DIRECT"]} 
  - { name: "YouTube", type: url-test, use: ["HaoJiaHuo"]}
  - { name: "Proxy", type: url-test, use: ["HaoJiaHuo"]} 
  - { name: "🎬哔哩哔哩", type: select, proxies: ["DIRECT"], use: ["HaoJiaHuo"]} 


rule-providers:
  Adobe:
    type: http
    behavior: classical
    path: ./ruleset/Adobe.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/Adobe.yaml
    interval: 3600

  Amazon:
    type: http
    behavior: classical
    path: ./ruleset/Amazon.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/Amazon.yaml
    interval: 3600

  GitHub:
    type: http
    behavior: classical
    path: ./ruleset/GitHub.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/GitHub.yaml
    interval: 3600
  
  Microsoft:
    type: http
    behavior: classical
    path: ./ruleset/Microsoft.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/Microsoft.yaml
    interval: 3600
  
  Netflix:
    type: http
    behavior: classical
    path: ./ruleset/Netflix.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/Netflix.yaml
    interval: 3600
  
  Spotify:
    type: http
    behavior: classical
    path: ./ruleset/Spotify.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/Spotify.yaml
    interval: 3600

  Speedtest:
    type: http
    behavior: classical
    path: ./ruleset/Speedtest.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/Speedtest.yaml
    interval: 3600

  Steam:
    type: http
    behavior: classical
    path: ./ruleset/Steam.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/Steam.yaml
    interval: 3600

  Tencent:
    type: http
    behavior: classical
    path: ./ruleset/Tencent.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/Tencent.yaml
    interval: 3600

  YouTube:
    type: http
    behavior: classical
    path: ./ruleset/YouTube.yaml
    url: https://cdn.jsdelivr.net/gh/Semporia/Clash-X@master/Filter/YouTube.yaml
    interval: 3600

  reject:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt"
    path: ./ruleset/reject.yaml
    interval: 86400

  icloud:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt"
    path: ./ruleset/icloud.yaml
    interval: 86400

  apple:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt"
    path: ./ruleset/apple.yaml
    interval: 86400

  google:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt"
    path: ./ruleset/google.yaml
    interval: 86400

  proxy:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt"
    path: ./ruleset/proxy.yaml
    interval: 86400

  direct:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt"
    path: ./ruleset/direct.yaml
    interval: 86400

  private:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt"
    path: ./ruleset/private.yaml
    interval: 86400

  gfw:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt"
    path: ./ruleset/gfw.yaml
    interval: 86400

  greatfire:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt"
    path: ./ruleset/greatfire.yaml
    interval: 86400

  tld-not-cn:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt"
    path: ./ruleset/tld-not-cn.yaml
    interval: 86400

  telegramcidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt"
    path: ./ruleset/telegramcidr.yaml
    interval: 86400

  cncidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt"
    path: ./ruleset/cncidr.yaml
    interval: 86400

  lancidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt"
    path: ./ruleset/lancidr.yaml
    interval: 86400

  Whitelist:
    type: http
    behavior: classical
    url: "https://gitee.com/myisafei/script/raw/master/clash/rule/Whitelist.yaml"
    path: ./ruleset/Whitelist.yaml
    interval: 86400
    
  ME:
    type: http
    behavior: classical
    url: "https://gitee.com/myisafei/script/raw/master/clash/rule/Other.yaml"
    path: ./ruleset/Other.yaml
    interval: 3600
  
  TW:
    type: http
    behavior: classical
    url: "https://gitee.com/myisafei/script/raw/master/clash/rule/Tw.yaml"
    path: ./ruleset/Tw.yaml
    interval: 3600


# 分流规则  
rules:
  # Local Area Network
  - DOMAIN-SUFFIX,local,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,10.0.0.0/8,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT

  # 自定义部分
  - DOMAIN-SUFFIX,hexieshe.com,MATCH
  - DOMAIN-SUFFIX,themoviedb.org,MATCH
  - DOMAIN-SUFFIX,mangabz.com,MATCH
  - DOMAIN-SUFFIX,manhuagui.com,MATCH
  - DOMAIN-SUFFIX,taobao.com,DIRECT

  # BT,PT 规则
  - DOMAIN-KEYWORD,tracker,DIRECT
  - DOMAIN-KEYWORD,announce.php?passkey=,DIRECT
  - DOMAIN-KEYWORD,torrent,DIRECT
  - DOMAIN-KEYWORD,peer_id=,DIRECT
  - DOMAIN-KEYWORD,info_hash,DIRECT
  - DOMAIN-KEYWORD,get_peers,DIRECT
  - DOMAIN-KEYWORD,find_node,DIRECT
  - DOMAIN-KEYWORD,BitTorrent,DIRECT
  - DOMAIN-KEYWORD,announce_peer,DIRECT

  # 哔哩哔哩
  - DOMAIN-SUFFIX,biliapi.com,🎬哔哩哔哩
  - DOMAIN-SUFFIX,biliapi.net,🎬哔哩哔哩
  - DOMAIN-SUFFIX,bilibili.com,🎬哔哩哔哩
  - DOMAIN-SUFFIX,bilibili.tv,🎬哔哩哔哩
  - DOMAIN-SUFFIX,bilivideo.com,🎬哔哩哔哩
  - DOMAIN-SUFFIX,biligame.com,🎬哔哩哔哩
  - DOMAIN-SUFFIX,biligame.net,🎬哔哩哔哩
  
    ######### 自己的规则 start ##############
  # (直通)
  - RULE-SET,Whitelist,China
  # (自己平时访问的网址)
  - RULE-SET,ME,Proxy
  # (自己平时访问的网址)
  - RULE-SET,TW,Proxy

    ######### 自己的规则 end ##############

  # (adobe 服务)
  - RULE-SET,Adobe,Adobe
  # (亚马逊)
  - RULE-SET,Amazon,Amazon
  # (GitHub)
  - RULE-SET,GitHub,GitHub
  # (Microsoft)
  - RULE-SET,Microsoft,Microsoft
  # (奈飞)
  - RULE-SET,Netflix,Netflix 
  # (测速)
  - RULE-SET,Speedtest,Speedtest
  # (Steam)
  - RULE-SET,Steam,Steam
  # (Spotify)
  - RULE-SET,Spotify,Spotify
  # (腾讯)
  - RULE-SET,Tencent,Tencent
  # (YouTube)
  - RULE-SET,YouTube,YouTube
  - DOMAIN-SUFFIX,live.cn,China
  
  
  # (广告域名列表)
  - RULE-SET,reject,REJECT
  # (Apple 域名列表)
  - RULE-SET,apple,Apple
  # (iCloud 域名列表)
  - RULE-SET,icloud,Apple
  # (Google 域名列表)
  - RULE-SET,google,Google
  # (代理域名列表)
  - RULE-SET,proxy,Proxy
  # (直连域名列表)
  - RULE-SET,direct,China
  # (私有网络专用域名列表)
  - RULE-SET,private,China
  # (GFWList 域名列表)
  - RULE-SET,gfw,MATCH
  # (GreatFire 域名列表)
  - RULE-SET,greatfire,REJECT
  # (非中国大陆使用的顶级域名列表)
  - RULE-SET,tld-not-cn,MATCH
  # (Telegram 使用的 IP 地址列表)
  - RULE-SET,telegramcidr,Telegram
  # (中国大陆 IPv4 地址列表)
  - RULE-SET,cncidr,China
  # (局域网 IP 及保留 IP 地址列表)
  - RULE-SET,lancidr,China


  # GeoIP China
  - GEOIP,CN,DIRECT
  - MATCH,MATCH
```

## 二、ui 配置

下载第三方 ui [yacd](https://github.com/haishanh/yacd), 访问 [https://github.com/haishanh/yacd/releases](https://github.com/haishanh/yacd/releases)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/21411718/1665821447717-780b4a97-cd04-40de-9bbb-64e1f96c0350.png#clientId=u1d991aa2-9698-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u04291e26&margin=%5Bobject%20Object%5D&name=image.png&originHeight=872&originWidth=2100&originalType=url&ratio=1&rotation=0&showTitle=false&size=106769&status=done&style=none&taskId=ua48e0b1c-7f17-47f6-8975-e1da9e857ab&title=)

下载后解压得到 public 文件夹, 修改名称为 ui, 把文件夹放到 docker-compose.yaml 文件同目录下

![image.png](https://cdn.nlark.com/yuque/0/2022/png/21411718/1665821447756-ddbba644-6c90-466c-9c65-0a9375c7d250.png#clientId=u1d991aa2-9698-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u3d83d338&margin=%5Bobject%20Object%5D&name=image.png&originHeight=872&originWidth=1840&originalType=url&ratio=1&rotation=0&showTitle=false&size=143988&status=done&style=none&taskId=ued07b0e1-c566-4195-82e8-6c826bdefa7&title=)

## 三、部署

### 1.1 docker 命令

```bash
docker run -d --name=clash -v "$PWD/config.yaml:/root/.config/clash/config.yaml" -v "$PWD/ui:/ui"  -p "7890:7890" -p "9090:9090" --restart=unless-stopped dreamacro/clash-premium
```

- -v  $/pwd/config.yaml – 配置文件
- -v $PWD/ui – 控制面板的路径(访问: http:ip:9090/ui)
- -p 7890 – 代理端口
- -p 9090 – 控制接口的端口

### 1.2 docker compose 部署

创建 docker-compose.yaml 文件

```yaml
version: '3.8'
services:
  clash:
    image: dreamacro/clash-premium
    container_name: clash-premium
    volumes:
      - ./config.yaml:/root/.config/clash/config.yaml
      - ./ui:/ui # 图形面板目录
    ports:
      - "7890:7890"
      - "9090:9090"
    restart: unless-stopped
    network_mode: "bridge"
```

运行

```bash
docker-compose up -d
```

查看日志

```bash
docker-compose logs
```

访问 <http://IP:8090/ui> 查看效果吧

![image.png](https://cdn.nlark.com/yuque/0/2022/png/21411718/1665821447758-91cb67b7-302b-4c6a-b9a4-11f8341a4578.png#clientId=u1d991aa2-9698-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u15062c96&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1192&originWidth=2678&originalType=url&ratio=1&rotation=0&showTitle=false&size=175754&status=done&style=none&taskId=u5c8458d9-905f-40f0-8e55-12bc41f0940&title=)

原文地址:<https://blog.fillpit.cn/shi-yong-docker-da-jian-tu-xing-hua-clash-fu-wu-duan-zhi-chi-zi-dong-geng-xin-ding-yue/>
