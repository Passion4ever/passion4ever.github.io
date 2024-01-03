---
title: 一文解释 conda,pip,anaconda,miniconda,miniforge
date: 2023-10-16 20:46:05
uuid: 6d191ef5-86cb-11ee-b04c-f58259a2146b
sticky:
---

> 转载修改自: https://zhuanlan.zhihu.com/p/518926990

## Anaconda vs Miniconda vs Miniforge

他们的核心都是包含 `conda` 这一工具, 来实现 python 环境(environment) 和 包(package) 管理的, （其实不仅仅可以用来管理python, 很多语言R, Java, C都支持）；然后就可以通过：
```bash
# 安装包
conda install numpy 
# 创建环境
conda create -n myenv python=3.9 
```

<!-- more -->

Anaconda 和 Miniconda 是一个公司的产品, 商用是付费的, 个人暂时免费；而 Miniforge 是由社区主导, 用GitHub托管, 完全免费. Miniconda 和 Miniforge 是差不多的产物, 代表着轻量化, 而 Anaconda 是完整版, 就略显臃肿. 这里先比较 Anaconda vs Miniconda, 而后比较 Miniconda vs Miniforge

### Anaconda vs Miniconda

简而言之:
**Miniconda** = `Python` + `conda` (with minimal dependencies...)
**Anaconda** = `Python` + `conda` + `meta packages` (about 160 Python pkgs...)
Anaconda 一般还包括一个图形界面, 主要是多了一些基本的包, 很省事, 不用再单独安装了, 但也有一些可能一直用不到, 白白占用了空间. Miniconda 可以按需求安装库, 但也可以借助conda install anaconda手动实现anaconda一样的 pre-installed package. 一个是安装初期花费更多时间下载, 一个是后期花更多时间单独安装. 我个人倾向于 Miniconda, 一切从简. 

### Miniconda vs Miniforge

**Miniforge** 使用 `conda-forge` 作为默认 channel, 而 **Miniconda** 使用 `anaconda.org` 作为默认channel. channel的含义在这里介绍一下：
{%note info%}
conda channels (源) 是你是从哪个来源下载这个包, 对应到conda内部处理则是下载文件的链接. 因为不同源会有相同名字的包, 因此必须指定来源, 同时安装conda的时候也会有一个默认的channel. 目前主流的就是 `conda-forge`, 齐全且更新快. 如果有多个channel, 他们会按顺序确定优先级, 优先的源上找不到, 就会到下一个优先级的源上去找. 还可以设置channel的优先级是否strict, 如果是strict的话, 则只会在这一个源上查找. 
简言之, 我个人更倾向于 Miniforge, 社区万岁. (如果习惯用 mamba, 还有 mambaforge 可供使用)
{%endnote%}

## Conda vs Pip
conda package的来源在前面介绍过了, 而pip的来源是 PyPI (Python Package Index). pip是专门针对python打包而成的, 属于wheels or source distributions, 需要compiler来安装；而conda packages are binaries, 因此包含例如C语言写的库, 同时也不需要compilers. pip的没有严格的依赖冲突检查, 而conda是会有严格的依赖冲突检查. 

通常我们安装一个python包, 直接用pip install <pkg-name> 就行, 但如果我们想要多个python环境, 也就需要用到virtualenv；同时如果这个包没有不是 Python packages, 是用C语言写的；这时候就需要Conda登场了, 它同时解决了以上所有问题. 


{%note info%}
仅代表个人, 我习惯于使用 conda 作为最高优先级, conda 解决不了再使用 pip. 
可能很多人吐槽 conda 安装慢或者容易失败, 一部分原因在于镜像源,另一部分原因在于 conda 会解析依赖, 保证安装完一定能 work, 所以慢(我自己是富强民主了一波,时间基本花在解析依赖,不存在下载慢的问题). 
反正我是不想安装的时候很爽, 用的时候这不行那不行.
{%endnote%}
