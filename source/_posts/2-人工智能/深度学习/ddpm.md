---
title: Denoising Diffusion Probabilistic Models
date: 2023-09-08 12:23:27
uuid: 6d196d23-86cb-11ee-b04c-f58259a2146b
sticky:
---

{%note info%}
本文是DDPM的奠基之作，是本领域最经典的论文之一。其实扩散模型并不是一个新的概念，这篇论文第一个给出了严谨的数学推导，可以复现的代码，完善了整个推理过程。后面diffusion models相关的论文基本都继承了前向加噪-反向降噪-训练这样的体系。
{%endnote%}

<!-- more -->

