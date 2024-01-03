---
title: Mac环境 Github + Hexo + NexT 搭建个人网站
date: 2023-07-29 23:50:24
uuid: 6d191ef4-86cb-11ee-b04c-f58259a2146b
sticky: true
---


{%note info%}
教程导向: 记录自己在Mac环境 `Github` + `Hexo` + `NexT` 搭建个人网站的步骤, 以及设置.
同时也记录了报错以及解决方法
{%endnote%}

<!-- more -->

## 配置环境软件

开始之前需要在电脑上安装`Git`和`Node.js`, Mac上可以使用`Homebrew`命令行工具来安装

{% note info %}
关于 `Homebrew` , 没安装的直接
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
不具体说了, 很简单
{% endnote %}

{% note success %}
如果某一步你已经做了, 跳过就好
{% endnote %}

### 安装 Node.js 和 Git

```bash
# 安装 Node.js
brew install node
# 查看版本
node -v
npm -v
# 安装 Git
brew install git
# 查看版本
git -v
# 都出现版本号说明安装成功
```

### 修改npm镜像源

使用npm过程中经常会遇到无法下载包的问题, 要修改镜像源
修改成淘宝镜像源
```bash
# 修改源
npm config set registry https://registry.npmmirror.com
# 验证
npm config get registry
# 如果返回 https://registry.npmmirror.com 说明镜像配置成功
```

### 配置 Git

这步是为了后面部署到 `Github` 上
```bash
git config --global user.name "username"
git config --global user.email "email@email.com"
```
其中 `username` 是你的用户名, `email@email.com` 是你`github`的登录邮箱
然后通过终端命令生成SSH Key
```bash
ssh-keygen -t rsa -C "email@email.com"
```
如果已经创建过会出现 `Overwrite (y/n)?` `n`提示可以输入 `n`, 如果没有创建过会要求我们输入密码, 然后**一路回车**下去就行, 执行完成后会在`~/.ssh/id_rsa.pub`目录下生成 需要使用的 key.

可以使用命令行输出key并复制
```bash
cat ~/.ssh/id_rsa.pub
```
或者可以找到这个文件并打开它, 复制里面的内容.

然后登录github账号 找到 `Settings`
{%asset_img github_hexo_next_tutorial_1.webp%}
先点击 `SSH and GPG keys` 然后再点击 `New SSH key` 进入到配置 SSH Key 的页面
{%asset_img github_hexo_next_tutorial_2.webp%}
然后输入复制好的key的内容, 点击 `Add SSH Key` 即可
{%asset_img github_hexo_next_tutorial_3.webp%}

### 安装 hexo

```bash
sudo npm install -g hexo-cli
# 卸载的话就是
sudo npm uninstall hexo-cli -g
```
这里就安装配置环境和软件就完事儿了

### 初次使用hexo

安装完成后在你想放个人站点的路径下创建一个文件夹`hexo_site`(叫啥都可以), 在该文件夹下初始化博客
```bash
# 先cd 到 hexo_site
hexo init
```
如果出现这个错误:
```bash
INFO  Cloning hexo-starter https://github.com/hexojs/hexo-starter.git
INFO  Install dependencies
WARN  Failed to install dependencies. Please run 'npm install' in "/Users/Documents/GitHub/hexo-site" folder.
```
运行`npm install`即可

初始化成功后, 在hexo_site目录下执行预览操作
```bash
hexo s
```
当看到如下输出就可以预览我们创建的博客了
```bash
INFO  Validating config
INFO  Start processing
INFO  Hexo is running at http://localhost:4000 . Press Ctrl+C to stop. 
```
预览效果

{%asset_img github_hexo_next_tutorial_4.webp%}

### 本地站点关联到Github 

登录Github并且创建一个名字为 `username.githug.io` 的仓库, `username` 是你 Github 的用户名(大小写应该是无所谓的)
因为我已经创建过了, 所以会显示红色, 如果创建过, 会显示绿色的, 然后点击创建. 切记一定要选择 `Public`, 否定不能访问. 
{%asset_img github_hexo_next_tutorial_5.webp%}

然后切到`hexo_site`目录下
```bash
sudo npm install hexo-deployer-git --save
```
然后开始修改配置文件 `/hexo_site/_config.yml`
修改 `deploy`部分为
```yaml
# 改成自己的
deploy:
  type: git
  repo: git@github.com:Passion4ever/passion4ever.github.io.git
  branch: main
```
```bash
# 生成文件
hexo g
# 部署
hexo d
```
然后就可以通过 `username.githug.io` 来访问啦

### 域名绑定到 Github Pages(可选)

这块我不太想说, 其实差不多, 具体的自己去网上找教程吧, 多的很.


### 安装 NexT 主题
```bash
cd hexo_site
npm install hexo-theme-next
```
然后在站点根目录下找到`_config.yml`
```yaml
# 改成 next 主题
theme: next
```
重新部署即可

### 你可能想更改 hexo 或者 next 的配置, 想美化

