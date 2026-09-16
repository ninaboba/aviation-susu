# -*- coding: utf-8 -*-
"""
Merges all 4 PoF explanation parts, validates 100% 200-question coverage,
and updates data/subjects/pof.json.
"""
import os
import sys
import json

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

import generate_pof_part1
import generate_pof_part2
import generate_pof_part3
import generate_pof_part4

def main():
    map1 = generate_pof_part1.get_part1()
    map2 = generate_pof_part2.get_part2()
    map3 = generate_pof_part3.get_part3()
    map4 = generate_pof_part4.get_part4()

    full_map = {}
    full_map.update(map1)
    full_map.update(map2)
    full_map.update(map3)
    full_map.update(map4)

    print(f"Total mapped PoF explanations: {len(full_map)} / 200")

    json_path = os.path.abspath(os.path.join(current_dir, '..', 'data', 'subjects', 'pof.json'))
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    missing = []
    updated_count = 0

    for item in data:
        qid = item['id']
        if qid in full_map:
            quick, detailed = full_map[qid]
            item['explanation_quick'] = quick
            item['explanation'] = detailed
            updated_count += 1
        else:
            missing.append(qid)

    print(f"Updated {updated_count} questions.")
    if missing:
        print(f"Warning: {len(missing)} questions missing: {missing}")
        sys.exit(1)
    else:
        print("PERFECT: All 200 questions successfully mapped and updated!")

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved enhanced PoF database to: {json_path}")

if __name__ == '__main__':
    main()
