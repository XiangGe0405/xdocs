---
sidebar_position: 5
authors: [wengtx]
tags: [mssql, SQL Server,死锁,历史记录]
---

# 查询数据库正在执行的信息

```sql
SELECT  
 der.[session_id],der.[blocking_session_id],  
 sp.lastwaittype,sp.hostname,sp.program_name,sp.loginame,  
 der.[start_time] AS '开始时间',  
 der.[status] AS '状态',  
 dest.[text] AS 'sql语句',  
 DB_NAME(der.[database_id]) AS '数据库名',  
 der.[wait_type] AS '等待资源类型',  
 der.[wait_time] AS '等待时间',  
 der.[wait_resource] AS '等待的资源',  
 der.[logical_reads] AS '逻辑读次数', 
 sp.physical_io AS '物理读次数' ,
 qp.query_plan AS 对应的执行计划
 FROM sys.[dm_exec_requests] AS der  
 INNER JOIN master.dbo.sysprocesses AS sp ON der.session_id=sp.spid  
 CROSS APPLY  sys.[dm_exec_sql_text](der.[sql_handle]) AS dest   
 CROSS APPLY [sys].[dm_exec_query_plan](plan_handle) AS qp 
 --WHERE [session_id]>50 AND session_id<>@@SPID  
 --WHERE  der.[session_id]=104
 --WHERE  DB_NAME(der.[database_id])='XXX'
 ORDER BY physical_io DESC 
```
