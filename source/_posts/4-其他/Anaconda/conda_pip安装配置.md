---
title: conda & pip 安装配置
date: 2023-10-16 21:30:59
uuid: 6d191ef2-86cb-11ee-b04c-f58259a2146b
sticky:
---

## 安装 conda

可以选择安装 [miniconda](https://docs.conda.io/projects/miniconda/en/latest/) 或者 [miniforge](https://github.com/conda-forge/miniforge), 目前官网都有详细的安装方法
两者的区别在 [一文解释 conda,pip,anaconda,miniconda,miniforge](/posts/51730) 中有介绍

<!-- more -->

## 卸载 conda

依次运行即可
```bash
rm -rf $(conda info --base)
rm ~/.condarc
rm -rf ~/.conda
```

## 更改 conda 镜像源

### 临时切换通道

```bash
conda install pytorch torchvision -c https://mirrors6.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
```
`-c` 后面的链接就是通道链接

### 长期切换通道

- 推荐生成 `.condarc` 文件后手动编辑文件内容，而不是通过命令行一个一个添加channel
- `.condarc` 文件默认不生成，运行一下命令就可以在用户目录下生成：`conda config --set show_channel_urls yes`, 或者自己手动创建一个

```bash
channels:
  - https://mirrors.tuna.tsinghua.edu.cn//anaconda/cloud/conda-forge/
  - conda-forge
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - pytorch
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
  - defaults
  # - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda
show_channel_urls: true
ssl_verify: true
channel_priority: flexible
# channel_priority: strict
```

然后 `conda clean -i` 清除索引缓存
以上用的是清华源，如果想切换北外、阿里云、中科大、上交镜像的话，可以将上面的`https://mirrors.tuna.tsinghua.edu.cn/anaconda`分别替换为：

```bash
https://mirrors.bfsu.edu.cn/anaconda  # (北外，清华的姊妹站)
https://mirrors.aliyun.com/anaconda  # (阿里云，比较新，之前只有pypi镜像)
https://mirrors.ustc.edu.cn/anaconda  # (中科大:由于合规性Anaconda源目前已经无限期停止服务)
https://anaconda.mirrors.sjtug.sjtu.edu.cn  # (上交)

# 换回默认源的命令：
conda config --remove-key channels
```

## 更改 pip 镜像源

### 临时切换通道

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple some-package
# 不行的话加参数 --trusted-host pypi.tuna.tsinghua.edu.cn
```

### 长期切换通道

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

长期使用也可以创建用户目录下的配置文件(~/.pip/pip.conf or C:\Users\xx\pip\pip.ini)，填入下面内容：

```bash
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple  # 清华镜像，可以换成其他的镜像
trusted-host = pypi.tuna.tsinghua.edu.cn  # 添加清华源为可信主机，要不然可能报错
disable-pip-version-check = true  # 取消pip版本检查，排除每次都报最新的
pip timeout = 120
```

国内pip镜像源：

```bash
清华：https://pypi.tuna.tsinghua.edu.cn/simple
北外：https://mirrors.bfsu.edu.cn/pypi/web/simple
阿里云：https://mirrors.aliyun.com/pypi/simple/
中国科技大学：https://pypi.mirrors.ustc.edu.cn/simple/
华中科技大学：http://pypi.hustunique.com/
山东理工大学：http://pypi.sdutlinux.org/
豆瓣：http://pypi.douban.com/simple/

```

新版ubuntu要求使用https源，要注意。Noarch is a contraction of "no architecture".

## conda 常用命令

```bash
# 1. 创建新环境(加上 --clone 就是克隆原环境)
conda create -n NewName --clone OldName
# 2. 删除环境
conda env remove -n OldName --all
# 3. 激活/切换 环境
conda activate EnvName
# 4. 退回 base 环境
conda deactivate
# 5. 查看 conda 有哪些环境
conda env list 
conda info -e
# 6. 查看当前环境有哪些包
conda list
# 7. 导出当前环境
conda env export > env_filename.yaml
# 8. 导入当前环境
conda env create -f env_filename.yaml
```