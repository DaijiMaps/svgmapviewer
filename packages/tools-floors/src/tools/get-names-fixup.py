import json
import sys


def pat_to_spans(pat: str) -> str:
    words = pat.strip().split(' ')
    spans = map(lambda w: w.replace('___', ' '), words)
    return '///'.join(spans)


def gen_labels(names_file: str) -> None:
    num_to_name = {}
    name_to_pat = {}

    with open(f"split-patterns.txt", "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            xs = line.strip().split('@@@')
            if len(xs) != 2:
                continue
            name = xs[0]
            pat = xs[1]
            if name == pat:
                continue
            #print(f"PAT: {name} => {pat}")
            name_to_pat[name] = pat

    with open(names_file, "r", encoding="utf-8") as fh:
        for line in fh.readlines():
            words = line.strip().split(' ')
            num = words[0]
            num = int(num)
            name = ' '.join(words[1:])
            #print(f"NUM: {num} => {name}")
            num_to_name[num] = name

    names = {}
    for num in num_to_name:
        name = num_to_name[num]
        #print(f"name={name}")
        if name in names:
            continue
        names[name] = 1
        if name in name_to_pat:
            pat = name_to_pat[name]
            print(f"{name}@@@{pat_to_spans(pat)}")


####


gen_labels(sys.argv[1])
