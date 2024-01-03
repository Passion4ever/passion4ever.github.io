---
title: 词向量模型 — GloVe
date: 2023-10-25 13:16:57
uuid: 6d196d27-86cb-11ee-b04c-f58259a2146b
sticky:
---

{%note info%}
参考: https://juejin.cn/post/6949155387308244999
**GloVe**论文: **《[GloVe: Global Vectors for Word Representation](https://aclanthology.org/D14-1162.pdf)》**
{%endnote%}

常见的词嵌入算法有**基于矩阵分解**的方法和**基于浅层窗口**的方法, **前者可以有效地利用全局信息, 但是在大数据集上速度慢**；而**后者对于词汇类比任务效果较好, 训练速度快, 但是不能有效利用全局信息**. `GloVe` 结合了这两类方法的优点生成词向量

<!-- more -->

## 词嵌入算法 Word Embedding

之前主要介绍了词嵌入算法 [Word2Vec](/posts/51729). 与传统的 one-hot 编码、共现向量相比, 词嵌入算法得到的词向量维度更低、也可以更好地支持一些下游的任务, 例如文档分类, 问答系统等. 

本文介绍另一种词嵌入算法`GloVe`, 首先简述目前主要的两类词嵌入算法的优缺点. 

- 第一类是 **Matrix Factorization** (矩阵分解) 方法, 例如 LSA；
- 第二类是 **Shallow Window-Based** (基于浅层窗口) 方法, 也称为基于预测的方法, 例如 Word2Vec. 

GloVe 算法结合了基于统计和基于浅窗口两种方法的优点. 

### 矩阵分解

基于矩阵分解的 word embedding 算法是一种利用了全局统计信息的方法

1. 首先需要在语料库中构造出**单词共现矩阵**或者**文档 - 单词矩阵**. 

    下面用一个简单的例子说明, 假设语料库中包含以下三个文档, 则可以构造出对应的**单词共现矩阵**或者**文档 - 单词矩阵**：

    ```
    文档 1：I have a cat
    文档 2：cat eat fish
    文档 3：I have a apple
    ```

    {%asset_img glove_1.webp %}
    {%cq%}
    **单词共现矩阵**中, 单词 `"I"` 和 单词 `"have"` 在两篇文档中共同出现, 因此其连接权重为 $2$ . **文档 - 单词矩阵**中文档 1 包含一个单词 `"I"`, 因此为 $1$ . 在实际构造**文档 - 单词矩阵**时则可以使用 **tf-idf** 作为权重. 
    {%endcq%}

2. 得到**单词共现矩阵**或者**文档 - 单词矩阵**后可以采用 LSA 算法学习得到词向量, LSA 算法 (潜在语义分析) 主要用于文本话题分析, 通过对**文档 - 单词矩阵**进行分解可以找出文档与话题、单词与话题之间的联系 . 
    矩阵 $X_{M×N}$ 表示**文档 - 单词矩阵**, 其中包含 $M$ 个文档和 $N$ 个单词. LSA 使用 SVD 分解矩阵 $X$ , 得到两个低维的矩阵 $U_{M×k}$ 和 $V_{N×k}$, **V** 的每一行就是一个单词的词向量. 

    $$
    \mathrm{X}_{\mathrm{M} \times \mathrm{N}}=\mathrm{U}_{\mathrm{M} \times \mathrm{k}} \Sigma_{\mathrm{k} \times \mathrm{k}} \mathrm{V}_{\mathrm{N} \times \mathrm{k}}^T
    $$


**优点**:
1. 可以有效利用全局统计信息

**缺点**: 
1. SVD算法的时间复杂度太大, 不适合用于大数据集；
2. 主要用于获取词汇的相似性, 对于词汇类比任务的表现没有基于浅窗口预测的方法好. 


### 基于浅窗口

基于浅窗口的方法也称为基于预测的方法, 代表算法有 NNLM、Word2Vec 等. 

基于浅窗口的方法通常使用语料库的局部信息, 在训练的过程中生成一个局部的上下文窗口. 通过用上下文单词预测中心词或者用中心词预测上下文单词, 最大化条件概率 $P(\text{中心词}|\text{上下文单词})$ 或者 $P(\text{上下文单词}|\text{中心词})$, 从而训练得到词向量. 

例如在 [Word2Vec](/posts/51729) 中的 CBOW 模型主要是通过上下文单词预测中心词, 最大化 $P(\text{中心词}|\text{上下文单词})$ . 


**优点**: 
1. 训练的过程中采用了预测的方式, 在词汇类比任务中的表现更好
2. 训练更快, 能适应大数据集
3. 能够学习到单词之间除了相似性之外的复杂模式

**缺点**: 
1. 不能很好的使用全局统计信息
2. 需要大量的数据集

## GloVe 单词共现矩阵与共现概率矩阵

GloVe模型将 LSA 和 Word2Vec 的优点结合在一起, 既利用了语料库的全局统计信息, 也利用了局部的上下文特征 (滑动窗口). 

GloVe 首先需要构造**单词共现矩阵**, 并提出了**共现概率矩阵** (Co-occurrence Probabilities Matrix)的概念, 共现概率矩阵可以通过单词共现矩阵计算. 

### GloVe 单词共现矩阵

GloVe 中构造**单词共现矩阵**时与 LSA 存在一些区别, 需要限定一个上下文窗口, 构造的过程如下：

1. 构造一个 N×N 的空矩阵, 值为 $0$
2. 定义一个滑动窗口, 大小为 $c$
3. 从语料库的第 $1$ 个单词开始作为中心词滑动窗口, 中心词在窗口中心
4. 中心词左右两边的单词有 $c-1$ 个, 为上下文单词
5. 统计中心词右的上下文单词出现的次数, 添加到矩阵中
6. 继续滑动窗口

例如给定句子 `"I have a cat"` 和上下文窗口大小为 $3$, 则可以构造出以下窗口. 

当遍历到第 $3$ 个窗口 `"have a cat"` 时, 中心词是 `"a"`, 此时要在**单词共现矩阵** $\mathrm{X}$ 中加上统计信息. $\mathrm{X}(a, have) += 1$, $\mathrm{X}(a, cat) += 1$. 注意这种方法构造出的**单词共现矩阵** $\mathrm{X}$ 是对称矩阵. 在实际使用的时候, 还可以根据上下文单词与中心词的距离调整添加到矩阵 $\mathrm{X}$ 中的权重, 远的词权重小, 而近的词权重大. 

{%asset_img glove_2.webp 300%}

### GloVe 共现概率矩阵

统计出**共现矩阵** **X** 后, 可以使用 $\mathrm{X}_{ij}$ 表示单词 $i$ 和 $j$ 共同出现的次数, 而 $\mathrm{X}_i$ 为所有 $\mathrm{X}_{ij}$ 的和, $\mathrm{P}_{ij} = \mathrm{P}(j|i)$ 表示单词 $j$ 出现在单词 $i$ 上下文的概率. 

$$
\begin{gathered}\mathrm{X}_i,\mathrm{X}_{i j} \\
\mathrm{P}_{i j}=\mathrm{P}(\mathrm{j} \mid \mathrm{i})=\frac{\mathrm{X}_{i j}}{\mathrm{X}_i}\end{gathered}
$$

GloVe 在上述基础上提出了**共现概率 (Co-occurrence)** 的概念, **共现概率**可以理解为上面**条件概率**的比例 **Ratio**. 
以下是原论文中的例子, 给定中心词`ice`(冰) 和`steam`(水蒸气), 可以通过不同的上下文单词 $k$ 与中心词`ice`、`steam`条件概率的比例 $\text{Ratio}(ice, steam, k)$ 判断它们之间的关系. 
$$
\text{Ratio}=\mathrm{P}(\mathrm{k} \mid \text{ice}) / \mathrm{P}(\mathrm{k} \mid \text{steam})
$$

{%asset_img glove_3.webp 600%}


- 当 k 与 ice 相关性较大的时候, 例如 $k = solid$ (固体), $Ratio(ice, steam, k)$ 会比较大；
- 当 k 与 steam 相关性较大的时候, 如 $k = gas$ (气体), $Ratio(ice, steam, k)$ 会比较小；
- 当 k 与 ice、steam 都相关时, 如 $k = water$ (水), $Ratio(ice, steam, k)$ 的值会接近 1；
- 当 k 与 ice、steam 都不相关时, 如 $k = fashione$ (时尚), $Ratio(ice, steam, k)$ 的值也会接近 1；

通过这个比例 $\text{Ratio}(ice, steam, k)$  可以很好地区分与`ice`相关的词(`solid`)、与`steam`相关的词(`gas`)和一些对于`ice`、`steam`不是很重要的词(`water`、`fashion`). 

因此`GloVe`使用了一种重要的思想, 即给定中心词 $i$, $j$ 和上下文单词 $k$, 词向量的学习应该与单词条件概率的比例 $\text{Ratio}(i, j, k)$ 相关, 好的词向量可以编码 $\text{Ratio}(i, j, k)$ 的相关信息. 

## GloVe 算法的推导

使用 $w_x$ 表示单词 $x$ 的词向量, $\tilde{w}_x$ 表示单词 $x$ 作为上下文时候的词向量. 则给定中心词 $i$, $j$ 和上下文单词 $k$, GloVe 希望词向量可以编码 $\text{Ratio}(i, j, k)$ 的信息, 则会存在一种函数 $\mathrm{F}$ , 使得下式成立. 

$$
\mathrm{F}\left(w_i, w_j, \tilde{w}_k\right)=\operatorname{Ratio}(\mathrm{i}, \mathrm{j}, \mathrm{k})=\frac{P_{i k}}{P_{j k}}
$$

上式右侧部分通过**单词共现矩阵**计算, 接下来需要简化公式. GloVe 的作者认为, 单词词向量空间是一个线性结构, 例如 `"man" - "women"` 的差与 `"king" - "queen"` 的差很相近. 因此一种直观的方法是, 通过词向量的差值简化公式. 

$$
\mathrm{F}\left(w_i-w_j, \tilde{w}_k\right)=\frac{P_{i k}}{P_{j k}}
$$

上式的右侧是一个标量, 而左侧 $\mathrm{F}$ 函数里面是向量. 为了避免函数 $\mathrm{F}$  ($\mathrm{F}$ 可以很复杂, 例如使用神经网络来学习) 学习到一些无用的东西, 混淆 GloVe 希望得到的线性结构, 因此进一步对公式进行简化, 将公式 $\mathrm{F}$ 函数里面的也变为一个标量. 

$$
\mathrm{F}\left(\left(w_i-w_j\right)^T \tilde{w}_k\right)=\frac{P_{i k}}{P_{j k}}
$$

**单词共现矩阵** $\mathrm{X}$ 是一个对称矩阵, 说明中心词与上下文词是可以互换位置的, 即公式中变换 $w_x$与 $\tilde{w}_x$、$\mathrm{X}_{(i, j)}$ 与 $\mathrm{X}_{(j, i)}$ , 公式应该不变. 但是上面的式子并不满足这一条件, 因此要将上面的公式变成满足**同态性**的. 

$$
\begin{aligned}
&\mathrm{F}\left(\left(w_i-w_j\right)^T \tilde{w}_k\right)=\frac{\mathrm{F}\left(w_i^T \tilde{w}_k\right)}{\mathrm{F}\left(w_j^T \tilde{w}_k\right)}\\
&\mathrm{F}\left(w_i^T \tilde{w}_k\right)=P_{i k}=\frac{X_{i k}}{X_i}
\end{aligned}
$$

从式子可以看出 $\mathrm{F}$ 是指数函数, 即 $\mathrm{F} = exp$ , 于是上面的公式可以进行变换, 得到下面的公式. 

$$
w_i^T \tilde{w}_k=\log \left(P_{i k}\right)=\log \left(X_{i k}\right)-\log \left(X_i\right)
$$

注意到上面的式子右侧交换 $i$ 和 $k$ 的位置会改变公式对称性, 为了保证对称性, 作者进行了如下变换, 增加了两个偏置项 $b_i$ 与 $\tilde b_k$ . 

$$
w_i^T \tilde{w}_k+b_i+\tilde{b}_k=\log \left(X_{i k}\right)
$$

因此最终需要最小化下面的目标函数：

$$
J=\sum_{i, j=1}^V f\left(X_{i j}\right)\left(w_i^T \tilde{w}_j+b_i+\tilde{b}_j-\log X_{i j}\right)^2
$$

$$
f(x)=\left\{\begin{array}{cc}\left(x / x_{\max }\right)^\alpha & \text { if } x<x_{\max } \\1 & \text { otherwise }\end{array}\right.
$$

目标函数就是**平方误差**, 其中 $f(X_{ij})$ 表示损失函数的权重, 作者采用了上述公式计算 $f(X_{ij})$, 保证了：

1. 两个单词共现次数越多, 损失函数权重越大；

2. 两单词共现次数超过一个阈值时, 权重不继续增大, 最大权重为 1；

3. 两个单词共现次数为 0, 则权重为 0. 

$f(X_{ij})$ 的图像如下:

{%asset_img glove_4.webp 600%}

目标函数采用随机梯度下降法进行优化, 随机选取**单词共现矩阵** $\mathrm{X}$ 中的非 0 项进行优化. $\mathrm{X}$ 是一个稀疏矩阵, GloVe 通常优化速度比 Word2Vec 要快, 因为 Word2Vec 中语料库的每一对 (中心词、上下文词) 都是训练样本, 样本数量较多. 

## 总结

GloVe 算法结合了**矩阵分解**和**浅窗口方法**的优点, 充分地利用了全局的**统计信息**和**局部上下文窗口**的优势. 在实际使用中效果会比 Word2Vec 要好, 而且训练的速度更快. 