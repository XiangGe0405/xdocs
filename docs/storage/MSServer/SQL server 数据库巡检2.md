---
# sidebar_position: 4
authors: [wengtx]
tags: [mssql, SQL Server,巡检,巡检模版]
---

# SQL server 数据库巡检模版(二)

``` sql
SELECT name FROM sysobjects where xtype='u' and name <>'XzryGzGrant' AND name LIKE 'XzryGzGrant2021%'
SELECT name FROM sys.tables WHERE TYPE='U' AND PATINDEX('%[^0-9][0-9]%',name)>0 ORDER BY name
--备份表
--SQL Server中，如果目标表存在：
insert into 目标表 select * from 原表;
--SQL Server中,，如果目标表不存在：
select * into 目标表 from 原表;
--查询外键SELECT fk.name fkname,       ftable.name ftablename,       cn.name fkcol,       rtable.name ftablename,       'ALTER TABLE ' + ftable.name + ' DROP constraint ' + fk.name + ''FROM sysforeignkeys    JOIN sysobjects fk ON sysforeignkeys.constid = fk.id    JOIN sysobjects ftable  ON sysforeignkeys.fkeyid = ftable.id    JOIN sysobjects rtable ON sysforeignkeys.rkeyid = rtable.id    JOIN syscolumns cn   ON sysforeignkeys.fkeyid = cn.id  AND sysforeignkeys.fkey = cn.colidWHERE rtable.name = 'DeviceInfo';
--SQL查看数据库中每张表的数据量和总数据量
SELECT a.name AS 表名, MAX(b.rows) AS 记录条数,'truncate table '+a.name+';'
FROM sys.sysobjects AS a INNER JOIN sys.sysindexes AS b  ON a.id = b.id
WHERE (a.xtype = 'u') and b.rows>0 and  a.name not in('System_Info','base_dbkey','SYSTEM_MENU','Base_Group')
GROUP BY a.name ORDER BY 记录条数 DESC;

--最耗时的SQL
SELECT TOP 20
       total_worker_time / 1000 AS [总消耗CPU 时间(ms)],
       execution_count [运行次数],
       qs.total_worker_time / qs.execution_count / 1000 AS [平均消耗CPU 时间(ms)],
       last_execution_time AS [最后一次执行时间],
       max_worker_time / 1000 AS [最大执行时间(ms)],
       SUBSTRING(qt.text, qs.statement_start_offset / 2 + 1,
        (CASE  WHEN qs.statement_end_offset = -1 THEN   DATALENGTH(qt.text)
         ELSE  qs.statement_end_offset END - qs.statement_start_offset) / 2 + 1
         ) AS [使用CPU的语法],
       qt.text [完整语法],
       dbname = DB_NAME(qt.dbid),
       OBJECT_NAME(qt.objectid, qt.dbid) ObjectName
FROM sys.dm_exec_query_stats qs WITH (NOLOCK) CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS qt
WHERE execution_count > 1 ORDER BY total_worker_time DESC;

--SQL查看数据库中每张表的数据量和总数据量
SELECT a.name AS 表名, MAX(b.rows) AS 记录条数,'truncate table '+a.name+';'
FROM sys.sysobjects AS a INNER JOIN sys.sysindexes AS b  ON a.id = b.id
WHERE (a.xtype = 'u') AND a.name LIKE '%xck_ClassHour%'
GROUP BY a.name ORDER BY 记录条数 DESC;


--查看数据库中每个表数据大小
IF OBJECT_ID('tempdb..#TablesSizes') IS NOT NULL
DROP TABLE #TablesSizes
CREATE TABLE #TablesSizes(
    TableName sysname ,
    Rows BIGINT ,
    reserved VARCHAR(100) ,
    data VARCHAR(100) ,
    index_size VARCHAR(100) ,
    unused VARCHAR(100)
)
DECLARE @sql VARCHAR(MAX)
SELECT  @sql = COALESCE(@sql, '') + 'INSERT INTO #TablesSizes execute sp_spaceused ''' + QUOTENAME(TABLE_SCHEMA, '[]') + '.' + QUOTENAME(Table_Name, '[]') + ''''
FROM  INFORMATION_SCHEMA.TABLES
WHERE   TABLE_TYPE = 'BASE TABLE'
PRINT ( @SQL )
EXECUTE (@SQL)
SELECT  * FROM #TablesSizes ORDER BY Rows DESC


--查看索引：
SELECT CASE WHEN t.[type] = 'U' THEN '表'  WHEN t.[type] = 'V' THEN '视图' END AS '类型',
       SCHEMA_NAME(t.schema_id) + '.' + t.[name] AS '(表/视图)名称',
       i.[name] AS 索引名称,  SUBSTRING(column_names, 1, LEN(column_names) - 1) AS '列名',
       CASE WHEN i.[type] = 1 THEN '聚集索引'
           WHEN i.[type] = 2 THEN'非聚集索引'
           WHEN i.[type] = 3 THEN 'XML索引'
           WHEN i.[type] = 4 THEN '空间索引'
           WHEN i.[type] = 5 THEN '聚簇列存储索引'
           WHEN i.[type] = 6 THEN '非聚集列存储索引'
           WHEN i.[type] = 7 THEN '非聚集哈希索引'
       END AS '索引类型',
       CASE WHEN i.is_unique = 1 THEN '唯一' ELSE '不唯一' END AS '索引是否唯一'
FROM sys.objects t
INNER JOIN sys.indexes i ON t.object_id = i.object_id
CROSS APPLY(SELECT col.[name] + ', ' FROM sys.index_columns ic 
INNER JOIN sys.columns col ON ic.object_id = col.object_id AND ic.column_id = col.column_id
WHERE ic.object_id = t.object_id  AND ic.index_id = i.index_id
ORDER BY col.column_id
FOR XML PATH('')
) D(column_names)
WHERE t.is_ms_shipped <> 1 AND index_id > 0
ORDER BY i.[name];

--查看索引使用情况SQL语句：
select db_name(database_id) as N'数据库名称',
       object_name(a.object_id) as N'表名',
       b.name N'索引名称',
       user_seeks N'用户索引查找次数',
       user_scans N'用户索引扫描次数',
       last_user_seek N'最后查找时间',
       last_user_scan N'最后扫描时间',
       rows as N'表中的行数'
from sys.dm_db_index_usage_stats a join 
     sys.indexes b
     on a.index_id = b.index_id
     and a.object_id = b.object_id
     join sysindexes c
     on c.id = b.object_id
where database_id=db_id('数据库名')   --指定数据库
     and object_name(a.object_id) not like 'sys%'
     and object_name(a.object_id) like '表名'  --指定索引表
     and b.name like '索引名' --指定索引名称 可以先使用 sp_help '你的表名' 查看表的结构和所有的索引信息
order by user_seeks,user_scans,object_name(a.object_id)

--查询触发器
select * from sysobjects where xtype='TR'

--SQL SERVER 查看数据库安装时间
SELECT * FROM sys.server_principals WHERE name = 'NT AUTHORITY\SYSTEM';

--查看SQL SERVER数据库的连接数
SELECT * FROM master.dbo.sysprocesses WHERE dbid = DB_ID('hdj_ams_zs');

--数据库的磁盘空间使用信息
EXEC sp_spaceused;

--日志文件占用大小
DBCC SQLPERF(LOGSPACE);

--指定数据库的文件组和文件空间占用大小
SELECT df.[name],
       df.physical_name,
       df.[size],
       df.growth,
       f.[name] [filegroup],
       f.is_default
FROM sys.database_files df
JOIN sys.filegroups f ON df.data_space_id = f.data_space_id;

--内存占用
SELECT *FROM sys.sysperfinfo WHERE counter_name LIKE '%Memory%';

--会话
EXEC sp_who;
EXEC sp_lock 
--查看数据库允许的最大连接
select @@MAX_CONNECTIONS
--查看数据库自上次启动以来的连接次数
SELECT @@CONNECTIONS
--关闭连接 kill 54

--用户信息
EXEC sp_helpsrvrolemember;


-- 数据库IO
SELECT  db.name AS 数据库,
        f.fileid AS 文件Id,
        f.filename AS 文件路径,
        i.num_of_reads AS 读取次数,
        i.num_of_bytes_read 读取总字节数,
        i.io_stall_read_ms '等待读取时间(毫秒)',
        i.num_of_writes AS 写入次数,
        i.num_of_bytes_written AS 写入总字节数,
        i.io_stall_write_ms AS '等待写入时间(毫秒)',
        i.io_stall AS 等待IO完成总时间,
        i.size_on_disk_bytes 磁盘占用字节数
FROM    sys.databases db
        INNER JOIN sys.sysaltfiles f ON db.database_id = f.dbid
        INNER JOIN sys.dm_io_virtual_file_stats(NULL,NULL) i ON i.database_id = f.dbid AND i.file_id = f.fileid;

--查询端口号
exec sys.sp_readerrorlog 0, 1, 'listening'

--SqlServer_查看SQLServer版本信息
SELECT @@VERSION

--查询哪些死锁 右键服务器->打开活动和监视器，，就可以看到监控的一些信息，阻塞信息，查询的耗时等
SELECT request_session_id spid, OBJECT_NAME( resource_associated_entity_id )
tableName FROM sys.dm_tran_locks WHERE resource_type = 'OBJECT'
--kill spid  --杀死进程


--数据库结构
SELECT d.name  AS 表名, 
isnull(f.value, '') AS 表说明, 
a.colorder AS 字段序号, 
a.name AS 字段名,ISNULL(g.[value], '') AS 字段说明, 
CASE WHEN COLUMNPROPERTY(a.id, a.name, 'IsIdentity') = 1 THEN '√' ELSE '' END AS 标识, 
CASE WHEN EXISTS(SELECT 1  FROM dbo.sysindexes si INNER JOIN 
dbo.sysindexkeys sik ON si.id = sik.id AND si.indid = sik.indid INNER JOIN dbo.syscolumns sc 
ON sc.id = sik.id AND sc.colid = sik.colid INNER JOIN  dbo.sysobjects so 
ON so.name = si.name AND so.xtype = 'PK' WHERE sc.id = a.id AND sc.colid = a.colid) THEN '√' ELSE '' END AS 主键, 
b.name AS 类型, a.length AS 长度, COLUMNPROPERTY(a.id, a.name, 'PRECISION')AS 精度, 
ISNULL(COLUMNPROPERTY(a.id, a.name, 'Scale'), 0) AS 小数位数,CASE WHEN a.isnullable = 1 THEN '√' ELSE '' END AS 允许空, 
ISNULL(e.text, '') AS 默认值 FROM dbo.syscolumns a LEFT OUTER JOIN   
dbo.systypes b ON a.xtype = b.xusertype INNER JOIN dbo.sysobjects d ON a.id = d.id AND d.xtype = 'U' AND  
d.status >= 0 LEFT OUTER JOIN   dbo.syscomments e ON a.cdefault = e.id LEFT OUTER JOIN sys.extended_properties g 
ON a.id = g.major_id AND a.colid = g.minor_id AND  g.name = 'MS_Description' LEFT OUTER JOIN  
sys.extended_properties f ON d.id = f.major_id AND f.minor_id = 0 AND f.name = 'MS_Description'

```
