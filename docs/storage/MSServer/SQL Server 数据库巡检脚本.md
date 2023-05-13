---
sidebar_position: 4
authors: [wengtx]
tags: [mssql, SQL Server,巡检,数据库巡检脚本,脚本]
---

# SQL Server 数据库巡检脚本

``` SQL

--1.查看数据库版本信息
select @@version
--2.查看所有数据库名称及大小
exec sp_helpdb
--3.查看数据库所在机器的操作系统参数
exec master..xp_msver
--4.查看数据库启动的参数
exec sp_configure
--5.查看数据库启动时间
select convert(varchar(30),login_time,120)
from master..sysprocesses where spid=1
--6.查看数据库服务器名
select 'Server Name:'+ltrim(@@servername)
--7.查看数据库实例名
select 'Instance:'+ltrim(@@servicename) 
--8.数据库的磁盘空间呢使用信息
exec sp_spaceused
--9.日志文件大小及使用情况
dbcc sqlperf(logspace)
--10.表的磁盘空间使用信息
exec sp_spaceused 'tablename'
--11.获取磁盘读写情况
select 
@@total_read [读取磁盘次数],
@@total_write [写入磁盘次数],
@@total_errors [磁盘写入错误数],
getdate() [当前时间]
--12.获取I/O工作情况
select @@io_busy,
@@timeticks [每个时钟周期对应的微秒数],
@@io_busy*@@timeticks [I/O操作毫秒数],
getdate() [当前时间]
--13.查看CPU活动及工作情况
select
@@cpu_busy,
@@timeticks [每个时钟周期对应的微秒数],
@@cpu_busy*cast(@@timeticks as float)/1000 [CPU工作时间(秒)],
@@idle*cast(@@timeticks as float)/1000 [CPU空闲时间(秒)],
getdate() [当前时间]
--14.检查锁与等待
exec sp_lock
--15.检查死锁
exec sp_who_lock --自己写个存储过程即可
/*
create procedure sp_who_lock  
as  
begin  
    declare @spid int,@bl int,  
    @intTransactionCountOnEntry int,  
    @intRowcount int,  
    @intCountProperties int,  
    @intCounter int  
    create table #tmp_lock_who (id int identity(1,1),spid smallint,bl smallint)  
    IF @@ERROR<>0 RETURN @@ERROR  
    insert into #tmp_lock_who(spid,bl) select 0 ,blocked  
    from (select * from sys.sysprocesses where blocked>0 ) a   
    where not exists(select * from (select * from sys.sysprocesses where blocked>0 ) b   
    where a.blocked=spid)  
    union select spid,blocked from sys.sysprocesses where blocked>0  
    IF @@ERROR<>0 RETURN @@ERROR  
        -- 找到临时表的记录数  
        select @intCountProperties = Count(*),@intCounter = 1  
        from #tmp_lock_who  
    IF @@ERROR<>0 RETURN @@ERROR  
    if @intCountProperties=0  
    select '现在没有阻塞和死锁信息' as message  
    -- 循环开始  
    while @intCounter <= @intCountProperties  
    begin  
    -- 取第一条记录  
    select @spid = spid,@bl = bl  
    from #tmp_lock_who where id = @intCounter   
    begin  
    if @spid =0   
        select '引起数据库死锁的是: '+ CAST(@bl AS VARCHAR(10)) + '进程号,其执行的SQL语法如下'  
    else  
        select '进程号SPID：'+ CAST(@spid AS VARCHAR(10))+ '被' + '进程号SPID：'+ CAST(@bl AS VARCHAR(10)) +'阻塞,其当前进程执行的SQL语法如下'  
    DBCC INPUTBUFFER (@bl )  
    end  
    -- 循环指针下移  
    set @intCounter = @intCounter + 1  
    end  
    drop table #tmp_lock_who  
    return 0  
end   
*/
 
--16.用户和进程信息
exec sp_who
exec sp_who2
 
--17.活动用户和进程的信息
exec sp_who 'active'
 
--18.查看进程中正在执行的SQL
dbcc inputbuffer(进程号)
exec sp_who3
/*
CREATE PROCEDURE sp_who3 ( @SessionID INT = NULL )
AS 
    BEGIN
        SELECT  SPID = er.session_id ,
                Status = ses.status ,
                [Login] = ses.login_name ,
                Host = ses.host_name ,
                BlkBy = er.blocking_session_id ,
                DBName = DB_NAME(er.database_id) ,
                CommandType = er.command ,
                SQLStatement = st.text ,
                ObjectName = OBJECT_NAME(st.objectid) ,
                ElapsedMS = er.total_elapsed_time ,
                CPUTime = er.cpu_time ,
                IOReads = er.logical_reads + er.reads ,
                IOWrites = er.writes ,
                LastWaitType = er.last_wait_type ,
                StartTime = er.start_time ,
                Protocol = con.net_transport ,
                ConnectionWrites = con.num_writes ,
                ConnectionReads = con.num_reads ,
                ClientAddress = con.client_net_address ,
                Authentication = con.auth_scheme
        FROM    sys.dm_exec_requests er
                OUTER APPLY sys.dm_exec_sql_text(er.sql_handle) st
                LEFT JOIN sys.dm_exec_sessions ses ON ses.session_id = er.session_id
                LEFT JOIN sys.dm_exec_connections con ON con.session_id = ses.session_id
        WHERE   er.session_id > 50
                AND @SessionID IS NULL
                OR er.session_id = @SessionID
        ORDER BY er.blocking_session_id DESC ,
                er.session_id 
    END
*/
 
--19.查看所有数据库用户登录信息
exec sp_helplogins 
 
--20.查看所有数据库用户所属的角色信息
exec sp_helpsrvrolemember
 
--21.查看链接服务器
exec sp_helplinkedsrvlogin
 
--22.查看远端数据库用户登录信息
exec sp_helpremotelogin
 
--23.获取网络数据包统计信息
select 
@@pack_received [输入数据包数量],
@@pack_sent [输出数据包数量],
@@packet_errors [错误包数量],
getdate() [当前时间]
 
--24.检查数据库中的所有对象的分配和机构完整性是否存在错误
dbcc checkdb
 
--25.查询文件组和文件
select 
	df.[name],df.physical_name,df.[size],df.growth, 
	f.[name][filegroup],f.is_default 
from sys.database_files df join sys.filegroups f 
on df.data_space_id = f.data_space_id 
 
--26.查看数据库中所有表的条数
select  b.name as tablename ,  
        a.rowcnt as datacount  
from    sysindexes a ,  
        sysobjects b  
where   a.id = b.id  
        and a.indid < 2  
        and objectproperty(b.id, 'IsMSShipped') = 0 
 
--27.得到最耗时的前10条T-SQL语句
;with maco as   
(     
    select top 10  
        plan_handle,  
        sum(total_worker_time) as total_worker_time ,  
        sum(execution_count) as execution_count ,  
        count(1) as sql_count  
    from sys.dm_exec_query_stats group by plan_handle  
    order by sum(total_worker_time) desc  
)  
select  t.text ,  
        a.total_worker_time ,  
        a.execution_count ,  
        a.sql_count  
from    maco a  
        cross apply sys.dm_exec_sql_text(plan_handle) t 
 
--28. 查看SQL Server的实际内存占用
select * from sysperfinfo where counter_name like '%Memory%'
 
 
--29.显示所有数据库的日志空间信息
dbcc sqlperf(logspace)
 
--30.收缩数据库
dbcc shrinkdatabase(databaseName)

```
