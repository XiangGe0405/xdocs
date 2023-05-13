---
sidebar_position: 3
---

# 查询数据库执行过的SQL记录

说明：仅支持sql server2008及以上版本

通过下面的SQL语句可以查看Sqlserver执行的SQL记录，常用于SQL优化及辅助查找数据更新相关功能bug。

```sql
SELECT TOP 1000
       ST.text AS '执行的SQL语句',
       QS.execution_count AS '执行次数',
       QS.total_elapsed_time AS '耗时',
       QS.total_logical_reads AS '逻辑读取次数',
       QS.total_logical_writes AS '逻辑写入次数',
       QS.total_physical_reads AS '物理读取次数',
       QS.creation_time AS '执行时间' ,  
       QS.*
FROM   sys.dm_exec_query_stats QS
       CROSS APPLY
sys.dm_exec_sql_text(QS.sql_handle) ST
WHERE  QS.creation_time >'2020-08-18'
ORDER BY
     QS.total_elapsed_time DESC
```

关键SQL信息查询测试

```sql
SELECT TOP 1000
       ST.text AS '执行的SQL语句',
       QS.total_elapsed_time AS '耗时',    
       QS.creation_time AS '执行时间' 
FROM   sys.dm_exec_query_stats QS
       CROSS APPLY
sys.dm_exec_sql_text(QS.sql_handle) ST
WHERE  QS.creation_time >'2021-02-18 15:00' AND QS.creation_time <'2021-02-18 23:00'
ORDER BY
     QS.total_elapsed_time DESC
```

dm_exec_query_stats字段属性详细说明参考官网：
<https://docs.microsoft.com/zh-cn/previous-versions/sql/sql-server-2012/ms189741(v=sql.110)?redirectedfrom=MSDN>

参考：<https://blog.csdn.net/qq_34440345/article/details/108069681>
