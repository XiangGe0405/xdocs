---
sidebar_position: 2
authors: [wengtx]
tags: [mssql, SQL Server,死锁]
---

# SQL SERVER 查看近期死锁

在项目运行的过程中，死锁不可能完全避免，但要尽可能减少死锁的出现，

产生死锁的原因主要是：
1，系统资源不足。
2，进程运行推进的顺序不合适。
3，资源分配不当等。

产生死锁的四个必要条件：

- 互斥条件：一个资源每次只能被一个进程使用，即在一段时间内某资源仅为一个进程所占有。此时若有其他进程请求该资源，则请求进程只能等待。

- 请求与保持条件：进程已经保持了至少一个资源，但又提出了新的资源请求时，该资源已被其他进程占有，此时请求进程被阻塞，但对自己已获得的资源保持不放。

- 不可剥夺条件:已经分配的资源不能从相应的进程中被强制地剥夺。

- 循环等待条件: 系统中若干进程组成环路，该环路中每个进程都在等待相邻进程正占用的资源。

这四个条件是死锁的必要条件，只要系统发生死锁，这些条件必然成立，而只要上述条件之一不满足，就不会发生死锁。

排查死锁是有哪个SQL导致的，死锁产生后即消失，很难让用户重现死锁问题，虽然可以从日志中分析死锁，但非常繁琐，可以利用下面的SQL SERVER 扩展事件，查询历史死锁，查询原因：

``` sql
DECLARE @SessionName SysName 
 
SELECT @SessionName = 'system_health'
 
 
IF OBJECT_ID('tempdb..#Events') IS NOT NULL BEGIN
    DROP TABLE #Events
END
 
DECLARE @Target_File NVarChar(1000)
    , @Target_Dir NVarChar(1000)
    , @Target_File_WildCard NVarChar(1000)
 
SELECT @Target_File = CAST(t.target_data as XML).value('EventFileTarget[1]/File[1]/@name', 'NVARCHAR(256)')
FROM sys.dm_xe_session_targets t
    INNER JOIN sys.dm_xe_sessions s ON s.address = t.event_session_address
WHERE s.name = @SessionName  AND t.target_name = 'event_file'
 
SELECT @Target_Dir = LEFT(@Target_File, Len(@Target_File) - CHARINDEX('\', REVERSE(@Target_File))) 
 
SELECT @Target_File_WildCard = @Target_Dir + '\'  + @SessionName + '_*.xel'
 
--Keep this as a separate table because it's called twice in the next query.  You don't want this running twice.
SELECT DeadlockGraph = CAST(event_data AS XML)
    , DeadlockID = Row_Number() OVER(ORDER BY file_name, file_offset)
INTO #Events
FROM sys.fn_xe_file_target_read_file(@Target_File_WildCard, null, null, null) AS F
WHERE event_data like '<event name="xml_deadlock_report%';

WITH Victims AS
(
    SELECT VictimID = Deadlock.Victims.value('@id', 'varchar(50)')
        , e.DeadlockID 
    FROM #Events e
        CROSS APPLY e.DeadlockGraph.nodes('/event/data/value/deadlock/victim-list/victimProcess') as Deadlock(Victims)
)
, DeadlockObjects AS
(
    SELECT DISTINCT e.DeadlockID
        , ObjectName = Deadlock.Resources.value('@objectname', 'nvarchar(256)')
    FROM #Events e
        CROSS APPLY e.DeadlockGraph.nodes('/event/data/value/deadlock/resource-list/*') as Deadlock(Resources)
)

SELECT *
FROM
(
    SELECT e.DeadlockID
        , TransactionTime = Deadlock.Process.value('@lasttranstarted', 'datetime')
        , DeadlockGraph
        , DeadlockObjects = substring((SELECT (', ' + o.ObjectName)
                            FROM DeadlockObjects o
                            WHERE o.DeadlockID = e.DeadlockID
                            ORDER BY o.ObjectName
                            FOR XML PATH ('')
                            ), 3, 4000)
        , Victim = CASE WHEN v.VictimID IS NOT NULL 
                            THEN 1 
                        ELSE 0 
                        END
        , SPID = Deadlock.Process.value('@spid', 'int')
        , ProcedureName = Deadlock.Process.value('executionStack[1]/frame[1]/@procname[1]', 'varchar(200)')
        , LockMode = Deadlock.Process.value('@lockMode', 'char(1)')
        , Code = Deadlock.Process.value('executionStack[1]/frame[1]', 'varchar(1000)')
        , ClientApp = CASE LEFT(Deadlock.Process.value('@clientapp', 'varchar(100)'), 29)
                        WHEN 'SQLAgent - TSQL JobStep (Job '
                            THEN 'SQLAgent Job: ' + (SELECT name FROM msdb..sysjobs sj WHERE substring(Deadlock.Process.value('@clientapp', 'varchar(100)'),32,32)=(substring(sys.fn_varbintohexstr(sj.job_id),3,100))) + ' - ' + SUBSTRING(Deadlock.Process.value('@clientapp', 'varchar(100)'), 67, len(Deadlock.Process.value('@clientapp', 'varchar(100)'))-67)
                        ELSE Deadlock.Process.value('@clientapp', 'varchar(100)')
                        END 
        , HostName = Deadlock.Process.value('@hostname', 'varchar(20)')
        , LoginName = Deadlock.Process.value('@loginname', 'varchar(20)')
        , InputBuffer = Deadlock.Process.value('inputbuf[1]', 'varchar(1000)')
    FROM #Events e
        CROSS APPLY e.DeadlockGraph.nodes('/event/data/value/deadlock/process-list/process') as Deadlock(Process)
        LEFT JOIN Victims v ON v.DeadlockID = e.DeadlockID AND v.VictimID = Deadlock.Process.value('@id', 'varchar(50)')
) X
ORDER BY DeadlockID DESC
```
