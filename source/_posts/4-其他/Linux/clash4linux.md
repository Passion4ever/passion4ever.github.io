---
title: Linux 配置 clash-core
date: 2023-10-16 19:58:12
uuid: 6d191ef0-86cb-11ee-b04c-f58259a2146b
sticky:
---

{% note info %}
参考视频: https://www.youtube.com/watch?v=VOlWdNZAq_o
参考教程: [在 Linux 中使用 Clash](https://blog.iswiftai.com/posts/clash-linux/)
Github: https://github.com/Dreamacro/clash/releases
你想安装它一般来说就是服务器访问外网很慢, 所以就本地下载压缩包
**默认你本地可以访问github啥的**
{% endnote %}

<!-- more -->

## Clash For Linux

本地下载clash for linux, 上传到服务器后

```bash
# 解压
gunzip clash-linux-amd64-v1.14.0.gz
# 赋予权限
chmod +x clash-linux-amd64-v1.14.0
# 运行,可能因为网络原因Country.mmdb下载不了, Ctrl+C取消就行
./clash-linux-amd64-v1.14.0
# 复制到配置文件目录中并重命名为clash
cp clash-linux-amd64-v1.14.0 ~/.config/clash/clash
```

如果不能下载 `Country.mmdb` , 先尝试

```bash
wget -O Country.mmdb https://www.sub-speeder.com/client-download/Country.mmdb
```

还是不行的话, 把 `Country.mmdb` 下载到本地, 传到服务器上

```bash
# 复制到配置文件目录中
cp Country.mmdb ~/.config/clash/Country.mmdb
```

文件 `config.yaml` 中包含的是你配置信息, 这里需要使用代理商提供的订阅链接, 要是不行的话, 把 `config.yaml` 下载到本地, 传到服务器上, 或者把订阅的yaml内容复制, 改服务器的 `config.yaml` 内容

```bash
wget -O config.yaml [代理商提供的订阅链接]
cp config.yaml ~/.config/clash/config.yaml
```

把下面的代码放到你的shell 配置文件中( `.bashrc` 或 `.zshrc` 等)**这里home后面的用户名是你自己的, 改一下**

```bash
# clash
alias 'clash'='nohup /home/yg/.config/clash/clash -d /home/yg/.config/clash > /dev/null 2>&1 &'                  
alias 'unclash'='pkill -9 clash'
# proxy
alias proxy="export http_proxy=http://127.0.0.1:7890;export https_proxy=http://127.0.0.1:7890"
alias unproxy="unset http_proxy;unset https_proxy"
```

修改了后激活一下

```bash
# 激活, 用什么shell就改它的配置文件
source .bashrc
```

然后就ok了

```bash
# 打开clash
clash
# 关闭clash
unclash
# 开启代理
proxy
# 关闭代理
unproxy
```

测试一下

```bash
curl -i google.com
# 有返回内容，说明OK
```

{%asset_img clash4linux_0.webp%}

