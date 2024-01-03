---
title: Mamba加速Conda
date: 2023-10-16 21:11:53
uuid: 6d191ef6-86cb-11ee-b04c-f58259a2146b
sticky:
---


`Mamba`（黑曼巴）专为加速 `Conda` 而生, 其改写了 `Conda` 下载资源的固有方式, 以多线程的方式对网络资源进行并行下载, 从而大幅提升 `Conda` 效率

<!-- more -->

```bash
conda install -c conda-forge mamba
```

`Mamba` 的本质是对 `Conda` 功能的覆盖, 因此我们在使用 `Mamba` 时其实只要将原有的 `Conda` 语句中的 `conda` 替换为 `mamba` 即可

- **加速下载（并行下载）**

    作为 `Mamba` 最核心的功能, `Mamba` 对 `conda install` 语句进行并行化改造, 达到加速下载过程的目的

- **查看指定库当前环境下所有可用版本**

    这是 `Mamba` 异于 `Conda` 的新功能, 使用 `mamba repoquery search 库名` 可以查看指定库在当前环境版本下所有可用版本

- **查看依赖关系**

    `Mamba` 中还提供了 `mamba repoquery depends` 和 `mamba repoquery whoneeds`, 分别用于查看指定库依赖哪些库, 以及指定库被哪些库依赖