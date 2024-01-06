---
title: collections
date: 2023-09-07 14:05:49
uuid: 6d194601-86cb-11ee-b04c-f58259a2146b
sticky:
---


## collections介绍

**collections** 作为 Python 的内建集合模块，实现了许多十分高效的特殊容器数据类型，即除了 Python 通用内置容器： dict、list、set 和 tuple 等的替代方案。其中常见的类/函数如下：

<!-- more -->

| 名称 | 功能 |
| --- | --- |
| Counter | 用于计算 hashable 对象的 dict 子类 (可哈希对象计数) |
| OrderedDict | 记住元素添加顺序的 dict 子类 (有序字典) |
| namedtuple | 用于创建具有命名字段的 tuple 子类的 factory 函数 (具名元组) |
| defaultdict | dict 子类调用 factory 函数来提供缺失值 |
| deque | 类似 list 的容器，两端都能实现快速 append 和 pop (双端队列) |
| ChainMap | 类似 dict 的类，用于创建多个映射的单视图 |
| UserDict | 包装 dict 对象以便于 dict 的子类化 |
| UserList | 包装 list 对象以便于 list 的子类化 |
| UserString | 包装 string 对象以便于 string 的子类化 |

{% note info %}
😎总结：最常用的可能是 `Counter` 和 `OrderedDict` 以及 `defaultdict`
{% endnote %}


## Counter

Counter，顾名思义是一个 计数器。Counter 类作为一个无序的容器类型，以字典的 key-value 对形式存储元素，旨在统计各元素 (哈希项) 出现的次数。具体而言，key 表示元素，value 表示各元素 key 出现的次数，可为任意整数 (即包括0与负数)。Counter 类有时被称为 bags 或 multisets 。我们在 IDLE 通过 help(collections.Counter) 可查看帮助文档。

在 Python 3.7 版更新后，作为 dict 的子类，Counter 继承了记住插入顺序的功能。 Counter 对象进行数学运算时同样会保持顺序。 结果会先按每个元素在运算符左边的出现时间排序，然后再按其在运算符右边的出现时间排序。

### 创建 Counter 对象

实例化 Counter 的常见方式为：

```python
## 导入 Counter 类
>>> from collections import Counter  # class collections.Counter([iterable-or-mapping])
 
>>> hashmap1 = Counter()  # a new, empty counter
>>> hashmap1
Counter()
 
## 通过可迭代对象、映射和关键字参数等实例化 Counter 对象
>>> hashmap2 = Counter('happy')  # a new counter from an iterable
>>> hashmap2
Counter({'p': 2, 'h': 1, 'a': 1, 'y': 1})
 
>>> hashmap3 = Counter(['A', 'A', 'K', 4, 7, 7])  # a new counter from an iterable
>>> hashmap3
Counter({'A': 2, 'K': 1, 4: 1, 7: 2})
 
>>> hashmap4 = Counter(('M', 'M', 4, 'A', 1, 1))  # a new counter from an iterable
>>> hashmap4
Counter({'M': 2, 4: 1, 'A': 1, 1: 2})
 
>>> hashmap5 = Counter({'x':1, 'y':2})  # a new counter from a mapping
>>> hashmap5
Counter({'y': 2, 'x': 1})
 
>>> hashmap6 = Counter(kangkang=1, daming=2, sam=3)  # a new counter from keyword args
>>> hashmap6
Counter({'sam': 3, 'daming': 2, 'kangkang': 1})
 
# 类型检查
>>> type(hashmap1), type(hashmap2), type(hashmap3), type(hashmap4), type(hashmap5), type(hashmap6)
(<class 'collections.Counter'>, <class 'collections.Counter'>, <class 'collections.Counter'>, <class 'collections.Counter'>, <class 'collections.Counter'>), <class 'collections.Counter'>)
```

可见元素从一个 iterable 被计数或从其他的 mapping (or counter) 实现初始化。

### 数值访问(键-值索引)

Counter 对象类似于 dict 接口，也通过 key 索引访问 value，但注意返回的 value 表示的是 key 的计数值：

```python
>>> hashmap2['p']  # hashmap2 = Counter({'p': 2, 'h': 1, 'a': 1, 'y': 1})
2
 
>>> hashmap3['A']  # hashmap3 = Counter({'A': 2, 'K': 1, 4: 1, 7: 2})
2
 
>>> hashmap4['M']  # hashmap4 = Counter({'M': 2, 4: 1, 'A': 1, 1: 2})
2
 
>>> hashmap5['x']  # hashmap5 = Counter({'y': 2, 'x': 1})
1
```

