---
sidebar_position: 1
---

# 格式化字符串位数，不足补零

本文举例在SQLSERVER中将1格式化为001的方法：

1、方法一SQL语句执行如下：

```sql
select right(1000 + 1,3) as col
```

2、方法二SQL语句执行如下：

```sql
select right(cast(power(10,3) as varchar) + 1,3) as col
```

下面是C#代码实现方法：

```csharp
int a = 1;
string str = a.ToString("000");
//或
string astr = a.ToString().PadLeft(3,'0');
```
