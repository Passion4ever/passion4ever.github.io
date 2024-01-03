---
title: 读写轮子
date: 2020-09-20 15:37:21
uuid: 3fb47d50-86e5-11ee-bdbe-936251103604
sticky:
---

{%note info%}
一些读写相关函数
{%endnote%}

<!-- more -->


## YAML I/O
{%tabs YAML I/O, 1%}
<!-- tab Read -->
```python
import yaml  # pyyaml
from pathlib import Path

# Read the YAML file as a dictionary
def read_yaml(fname, encoding='utf-8'):
    """Read yaml file and return a dictionary with file contents.

    If there are multiple sets of data in the yaml file, 
    the key of the dictionary will be used as the identifier of multiple sets.
    """
    
    fname = Path(fname)
    with fname.open('r', encoding=encoding) as f:
        dict_generator = yaml.load_all(f.read(), Loader=yaml.FullLoader)
    dict_list = list(dict_generator)
    yaml_dict = {}
    if len(dict_list) == 1:
        yaml_dict, = dict_list
    else:
        for idx, i in enumerate(dict_list):
            yaml_dict[idx] = i
    return yaml_dict
```
<!-- endtab -->

<!-- tab Write -->
```python
import yaml  # pyyaml
from pathlib import Path

# Write dictionary to YAML file
def write_yaml(fname, *objs, encoding='utf-8'):
    """Write objects to a yaml file."""

    fname = Path(fname)
    with fname.open('w', encoding=encoding) as f:
        yaml.dump_all(documents=objs, stream=f, allow_unicode=True, indent=4, sort_keys=False)
```
<!-- endtab -->
{% endtabs %}

## JSON I/O

{%tabs JSON I/O, 1%}
<!-- tab Read -->
```python
import json
from pathlib import Path

# Read the JSON file as a dictionary
def read_json(fname, encoding='utf-8'):
    """Read json file and return a dictionary with file contents."""

    fname = Path(fname)
    with fname.open('r', encoding=encoding) as f:
        return json.load(f)
```
<!-- endtab -->

<!-- tab Write -->
```python
import json
from pathlib import Path

# Write dictionary to JSON file
def write_json(fname, content, encoding='utf-8'):
    """ Write objects to a json file."""
    
    fname = Path(fname)
    with fname.open('w', encoding=encoding) as f:
        json.dump(content, f, indent=4, sort_keys=False)
```
<!-- endtab -->
{% endtabs %}

## YAML ↔️ JSON 

{%tabs YAML ↔️ JSON, 1%}
<!-- tab Yaml -> Json -->
```python
# The `read_yaml` and `write_json` functions are used
def yaml_to_json(yaml_path, json_path=None):
    """ Convert '.yaml' to '.json' format.

    If there are multiple sets of data in the yaml file, 
    an identification key will be added to the json file.
    """
    dictionary_list = read_yaml(yaml_path)
    if len(dictionary_list) == 1: 
        my_dict, = dictionary_list
    else:
        my_dict = {}
        for idx, i in enumerate(dictionary_list):
            my_dict[idx] = i
    if json_path == None:
        fname = str(Path(yaml_path).parent / Path(yaml_path).stem) + '.json'
    else: fname = json_path
    write_json(fname, my_dict)
```
<!-- endtab -->

<!-- tab Json -> Yaml -->
```python
# The `read_json` and `write_yaml` functions are used
def json_to_yaml(json_path, yaml_path=None):
    """ Convert '.json' to '.yaml' format. """
    
    json_dict = read_json(json_path)
    if yaml_path == None:
        fname = str(Path(json_path).parent / Path(json_path).stem) + '.yaml'
    else: fname = yaml_path
    write_yaml(fname, json_dict)
```
<!-- endtab -->
{% endtabs %}

## FASTA I/O

{% tabs FASTA I/O %}
<!-- tab Read to list -->
```python
# to list
def read_fasta(path):
    with open(path, 'r') as f:
        temp = f.readlines()
        res = [i.strip() for i in temp if '>' not in i]
        return res
```
<!-- endtab -->

<!-- tab Read to dict -->
```python
def read_fasta(file_path):
    sequences = {}
    header = None
    with open(file_path) as fp:
        for line in fp:
            line = line.strip()
            if line.startswith(">"):
                # Parsing name line
                header = line[1:]
                if not header:
                    raise ValueError("Error: empty sequence header.")
                if header in sequences:
                    raise ValueError(f"Error: duplicate sequence header '{header}'.")
                sequences[header] = []
            else:
                # Add the sequence to the current sequence.
                if header is None:
                    raise ValueError("Error: sequence data found before any sequence header.")
                sequences[header].append(line)

        # Convert the list of sequences into a string.
        sequences = {header: "".join(seq) for header, seq in sequences.items()}

    return sequences
```
<!-- endtab -->

<!-- tab Write -->
```python
def write_fasta(output_file, seq_list):
    with open(output_file, 'w') as f:
        for index, seq in enumerate(seq_list):
            f.write(f'>Sequence_{index+1}\n{seq}\n')
```
<!-- endtab -->
{% endtabs %}



## K-mer

```python
from functools import reduce

# Complete K-mer List
def total_k_mer(k):  
    """ Return a complete list of Kmer sets. """
    return reduce(lambda x, y: [i + j for i in x for j in y], [['A','T','C','G']] * k)
```

## One-hot reverse

```python
def inv2seq(onehot_arr, inv_charmap):
    """Convert onehot arr to seq list.

    Parameters
    ----------
    onehot_arr : ndarray
        The onehot array representing the sequences.
    
    Returns
    -------
    decoded_samples : list
        Sequences list corresponding to onehot array.
    """
    samples = np.argmax(onehot_arr, axis=2)
    decoded_samples = []
    for i in range(len(samples)):
        decoded = []
        for j in range(len(samples[i])):
            decoded.append(inv_charmap[samples[i][j]])
        seq = ''.join(decoded)
        decoded_samples.append(seq)

    return decoded_samples 
    ```