而当访问的 key 不存在时，返回 0 而非 KeyError：

```python
# count of a missing element is zero
>>> hashmap2[6]  # hashmap2 = Counter({'p': 2, 'h': 1, 'a': 1, 'y': 1})
0
>>> hashmap3[6]  # hashmap3 = Counter({'A': 2, 7: 2, 'K': 1, 4: 1})
0
>>> hashmap4[6]  # hashmap4 = Counter({'M': 2, 1: 2, 4: 1, 'A': 1})
0
>>> hashmap5[6]  # hashmap5 = Counter({'y': 2, 'x': 1})
0
```

作为 dict 的子类，通过 Counter.keys()、Counter.values()、Counter.items() 访问键-值对仍然适用：

```python
# 以 hashmap2 为例
>>> hashmap2 = Counter('happy')
>>> hashmap2 
Counter({'p': 2, 'h': 1, 'a': 1, 'y': 1})
 
>>> hashmap2.keys()
dict_keys(['h', 'a', 'p', 'y'])
>>> type(hashmap2.keys())
<class 'dict_keys'>
 
>>> hashmap2.values()
dict_values([1, 1, 2, 1])
>>> type(hashmap2.values())
<class 'dict_values'>
 
>>> hashmap2.items()
dict_items([('h', 1), ('a', 1), ('p', 2), ('y', 1)])
>>> type(hashmap2.items())
<class 'dict_items'>
```

注意，原地操作如 hashmap[key] += 1，值类型只支持加和减，故分数、小数、十进制甚至负值都适用。

### 元素删除 (键-值对删除)

对于 Counter 对象的元素删除应使用内置函数`del`，而令 value=0 是不能删除元素(键-值对)的。

```python
# 以 hashmap2 为例
>>> hashmap2 = Counter('happy')
>>> hashmap2 
Counter({'p': 2, 'h': 1, 'a': 1, 'y': 1})
 
>>> hashmap2['y'] = 0
>>> hashmap2
Counter({'p': 2, 'h': 1, 'a': 1, 'y': 0})  # 'y' 还在, 只是 value=0 而已
 
>>> del hashmap2['y']
>>> hashmap2
Counter({'p': 2, 'h': 1, 'a': 1})  # 'y' 被删除了
```

### update() / subtract() —— 元素更新 (键-值对增减)****

可以使用另外的 iterable 对象或 Counter 对象实现对原 Counter 对象的元素更新 (键-值对增减)。其中，元素增加使用 Counter.update(*iterable-or-mapping*) 方法：

```python
## 以 hashmap2 为例, 其余同理
>>> hashmap2 = Counter('happy')
>>> hashmap2 
Counter({'p': 2, 'h': 1, 'a': 1, 'y': 1})
 
## 用 iterable 对象更新
>>> hashmap2.update('hp')  # 用 string 更新 (iterable 对象)
>>> hashmap2
Counter({'p': 3, 'h': 2, 'a': 1, 'y': 1})  
 
>>> hashmap2.update(['a','y'])  # 用 list 更新 (iterable 对象)
>>> hashmap2
Counter({'p': 3, 'h': 2, 'a': 2, 'y': 2})
 
>>> hashmap2.update(('a'))  # 用 tuple 更新 (iterable 对象)
>>> hashmap2
Counter({'a': 3, 'p': 3, 'h': 2, 'y': 2})
 
## 用 mapping 对象更新
>>> hashmap2.update({'h':1, 'y':1})  # 用 dict 更新 (mapping 对象)
>>> hashmap2
Counter({'h': 3, 'a': 3, 'p': 3, 'y': 3})
 
## 用 Counter 对象更新
>>> hashmap2.update(Counter('hapy'))
>>> hashmap2
Counter({'h': 4, 'a': 4, 'p': 4, 'y': 4})
```

注意，元素的添加来自 iterable 对象计数元素，或另一个 mapping 对象 (或 Counter 对象) ，其中 iterable 对象应为序列 sequence 元素。

同理，元素减少使用 Counter.subtract(iterable-or-mapping) 方法，但注意元素的计数 —— value 为 0 和 负数都是允许的：

