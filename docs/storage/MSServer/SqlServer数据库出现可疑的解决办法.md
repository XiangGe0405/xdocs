---
# sidebar_position: 4
authors: [wengtx]
tags: [mssql, SQL Server,MD5,加密]
---

# SqlServer数据库出现可疑的解决办法

当数据库发生这种操作故障时，可以按如下操作步骤可解决此方法，打开数据库里的Sql 查询编辑器窗口，运行以下的命令。

　　1、修改数据库为紧急模式

``` sql
ALTER DATABASE yourdbname SET EMERGENCY
```

　　2、使数据库变为单用户模式

``` sql
　　ALTER DATABASE yourdbname SET SINGLE_USER
```

　　3、修复数据库日志重新生成，此命令检查的分配，结构，逻辑完整性和所有数据库中的对象错误。当您指定“REPAIR_ALLOW_DATA_LOSS”作为DBCC CHECKDB命令参数，该程序将检查和修复报告的错误。但是，这些修复可能会导致一些数据丢失。

``` sql
　　DBCC CheckDB (yourdbname, REPAIR_ALLOW_DATA_LOSS)
```

　　4、使数据库变回为多用户模式

``` sql
　　ALTER DATABASE yourdbname SET MULTI_USER
```

　　也可以这样做：

　　1：重新建立一个，一样的数据库，路径名称，文件都一样。

　　2：关掉SQL Server服务;

　　3：把源文件COPY过来;

　　4：开启SQL Server服务，这样问题同样就解决了。
