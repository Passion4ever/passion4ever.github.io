---
title: 解决git@github.com:Permission denied (publickey)
date: 2024-01-06 17:06:46
uuid: eacf08b0-ac72-11ee-9ab0-090f13a67101
sticky:
---

{%note info%}
出现这个问题一般都是密钥问题
{%endnote%}

## ssh-keygen

1. 首先，如果你没有ssh key的话，输入命令：`ssh-keygen -t rsa -C "xx@example.com"`， `"xx@example.com"`改为自己的邮箱即可，途中会让你输入密码啥的，不需要管，一路回车即可，会生成你的ssh key。（如果重新生成的话会覆盖之前的ssh key。）

<!-- more -->

{%asset_img 解决git@github.com拒绝_1.webp%}

## 测试github git

2. 然后再执行命令：`ssh -v git@github.com`

最后两句会出现：

No more authentication methods to try.  
Permission denied (publickey).

{%asset_img 解决git@github.com拒绝_2.webp%}

## ssh-agent -s

3. 这时候再下输入：`ssh-agent -s`
然后会提示类似的信息：

{%asset_img 解决git@github.com拒绝_3.webp%}

## ssh-add ~/.ssh/id_rsa

4. 接着再输入：`ssh-add ~/.ssh/id_rsa`

这时候应该会提示：
{%asset_img 解决git@github.com拒绝_4.webp%}

（注意）如果出现错误提示：
{%asset_img 解决git@github.com拒绝_5.webp%}

请执行命令：`eval ssh-agent -s`后，继续执行命令 `ssh-add ~/.ssh/id_rsa`，这时候一般OK了。

## Github 添加SSH Key

5. 打开你刚刚生成的id_rsa.pub，将里面的内容复制，进入你的github账号，在settings下，SSH and GPG keys下new SSH key，title随便取一个名字，然后将id_rsa.pub里的内容复制到Key中，完成后Add SSH Key。

6. 最后一步，验证Key

输入命令：`ssh -T git@github.com`

提示：如下信息就OK了。
{%asset_img 解决git@github.com拒绝_6.webp%}