```python
# 以 hashmap2 为例, 其余同理
>>> hashmap2 = Counter('happy')
>>> hashmap2 
Counter({'p': 2, 'h': 1, 'a': 1, 'y': 1})
 
# 用 iterable 对象更新元素
>>> hashmap2.subtract('p')  # 用 string 更新
>>> hashmap2
Counter({'h': 1, 'a': 1, 'p': 1, 'y': 1}) 
 
>>> hashmap2.subtract(['p'])  # 用 list 更新
>>> hashmap2
Counter({'h': 1, 'a': 1, 'p': 0, 'y': 1})  # 允许 value <= 0
 
>>> hashmap2.subtract(('p'))  # 用 tuple 更新
>>> hashmap2
Counter({'h': 1, 'a': 1, 'y': 1, 'p': -1})  # 允许 value <= 0
 
## 用 mapping 对象更新
>>> hashmap2.subtract({'h':2})  # 用 dict 更新
>>> hashmap2
Counter({'a': 1, 'y': 1, 'h': -1, 'p': -1})  # 允许 value <= 0
 
## 用 Counter 对象更新
>>> hashmap2.update(Counter('ay'))
>>> hashmap2
Counter({'a': 0, 'y': 0, 'h': -1, 'p': -1})
```

可见使用 iterable 对象更新原 Counter 对象之前，都会被隐式地转换为 Counter 对象，再把元素更新到原 Counter 对象上。

### elements() —— 元素全部列出

Counter.elements() 方法将返回一个迭代器。元素的计数有多少，在该迭代器中就包含多少个该元素。~~元素排列无确定顺序~~元素按首次出现的顺序返回，且不含 value<= 0 的元素。

```python
>>> hashmap7 = Counter('happy')
>>> hashmap7
Counter({'p': 2, 'h': 1, 'a': 1, 'y': 1})
 
>>> hashmap7.elements()          # 返回迭代器
<itertools.chain object at 0x00000249719226A0>
 
>>> list(hashmap7.elements())    # 显式类型转换
['h', 'a', 'p', 'p', 'y']
 
>>> tuple(hashmap7.elements())   # 显式类型转换
('h', 'a', 'p', 'p', 'y')
 
>>> str(hashmap7.elements())     # 那是不可能的...
'<itertools.chain object at 0x0000024971125390>'
 
>>> sorted(hashmap7.elements())  # 隐式类型转换
['a', 'h', 'p', 'p', 'y']
```

### most_common() —— 元素按出现频数从大到小列出

Counter.most_common([n]) 方法将返回一个 list，其中包含前 n 个出现频数最高的元素及其出现次数，并从大到小排列。 若 n 被省略或为 None，most_common()  将返回 Counter 对象中的所有元素。若元素计数值相等，则按首次出现的顺序排序：

```python
>>> hashmap8 = Counter(x=3, y=2, z=1, h=2)
>>> hashmap8
Counter({'x': 3, 'y': 2, 'h': 2, 'z': 1})
 
>>> hashmap8.most_common(1)  # n=1
[('x', 3)]
>>> hashmap8.most_common(2)  # n=2
[('x', 3), ('y', 2)]
>>> hashmap8.most_common(3)  # n=3
[('x', 3), ('y', 2), ('h', 2)]
>>> hashmap8.most_common(4)  # n=4
[('x', 3), ('y', 2), ('h', 2), ('z', 1)]  # 'y' 与 'h' 出现频次均为 2, 但 'y' 先出现, 故前排
 
>>> hashmap8.most_common()  # n ignored
[('x', 3), ('y', 2), ('h', 2), ('z', 1)]  # 全排：从大到小
>>> hashmap8.most_common()[::-1]  # n ignored
[('z', 1), ('h', 2), ('y', 2), ('x', 3)]  # 全排：从小到大
```

### 算术与集合运算

有几个常用的数学运算操作：

```python
>>> h1 = Counter(x=1, y=2)
>>> h2 = Counter(x=2, y=1)
>>> h3 = Counter(x=1, y=-1)
 
>>> h1 + h2
Counter({'x': 3, 'y': 3})  # 按元素相加
>>> h2 + h3
Counter({'x': 3})  # value <= 0 的会被删除
 
>>> h1 - h2
Counter({'y': 1})  # 按元素相减
>>> h1 - h3
Counter({'y': 3})  # value <= 0 的会被删除
 
>>> h1 & h2
Counter({'x': 1, 'y': 1})  # 按元素取 min() (交集)
 
>>> h1 | h2
Counter({'x': 2, 'y': 2})  # 按元素取 max() (并集)
```

