---
# sidebar_position: 4
authors: [wengtx]
tags: [mssql, SQL Server,巡检,巡检模版]
---

# SQL server 数据库巡检模版(三)

``` text

1、系统信息

A. 机器名称：
B. 硬件配置：Intel(R) CPU E5-2630 2.3GHz(2处理器),24核,16G内存
C. 操作系统版本：Windows Server 2008 R2 X64 企业版 Windows NT 6.1 (Build 7600: )
D. 数据库版本：Microsoft SQL Server 2005 SP3- 9.00.4035.00 (X64)
E. 工作模式：Windows域模式，域为tict.com.cn
F. 数据库端口：1433
G. 业务系统：
H. 内存使用：物理内存16G，实际使用5.95G，设置了最大内存12G。

2、系统环境检查

A. 检查系统日志
a) 使用“事件查看器”，查看系统日志，关注错误信息排查错误。
检查结果：正常
b) 重点关注与SQLServer相关的日志信息。
检查结果：有比较多的SA账户登陆失败，需进一步排查。
c) 及时备份与清理过期的日志信息。
B. 检查磁盘空间
a) 有C、D、E三个盘符，系统文件在C盘上，数据文件和日志文件在D盘上。
b) 检查系统文件所在的磁盘空间使用情况
检查结果：正常 已用空间：43.7G，可用空间53.9G
c) 检查数据文件所在的磁盘空间使用情况
检查结果：正常 已用空间：8.62G，可用空间479G
d) 检查日志文件所在的磁盘空间使用情况
检查结果：正常 已用空间：8.62G，可用空间479G
e) 检查备份的磁盘空间使用情况
检查结果：单机运行，没有备份。

3、数据库性能巡检
检查项目 检查结果 指标说明
磁盘使用情况
PhysicalDisk-> AVG.Disk Aueue Length 正常 显示每一个磁盘的队列长度。不要选择_TOTAL对象，而是查看某驱动盘符的队列长度，如果参数值持续大于2，则可能影响性能。
PhysicalDisk-> AVG.Disk sec/Read 正常 显示每次读取的平均磁盘时间，理想情况下值小于10毫秒。
PhysicalDisk-> AVG.Disk sec/Write 正常 显示每次写入的平均磁盘时间，理想情况下值小于10毫秒。
SQL Serve Access Methods->Fullscans/sec 正常 显示每秒请求完全索引扫描或者全表扫描的数目，如果扫描频率每秒大于1，那么说明索引缺少或者索引比较差。
SQL Server Access Methods-> PageSplits/sec 正常 显示每秒页面拆分的次数。可以通过适当的索引维护或者好的填充因子来避免发生。
CPU使用情况 低于3%
System-> Processor Queue Length 正常 显示系统队列长度，如果平均值大于3，那么说明cpu存在瓶颈。
Processor->%Privilege Time 正常 显示操作系统内部操作所花费的时间
SQL Server: SQL Statistics->SQL Compilations/sec 正常 显示查询计划的编译次数。次数过高的话，说明可能未使用绑定变量导致计划重新编译，或者说重新编译次数比编译次数过高的话，那么说明存在应用上的瓶颈。
SQL Server: SQL Statistics->SQL Re-Compilations/sec 正常 显示查询计划的重编译次数。次数过高的话，说明可能未使用绑定变量导致计划重新编译，或者说重新编译次数比编译次数过高的话，那么说明存在应用上的瓶颈。
内存使用情况 5.95G
DBCC MEMORYSTATUS 正常 重点查看buffer counts部分:
其中committed memory和target memory最重要。
Committed memory表示sql server已经得到的内存数量
target memory表示有效运行所需的内存数量。
当两个存在差别过大，说明可能存在内存压力。
SQLServer:Buffer Manager-> Page Life Expectancy 正常 显示数据页在缓冲池中驻留的时间长度（单位是秒）。值越大，系统越健康。如果存在内存瓶颈，这个值会低于300s或者更少。
SQLServer:Buffer Manager-> Buffer cache hit ratio 正常 显示数据库内存命中率，所请求的数据或者说页面在缓冲池被找到的次数，如果很低说明内存不足，此值一般大于98%
SQLServer:Buffer Manager-> Stolen pages 正常 当这个指标与目标内存页面数比例较大时可能存在问题。
SQLServer:Buffer Manager->Memory Grants Pending 正常 显示等待内存授权的进程队列。这个指标值为0时理想状态。
SQLServer:Buffer Manager->Checkpoint pages/sec 正常 显示检查点操作每秒写入磁盘的脏页数目。如果这个值很高，说明缺少内存。
SQLServer:Buffer Manager-> Lazy writes/sec 正常 显示每秒将脏页从内存写到磁盘的次数。这个值应该尽可能接近0，当大于20或者更多，确信缓冲池不够。

4、数据库维护巡检

A. 主数据库（业务数据库）(查看数据文件和日志文件增长情况)
检查结果：正常 自动增长，每次增长10%，空间足够。
B. 镜像数据库
检查结果：单机数据库运行，没有配置镜像。
C. 辅助数据库(Log Shipping)
检查结果：单机数据库运行，没有配置日志传送(Log Shipping)。
D. 作业运行状况（通过图形界面“作业活动监视器”查看）
检查结果：没有作业，没有启动SQL Agent。
E. 备份状况（查看备份是否成功、验证备份集(RESTORE VERIFYONLY )、定期做数据库灾难恢复的演练-还原、HA）
检查结果：没有备份，也没有做双机热备HA。

5、总结及建议

 总结：

1.. 数据库性能：CPU消耗低，2%以下，内存充足，不到设置的最大内存12G的50%，硬盘空间也充足。

1. 数据库安全性：较多的SA登陆失败，可能是正常的密码输入错误引起，也可能涉及安全风险。

2. 数据库备份容灾：当前用户只是在同一个硬盘、同一个SQL实例里有多个数据库，但是没有做普通意义上的备份和容灾，存在数据丢失风险。

建议：

1. 进一步核实SA登陆失败的原因。

2. 数据库的备份很重要，建议做好物理备份，物理备份和源数据库文件不能位于同一个物理磁盘上，一般需要位于不同的物理服务器上。鉴于财务系统的重要性，有预算的话，建议采用性价比高的第三方DBTwin数据库集群软件(应用级双活、故障时数据零丢失、安装维护简单)。不建议采用第三方的双机热备或者第三方的容灾备份方案。

```
