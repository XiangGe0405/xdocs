---
# sidebar_position: 4
authors: [wengtx]
tags: [mssql, SQL Server,MD5,加密]
---

# SQLSERVER md5加密

``` sql
  SELECT SUBSTRING(sys.fn_sqlvarbasetostr(HASHBYTES('MD5',CAST('123456' AS VARCHAR(32)))),3,32)
```