还有单目加和减 (一元操作符) 及其等价形式：

```python
>>> hashmap9 = Counter(a=2, b=1, c=0, d=-1)
 
>>> +hashmap9
Counter({'a': 2, 'b': 1})  # 去除 value<=0 的元素
 
>>> -hashmap9
Counter({'d': 1})  # 去除 value>=0 的元素
 
>>> hashmap9 += Counter()  
>>> hashmap9
Counter({'a': 2, 'b': 1})  # 去除 value<=0 的元素
```

### 常用操作范例

```python
>>> hashmap8 = Counter(x=3, y=2, z=1, h=2)
>>> hashmap8
Counter({'x': 3, 'y': 2, 'h': 2, 'z': 1})
 
## 对 Counter 对象的 value 求和
>>> sum(hashmap8.values())  
8
 
## 从小到大排序
>>> hashmap8.most_common()[::-1]
[('z', 1), ('h', 2), ('y', 2), ('x', 3)]  
 
## 类型转换
>>> list(hashmap8)
['x', 'y', 'z', 'h']  # 将 Counter 对象的 key 转换为 list
>>> tuple(hashmap8)
('x', 'y', 'z', 'h')  # 将 Counter 对象的 key 转换为 tuple
>>> set(hashmap8)
{'z', 'y', 'x', 'h'}  # 将 Counter 对象的 key 转换为 set
>>> dict(hashmap8)
{'x': 3, 'y': 2, 'z': 1, 'h': 2}  # 将 Counter 对象的转换为 dict
 
## 去除 value <= 0 的元素
>>> hashmap9 = Counter(a=2, b=1, c=0, d=-1)
>>> hashmap9
Counter({'a': 2, 'b': 1, 'c': 0, 'd': -1})
 
>>> hashmap9 += Counter()  
>>> hashmap9
Counter({'a': 2, 'b': 1})
```


## namedtuple

### 内建元组局限

内建元组 tuple 存在一个局限: **不能为 tuple 中的元素命名**，tuple 所要表达的意义并不明显。

引入工厂函数 (factory function) `collections.namedtuple`，以构造一个带字段名的 tuple。

- **具名元组**(namedtuple) 和 **普通元组**(tuple) **消耗的内存一样多** (因为字段名都被保存在对应的类中) 但却**更具可读性** (namedtuple 使 tuple 变成自文档，根据字段名很容易理解用途)，令代码更易维护.
- 同时，namedtuple **不用命名空间字典(namespace dictionary)** (**dict**) 来存放/维护实例属性，故**比普通 dict 更加轻量和快速**。但注意，具名元组 namedtuple 继承自 tuple ，其中的**属性均不可变**.

### 用法

> **`collections.namedtuple(*typename*, *field_names*, ***, *verbose=False*, *rename=False*, *module=None*)`**
> 

**namedtuple** 名称为参数`typename`，各字段名称为参数`field_names`，它返回一个tuple子类

其中，`field_names`既可以是一个类似 ['x', 'y'] 的字符串序列 (string-seq)，也可以是用空格或逗号分隔开的纯字符串 string，如 'x y' 或 'x, y'。任何 Python 的有效标识符都可作为字段名。所谓有效标识符由字母，数字，下划线组成，但首字母不能是数字或下划线，且不能与 Python 关键词重复，如 class, for, return 等。

具名元组 namedtuple 向后兼容普通 tuple，可通过 **`field_names`** 获取元素值/字段值，也能**通过索引和迭代获取**元素值/字段值。

```python
>>> from collections import namedtuple
 
# Point = namedtuple("Point", 'x, y')  # 等价的初始化方式
# Point = namedtuple("Point", 'x y')   # 等价的初始化方式
>>> Point = namedtuple("Point", ['x', 'y'])  # 初始化一个具名元组 Point
>>> Point
<class '__main__.Point'>
# -------------------------------------------------------------------------
>>> p1 = Point(2, 3)  # 实例化一个具名元组 Point 对象 p1
>>> p1                # 可读 (readable __repr__ with a name=value style)
Point(x=2, y=3)
# -------------------------------------------------------------------------
>>> p1.x   # 通过字段名获取元素值/字段值 (fields also accessible by name)
2
>>> p1[0]  # 通过索引获取元素值/字段值 (indexable like the plain tuple (2, 3))
2
>>> for i in p1:  # 通过迭代获取元素值/字段值
	print(i)
2
3
# -------------------------------------------------------------------------
>>> a, b = p1  # 能够像普通 tuple 一样解绑 (unpack like a regular tuple)
>>> a, b
(2, 3)
```

