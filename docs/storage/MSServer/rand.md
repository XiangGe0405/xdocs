---
sidebar_position: 2
authors: [wengtx]
tags: [mssql, SQL Server,RAND()]
---

# 获取随机数

```text
比较 CEILING 和 FLOOR
CEILING 函数返回大于或等于所给数字表达式的最小整数。FLOOR 函数返回小于或等于所给数字表达式的最大整数。
例如，对于数字表达式 12.9273，CEILING 将返回 13，FLOOR 将返回 12。FLOOR 和 CEILING 返回值的数据类型都与输入的数字表达式的数据类型相同。
```

随机小数

```sql
SELECT RAND()

0.8342308279445682
```

随机0-99之间的整数

```sql
SELECT CAST(FLOOR(RAND() * 100 ) AS INT )
```

随机1-100之间的整数

```sql
select cast(ceiling(rand() * 100) as int)
```

随机整数

```sql
# 100内
SELECT floor(rand()*100)

85
# 1000内
SELECT floor(rand()*1000)

923
```

随机一位数字，保留两位小数

```sql
SELECT ROUND(RAND()*10,2)
```

随机两位数字，保留两位小数

```sql
SELECT ROUND(RAND()*100,2)

92.33
```

UUID
默认带横线（36位），形如`abaffaca-fd55-11e5-b3d0-d2c510923c15`

```sql
SELECT UUID()
```

生成32位不带横线UUID

```sql
SELECT REPLACE(UUID(),'-','')
```

字符串拼接

```sql
SELECT CONCAT('测试_',REPLACE(UUID(),'-',''))
```
