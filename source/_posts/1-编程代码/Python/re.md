---
title: re
date: 2023-09-07 14:05:44
uuid: 6d194608-86cb-11ee-b04c-f58259a2146b
sticky:
---

{% note info %}
😎 先学习正则表达式语法，然后掌握几个常用的函数即可
{% endnote %}
还有一篇需要整理, https://zhuanlan.zhihu.com/p/349205967
## 什么是正则表达式

正则表达式是对**字符串** (包括**普通字符**(例如，a到z之间的字母)和**特殊字符**(称为“元字符”)) 操作的一种逻辑公式

用事先定义好的一些特定字符、及这些特定字符的组合，组成一个“规则字符串”，这个“规则字符串”用来表达对字符串的一种过滤逻辑。

正则表达式是一种文本模式，该模式描述在搜索文本时要匹配的一个或多个字符串。

<!-- more -->

## 语法

**Python的re模块是正则表达式模块，要用好re，首先得熟悉正则表达式语法。**

一张图可以掌握最核心的正则表达式用法

{%asset_img re_1.webp%}


**正则表达式中需要转义的字符**
    
若在匹配中使用它本来的含义，需要进行转义(在其前面加`\`)

**总结：`* . ? + $ ^ [ ] ( ) { } | \ /`**

1. `*`匹配前面的子表达式**零次**或**多次**
2. `.`匹配**除**换行符`\n`之外的**任何单**字符
3. `?`匹配前面子表达式**零次**或**一次**，或**指明一个非贪婪限定符**
4. `+`匹配前面的子表达式**一次**或**多次**
5. `$`匹配输入字符串的**结尾位置**。若设置了RegExp对象的Multiline属性，则`$`也匹配，如‘\n’或’\r’
6. `^`匹配输入字符串的**开始位置**，若**在方括号表达式中使用**，此时表示**不接受该字符集合**
7. `[]`标记一个中括号表达式的开始
8. `()`标记一个子表达式的**开始**和**结束**位置。子表达式可以获取供以后使用。要匹配这些字符
9. `{}`标记限定符表达式的开始
10. `|`指明两项之间的一个选择

## re模块的使用

### 编译正则对象

先提一下原生字符串表示

1. `r`：这玩意代表**原始字符串标识符**，该字符串中的特殊符号不会被转义，适用于正则表达式中繁杂的特殊符号表示。 因此`r"\n"`表示包含`'\'`和`'n'`两个字符的字符串，而`"\n"`则表示只包含一个换行符的字符串。
    
    ```python
    print("\\n")  # 输出 \n
    print(r"\n")  # 输出 \n
    ```
    
2. `compile`
    
    若一个正则表达式要重复使用几千次，出于效率的考虑，我们是不是应该先把这个正则先预编译好，接下来重复使用时就不再需要编译这个步骤了，直接匹配，提高我们的效率
    
    **编译的方式使用正则表达式(re内部做的事情)**
    
    1. 将正则表达式的字符串形式编译为一个`Pattern`对象(这里其实就用到了`compile`)
    2. 通过`Pattern`对象的一系列方法对文本进行匹配查找，获得匹配结果(一个`Match`对象)
    3. 最后使用`Match`对象提供的属性和方法获得信息，根据需要进行其他的操作
    
    ```python
    re.compile(pattern, flags=0) 
    Compile a regular expression pattern, returning a pattern object.
    ```
    
    从compile()函数的定义中，可以看出返回的是一个匹配对象，它单独使用就没有任何意义，需要和`findall()`, `search()`, `match()`搭配使用
    

### 查找一个匹配项

1. `match`
    
    match方法，类似于字符串中的`startwith`方法，match函数用以匹配字符串的开始部分
    
    若匹配成功，返回`re.Match`类型的对象，若匹配失败，返回`None`
    
    ```python
    # 我们要判断data字符串是否以 what 和 是否以 数字 开头
    
    s_true = "what is a boy"
    s_false = "What is a boy"
    
    p = re.compile("what")
    print(p.match(string=s_true))
    # <re.Match object; span=(0, 4), match='what'>
    print(p.match(string=s_false))
    # None
    
    ---
    s_true = "123what is a boy"
    s_false = "what is a boy"
    
    p = re.compile("\d+")
    print(p.match(string=s_true))
    # <re.Match object; span=(0, 3), match='123'>
    
    print(p.match(s_true).start())  # 开头索引
    # 0
    
    print(p.match(s_true).end())  # 末尾索引
    # 3
    
    print(p.match(s_true).span())  # 索引元组
    # (0, 3)
    
    print(p.match(s_true).string)  # 整个字符串
    # 123what is a boy
    
    print(p.match(s_true).group())  # 返回匹配到的开头
    # 123
    
    print(p.match(string=s_false))
    # None
    ```
    
2. `search`
    
    search方法和match方法基本相同，两者区别在于：
    
    - match只能从开头匹配，而search从字符串任意位置匹配
    - search仅查找第一次匹配
3. `fullmatch`
    
    整个字符串与正则完全匹配，同样返回的是Match对象，对应的方法与search方法一致
    
    ```python
    #必须要全部符合条件才能匹配
    re.fullmatch(r'[a-z]+','chiputao14').group()
    AttributeError: 'NoneType' object has no attribute 'group'
    
    re.fullmatch(r'[a-z]+','chiputao').group()
    'chiputao'
    ```
    

### 查找多个匹配项

1. `findall`
    
    findall方法，该方法在字符串中查找模式匹配，返回一个列表，若匹配到，列表中的元素为匹配到的子字符串，若未匹配到，则返回一个空的列表
    
    ```python
    re_str = "hello this is python 2.7.13 and python 3.4.5"
     
    # 不使用'r'
    p = "python \d\.\d\.\d{2,}"
    res = re.findall(pattern=p, string=re_str)
    print(res)
    # ['2.7.13']
    
    # 使用'r'并且使用compile, 使用compile后匹配函数(findall)不需要写pattern了
    p = re.compile(r"python \d.\d.\d+")
    res = p.findall(string=re_str)
    print(res)
    # ['2.7.13', '3.4.5']
    
    # python和版本号之间没空格, 匹配失败
    p = re.compile("python\d\.\d\.\d{2,}")
    res = p.findall(string=re_str)
    print(res)
    # []
    
    ---
    re_str = "hello this is python 2.7.13 and Python 3.4.5"  # 大写P
     
    p = re.compile("python \d\.\d\.\d", flags=re.IGNORECASE)
    # 设置标志flags=re.IGNORECASE，意思为忽略大小写
    res = p.findall(string=re_str)
    print(res)
    # ['python 2.7.1', 'Python 3.4.5']
    ```
    
2. `finditer`
    
    finditer返回一个**迭代器**，遍历迭代器可以得到一个`re.Match`对象，比如下面的例子
    
    ```python
    re_str = "what is a different between python 2.7.14 and python 3.5.4"
    
    p = re.compile("\d{1,}\.\d{1,}\.\d{1,}")
    for i in p.finditer(re_str):
        print(i)
    # <re.Match object; span=(35, 41), match='2.7.14'>
    # <re.Match object; span=(53, 58), match='3.5.4'>
    ```
    

### 修改字符串

替换、分割等等

1. `sub(pattern, repl, string, count**=**0, flags**=**0)`
    
    `pattern`: 就是匹配的模式，用compile的话就不写这个了
    
    `repl`: 替换成的字符串，也可以是一个**函数**
    
    `string`: 被替换的字符串
    
    `count`: 替换的最大次数，默认为0，就是全部替换
    
    sub方法类似于字符串的`replace`方法，sub方法支持正则，所以更猛点
    
    ```python
    re_str = "what is a different between python 2.7.14 and python 3.5.4"
     
    p = re.compile("\d+\.\d+\.\d+")
     
    print(p.sub("a.b.c", re_str, count=1))
    # what is a different between python a.b.c and python 3.5.4
     
    print(p.sub("a.b.c", re_str, count=2))
    # what is a different between python a.b.c and python a.b.c
     
    print(p.sub("a.b.c", re_str))
    # what is a different between python a.b.c and python a.b.c
    ```
    
2. `subn`
    
    和sub方法一样，只不过返回一个元组(字符串, 替换次数)
    
3. `split`
    
    split方法类似于字符串的`split`方法，同样的re的split方法更猛
    
    ```python
    re_str = "what is a different between python 2.7.14 and python 3.5.4 USA:NewYork!Zidan.FRA"
     
    p = re.compile("[. :!]") # 以'.', ' ', ':', '!'为分隔符(点号、空格、冒号、感叹号分隔)
     
    print(p.split(re_str))
    # ['what', 'is', 'a', 'different', 'between', 'python', '2', '7', '14', 'and', 'python', '3', '5', '4', 'USA', 'NewYork', 'Zidan', 'FRA']
    ```
    

### re的flags参数

- 常量可叠加使用，因为常量值都是2的幂次方，所以是可以叠加使用的，叠加时请使用 | 符号而不是+ 符号！
1. `re.IGNORECASE` / `re.L`
    
    忽略字母大小写
    
2. `re.ASCII` / `re.A`
    
    顾名思义，ASCII表示ASCII码的意思，让 \w, \W, \b, \B, \d, \D, \s 和 \S 只匹配ASCII，而不是Unicode
    
    ```python
    p = (r'\w+')
    p.findall(r'\w+','阿光tm真帅')
    ['阿光tm真帅']  # w匹配所有字符
    
    p = (r'\w+', flags=re.ASCII)
    p.findall('阿光tm真帅')  # w匹配字母和数字
    ['tm']
    ```
    
3. `re.DOTALL` / `re.S`
    
    DOT表示`.`，ALL表示所有，连起来就是`.`匹配所有，包括换行符`\n`。默认模式下`.`是不能匹配行符`\n`的
    
    ```python
    print('阿光\n真帅')  # 文本中间包含换行符，打印的时候会换行
    # 阿光
    # 真帅
    
    p = re.compile(r'.*')
    p.findall('阿光\n真帅')
    # ['阿光', '', '真帅', '']
    
    p = re.compile(r'.*', flags=re.DOTALL)
    p.findall('阿光\n真帅')
    # ['阿光\n真帅', '']
    ```
    
4. `re.MULTILINE` / `re.M`
    
    多行模式，当某字符串中有换行符`\n`，默认模式下是不支持换行符特性的，比如：行开头和行结尾，而多行模式下是支持匹配行开头的
    
    ```python
    print('阿光\n真帅')  # 文本中间包含换行符，打印的时候会换行
    # 阿光
    # 真帅
    
    p = re.compile(r'^真帅')
    p.findall('阿光\n真帅')
    # []
    
    p = re.compile(r'^真帅', flags=re.MULTILINE)
    p.findall('阿光\n真帅')
    # ['真帅']
    ```
    
5. `re.VERBOSE` / `re.X`
    
    详细模式，可以在正则表达式中加注解！
    
    ```python
    text  = '阿光tm帅'
    
    pat = '''阿光 # 人名，本文作者
             tm  # 强调程度
             帅  # 形容词
          '''
    re.findall(pat,text)
    # []
    re.findall(pat,text,re.VERBOSE)
    # ['阿光tm帅']
    ```
    
    可以看到，默认模式下无法识别正则表达式中的注释，而详细模式是可以识别的。当一个正则表达式十分复杂的时候，详细模式或许能为你提供另一种注释方式，但它**不应该成为炫技的手段，建议谨慎使用！**
    
6. `re.LOCALE` / `re.L`
    
    由当前语言区域决定 \w, \W, \b, \B 和大小写敏感匹配，这个标记只能对byte样式有效，该标记官方已经不推荐使用，因为语言区域机制很不可靠，它一次只能处理一个 "习惯”，而且只对8位字节有效。
    
7. `re.UNICODE` / `re.U`
    
    与 ASCII常量类似，匹配unicode编码支持的字符，但是Python3默认字符串已经是Unicode，所以显得有点多余。
    
8. `re.DEBUG`
    
    显示编译时的debug信息
    
    ```python
    re.findall(r'tm','阿光tm真帅',re.DEBUG)
    
    # LITERAL 116
    # LITERAL 109
    
    #  0. INFO 10 0b11 2 2 (to 11)
    #       prefix_skip 2
    #       prefix [0x74, 0x6d] ('tm')
    #       overlap [0, 0]
    # 11: LITERAL 0x74 ('t')
    # 13. LITERAL 0x6d ('m')
    # 15. SUCCESS
    # ['tm']
    ```
    
9. `re.TEMPLATE` / `re.T`
    
    disable backtracking(禁用回溯)，也就是在正则匹配的过程中，匹配错误后不进行回溯处理
    
    ```python
    re.findall(r'ab{1,3}c','abbc')
    # ['abbc']
    re.findall(r'ab{1,3}c','abbc',re.TEMPLATE)
    # error: internal: unsupported template operator MAX_REPEAT
    ```
    
    我们看看正则一步一步分解匹配过程：
    
    - 正则引擎先匹配 a。
    - 正则引擎尽可能多地(贪婪)匹配 b{1,3}中的 b。
    - 正则引擎去匹配 b，发现没 b 了，糟糕！赶紧回溯！所以第一个案例没禁止，能匹配，第二个案例有禁止，系统报错
    - 返回 b{1,3}这一步，不能这么贪婪，少匹配个 b。
    - 正则引擎去匹配 b。
    - 正则引擎去匹配 c，完成匹配。
    
    以上，就是一个简单的回溯过程，不进行回溯有可能匹配不到满足条件的匹配项