### 方法和属性

除继承普通 tuple，具名元组 nametuple 还额外支持三个方法和两个属性。为防止名称冲突，方法和属性以下划线开始：

- 类属性 **_fields**：包含本类所有字段名的元组 tuple
- 类方法 **_make(iterable)**：接受一个序列 sequence 或可迭代对象 iterable 来生成本类的实例
- 实例方法 **_replace(**kwargs)**：基于本实例修改、替换元素来生成本类的实例
- 实例方法 **_asdict()**：将具名元组以 collections.OrdereDict 的形式返回，用于友好地展示元组信息
- 实例方法 **_source**：略...

```python
>>> from collections import namedtuple
 
>>> Point2 = namedtuple("Point2", 'x, y')  # 初始化一个具名元组对象 Point2
>>> p2 = Point2(1, 4)
>>> p2
Point2(x=1, y=4)
# -------------------------------------------------------------------------
>>> p2._fields  # 获取所有字段名构成的 tuple
('x', 'y')
# -------------------------------------------------------------------------
>>> p21 = p2._make([5, 6])  # 使用 list 实例化一个新 Point2 对象
>>> p21
Point2(x=5, y=6)
>>> p2
Point2(x=1, y=4)  # 原 namedtuple 不变
# -------------------------------------------------------------------------
>>> p22 = p2._replace(y=4.5)  # 使用关键字参数修改并实例化一个新 Point2 对象
>>> p22
Point2(x=1, y=4.5)
>>> p2
Point2(x=1, y=4)  # 原 namedtuple 不变
# -------------------------------------------------------------------------
>>> p2._asdict()  # 将 namedtuple 对象转换为 OrderedDict 对象
OrderedDict([('x', 1), ('y', 4)])
>>> p2
Point2(x=1, y=4)  # 原 namedtuple 不变
```

注意，上述方法 **均非“原地操作” (in-place) 方法**，因为 **tuple / namedtuple 是不可变对象**！只能创建新的。

若参数 `rename=True`，无效字段名 field_names  会自动转换成位置名。例如 ['abc',  'def',  'ghi',  'abc'] 转换成 ['abc',  '_1',  'ghi',  '_3']，转换并消除了关键词 def 和重复域名 abc。否则，在创建伊始就会抛出 ValueError。

```python
>>> Point3 = namedtuple("Point3", ['abc', 'def', 'ghi', 'abc'], rename=True)
>>> p3 = Point3(3, 5, 7, 9)
>>> p3._fields
('abc', '_1', 'ghi', '_3')
>>> p3
Point3(abc=3, _1=5, ghi=7, _3=9)
```

此外，将 dict 转换为 namedtuple 可使用双星操作符 `**` (double-star-operator) 进行解包实现：

```python
>>> dict4 = {'x':14, 'y':16}
>>> Point4 = namedtuple("Point4", 'x y')
>>> p4 = Point4(**dict4)
>>> p4
Point4(x=14, y=16)
```


## deque

{%asset_img collections_1.webp%}
{%cq%}
双端队列
{%endcq%}

> **`collections.deque([*iterable*[, *maxlen*]])`**
> 

Deque 是 **double-ended-queue** 的缩写，意为**双端队列**。输入 **可迭代对象 iterable** 并返回一个新的双端队列对象。若不指定可迭代对象  iterable，则返回的双端队列对象为空。

Deque 可以从队列 **两端添加 (append)** 和 **弹出 (pop)** 元素，且两个方向的 **时间复杂度均为 O(1)** 。虽然 list 对象也支持类似操作，但 list 在开头插入 insert(0, item) 或弹出 (pop(0)) 元素的时间复杂度均为 O(n)。

若可选参数 maxlen 未指定或为 None，deque 将成为**任意长度**的双端队列。否则， **maxlen就是限定最大长度**，将构造一个固定大小的双端队列。当 deque 元素已满且有新元素从一端“入队”时，数量相同的旧元素将从另一端“出队” (被移除)。

