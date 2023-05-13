---
# sidebar_position: 1
---
# Clouddrive

docker下载

``` bash
docker pull cloudnas/clouddrive
```

``` bash
docker run -d \
     --name clouddrive \
     --restart unless-stopped \
     -v <path to accept cloud mounts>:/CloudNAS:shared \
     -v <path to app data>:/Config \
     -v <other local shared path>:/media:shared \
     --network host \
     --pid host \
     --privileged \
     --device /dev/fuse:/dev/fuse \
     cloudnas/clouddrive
```

地址：

``` bash
http://<ip>:9798

localhost:9798
```
