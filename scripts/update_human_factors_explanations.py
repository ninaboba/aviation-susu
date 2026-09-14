# -*- coding: utf-8 -*-
"""
Merges all explanation parts, validates complete 294 coverage, and updates data/subjects/human_factors.json.
"""
import os
import sys
import json

# Ensure scripts dir is in path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

import generate_explanations_part1
import generate_explanations_part2
import generate_explanations_part3
import generate_explanations_part4
import generate_explanations_part5

def main():
    map1 = generate_explanations_part1.build_data()
    map2 = generate_explanations_part2.build_data_part2()
    map3 = generate_explanations_part3.build_data_part3()
    map4 = generate_explanations_part4.build_data_part4()
    map5 = generate_explanations_part5.build_data_part5()

    full_map = {}
    full_map.update(map1)
    full_map.update(map2)
    full_map.update(map3)
    full_map.update(map4)
    full_map.update(map5)

    print(f"Total mapped explanations: {len(full_map)}")

    json_path = os.path.abspath(os.path.join(current_dir, '..', 'data', 'subjects', 'human_factors.json'))
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
    else:
        print("PERFECT: All 294 questions successfully mapped and updated!")

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved enhanced database to: {json_path}")

if __name__ == '__main__':
    main()