### 方法速查表

| 形式 | 说明 |
| --- | --- |
| append(x) | 从 deque 最右端加入元素 x |
| appendleft(x) | 从 deuqe 最左端加入元素 x |
| extend(iterable) | 使用可迭代对象 iterbale 中的元素扩展 deque 右端 |
| extendleft(iterable) | 使用可迭代对象 iterbale 中的元素扩展 deque 左端 |
| insert(i, x) | 在 index=i 的位置插入元素 x (若导致 deque 长度超过 maxlen，引发 IndexError) |
| pop() | 弹出 deque 最右端的一个元素 (若无元素引发 IndexError) |
| popleft() | 弹出 deque 最左端的一个元素 (若无元素引发 IndexError) |
| remove(x) | 移除从左到右找到的第一个 x (若无 x 引发 ValueError) |
| clear() | 清空 deque 中的所有元素，使之为空 deque (长度归0) |
| copy() | 创建一份当前 deque 的浅拷贝 |
| count(x) | 计算 deque 中 x 的个数 |
| index(x[, start[, stop]]) | 返回在 [start, stop] 之间从左到右找到的第一个 x 的 index (未找到引发 ValueError) |
| reverse() | 将当前 deque 逆序排列，返回 None |
| rotate(n=1) | n 为正数向右循环移动 n 步，n 为负数向左循环移动 n 步，若 deque 非空，向右循环移动 1 步等价于 d.appendleft(d.pop())向左循环移动 1 步等价于d.append(d.popleft()) |

此外，deque 还支持索引、迭代、清洗 以及 len(d)、reversed(d)、copy.copy(d)、copy.deepcopy(d) 等内建函数通用操作，支持用 in 成员测试操作符。deque 两端的索引增、删、改复杂度是 O(1)，在中间的复杂度则比 O(n) 略低。从 Python 3.5 开始 deque 还支持 **add**()、**mul**()、**imul**() 等。

### 用法示例

#### 新建对象

首先，导入 collections 模块中的 deque：

```python
>>> from collections import deque
```

创建一个 deque 对象：

```python
>>> d = deque()  # 创建空 deque
>>> d
deque([])
```

注意，**可迭代对象 iterable** 包括：**序列 sequence (list、string、tuple)、set、dict、迭代器 iterator、生成器 generator、文件对象** 等。可以将 可迭代对象 iterable 转换为 双端队列对象 deque，例如：

```python
>>> d1 = deque([1, 2, 3, 4])    # list → deque
>>> d1
deque([1, 2, 3, 4])
# -----------------------------------------------------------------------
>>> d2 = deque({1, 2, 3, 4})    # set → deque
>>> d2
deque([1, 2, 3, 4])
# -----------------------------------------------------------------------
>>> d3 = deque({'a':1, 'b':2})  # dict → deque
>>> d3
deque(['a', 'b'])
# -----------------------------------------------------------------------
>>> d4 = deque(range(1, 5))     # iterable → deque
>>> d4
deque([1, 2, 3, 4])
```

#### 元素操作

新建一个 deque 对象用于说明：

```python
>>> d0 = deque([1, 2, 3, 4, 5])
>>> d0
deque([1, 2, 3, 4, 5])
```

两端添加元素：

```python
>>> d0.append(6)
>>> d0
deque([1, 2, 3, 4, 5, 6])
# -----------------------------------------------------------------------
>>> d0.appendleft(-1)
>>> d0
deque([-1, 1, 2, 3, 4, 5, 6])
```

用可迭代对象 iterable 拓展两端元素：

```python
>>> d0.insert(0, -4)  # index=0
>>> d0
deque([-4, -2, -3, -1, 1, 2, 3, 4, 5, 6, 7, 8])
 
>>> d0.insert(12, 9)  # index=12
>>> d0
deque([-4, -2, -3, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9])
```

两端弹出元素：

```python
>>> d0.pop()
9
>>> d0
deque([-4, -2, -3, -1, 1, 2, 3, 4, 5, 6, 7, 8])
 
>>> d0.popleft()
-4
>>> d0
deque([-2, -3, -1, 1, 2, 3, 4, 5, 6, 7, 8])
```

移除从左到右找到的首个指定元素：

