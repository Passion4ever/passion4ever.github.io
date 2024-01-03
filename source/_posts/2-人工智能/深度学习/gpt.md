---
title: GPT模型详解
date: 2023-09-09 00:26:29
uuid: 6d196d28-86cb-11ee-b04c-f58259a2146b
sticky:
---

{%note info%}
参考: https://juejin.cn/post/6949891635735953438
**GPT**论文: **《[Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)》**
**GPT-2**论文: **《[Language Models are Unsupervised Multitask Learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)》**
**GPT-3**论文: **《[Language Models are Few-Shot Learners](https://arxiv.org/pdf/2005.14165.pdf)》**
{%endnote%}

OpenAI GPT 是在 [BERT](/posts/51727) 最大的区别在于, GPT 采用了传统的语言模型进行训练, 即使用单词的上文预测单词, 而 BERT 是同时使用上文和下文预测单词. 因此, GPT 更擅长处理自然语言生成任务 (NLG), 而 BERT 更擅长处理自然语言理解任务 (NLU). 

<!-- more -->

## OpenAI GPT

OpenAI 在论文《Improving Language Understanding by Generative Pre-Training》中提出了 GPT 模型, 后面又在论文《Language Models are Unsupervised Multitask Learners》提出了 GPT2 模型. GPT2 与 GPT 的模型结构差别不大, 但是采用了更大的数据集进行实验. 

GPT 采用的训练方法分为两步: 
1. 利用没有标签的文本数据集训练语言模型
2. 根据具体的下游任务, 例如 QA, 文本分类等对模型进行微调. 

BERT也延用了这一训练方法. 我们首先了解一下GPT 与BERT的主要区别

- **预训练**: GPT 预训练的方式和传统的语言模型一样, 通过上文, 预测下一个单词；GPT 预训练的方式是使用 Mask LM, 可以同时通过上文和下文预测单词. 例如给定一个句子 $[u_1, u_2, ..., u_n]$, GPT 在预测单词 ui 的时候只会利用 $[u_1, u_2, ..., u_{(i-1)}]$ 的信息, 而 BERT 会同时利用 $[u_1, u_2, ..., u_{(i-1)}, u_{(i+1)}, ..., u_n]$ 的信息. 

    {%asset_img gpt-1.webp%}

- **模型效果**: GPT 因为采用了传统语言模型所以更加适合用于自然语言生成类的任务 (NLG), 因为这些任务通常是根据当前信息生成下一刻的信息. 而BERT更适合用于自然语言理解任务 (NLU). 

- **模型结构**: GPT 采用了 Transformer 的 Decoder, 而BERT采用了 Transformer 的 Encoder. GPT 使用 Decoder 中的` Mask `Multi-Head Attention 结构, 在使用 $[u_1, u_2, ..., u_{(i-1)}]$ 预测单词 $u_i$ 的时候, 会将 $u_i$ 之后的单词` Mask `掉. 

## GPT模型结构

GPT 使用 Transformer 的 Decoder 结构, 并对 Transformer Decoder 进行了一些改动, 原本的 Decoder 包含了两个 Multi-Head Attention 结构, GPT 只保留了 Mask Multi-Head Attention, 如下图所示. 

{%asset_img gpt-2.webp 400%}

GPT 使用句子序列预测下一个单词, 因此要采用 Mask Multi-Head Attention 对单词的下文遮挡, 防止信息泄露. 例如给定一个句子包含4个单词 [A, B, C, D], GPT 需要利用 A 预测 B, 利用 [A, B] 预测 C, 利用 [A, B, C] 预测 D. 则预测 B 的时候, 需要将 [B, C, D]` Mask `起来. 

Mask 操作是在 Self-Attention 进行 `Softmax` 之前进行的, 具体做法是将要` Mask `的位置用一个无穷小的数替换 $-inf$, 然后再 `Softmax`, 如下图所示. 

{%asset_img gpt-3.webp 600%}

可以看到, 经过` Mask `和 `Softmax` 之后, 当 GPT 根据单词 A 预测单词 B 时, 只能使用单词 A 的信息, 根据 [A, B] 预测单词 C 时只能使用单词 A, B 的信息. 这样就可以防止信息泄露. 

下图是 GPT 整体模型图, 其中包含了 12 个 Decoder. 

{%asset_img gpt-4.webp 700%}
{%cq%}
（左）GPT架构和训练目标. （右）用于微调不同任务的输入转换
{%endcq%}

## GPT训练过程

GPT 训练过程分为两个部分, **无监督预训练语言模型**和**有监督的下游任务 fine-tuning**

### 预训练语言模型

给定句子 $U=[u_1, u_2, ..., u_n]$, GPT 训练语言模型时需要最大化下面的似然函数. 

$$
\begin{aligned}
L_1(\mathcal{U})=\sum_i \log P\left(u_i \mid u_{i-k}, \ldots, u_{i-1} ; \Theta\right)
\end{aligned}
$$

可以看到 GPT 是一个单向的模型, GPT 的输入用 **$h_0$** 表示, **$h_0$** 的计算公式如下. 

$$
\begin{aligned}
&h_0 = U W_e+W_p \\ 
&h_l = \operatorname{transformer} \_ \text {block }\left(h_{l-1}\right) \forall i \in[1, n] \\
&P(u) = \operatorname{sof} \operatorname{tmax}\left(h_n W_e^T\right)
\end{aligned}
$$

**$W_p$** 是单词位置的 Embedding, **$W_e$** 是单词的 Embedding. 用 $voc$ 表示词汇表大小, $pos$ 表示最长的句子长度, $dim$ 表示 Embedding 维度, 则 **$W_p$** 是一个  $pos×dim$ 的矩阵, **$W_e$** 是一个 $voc×dim$ 的矩阵. 

得到输入 **$h_0$** 之后, 需要将 **$h_0$** 依次传入 GPT 的所有 Transformer Decoder 里, 最终得到 **$h_l$**. 

最后得到 **$h_l$** 再预测下个单词的概率. 

### 3.2 下游任务 fine-tuning

GPT 经过预训练之后, 会针对具体的下游任务对模型进行微调. 微调的过程采用的是有监督学习, 训练样本包括单词序列 $[x_1, x_2, ..., x_m]$ 和 类标 $y$. GPT 微调的过程中根据单词序列 $[x_1, x_2, ..., x_m]$ 预测类标 $y$. 

$$
\begin{aligned}
P\left(y \mid x^1, \ldots, x^m\right)=\operatorname{softmax}\left(h_l^m W_y\right)
\end{aligned}
$$

**$W_y$** 表示预测输出时的参数, 微调时候需要最大化以下函数. 

$$
\begin{aligned}
L_2(\mathcal{C})=\sum_{(x, y)} \log P\left(y \mid x^1, \ldots, x^m\right)
\end{aligned}
$$

GPT 在微调的时候也考虑预训练的损失函数, 所以最终需要优化的函数为：

$$
\begin{aligned}
L_3(\mathcal{C})=L_2(\mathcal{C})+\lambda * L_1(\mathcal{C})
\end{aligned}
$$

## GPT 总结

GPT 预训练时利用上文预测下一个单词, BERT 是根据上下文预测单词, 因此在很多 NLU 任务上, GPT 的效果都比 BERT 要差. 但是 GPT 更加适合用于文本生成的任务, 因为文本生成通常都是基于当前已有的信息, 生成下一个单词. 

建议阅读一下 huggingface 在 Github 上的代码, 里面包含了很多基于 Transformer 的模型, 包括 roBERTa 和 ALBERT 等. 