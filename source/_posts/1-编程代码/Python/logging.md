---
title: logging
date: 2023-09-07 14:05:29
uuid: 6d194600-86cb-11ee-b04c-f58259a2146b
sticky:
---

{% note info %}
😎 在机器学习/深度学习训练中，logging主要监控模型的输出和异常，知道日志的Logger，Handler，Formatter是啥，学会用 `yaml` / `json` 配置文件写logger就行了
{% endnote %}

## 什么是日志？

日志是对软件执行时所发生事件的一种追踪方式。开发者还会区分事件的重要性，重要性也被称为 **`等级`** 或 **`严重性`**


## 何时使用日志？

| 想要执行的任务 | 此任务最好的工具 |
| --- | --- |
| 对于命令行或程序的应用，结果显示在控制台。 | print() |
| 程序正常运行时的事件报告 | logging.info() 
| 当有诊断目的需要详细输出信息时 | logging.debug()|
| 提出一个警告信息基于一个特殊的运行时事件 | warnings.warn()位于代码库中，该事件是可以避免的，需要修改客户端应用以消除警告 <br> logging.warning()不需要修改客户端应用，但是该事件还是需要引起关注 |
| 对一个特殊的运行时事件报告错误 | 引发异常 |
| 报告错误而不引发异常(如在长时间运行中的服务端进程的错误处理) | logging.error(), logging.exception() 或 logging.critical()分别适用于特定的错误及应用领域 |

> 默认的级别是 `WARNING`，意味着只会追踪该级别及以上的事件，除非更改日志配置。所追踪事件可以以不同形式处理。最简单的方式是输出到控制台。另一种常用的方式是写入磁盘文件。

| 级别 | 数值 | 何时使用 |
| --- | --- | --- |
| DEBUG | 10 | 细节信息，仅当诊断问题时适用。 |
| INFO | 20 | 确认程序按预期运行 |
| WARNING | 30 | 表明有已经或即将发生的意外 (例如：磁盘空间不足)。程序仍按预期进行 |
| ERROR | 40 | 由于严重的问题，程序的某些功能已经不能正常执行 |
| CRITICAL | 50 | 严重的错误，表明程序已不能继续执行 |

> 日志的作用
> 
> - 进行程序(代码)的调试
> - 程序运行过程中的问题定位和分析
> - 收集程序运行的情况

## 日志组件

**logging采用了模块化设计，主要包含四种组件**:

| 组件 | 功能 |
| --- | --- |
| Logger | 记录器，提供应用程序代码能直接使用的接口。 |
| Handler | 处理器，将记录器产生的日志发送到目的地。 (输出到文件或者控制台或者邮件等。) |
| Filter | 过滤器，提供更好的粒度控制，决定哪些日志会被输出。 |
| Formatter | 格式化器，设置日志内容的组成结构和消息字段。 |

### Loggers记录器

1. 提供应用程序的调用接口
    
    ```python
    logger = logging.getLogger(__name__)
    # logger是单例的，也就是__name__不变，获取到的logger都是同一个
    ```
    
2. 设置日志记录的级别
    
    ```python
    logger.setLevel()
    ```
    
3. 将日志内容传递到相关联的handlers中
    
    ```python
    logger.addHandler()
    logger.removeHandler()
    ```
    

### Handler处理器

> 将日志发送到不同的地方

```python
# 常见的处理器
StreamHandler  # 屏幕输出
FileHandler  # 文件记录
BaseRotatingHandler  # 标准的分割文件日志
RotatingFileHandler  # 按文件大小记录日志
TimeRotatingFileHandler  # 按时间记录日志
```

**StreamHandler**

> 标准输出分发器，也就是屏幕显示

```python
sh = logging.StreamHandler(stream=None)
```

**FileHandler**

> 将日志保存到文件中

```python
fh = logging.FileHandler(filename,mode='a',encoding=None,delay=False)
```

**setFormatter()**

> 设置当前Handler对象使用的消息格式

### Filter过滤器(不常用)

Filter可以被Handler和Logger用来做比之前设置的日志等级level更为细粒度的、更复杂的相关过滤功能。

简单的说Filter是一个过滤器基类，它只允许某个logger层级下的日志事件通过过滤，保存下来。该类定义如下：

```python
class logging.Filter(name='')
    filter(record)
```

过滤举例：

例如用 ‘A.B’ 初始化的 Filter，那么其允许Logger ‘A.B’, ‘A.B.C’, ‘A.B.C.D’, ‘A.B.D’ 等日志记录的事件，logger‘A.BB’, ‘B.A.B’ 等就不满足过滤的条件。

