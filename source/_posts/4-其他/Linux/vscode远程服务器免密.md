---
title: VSCode远程服务器免密配置
date: 2024-01-06 16:37:26
uuid: d1f3f430-ac6e-11ee-86cd-4f8d3e6d1f22
sticky:
---

{%note info%}
1. 本机安装ssh，check ssh是否安装成功： `ssh` 或者 `ssh-V`
2. vscode安装 Remote-SSH 插件
3. 配置密钥
   1. 在本地机器生成密钥对(公钥+私钥)
   2. 公钥内容添加到远程`authorized_keys`内(`~/.ssh/authorized_keys`)
   3. Remote-SSH 插件 config文件加入本机私钥路径
{%endnote%}

<!-- more -->

## 具体步骤

### 本机安装ssh

现在系统一般都自带，若没，可google安装

### VSCode 安装远程插件

扩展中搜索Remote-SSH，安装

### 配置密钥

#### ssh-keygen 生成密钥对

- `id_rsa.pub`是公钥，`id_rsa`是私钥。

{%asset_img vscode远程服务器免密_1.webp%}

- 如果多平台都要使用ssh，则需要修改两个密钥文件名，避免冲突(建议)

#### 公钥内容添加到远程authorized_keys内

复制id_rsa.pub内容，然后到服务器`~/.ssh`文件夹内。看有没有`authorized_keys`文件，有的话，把公钥内容添加到新的一行，没有就创建authorized_keys文件并添加进去。

#### Remote-SSH 插件 config文件加入本机私钥路径

进入.ssh/config文件
{%asset_img vscode远程服务器免密_2.webp%}


修改.ssh/config文件：加入`IdentityFile`的路径（也就是私钥在本机的所在位置）
{%asset_img vscode远程服务器免密_3.webp%}


完事~