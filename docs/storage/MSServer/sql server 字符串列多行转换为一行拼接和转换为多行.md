---
sidebar_position: 2
authors: [wengtx]
tags: [mssql, SQL Server,RAND()]
---

# SQL SERVER 字符串列多行转换为一行拼接和转换为多行

## 拼接

``` SQL

--STUFF：从位置1开始，截取1个字符串，替换为'',目的去除第一个逗号
--FOR XML PATH('')：行转列拼接字符串
STUFF((SELECT distinct ',' + aa.Customer FROM BC_OutQAReport aa  FOR XML PATH('')), 1, 1, '')  as Customer 

```

## 转多行

```SQL

 declare @Customer nvarchar(100)
 set @Customer='CH,KH,MK,BB'
 select @Customer
 SELECT B.id,B.typeid  
    FROM   (  
                SELECT [value] = CONVERT(XML, '<v>' + REPLACE(@Customer,',', '</v><v>') + '</v>')  
            ) A  
            OUTER APPLY(  
        SELECT id = N.v.value('.', 'nvarchar(100)'),typeid=1
        FROM   A.[value].nodes('/v') N(v)  
    ) B  

```
