---
sidebar_position: 4
authors: [wengtx]
tags: [mssql, SQL Server,死锁,历史记录,]
---

# 查询数据库各种历史记录

在SQL Server数据库中，从登陆开始，然后做了什么操作，以及数据库里发生了什么，大多都是有记录可循的，但是也有一些确实无从查起。

## 一. 数据库启动记录

### 1. 最近一次启动SQL Server的时间

```sql
select sqlserver_start_time from sys.dm_os_sys_info;

--也可参考系统进程创建的时间，比服务启动时间略晚(秒级)
select login_time from sysprocesses where spid = 1
select login_time from sys.dm_exec_sessions where session_id = 1

--也可参考tempdb数据库创建的时间，比服务启动时间略晚(秒级)
select create_date from sys.databases
where database_id=2
```

### 2. 最近几次启动SQL Server的时间

--参考error log，系统默认保留6个归档，共7个文件

```sql
exec xp_readerrorlog 0,1, N'SQL Server is starting'
exec xp_readerrorlog 1,1, N'SQL Server is starting'
exec xp_readerrorlog 2,1, N'SQL Server is starting'
exec xp_readerrorlog 3,1, N'SQL Server is starting'
exec xp_readerrorlog 4,1, N'SQL Server is starting'
exec xp_readerrorlog 5,1, N'SQL Server is starting'
exec xp_readerrorlog 6,1, N'SQL Server is starting'
--之前关键字用N'Server process ID is'并不严谨，改为N'SQL Server is starting'
```

### 3.历史上更多次启动SQL Server的时间

查看windows event log，SQL语句无法直接读取event log，如果想用命令行，可以试试VBS，Powershell。
Event Viewer/Windows logs下Application 或者 System 事件里都有服务启动的记录。

## 二. 登录数据库记录

### 1. 查看error log

默认情况下，只有失败的登录会被记录在error log里，如果想登录失败/成功都被记录到error log，需要开启如图选项：
用SQL语句修改注册表，也同样可以开启，键值对应关系如下：

* 0, None
* 1, Failed
* 2, Successful
* 3, Both failed and successful

```sql
USE [master]
GO
EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', N'Software\Microsoft\MSSQLServer\MSSQLServer', N'AuditLevel', REG_DWORD, 3
GO
```

在error log里查看登录记录：

```sql
exec xp_readerrorlog 0,1, N'Login', N'for user', null, null, N'DESC'
```

### 2. 利用LOGON 触发器进行记录

从SQL Server 2005 SP2开始引入了LOGON Trigger，可以用它在登录时做个记录，实现如下：

```sql
--创建LOGON触发器
CREATE database DBA
GO

USE DBA
GO

IF OBJECT_ID('login_history','U') is not null
DROP TABLE login_history
GO

CREATE TABLE login_history
(
FACT_ID         bigint IDENTITY(1,1) primary key,
LOGIN_NAME      nvarchar(1024),
LOGIN_TIME      datetime
)
GO

IF EXISTS(select 1 from sys.server_triggers where name = 'login_history_trigger')
DROP TRIGGER login_history_trigger ON ALL SERVER
GO

CREATE TRIGGER login_history_trigger
ON ALL SERVER
FOR LOGON
AS
BEGIN
--IF SUSER_NAME() NOT LIKE 'NT AUTHORITY%' AND
--   SUSER_NAME() NOT LIKE 'NT SERVICE%'
IF ORIGINAL_LOGIN() NOT LIKE 'NT AUTHORITY%' AND
ORIGINAL_LOGIN() NOT LIKE 'NT SERVICE%'
BEGIN
INSERT INTO DBA..login_history
VALUES(ORIGINAL_LOGIN(),GETDATE());
END;
END;
GO
```

--登录后查看记录

```sql
SELECT * FROM login_history
```

### 3. 实例：查询某login的最后一次登录

系统表/试图里，并没有这样的字段记录，syslogins里accdate也是不对的，如果要查可以通过上面2个方法里的一种：
(1) ERROR LOG，得设置记录Login Auditing 的“Both failed and successful” 选项，默认为”Failed”；
(2) Logon Trigger；

## 三. 创建，修改，删除记录 (DDL)

### 1. 服务器对象的创建，修改

```sql
--创建数据库
select name, create_date from sys.databases

--创建，修改登录
select name, createdate, updatedate from syslogins
select name, create_date, modify_date from sys.server_principals

--创建，修改LOGON触发器
select name, create_date, modify_date from sys.server_triggers
```

### 2. 数据库对象创建，修改

