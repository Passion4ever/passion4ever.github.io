---
title: 词向量模型 — Word2Vec
date: 2023-10-25 12:24:04
uuid: 6d199422-86cb-11ee-b04c-f58259a2146b
sticky:
---

{%note info%}
参考: https://juejin.cn/post/6937675663675490341
**Word2Vec**论文: **《[Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/pdf/1301.3781v3.pdf)》**
{%endnote%}

2013年Google提出的词向量模型`Word2Vec`, 通过`Word2Vec`可以用数值向量表示单词, 且在向量空间中可以很好地衡量两个单词的相似性.

<!-- more -->

## 词向量

计算机理解人类的语言首先要做的就是**将单词表示成一个数值向量(称为词向量)**, 以方便计算机处理. 比较直观的做法有**one-hot 编码**和**共现矩阵**等. 

### one-hot 编码

首先构造一个容量为 $N$ 的词汇表, 每个单词可以用一个 $N$ 维的词向量表示, 词向量中只有单词在词汇表的索引处取值为 $1$, 其余为 $0$ 
**one-hot** 编码主要的缺点是：
- **当词汇表的容量变大时, 词向量的特征空间会变得很大**
- **one-hot 编码不能区分单词之间的相似度**

{%asset_img word2vec_1.webp 500%}

### 共现矩阵

假设现在语料库中只有三个句子`"I have a cat"`、`"cat eat fish"`、`"I have a apple"`, 则可以构造出单词间的共现矩阵 $A$. 

例如 `"I"` 和 `"have"` 在两个句子中共同出现过, 因此在 $A$ 中的权重为 $2$ . 而 “I” 和 “cat“ 只在一个句子中共现,  $A$ 中权重为 $1$ . 
$A$ 中的每一行就代表了一个单词的词向量, 与 one-hot 编码类似, 使用共现矩阵的词向量的维度也非常大. 

也可以使用 **SVD (奇异值分解)** 对 $A$ 进行分解, 从而得到更低维度的词向量, 但是 **SVD** 算法的时间复杂度较高, 对 $n*n$ 的矩阵进行 **SVD** 分解的复杂度为 $O(n^3)$ . 

{%asset_img word2vec_2.webp 600%}

## Word2Vec


{%asset_img word2vec_3.webp 500%}

