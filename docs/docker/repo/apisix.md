---
# sidebar_position: 1
---
# Apisix

**Apache APISIX** 是 Apache 软件基金会下的云原生 API 网关，它兼具动态、实时、高性能等特点，提供了负载均衡、动态上游、灰度发布（金丝雀发布）、服务熔断、身份认证、可观测性等丰富的流量管理功能。我们可以使用 Apache APISIX 来处理传统的南北向流量，也可以处理服务间的东西向流量。同时，它也支持作为 K8s Ingress Controller 来使用。

主要特性#

- 多平台支持：APISIX 提供了多平台解决方案，它不但支持裸机运行，也支持在 Kubernetes 中使用，还支持与 AWS Lambda、Azure Function、Lua 函数和 Apache OpenWhisk 等云服务集成。

- 全动态能力：APISIX 支持热加载，这意味着你不需要重启服务就可以更新 APISIX 的配置。请访问为什么 Apache APISIX 选择 Nginx + Lua 这个技术栈？以了解实现原理。

- 精细化路由：APISIX 支持使用 NGINX 内置变量做为路由的匹配条件，你可以自定义匹配函数来过滤请求，匹配路由。
运维友好：APISIX 支持与以下工具和平台集成：HashiCorp Vault、Zipkin、Apache SkyWalking、Consul、Nacos、Eureka。通过 APISIX

- Dashboard，运维人员可以通过友好且直观的 UI 配置 APISIX。
多语言插件支持：APISIX 支持多种开发语言进行插件开发，开发人员可以选择擅长语言的 SDK 开发自定义插件。

## 安装APISIX

``` bash
git clone https://github.com/apache/apisix-docker.git
cd apisix-docker/example
```

启动

``` bash
docker-compose -p docker-apisix up -d
```