```sql
--创建，修改数据库对象
select name, create_date, modify_date from sys.objects

--创建，修改触发器，DDL触发器不在sys.objects里
select name, create_date, modify_date from sys.triggers
```

注意：

#### (1) 索引的创建，修改并没有记录

```sql
sys.objects --里面没有0,1 之外的索引
sys.indexes --里面没有日期
objectproperty() --没有日期属性
indexproperty()  --没有日期属性

sys.dm_db_index_operational_stats
sys.dm_db_index_usage_stats
sys.dm_db_index_physical_stats --也都没有

STATS_DATE (table_id, index_id) --是索引的统计信息最后更新时间
```

#### (2) 关于creator和owner

SQL Server里只有owner，数据库里对象的owner必须是一个有效的database principal (user或者role)，没有creator，很难知道是谁创建了这个对象，因为owner并不准确：
首先，数据库对象的owner可以被修改，ALTER AUTHORIZATION或者sp_changeobjectowner都行；
其次，就算owner没被修改过，默认情况下数据库对象的owner沿用schema的owner，除非在创建schema时特意指定了某个owner；

最后，系统表并没有记录creator，如果想要查询，也许得利用DDL 触发器来记录。

关于owner简单举例如下：

```sql
--用sysadmin权限的账号登录后创建
USE master
GO
CREATE LOGIN test_login WITH PASSWORD=N'123', DEFAULT_DATABASE=master, CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
ALTER SERVER ROLE sysadmin ADD MEMBER test_login
GO

CREATE database DBA
GO

USE DBA
GO

CREATE USER test_user FOR LOGIN test_login
GO

CREATE SCHEMA test_schema
GO

--用"test_login"登录后建表
if OBJECT_ID('test_schema.test_owner','U') is not null
    drop table test_schema.test_owner
GO

create table test_schema.test_owner(id int)
GO

--表的owner还是用了schema的owner
select s.name as schema_name, dp2.name as schema_owner,
       o.name as object_name, coalesce(dp1.name, dp2.name) as object_owner,* 
from sys.objects o
inner join sys.schemas s
on o.schema_id = s.schema_id
left join sys.database_principals dp1
on o.principal_id = dp1.principal_id
left join sys.database_principals dp2
on s.principal_id = dp2.principal_id
where o.name = 'test_owner'

--用objectproperty也可以查看owner
select name as object_owner
from sys.database_principals 
where principal_id = OBJECTPROPERTY(object_id('test_schema.test_owner'),'OwnerId')

object owner
```

### 3. 默认跟踪里的创建，修改，删除对象 (create, alter, drop)

从sql server 2005开始引入了默认跟踪，这是sql server默认开启的跟踪，并定义了事件、文件大小，个数，查看定义如下：

```sql
--系统定义好的默认跟踪事件
select t.eventid, te.name
from (select distinct eventid from sys.fn_trace_geteventinfo(1)) t
inner join sys.trace_events te
on t.eventid = te.trace_event_id

--最多5个文件，每个文件20MB，依次滚动覆盖
select * from sys.traces
where id = 1
```

示例，利用默认跟踪查看删除数据库记录如下：

```sql
DECLARE @path  varchar(1024) 

SELECT @path  = path 
FROM sys.traces
WHERE id = 1

SELECT *
FROM fn_trace_gettable(@path, default) --default读取当前所有trace文件，包括正在用的
WHERE DatabaseName = 'DBA'
and EventClass = 47    --46表示Create对象，47表示Drop对象，164表示修改对象
and ObjectType = 16964 --16964表示数据库
```

注意：

