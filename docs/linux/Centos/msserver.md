---
sidebar_position: 5
---

# 安装SQL Server2019

## 一、安装SQLServer 实例

### 1.下载 `Microsoft SQL Server 2019 Red Hat` 存储库配置文件

``` bash
curl -o /etc/yum.repos.d/mssql-server.repo https://packages.microsoft.com/config/rhel/8/mssql-server-2019.repo
```

### 2.运行以下命令以安装 SQL Server

``` bash
yum install -y mssql-server
```

### 3.包安装完成后，运行 mssql-conf setup，按照提示设置 SA 密码并选择版本

``` bash
/opt/mssql/bin/mssql-conf setup
```

### 4.sqlserver默认使用1433端口，可关闭防火墙或开放1433端口进行远程

## 二、安装 SQL Server 命令行工具

若要创建数据库，则需要使用可在 SQL Server 上运行 Transact-SQL 语句的工具进行连接。 以下步骤将安装 SQL Server 命令行工具：`sqlcmd` 和 `bcp`

### 1.下载 Microsoft Red Hat 存储库配置文件

``` bash
curl -o /etc/yum.repos.d/msprod.repo https://packages.microsoft.com/config/rhel/8/prod.repo
```

### 2.如果安装了早期版本的 mssql-tools，请删除所有旧的 unixODBC 包

``` bash
yum remove unixODBC-utf16 unixODBC-utf16-devel
```

### 3.运行以下命令，以使用 unixODBC 开发人员包安装 `mssql-tools`

``` bash
yum install -y mssql-tools unixODBC-devel
```

### 4.为方便起见，向 PATH 环境变量添加 `/opt/mssql-tools/bin/` 。 这样可以在不指定完整路径的情况下运行这些工具。 运行以下命令以修改登录会话和交互式/非登录会话的路径

``` bash
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
source ~/.bashrc
```

测试本地连接

``` bash
sqlcmd -S localhost -U SA -P '<YourPassword>'
```

使用以下命令更改 SA 密码：

``` bash
sudo systemctl stop mssql-server
sudo /opt/mssql/bin/mssql-conf set-sa-password
```

重新启动 SQL Server 服务。

``` bash
sudo systemctl start mssql-server
```

查看我们安装的sql server版本

``` bash
rpm -qa | grep mssql
```

查看安装的路径

``` bash
find / -name mssql
```

设置开机启动

``` bash
systemctl enable mssql-server
```

具体配置路劲为/opt/mssql/bin/mssql-conf

若要允许远程连接，请在 RHEL 的防火墙上打开 SQL Server 端口。 默认的 SQL Server 端口为 TCP 1433。 如果为防火墙使用的是 FirewallD，则可以使用以下命令：

``` bash
sudo firewall-cmd --zone=public --add-port=1433/tcp --permanent
sudo firewall-cmd --reload
```

==解决 "/lib64/libc.so.6: version `GLIBC_2.18' not found (required by /lib64/libstdc++.so.6)"==

``` bash
curl -O http://ftp.gnu.org/gnu/glibc/glibc-2.18.tar.gz
tar zxf glibc-2.18.tar.gz 
cd glibc-2.18/
mkdir build
cd build/
../configure --prefix=/usr
make -j2
make install
```
