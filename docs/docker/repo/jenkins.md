---
# sidebar_position: 1
---
# Jenkins

## 下载镜像

``` bash
docker pull jenkins/jenkins:lts
```

Jenkins中文官网：(<https://www.jenkins.io/zh/>)

## 安装启动容器

``` bash
docker run -d --name jenkins -p 8081:8080 -v /data/jenkins_home:/var/jenkins_home jenkins/jenkins:lts;
```

备注：
    -d //启动在后台
    --name //容器名字
    -p //端口映射（8081：宿主主机端口，8080：容器内部端口）
    -v //数据卷挂载映射（/data/jenkins_home：宿主主机目录，另外一个即是容器目录）
    Jenkins/jenkins:lts //Jenkins镜像（最新版）

### win

``` bash
docker run -d --name jenkins -p 8081:8080 -v O:\docker/jenkins_home:/var/jenkins_home jenkins/jenkins:lts
 ```

## 更改Jenkins升级站点

改成国内的地址：
`https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json`

## 升级docker镜像的Jenkins版本

替换最新的war包

``` bash
docker cp /root/jenkins.war jenkins:/usr/share/jenkins/
```

重新启动容器

``` bash
docker restart jenkins
```