`Word2Vec`是一种浅层神经网络, 包含输入层 $\mathrm{x}$, 隐藏层 $\mathrm{h}$ 和输出层 $\mathrm{o}$. 
输入层、输出层的维度为 $N$  (词汇表的大小), 隐藏层维度为 $D$ (词向量的维度). 
输入层与隐藏层之间的网络权重矩阵为 $\mathrm{V}_{N*D}$, 输入层与隐藏层之间的网络权重矩阵为 $\mathrm{V'}_{N*D}$. 

$$
\begin{gathered}
\mathrm{h}=\mathrm{xV} \\
\mathrm{o}=\operatorname{softmax}\left(\mathrm{V}^{\prime} \mathrm{h}\right)
\end{gathered}
$$

`Word2Vec`输入层 $\mathrm{x}$ 接收单词 **a** 的 one-hot 编码, 输出层 $\mathrm{o}$ 计算出所有单词出现在单词 **a** 上下文的概率, 概率用 $\operatorname{softmax}$ 计算. 
`Word2Vec`在语料库中训练, 使单词出现的条件概率尽可能符合语料库中的分布. 训练完后, 神经网络的权重向量矩阵 $\mathrm{V}$ 就是最终的词向量矩阵, 而 $\mathrm{V'}$ 是词作为预测输出时的向量矩阵. 

{%asset_img word2vec_4.webp 600%}

`Word2Vec`有两种模型`CBOW`和`Skip-Gram`, 两种模型的区别在于`CBOW`**使用上下文词预测中心词**, 而`Skip-Gram`**使用中心词预测其上下文单词**. 

{%asset_img word2vec_5.webp 600%}
{%cq%}
`CBOW`和`Skip-Gram`模型图
{%endcq%}

### CBOW

注意下面的描述中  $w(x)$ **表示第 $x$ 个单词**, $v(x)$ **表示第 $x$ 个单词对应的词向量**, $v'(x)$ **表示预测输出时对应第 $x$ 个单词的权重向量**
给定一个句子 $[w(1), w(2), w(3), ..., w(T)]$, 对于任意一个单词 $w(t)$, 其上下文单词包括 $[w(t-c), ..., w(t-1), w(t+1), ..., w(t+c)]$, $c$ 为上下文窗口的大小. 

{%asset_img word2vec_6.webp %}

`CBOW`希望通过上下文单词 $[w(t-c), ..., w(t-1), w(t+1), ..., w(t+c)]$ 预测中心词是 $w(t)$ 的概率, 因此输入到神经元的有 $2c$ 个 one-hot 编码. 
实际上是把上下文单词 $[w(t-c), ..., w(t-1), w(t+1), ..., w(t+c)]$ 对应的词向量的均值传入神经网络的隐藏层 $\mathrm{h}$ (如下公式), 然后计算输出单词 $w(t)$ 的概率. 

$$
\mathrm{h}=\frac{1}{2 c} \sum_{-c \leq j \leq c, j \neq 0} v(t+j) \quad v \text { 表示词向量 }
$$

因此对于一个句子 $[w(1), w(2), w(3), ..., w(T)]$, `CBOW`需要最大化以下目标函数, 其中概率使用 $\operatorname{softmax}$ 计算：

$$
\begin{gathered}L=\frac{1}{\mathrm{~T}} \sum_{t=1}^T \log P(w(t) \mid w(t-c): w(t+c)) \\P(w(t) \mid w(t-c): w(t+c))=\frac{\exp \left(h^T v^{\prime}(t)\right)}{\sum_{n=1}^N \exp \left(h^T v^{\prime}(n)\right)}\end{gathered}
$$

### Skip-Gram

`Skip-Gram`与`CBOW`不同, 给定一个句子 $[w(1), w(2), w(3), ..., w(T)]$, 对于任意一个中心词 $w(t)$, 需要计算上下文单词的 $[w(t-c), ..., w(t-1), w(t+1), ..., w(t+c)]$ 的概率. 
因此需要最大化以下目标函数：

$$
\begin{gathered}L=\frac{1}{\mathrm{~T}} \sum_{t=1}^T \sum_{-c \leq j \leq c, j \neq 0} \log P(w(t+j) \mid w(t)) \\P(w(t+j) \mid w(t))=\frac{\exp \left(v(t)^T v^{\prime}(t+j)\right)}{\sum_{n=1}^N \exp \left(v(t)^T v^{\prime}(n)\right)}\end{gathered}
$$

## 优化方法


优化`CBOW`和`Skip-Gram`都需要计算 $\operatorname{softmax}$, 其中需要在所有单词上进行求和, 效率低下. 
一般可以采用两种优化方法：`Hierarchical softmax`和`Negative sampling`. 

### Hierarchical softmax

对于一个 $N$ 分类问题, $\operatorname{softmax}$ 可以求出每一个类的概率, 并且 $N$ 个类的概率之和为 $1$ . Hierarchical softmax 简化了 $\operatorname{softmax}$ 的计算, 采用二叉树结构 (可以使用霍夫曼树优化), 把一个 $N$ 分类问题转换成 $\mathrm{log}_N$ 个二分类问题. 

{%asset_img word2vec_7.webp %}

其中 $n$ 表示节点, $n(w, j)$ 表示从根节点到单词 $w$ 路径上的第 $j$ 个节点, $n(w, 1)$ 表示从根节点, $L(w)$ 表示从根节点到单词 $w$ 的路径长度. 
输入单词的词向量为 $v(x)$, 则到达某一节点 $n(w, j)$ 后往左子树走和往右子树走的概率分别为：

$$
\begin{gathered}p(n, \text { left })=\operatorname{sigmoid}\left(v^{\prime}(w, j)^T v(x)\right) \\p(n, \text { right })=\operatorname{sigmoid}\left(-v^{\prime}(w, j)^T v(x)\right)\end{gathered}
$$

而通过单词 $v(x)$ 观察到其上下文单词 $w$ 的概率可以如下计算：

$$
\begin{gathered}p(w \mid x)=\prod_{j=1}^{L(w)-1} \sigma\left(\llbracket n(w, j+1)=\operatorname{leftchild}(n(w, j)) \rrbracket \cdot v^{\prime}(w, j)^T v(x)\right) \\\llbracket n(w, j+1)=\operatorname{leftchild}(n(w, j)) \rrbracket=\left\{\begin{array}{cc}1 & n(w, j+1) \text { 是 }(n(w, j)) \text { 左节点 } \\-1 & n(w, j+1) \text { 是 }(n(w, j)) \text { 右节点 }\end{array}\right.\end{gathered}
$$

### 3.2 Negative sampling

Negative sampling 是负采样算法, 给定训练样本单词 $x$ 和 $x$ 的上下文单词 $pos$. 负采样算法将 $pos$ 作为 $x$ 的正样本, 然后从词汇表中随机采样 $k$ 个单词 $neg$  构成负样本, 然后最大化通过 $x$ 观察到 $pos$ 的概率, 最小化通过 $x$ 观察到负样本 $neg$ 的概率. 需要最大化如下目标函数：

$$
\log p(\text { pos } \mid x)=\log \sigma\left(v^{\prime}(\text { pos })^T v(x)\right)+\sum_{i=1}^k E_{n e g_i \sim P_n(w)}\left[\log \sigma\left(-v^{\prime}\left(n e g_i\right)^T v(x)\right)\right]
$$

每个单词被采样作为负样本的概率如下：

$$
P_n\left(w_i\right)=\frac{f\left(w_i\right)^{3 / 4}}{\sum_{j=1}^n f\left(w_j\right)^{3 / 4}}
$$

## 总结

**优点**:
- 模型简单
- 训练速度快
- 训练中会考虑单词的上下文

**缺点**:
- 上下文窗口较小, 也没有使用全局的单词共现信息
- 每个单词的词向量是固定的, 无法解决一词多义的问题