```python
>>> d0.remove(-3)
>>> d0
deque([-2, -1, 1, 2, 3, 4, 5, 6, 7, 8])
```

浅拷贝：(注意，此处未体现浅拷贝的根本含义，[点击学习](https://blog.csdn.net/qq_39478403/article/details/105428197))

```python
>>> dcp = d0.copy()
>>> dcp
deque([-2, -1, 1, 2, 3, 4, 5, 6, 7, 8])
```

指定元素计数：

```python
>>> d0.count(6)
1
```

返回从左到右找到的首个指定元素的位置 index：

```python
>>> d0.index(6)
7
```

逆序排列：

```python
>>> d0.reverse()
>>> d0
deque([8, 7, 6, 5, 4, 3, 2, 1, -1, -2])
```

元素双向循环移动指定步数：

```python
>>> d0.rotate(2)   # 右循环移动 2 步
>>> d0
deque([-1, -2, 8, 7, 6, 5, 4, 3, 2, 1])
 
>>> d0.rotate(-2)  # 左循环移动 2 步
>>> d0
deque([8, 7, 6, 5, 4, 3, 2, 1, -1, -2])
```

清空 deque：

```python
>>> d0.clear()
>>> d0   # 清空
deque([])
 
>>> dcp  # 浅拷贝外围元素健在
deque([-2, -1, 1, 2, 3, 4, 5, 6, 7, 8])
```


## defaultdict

defaultdict，顾名思义是默认字典，它返回一个类似 dict 的新对象。defaultdict 作为内置 dict 类的子类，重载了一个新方法并添加了一个可写的实例变量，而其余功能则与 dict 类相同。

### 用法介绍

> **`collections.defaultdict([*default_factory*[, *...*]]`**
> 

第一个参数 `default_factory` 是 工厂函数 (factory function)，默认为 None，可选 list、tuple、set 、str 、int 等 用于创建各种类型对象的内建函数 (工厂)，其作用在于：**当用 defaultdict 创建的默认字典的 key 不存在时，将返工厂函数 default_factory 的默认值**。例如，list 对应 [ ]、tuple 对应 ()。而其他参数用法则同 dict，包括关键词参数。

通常，我们创建 dict 时，若索引了不存在的 key，则会导致 KeyError：

```python
>>> dict0 = {}
>>> dict0[0]
Traceback (most recent call last):
  File "<pyshell#2>", line 1, in <module>
    dict0[0]
KeyError: 0
```

为避免这样的问题，可以对默认字典 defaultdict 馈入指定“工厂” 作为默认工厂，当访问不存在的 key 时，会调用默认工厂自动创建并返回一个默认 value，而非 KeyError，例如：

```python
>>> from collections import defaultdict
 
## dict 初始化之初, key=0 原本是不存在的,
## 但在 defaultdict 的作用下, 根据工厂函数构建了相应的 默认 value
# -------------------------------------------------------------
>>> dict1 = defaultdict(list)
>>> dict1
defaultdict(<class 'list'>, {})
>>> dict1[0]  
[]
>>> dict1
defaultdict(<class 'list'>, {0: []})  
# -------------------------------------------------------------
>>> dict2 = defaultdict(tuple)
>>> dict2
defaultdict(<class 'tuple'>, {})
>>> dict2[0]
()
>>> dict2
defaultdict(<class 'tuple'>, {0: ()})
# -------------------------------------------------------------
>>> dict3 = defaultdict(set)
>>> dict3
defaultdict(<class 'set'>, {})
>>> dict3[0]   # 注意, 为区别 dict 的 {}, set 创建的是 set()
set()
>>> dict3
defaultdict(<class 'set'>, {0: set()})    
# -------------------------------------------------------------
>>> dict4 = defaultdict(str)
>>> dict4
defaultdict(<class 'str'>, {})
>>> dict4[0]
''
>>> dict4
defaultdict(<class 'str'>, {0: ''})
# -------------------------------------------------------------
>>> dict5 = defaultdict(int)
>>> dict5
defaultdict(<class 'int'>, {})
>>> dict5[0]
0
>>> dict5
defaultdict(<class 'int'>, {0: 0})
# -------------------------------------------------------------
>>> dict6 = defaultdict(float)
>>> dict6
defaultdict(<class 'float'>, {})
>>> dict6[0]
0.0
>>> dict6
defaultdict(<class 'float'>, {0: 0.0})
```

注意，上述例子的实参是 list、tuple、set、str、int、float，它们均为类对象，而非新列表 list()、新元组 tuple() 等等。

当然，形参工厂函数 default_factory 可接受的工厂实参远不止这些。

但是，若实例化 defaultdict 对象时不指定 default_factory 参数，则默认为 None，使之与 dict 基本没有区别，访问不存在的 key 时同样会抛出 KeyError，而不会创建默认 value (因为没有默认工厂可用！)：

```python
>>> dict00 = defaultdict()
>>> dict00
defaultdict(None, {})
>>> dict00[0]
```

#### 整合字典

例如，使用 defaultdict 能够很容易地将 tuple-list 整合为 value 为 list 的 dict，而不必预先检查 key 的存在性：

```python
>>> old = [('yellow', 2), ('blue', 4), ('yellow', 1), ('blue', 1), ('red', 2)]
>>> new = defaultdict(list)
>>> for key, value in old:
	new[key].append(value)
 
>>> new.items()
dict_items([('yellow', [2, 1]), ('blue', [4, 1]), ('red', [2])])
>>> sorted(new.items())
[('blue', [4, 1]), ('red', [2]), ('yellow', [2, 1])]
```

使用了 defaultdict 的方法比使用 dict.setdefault() 的等价方法更加简洁高效：

```python
>>> old = [('yellow', 2), ('blue', 4), ('yellow', 1), ('blue', 1), ('red', 2)]
>>> new2 = {}
>>> for key, value in old:
	new2.setdefault(key, []).append(value)
 
>>> new2.items()
dict_items([('yellow', [2, 1]), ('blue', [4, 1]), ('red', [2])])
>>> sorted(new2.items())
[('blue', [4, 1]), ('red', [2]), ('yellow', [2, 1])]
```

#### 计数字典

例如，使用 defaultdict 为 string 中各元素出现次数计数：

```python
>>> string = 'nobugshahaha'
>>> count = defaultdict(int)
>>> for key in string:
	count[key] += 1
 
>>> count.items()
dict_items([('n', 1), ('o', 1), ('b', 1), ('u', 1), ('g', 1), ('s', 1), ('h', 3), ('a', 3)])
>>> sorted(count.items())
[('a', 3), ('b', 1), ('g', 1), ('h', 3), ('n', 1), ('o', 1), ('s', 1), ('u', 1)]
```

但对于计数，我还是倾向于使用专业的计数器类 **collections.Counter()**

```python
from collections import Counter
>>> count2 = Counter(string)
>>> count2
Counter({'h': 3, 'a': 3, 'n': 1, 'o': 1, 'b': 1, 'u': 1, 'g': 1, 's': 1})
>>> count2.items()
dict_items([('n', 1), ('o', 1), ('b', 1), ('u', 1), ('g', 1), ('s', 1), ('h', 3), ('a', 3)])
>>> count2.most_common()
[('h', 3), ('a', 3), ('n', 1), ('o', 1), ('b', 1), ('u', 1), ('g', 1), ('s', 1)]
```

#### 不重复计数字典

使用 defaultdict 构造 set-dict 实现元素的不重复计数：

```python
>>> colors = [('yellow', 2), ('blue', 4), ('yellow', 1), ('blue', 4), ('yellow', 2)]
>>> color_set = defaultdict(set)
>>> for key, value in colors:
	color_set[key].add(value)
	
>>> color_set.items()
dict_items([('yellow', {1, 2}), ('blue', {4})])
>>> sorted(color_set.items())
[('blue', {4}), ('yellow', {1, 2})]
```

#### 更灵活的方式 —— 使用 lambda 提供各种类型的默认 value

注意这里面的用法有一点点高级：

```python
>>> def constant_factory(value):
    ''' 使用 lambda 函数提供任何常量值 '''
	return lambda: value    # 不常见用法
 
>>> words = defaultdict(constant_factory('~<China>~'))
>>> words
defaultdict(<function constant_factory.<locals>.<lambda> at 0x0000025698DF37B8>, {})
 
>>> words.items()
dict_items([])
>>> words.update(name='Liangzai', action='ran')
>>> words.items()
dict_items([('name', 'Liangzai'), ('action', 'ran')])
 
>>> "%(name)s %(action)s to %(object)s" % words    # 不常见用法
'Liangzai ran to ~<China>~'
```