(1) 其他对象比如表的删除等也都可以查到；
(2) 默认跟踪返回的列值有很多定义，没有系统表记载，需要去翻帮助，比如ObjectType列值参考这个列表：
[https://msdn.microsoft.com/en-us/library/ms180953.aspx](https://msdn.microsoft.com/en-us/library/ms180953.aspx)
(3) 注意默认跟踪的时效性，5个20MB的文件，也许想要看的信息很快就被覆盖了；
(4)  truncate table并没有被默认跟踪记录。

## 四. 数据库表的各种记录

汇总一下对表的各种历史操作记录的查看：

* (1) create table, alter table记录，查看sys.objects 或者默认跟踪；
* (2) drop table记录，查看默认跟踪；
* (3) truncate table 也许只有去打开数据库log文件查看了，最后会简单介绍下；
* (4) DML操作表中数据的记录，查看sys.dm_db_index_usage_stats，如下：

```sql
SELECT o.name as table_name,
s.last_user_seek,
s.last_user_scan,
s.last_user_lookup,
s.last_user_update
from sys.indexes i
left join sys.dm_db_index_usage_stats s
on s.object_id = i.object_id and
s.index_id = i.index_id
inner join sys.objects o
on i.object_id = o.object_id
where i.index_id <= 1
and o.is_ms_shipped = 0
order by o.name
```

注意：动态管理视图(DMV) 中采集来的信息都是从sql server启动后开始的，也就是说重启后就没了。

## 五. 历史SQL语句记录

有些数据库本身，会记录所有历史的SQL命令。比如：mysql和pgsql都有专门的log文本文件来存放所有历史的SQL命令；

也有些数据库在保存log文本的同时，还保留最近的N条SQL命令在数据库里，以方便查询。
SQL Server并没有这样的实现，只有sys.dm_exec_query_stats缓存了一部分 (sql server服务开启后执行的语句，某些不被缓存执行计划的语句并不记录)。

这个视图主要是对执行计划的统计，包含消耗成本，运行次数等等，并没有session，user，每次被执行的时间等信息：

```sql
SELECT st.text as sql_statement,
qs.creation_time as plan_last_compiled,
qs.last_execution_time as plan_last_executed,
qs.execution_count as plan_executed_count,
qp.query_plan
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.plan_handle) st
CROSS APPLY sys.dm_exec_query_plan(qs.plan_handle) qp
order by total_elapsed_time/execution_count desc
```

当然，开启跟踪，审计之类的方法，是可以记录所有操作的，但是这个开销有可能会影响系统性能，所以一般并不在生产环境启用。

## 六. 数据库备份还原历史记录

备份还原的记录都在msdb里。

### 1. 备份记录

```sql
SELECT
bs.backup_set_id,
bs.database_name,
bs.backup_start_date,
bs.backup_finish_date,
CAST(CAST(bs.backup_size/1000000 AS INT) AS VARCHAR(14)) + ' ' + 'MB' AS [Size],
CAST(DATEDIFF(second, bs.backup_start_date,
bs.backup_finish_date) AS VARCHAR(4)) + ' ' + 'Seconds' [TimeTaken],
CASE bs.[type]
WHEN 'D' THEN 'Full Backup'
WHEN 'I' THEN 'Differential Backup'
WHEN 'L' THEN 'TLog Backup'
WHEN 'F' THEN 'File or filegroup'
WHEN 'G' THEN 'Differential file'
WHEN 'P' THEN 'Partial'
WHEN 'Q' THEN 'Differential Partial'
END AS BackupType,
bmf.physical_device_name,
CAST(bs.first_lsn AS VARCHAR(50)) AS first_lsn,
CAST(bs.last_lsn AS VARCHAR(50)) AS last_lsn,
bs.server_name,
bs.recovery_model
FROM msdb.dbo.backupset bs
INNER JOIN msdb.dbo.backupmediafamily bmf
ON bs.media_set_id = bmf.media_set_id
ORDER BY bs.server_name,bs.database_name,bs.backup_start_date;
GO
```

如果server_name是本机，那么备份是在本机生成的；
如果server_name是别的主机名，那么备份是被拿到本机做过数据库还原；

### 2. 还原纪录

```sql
SELECT
rs.[restore_history_id],
rs.[restore_date],
rs.[destination_database_name],
bmf.physical_device_name,
rs.[user_name],
rs.[backup_set_id],
CASE rs.[restore_type]
WHEN 'D' THEN 'Database'
WHEN 'I' THEN 'Differential'
WHEN 'L' THEN 'Log'
WHEN 'F' THEN 'File'
WHEN 'G' THEN 'Filegroup'
WHEN 'V' THEN 'Verifyonly'
END AS RestoreType,
rs.[replace],
rs.[recovery],
rs.[restart],
rs.[stop_at],
rs.[device_count],
rs.[stop_at_mark_name],
rs.[stop_before]
FROM [msdb].[dbo].[restorehistory] rs
INNER JOIN [msdb].[dbo].[backupset] bs
--on rs.backup_set_id = bs.media_set_id
ON rs.backup_set_id = bs.backup_set_id
INNER JOIN msdb.dbo.backupmediafamily bmf
ON bs.media_set_id = bmf.media_set_id
GO
```

还原数据库的时候是会写backupset和backupmediafamily系统表的，用来记录还原所用到的备份文件信息。

## 七. 作业，维护计划，数据库邮件历史记录

作业，维护计划，数据库邮件的历史记录，也都在msdb里。

### 1. 作业历史记录

```sql
if OBJECT_ID('tempdb..#tmp_job') is not null
drop table #tmp_job

--只取最后一次结果
select job_id,
run_status,
CONVERT(varchar(20),run_date) run_date,
CONVERT(varchar(20),run_time) run_time,
CONVERT(varchar(20),run_duration) run_duration
into #tmp_job
from msdb.dbo.sysjobhistory jh1
where jh1.step_id = 0
and (select COUNT(1) from msdb.dbo.sysjobhistory jh2
where jh2.step_id = 0
and (jh1.job_id = jh2.job_id)
and (jh1.instance_id <= jh2.instance_id))=1

--排除syspolicy_purge_history这个系统作业
select a.name job_name,
case b.run_status when 0 then 'Failed'
when 1 then 'Succeeded'
when 2 then 'Retry'
when 3 then 'Canceled'
else 'Unknown'
end as job_status,
LEFT(run_date,4)+'-'+SUBSTRING(run_date,5,2)+'-'+RIGHT(run_date,2)
+SPACE(1)
+LEFT(RIGHT(1000000+run_time,6),2)+':'
+SUBSTRING(RIGHT(1000000+run_time,6),3,2)+':'
+RIGHT(RIGHT(1000000+run_time,6),2) as job_started_time,
+LEFT(RIGHT(1000000+run_duration,6),2)+':'
+SUBSTRING(RIGHT(1000000+run_duration,6),3,2)+':'
+RIGHT(RIGHT(1000000+run_duration,6),2) as job_duration
from msdb.dbo.sysjobs a
left join    #tmp_job b
on a.job_id=b.job_id
where a.name not in ('syspolicy_purge_history')
and a.enabled = 1
order by b.run_status asc,a.name,b.run_duration desc
```

### 2. 维护计划历史记录

```sql
select * from msdb..sysdbmaintplan_history

--新的系统表也可以
select * from msdb..sysmaintplan_log
select * from msdb..sysmaintplan_logdetail
```

维护计划最终是作为作业在运行的，也可以直接查看同名作业的历史记录。

### 3. 数据库邮件历史记录

```sql
--直接查系统表
select * from msdb..sysmail_mailitems
select * from msdb..sysmail_log

--也可查看基于这2个系统表的系统视图
select * from msdb..sysmail_allitems
select * from msdb..sysmail_sentitems
select * from msdb..sysmail_unsentitems
select * from msdb..sysmail_faileditems
select * from msdb..sysmail_event_log

--更多系统表和视图
use msdb
GO
select * from sys.objects
where name like '%sysmail%'
and type in('U','V')
order by type,name
```

## 八. 查看数据库日志文件

数据库日志文件里对于DDL，DML操作肯定是有记录的，有2个内置函数可以用来解析，但是并不那么轻松，简单介绍如下：

### 1. fn_dblog 读取当前在线的日志

```sql
select * from fn_dblog(null,null) --2个null代表起始的日志LSN
```

返回的结果集中字段定义：
(1) AllocUnitName: 对象名
(2) Operation: 操作类型，常见的有 'LOP_INSERT_ROWS', 'LOP_DELETE_ROWS', 'LOP_MODIFY_ROW'
(3) [RowLog Contents 0], [RowLog Contents 1], 2,3,4,5: 字段内容，但是是二进制的，和dbcc page看到的类似

试着查看truncate table记录如下：

```sql
IF OBJECT_ID('test_truncate','U') is not null
DROP TABLE test_truncate
GO

CREATE TABLE test_truncate(ID int)
INSERT INTO test_truncate values(1)
TRUNCATE TABLE test_truncate

--查看truncate table记录
select * from fn_dblog(null,null)
where AllocUnitName like '%test_truncate%'
and Description like 'Deallocated%'
```

### 2. fn_dump_dblog 读取数据库备份里的日志

参数介绍：前面两2个NULL和fn_dblog一样代表起始的日志LSN，DISK表示设备类型，1表示备份文件个数，最多64个，这里以1个文件为例：

```sql
backup database DBA to disk = 'C:\backup\dba.bak'

SELECT *
FROM
fn_dump_dblog (
NULL, NULL, N'DISK', 1, N'C:\backup\dba.bak',
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT,
DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT);
GO
```

这2个函数返回的信息量很大，如果有兴趣，不妨多做点测试。

原文地址:[https://www.cnblogs.com/seusoftware/p/4826958.html](https://www.cnblogs.com/seusoftware/p/4826958.html)
