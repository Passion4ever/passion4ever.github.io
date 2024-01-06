---
title: pathlib
date: 2023-09-07 14:05:37
uuid: 6d194602-86cb-11ee-b04c-f58259a2146b
sticky:
---

{% note info %}
😎 平时操作路径主要是创建文件夹和路径拼接或者筛选路径字符串，了解常用的操作就行

更多内容详见[pathlib官方文档](https://www.notion.so/pathlib-e97fff4668984ca99ec95f9f1705b09b?pvs=21)
{% endnote %}

## pathlib介绍

在操作路径时，现在使用`pathlib`模块基本可以代替 `os.path`来处理路径。它采用了完全面向对象的编程方式。

<!-- more -->

其包含了6个Python类：

{%asset_img pathlib_1.webp%}
{%cq%}
A→B表示A继承自B
{%endcq%}

大体分为两类：
- pure paths 路径计算操作没有IO功能
- concrete paths 路径计算操作和IO功能

从上图可以看出：`PurePath`类是所有类的基类

**我们重点要掌握`PurePath`和`Path`这两个类,在Windows平台下路径对象会有Windows前缀,Unix平台上路径对象会有Posix前缀。**


日常使用中最常用到`Path`类

## 普通操作
    
```python
from pathlib import Path

# 当前工作路径：
Path.cwd()
# PosixPath('/Users/test')

# home路径
Path.home()
# PosixPath('/Users/test')

# 列出当前目录的子目录：
p = Path('.')
[x for x in p.iterdir() if x.is_dir()]

p.iterdir() # 当路径指向一个目录时，产生该路径下的对象的路径

# 将路径绝对化
p.resolve()

# 列出当前目录下所有的`csv`文件：
list(p.glob('**/*.csv'))

# 查看路径是否存在
a = Path('data/data2/Iris.csv')
a.exists() # True
b = Path('data/data2/NoIris.csv')
b.exists() # False

# 判断是否为文件夹
a.is_dir()  # False
p.is_dir() # True
a.is_dir() # True
p.is_file() # False

# 读取文件内容
a.read_text()

# 获取文件名和后缀
print(a.name)
# prints "Iris.csv"
print(a.suffix)
# prints ".csv"

# 分离路径 
a.parts  # ('data', 'data2', 'Iris.csv')

# 修改目录权限
p.chmod(777)

# 删除目录
path_to_remove = Path('to_remove')
path_to_remove.rmdir()
```

---

## 常用操作

1. 用 `/` 拼接路径
    
    ```python
    from pathlib import Path
    
    path = Path('/aaa/bbb/ccc')
    
    path2 = path / 'ddd' / 'eee'
    # path2: '/aaa/bbb/ccc/ddd/eee'
    
    # 由于parent返回的还是Path对象，所以可以链式的获取其parent属性。
    ```
    
2. `parent`/`parents`
    
    ```python
    path = Path('/aaa/bbb/ccc')
    
    path.parents[0]
    # PosixPath('/aaa/bbb')
    
    path.parents[1]
    # PosixPath('/aaa')
    
    path.parents[2]
    # PosixPath('/')
    
    path.parent
    # PosixPath('/aaa/bbb')
    
    path.parent.parent
    # PosixPath('/aaa')
    ```
    
3. `suffix`/`stem`
    
    ```python
    path = Path('/aaa/bbb/ccc/test.py')
    
    path.suffix, path.stem
    # ('.py', 'test')
    
    # 注意: 当文件有多个后缀，可以用suffixes返回文件所有后缀列表:
    Path('my.tar.bz2').suffixes
    ['.tar', '.bz2']
    
    Path('my.tar').suffixes
    ['.tar']
    
    Path('my').suffixes
    []
    ```
    
4. `torch`创建文件
    
    ```python
    Path('new.txt').touch()
    # touch接受mode参数，能够在创建时确认文件权限，还能通过exist_ok参数方式确认是否可以重复touch(默认可以重复创建，会更新文件的mtime)
    ```
    
5. `with_name` / `with_suffix`
    
    基于某个文件路径生成另外一个文件路径。举个例子，有一个文件地址`'/home/aaa/abc.jpg'`，2个需求:
    
    1. 获得转成`webp`格式的路径
    2. 把图片名字改成`123`
    
    ```python
    p = Path('/home/aaa/abc.jpg')
    
    p.with_suffix('.webp')
    # PosixPath('/home/aaa/abc.webp')
    
    p.with_name(f'123{p.suffix}')
    # PosixPath('/home/aaa/123.webp')
    ```
    
6. **创建目录**
    
    `Path.mkdir(mode=0o777, parents=False, exist_ok=False)`
    
    新建给定路径的目录。
    
    如果给出了 *`mode`* ，它将与当前进程的 `umask` 值合并来决定文件模式和访问标志。如果路径已经存在，则抛出 `FileExistsError`。
    
    如果 *`parents`* 为True，任何找不到的父目录都会伴随着此路径被创建
    
    如果 *`parents`* 为假值（默认），则找不到的父级目录会引发 `FileNotFoundError`。
    
    如果 *`exist_ok`* 为 false（默认），则在目标已存在的情况下抛出 `FileExistsError`。
    
    如果 *`exist_ok`* 为 true， 则 `FileExistsError` 异常将被忽略，但是只有在最后一个路径组件不是现存的非目录文件时才生效。
    {% note info %}
    一般 `exist_ok` 和 `parents` 都为 `True`
    {% endnote %}

7. ****owner****
    
    有时操作文件前需要确认拥有此文件的用户
    
    ```python
    p.owner()
    'yg'
    ```