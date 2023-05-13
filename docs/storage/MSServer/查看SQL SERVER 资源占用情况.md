---
sidebar_position: 2
authors: [wengtx]
tags: [mssql, SQL Server,RAND()]
---

# 查看SQL SERVER 资源占用情况

## 1，查看CPU占用量最高的会话及SQL语句

``` sql
select  spid,cmd,cpu,physical_io,memusage,
(select  top  1  [text]  from  ::fn_get_sql(sql_handle))  sql_text
from  master..sysprocesses  order  by  cpu  desc,physical_io  desc
```

## 2，查看缓存重用次数少，内存占用大的SQL语句

```sql
SELECT  TOP  100  usecounts,  objtype,  p.size_in_bytes,[sql].[text] 
FROM  sys.dm_exec_cached_plans  p  OUTER  APPLY  sys.dm_exec_sql_text  (p.plan_handle)  sql 
ORDER  BY  usecounts,p.size_in_bytes    desc
```
