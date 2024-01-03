---
title: random
date: 2023-09-07 14:05:55
uuid: 6d194603-86cb-11ee-b04c-f58259a2146b
sticky:
---

## 随机数模块

python 的 random 模块

1. `random.random()`
    
    生成一个0-1之间的浮点数，闭区间
        
    <!-- more -->
    
2. `random.uniform(a, b)`
    
    生成一个指定范围内的浮点数，闭区间

3. `random.randint(a, b)`
    
    生成一个指定范围内的整数，闭区间
    
4. `random.randrange([start], stop, [step])`
    
    从指定范围中，按指定基数递增的集合中获取一个随机数。参数必须为整数，start默认为0，step默认为1，所以，写单个参数时，最小是1
    
5. `random.choice(sequence)`
    
    从序列中获取一个随机元素，参数sequence表示一个有序类型，泛指一系列类型，如list,tuple,字符串
    
6. `random.shuffle(x, [random])`
    
    将列表中的元素随机排列
    
7. `random.sample(sequence, k)`
    
    从指定序列中随机获取指定长度的片段。sample函数不会修改原有的序列