关于如何更改配置, 请先参阅hexo next 官方文档 [Alternate Theme Config](https://theme-next.js.org/docs/getting-started/configuration.html)和 [Custom Files](https://theme-next.js.org/docs/advanced-settings/custom-files.html). 要说的东西很多, 可以自己看. 
我选择的是在 hexo配置文件中添加`theme_config`键值对, 把需要更改的 next 配置给覆盖, 这样也便于维护

更改 hexo 站点的配置, 参阅[Hexo官方文档](https://hexo.io/zh-cn/docs/)

{%note success%}
其实在网上搜索了很多教程, 很多都过时了! 关于 next 相关
‼️去看[Next官方文档](https://theme-next.js.org/)才是最好的‼️
{%endnote%}

#### 创建分类页面和标签页面

```bash
hexo new page categories
hexo new page tags
```
点开分类和标签其实是没得, 还得到 `source` 目录下的 `categories` 和 `tags` 下的 `index.md` 分别添加 `type: categories`, `type: tags`

#### 添加搜索(NEXT) - 插件

next 配置
```yaml
local_search:
  enable: true
```
然后命令行
```bash
npm install hexo-generator-searchdb --save
```

#### Next主题之Latex数学公式渲染 - 插件
去 next 主题 github 仓库的[中文文档](https://github.com/theme-next/hexo-theme-next/blob/master/docs/zh-CN/MATH.md)有介绍, 使用 **MathJax** 或者 **Katex**

前者全面, 后者轻量, 我是用的是后者. 

#### 唯一链接标识 - 插件

使用`hexo-uuid`

```bash
npm install hexo-uuid --save
```
`_config.yml` 中修改
```yaml
permalink: posts/:uuid/
```

#### 图片的问题

我是用的资源存储方式是 `post_asset_folder` 为 `true` ,也即如下路径关系
```
_post           
├─ test         
│  └─ fig1.webp  
└─ test.md      

```
那么按理来说, 我引用这个图片只需要在`test.md`中使用 `![alt](/test/fig1.webp)` 即可(路径前面有没有 `./` `/` 都无所谓), 但是, 本地 markdown渲染都没问题, hexo 在网页上就不显示. 

后来发现使用 `post_asset_folder` 为 `true` 这种资源存储方式, 图片最后会和 `.md` 文件在统一目录下, 所以**直接引用即可**, 即`![alt](fig1.webp)` 

真的坑人!

又遇到了首页无法显示图, 点进文章可以, 真的恶心, 最后使用了
`{%asset_img xxx.webp alt %}` 的方式
还是这个靠谱, 就是无法显示图片的 caption

#### 添加文章置顶功能

直接在文章上加个`sticky: 数字`即可

也可以使用插件[hexo-cake-moon-menu](https://github.com/jiangtj-lab/hexo-cake-moon-menu)
```css
/* 在 node_modules/hexo-cake-moon-menu/assets 文件夹下找light.css或者 dark.css */
/* 好像这个是根据你系统的明暗主题和 hexo 与 next 主题无关(不确定) */
.moon-menu {
  --moon-cricle: #9f9f9f;
  --color: #dddddd;
  --moon-item-bg-color: #9f9f9f;
}
```

#### 文章添加阴影
`source/_data/styles.styl`下添加
```css
// 文章添加阴影效果
.post-block {
    visibility: display;
    margin-top: 25px;
    margin-bottom: 25px;
    padding: 25px;
    border-radius: 20px 20px 20px 20px;
    -webkit-box-shadow: 0 0 20px rgba(202, 203, 203, .5);
    -moz-box-shadow: 0 0 5px rgba(202, 203, 204, .5);
}
```


## hexo 常用命令

```bash
hexo n "博客名称"  => hexo new "博客名称"   # 这两个都是创建新文章，前者是简写模式
hexo p  => hexo publish
hexo g  => hexo generate  # 生成
hexo s  => hexo server  # 启动服务预览
hexo d  => hexo deploy  # 部署  

hexo server   # Hexo 会监视文件变动并自动更新，无须重启服务器。
hexo server -s   #静态模式
hexo server -p 5000   #更改端口
hexo server -i 192.168.1.1   #自定义IP
hexo clean   #清除缓存，网页正常情况下可以忽略此条命令
hexo g   # 生成静态网页
hexo d   # 开始部署
```
具体的指令解释可以看[官方文档](https://hexo.io/zh-cn/docs/commands)

## NexT 主题 常用命令

{% note default %}
default 提示块标签
{% endnote %}

{% note primary %}
primary 提示块标签
{% endnote %}

{% note success %}
success 提示块标签
{% endnote %}

{% note info %}
info 提示块标签
{% endnote %}

{% note warning %}
warning 提示块标签
{% endnote %}

{% note danger %}
danger 提示块标签
{% endnote %}

```
{% note default %}
default 提示块标签
{% endnote %}

{% note primary %}
primary 提示块标签
{% endnote %}

{% note success %}
success 提示块标签
{% endnote %}

{% note info %}
info 提示块标签
{% endnote %}

{% note warning %}
warning 提示块标签
{% endnote %}

{% note danger %}
danger 提示块标签
{% endnote %}
```