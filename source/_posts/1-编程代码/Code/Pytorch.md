---
title: Pytorch轮子
date: 2021-07-30 23:27:24
uuid: 44de82d0-86e5-11ee-af1f-3d099b1acb8b
sticky:
---

{%note info%}
Pytorch 相关的函数
{%endnote%}

<!-- more -->

## 设置全局随机种子
```python
import os
import random
import torch
import numpy as np

def set_global_random_seed(seed):  
    """Unify all random number seeds to ensure reproducibility as much as possible.
    
    Args:
        seed(int): Random seed number.
    """

    assert isinstance(seed, int) and 0 <= seed <= (2**32 - 1) , \
        'Seed must be int and between 0 and 2**32 - 1!'
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    # torch.backends.cudnn.deterministic = True  # May slow down the speed of code running
    torch.backends.cudnn.benchmark = False
```

## 循环 dataloader

```python
from itertools import repeat
def inf_loop(data_loader):
    """Wrapper function for endless data loader."""
    
    for loader in repeat(data_loader):
        yield from loader
```

## 用于提取模型特征的钩子

```python
from collections import defaultdict

class HookTool: 
    """HookTool for getting model features.
    
    Attributes:
        feature: model feature value
        module: submodule of torch
        fea_in: tuple, input of module
        fea_out: tensor, output of module
    """
    
    def __init__(self):
        self.feature = None 

    def hook_func(self, module, fea_in, fea_out):
        self.feature = fea_out


def get_features(model, modules):
    """Get model features.
    
    Args:
        model: The model inherited from 'nn.Module'.
        modules: tuple, module name to be extracted.
    Returns:
        features: defaultdict, feature values dict.
    """
    
    features = defaultdict(dict)
    for name, module in model.named_modules():
        if isinstance(module, modules):
            cur_hook = HookTool()
            module.register_forward_hook(cur_hook.hook_func)
            features[module._get_name()][name] = cur_hook

    return features
```

## EarlyStop 早停

```python

class EarlyStopping:
    """Early stops the training if the metric doesn't improve after a given patience.

    Attributes:
        mode (str): The mode of metric optimization. Default: 'min'
        patience (int): The number of epochs to wait after the last time the metric improved.
        delta (float): The minimum change in the monitored quantity to qualify as an improvement.
    """

    def __init__(self, mode: str = 'min', patience: int = 10, delta: float = 0) -> None:
        """Initialize EarlyStopping class."""

        assert mode in ['min', 'max'], "mode must be 'min' or 'max'."
        self.mode = mode
        self.patience = patience
        self.delta = delta 
        self.counter = 0
        self.best_score = float('inf') if mode == 'min' else float('-inf')
        self.early_stop = False

    def __call__(self, metric: float) -> tuple[bool, float, int]:
        """Earlystop call"""

        improved = (self.mode == 'min' and metric < self.best_score - self.delta ) or \
                   (self.mode == 'max' and metric > self.best_score + self.delta)

        if improved:
            self.best_score = metric
            self.counter = 0
            update = True
            return update, self.best_score, self.counter
        else:
            self.counter += 1
            update = False
            if self.counter >= self.patience:
                self.early_stop = True
            return update, self.best_score, self.counter
```