如果用空字符串来对Filter初始化，所有日志记录的事件都将不会被过滤。

**过滤器在代码里的应用**

```python
# 定义一个过滤器
flt1 = logging.Filter("logger1") #名字就是logger记录器的名字

# 关联过滤器
# 1.logger关联过滤器
logger.addFilter(flt1)

# 2.处理器关联过滤器
sh1.addFilter(flt1)
# fh1.addFilter(flt1)

# 过滤器定义在记录器上的时候，不管你设置了任何关于这个过滤器的任何设置，都不起作用。
# 过滤器定义在哪个处理器上，哪个处理器就不起作用，也就可以控制日志的输出，想要还是不想要。
# 特别是在项目调试的时候，不想让日志记录到文件里去，直接在屏幕显示，就过滤到fh
# 代码上线后，日志记录到文件，不用在屏幕显示，就过滤掉sh
```

### Formatter格式化器

formatter对象用来最终设置日志信息的顺序，结构和内容

```python
ft = logging.Formatter.__init__(fmt=None,datafmt=None)
```

| 属性 | 格式 | 描述 |
| --- | --- | --- |
| asctime | %(asctime)s | 日志产生的时间，默认格式为2003-07-08 16:49:45, 896 |
| message | %(message)s | 具体的日志信息 |
| filename | %(filename)s | 生成日志的程序名 |
| name | %(name)s | 日志调用者 |
| levelname | %(levelname)s | 日志级別( DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| lineno | %(lineno)d | 日志所针对的代码行号 (如果可用的话) |
| msecs | %(msecs)d | 日志生成时间的亳秒部分 |
| created | %(created)f | time.time生成的日志创建时间戳 |
| funcname | %(funcname)s | 调用日志的函数名 |
| levene | %(leveling)s | 日志级别对应的数值 |
| module | %(module)s | 生成日志的模块名 |
| pathname | %(pathname)s | 生成日志的文件的完整路径 |
| process | %(process)d | 生成日志的进程D (如果可用) |
| processname | %(processname)s | 进程名 (如果可用) |
| thread | %(thread)d | 生成日志的线程D (如果可用) |
| threadname | %(threadname)s | 线程名 (如果可用) |

### 逻辑图

![logging 逻辑图](standard_imgs/logging_1.webp)


## 如何使用？

### 编程方式logging(不推荐，可以不看)

```python
# -*- coding:utf-8 -*-

import logging

# 使用basicConfig()来指定日志级别和相关信息

logging.basicConfig(
				level=logging.DEBUG  # 设置日志输出级别
		   ,filename="demo.log"  # log日志输出的文件位置和文件名
		   ,filemode="w"  # 文件的写入格式，w为重新写入文件，默认是追加
		   # 日志输出的格式, -8表示占位符，让输出左对齐，输出长度都为8位
		   ,format="%(asctime)s - %(name)s - %(levelname)-9s - %(filename)-8s : %(lineno)s line - %(message)s"
		   ,datefmt="%Y-%m-%d %H:%M:%S"  # 时间输出的格式
)

# 默认的warning级别，只输出warning以上的
logging.debug("This is  DEBUG !!")
logging.info("This is  INFO !!")
logging.warning("This is  WARNING !!")
logging.error("This is  ERROR !!")
logging.critical("This is  CRITICAL !!")

# 在实际项目中，捕获异常的时候，如果使用logging.error(e)，只提示指定的logging信息
# 不会出现为什么会错的信息，所以要使用logging.exception(e)去记录。

try:
   3/0
except Exception as e:
    # logging.error(e)
    logging.exception(e)
```

日志输出结果如下:

```bash
2022-08-01 16:46:18 - root - DEBUG     - test.py  : 14 line - This is  DEBUG !!
2022-08-01 16:46:18 - root - INFO      - test.py  : 15 line - This is  INFO !!
2022-08-01 16:46:18 - root - WARNING   - test.py  : 16 line - This is  WARNING !!
2022-08-01 16:46:18 - root - ERROR     - test.py  : 17 line - This is  ERROR !!
2022-08-01 16:46:18 - root - CRITICAL  - test.py  : 18 line - This is  CRITICAL !!
2022-08-01 16:46:18 - root - ERROR     - test.py  : 27 line - division by zero
Traceback (most recent call last):
File "/Users/yg/Documents/test.py", line 24, in <module>
3/0
ZeroDivisionError: division by zero
```

**添加不同模块达到不同的效果**

```python
# 编程的方式记录日志
import logging

# 记录器
logger1 = logging.getLogger("logger1")
logger1.setLevel(logging.DEBUG)
print(logger1)
print(type(logger1))

logger2 = logging.getLogger("logger2")
logger2.setLevel(logging.INFO)
print(logger2)
print(type(logger2))

# 处理器
# 1.标准输出
sh1 = logging.StreamHandler()
sh1.setLevel(logging.WARNING)
sh2 = logging.StreamHandler()

# 2.文件输出
# 没有设置输出级别，将用logger1的输出级别(并且输出级别在设置的时候级别不能比Logger的低!!!)，设置了就使用自己的输出级别
fh1 = logging.FileHandler(filename="fh.log",mode='w')
fh2 = logging.FileHandler(filename="fh.log",mode='a')
fh2.setLevel(logging.WARNING)

# 格式器
fmt1 = logging.Formatter(fmt="%(asctime)s - %(levelname)-9s - %(filename)-8s : %(lineno)s line - %(message)s")

fmt2 = logging.Formatter(fmt="%(asctime)s - %(name)s - %(levelname)-9s - %(filename)-8s : %(lineno)s line - %(message)s"
                        ,datefmt="%Y/%m/%d %H:%M:%S")

# 给处理器设置格式
sh1.setFormatter(fmt1)
fh1.setFormatter(fmt2)
sh2.setFormatter(fmt2)
fh2.setFormatter(fmt1)

# 记录器设置处理器
logger1.addHandler(sh1)
logger1.addHandler(fh1)
logger2.addHandler(sh2)
logger2.addHandler(fh2)

# 打印日志代码
logger1.debug("This is  DEBUG of logger1 !!")
logger1.info("This is  INFO of logger1 !!")
logger1.warning("This is  WARNING of logger1 !!")
logger1.error("This is  ERROR of logger1 !!")
logger1.critical("This is  CRITICAL of logger1 !!")

logger2.debug("This is  DEBUG of logger2 !!")
logger2.info("This is  INFO of logger2 !!")
logger2.warning("This is  WARNING of logger2 !!")
logger2.error("This is  ERROR of logger2 !!")
logger2.critical("This is  CRITICAL of logger2 !!")
```

控制台输出:

```bash
<Logger logger1 (DEBUG)>
<class 'logging.Logger'>
<Logger logger2 (INFO)>
<class 'logging.Logger'>
2022-08-01 18:04:28,160 - WARNING   - test.py  : 56 line - This is  WARNING of logger1 !!
2022-08-01 18:04:28,160 - ERROR     - test.py  : 57 line - This is  ERROR of logger1 !!
2022-08-01 18:04:28,160 - CRITICAL  - test.py  : 58 line - This is  CRITICAL of logger1 !!
2022/08/01 18:04:28 - logger2 - INFO      - test.py  : 61 line - This is  INFO of logger2 !!
2022/08/01 18:04:28 - logger2 - WARNING   - test.py  : 62 line - This is  WARNING of logger2 !!
2022/08/01 18:04:28 - logger2 - ERROR     - test.py  : 63 line - This is  ERROR of logger2 !!
2022/08/01 18:04:28 - logger2 - CRITICAL  - test.py  : 64 line - This is  CRITICAL of logger2 !!
```

文件fh.log输出:

```bash
2022/08/01 18:04:28 - logger1 - DEBUG     - test.py  : 54 line - This is  DEBUG of logger1 !!
2022/08/01 18:04:28 - logger1 - INFO      - test.py  : 55 line - This is  INFO of logger1 !!
2022/08/01 18:04:28 - logger1 - WARNING   - test.py  : 56 line - This is  WARNING of logger1 !!
2022/08/01 18:04:28 - logger1 - ERROR     - test.py  : 57 line - This is  ERROR of logger1 !!
2022/08/01 18:04:28 - logger1 - CRITICAL  - test.py  : 58 line - This is  CRITICAL of logger1 !!
2022-08-01 18:04:28,160 - WARNING   - test.py  : 62 line - This is  WARNING of logger2 !!
2022-08-01 18:04:28,160 - ERROR     - test.py  : 63 line - This is  ERROR of logger2 !!
2022-08-01 18:04:28,160 - CRITICAL  - test.py  : 64 line - This is  CRITICAL of logger2 !!```
```

### 文件配置logging(推荐)

**主要有两种方式去配置，一种是conf文件，一种是字典文件。**

```python
import logging.config

# conf文件
logging.config.fileConfig("/path/to/configfile")
# 字典文件(推荐) 因为无论是什么配置文件格式只要能读取成字典就行
logging.config.dictConfig("/path/to/configfile")
```

**举例：yaml配置文件**

```yaml
version: 1
# 是否覆盖掉已经存在的loggers
disable_existing_loggers: True

# 格式化器
formatters:
  tostrout:
    format: "%(asctime)s - %(name)s - %(levelname)-9s - %(filename)-8s : %(lineno)s line - %(message)s"
    datefmt: "%Y/%m/%d %H:%M:%S"
  tofile:
    format: "%(asctime)s - %(name)s - %(levelname)-9s - %(filename)-8s : %(lineno)s line - %(message)s"

# 处理器
handlers:
  sh:
    class: logging.StreamHandler
    level: WARNING
    formatter: tostrout
    stream: ext://sys.stdout
  fh:
    class: logging.handlers.TimedRotatingFileHandler
    filename: info.log
    interval: 1
    backupCount: 2
    when: D
    level: INFO
    formatter: tofile

# 记录器
loggers:
  logger1:
    level: DEBUG
    handlers: [sh]
    # 是否往上级Logger传递，如果为yes的话，root选择了两个logger，这里的日志也会在两个logger的配置中输出，会重复。所以选No,自己记录自己的日志。
    propagate: no   
  logger2:
    level: INFO
    handlers: [fh]
    propagate: no

# 根记录器
root:
  level: DEBUG
    handlers: [sh,fh]
    propagate: no
```

**调用代码：**

```python
#  -*- coding:utf-8 -*-

import logging
import logging.config
import yaml

with open("logger_config.yaml", "r") as f:
    dict_conf = yaml.safe_load(f)

logging.config.dictConfig(dict_conf)
root = logging.getLogger()
logger1 = logging.getLogger('logger1')
logger2 = logging.getLogger('logger2')

# 打印日志代码

root.debug("This is  DEBUG of root !!")
root.info("This is  INFO of root !!")
root.warning("This is  WARNING of root !!")
root.error("This is  ERROR of root !!")
root.critical("This is  CRITICAL of root !!")

logger1.debug("This is  DEBUG of logger1 !!")
logger1.info("This is  INFO of logger1 !!")
logger1.warning("This is  WARNING of logger1 !!")
logger1.error("This is  ERROR of logger1 !!")
logger1.critical("This is  CRITICAL of logger1 !!")

logger2.debug("This is  DEBUG of logger2 !!")
logger2.info("This is  INFO of logger2 !!")
logger2.warning("This is  WARNING of logger2 !!")
logger2.error("This is  ERROR of logger2 !!")
logger2.critical("This is  CRITICAL of logger2 !!")
```

**标准输出：**

```bash
2022/08/02 01:23:05 - root - WARNING   - test.py  : 17 line - This is  WARNING of root !!
2022/08/02 01:23:05 - root - ERROR     - test.py  : 18 line - This is  ERROR of root !!
2022/08/02 01:23:05 - root - CRITICAL  - test.py  : 19 line - This is  CRITICAL of root !!
2022/08/02 01:23:05 - logger1 - WARNING   - test.py  : 23 line - This is  WARNING of logger1 !!
2022/08/02 01:23:05 - logger1 - ERROR     - test.py  : 24 line - This is  ERROR of logger1 !!
2022/08/02 01:23:05 - logger1 - CRITICAL  - test.py  : 25 line - This is  CRITICAL of logger1 !!
```

**文件输出(info.log):**

```bash
2022-08-02 01:23:05,688 - root - INFO      - test.py  : 16 line - This is  INFO of root !!
2022-08-02 01:23:05,688 - root - WARNING   - test.py  : 17 line - This is  WARNING of root !!
2022-08-02 01:23:05,688 - root - ERROR     - test.py  : 18 line - This is  ERROR of root !!
2022-08-02 01:23:05,688 - root - CRITICAL  - test.py  : 19 line - This is  CRITICAL of root !!
2022-08-02 01:23:05,688 - logger2 - INFO      - test.py  : 28 line - This is  INFO of logger2 !!
2022-08-02 01:23:05,688 - logger2 - WARNING   - test.py  : 29 line - This is  WARNING of logger2 !!
2022-08-02 01:23:05,688 - logger2 - ERROR     - test.py  : 30 line - This is  ERROR of logger2 !!
2022-08-02 01:23:05,688 - logger2 - CRITICAL  - test.py  : 31 line - This is  CRITICAL of logger2 !!
```