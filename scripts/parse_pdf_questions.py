import os
import sys
import re
import json
import pypdf

# Default section mapping for Subject 040 (Human Performance & Limitations)
SECTIONS_040 = [
    (1, 23, '040 01', 'Anatomy & Visual Acuity'),
    (24, 43, '040 02', 'Circulatory System'),
    (44, 69, '040 03', 'Oxygen & Respiration'),
    (70, 92, '040 04', 'Human Factors: Vision & the Eye'),
    (93, 115, '040 05', 'Ear Anatomy & Conductive Hearing'),
    (116, 141, '040 06', 'Flying & Health'),
    (142, 161, '040 07', 'Sleep & Fatigue'),
    (162, 181, '040 08', 'Information Processing, Human Error & Learning'),
    (182, 201, '040 09', 'Cognition in Aviation — Visual Illusions & Perception'),
    (202, 221, '040 10', 'Communication & Cooperation'),
    (222, 237, '040 11', 'Behaviour & Motivation'),
    (238, 257, '040 12', 'Stress'),
    (258, 277, '040 13', 'Man & Machine'),
    (278, 294, '040 14', 'Individual Differences & Interpersonal Relationships')
]

def get_section_for_id(q_id, sections):
    for s_min, s_max, code, name in sections:
        if s_min <= q_id <= s_max:
            return code, name
    return 'GEN', 'General'

def parse_pdf_question_bank(pdf_path, output_json_path, subject_code="040", sections=None):
    """
    General parser for CAAT Study Edition MCQ Question Bank PDFs.
    Extracts Question, Options (A-D / True-False), Correct Answers, Explanations, and LO.
    """
    if sections is None:
        sections = SECTIONS_040

    if not os.path.isabs(pdf_path):
        # Resolve relative to workspace root if executed from scripts/
        if not os.path.exists(pdf_path):
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            candidate = os.path.join(base_dir, pdf_path)
            if os.path.exists(candidate):
                pdf_path = candidate

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    print(f"Loading PDF: {pdf_path}")
    reader = pypdf.PdfReader(pdf_path)

    full_text = ''
    # Skip cover / toc pages if relevant, or scan from page 4 (index 3)
    start_page = 3 if len(reader.pages) > 4 else 0
    for i in range(start_page, len(reader.pages)):
        txt = reader.pages[i].extract_text() or ''
        # Strip recurring running header
        txt = re.sub(r'Subject\s+\d+\s+–\s+.*?Questions\s+Bank\s+–\s+Study\s+Edition\s*', '', txt)
        full_text += txt + '\n'

    # Split into question blocks
    parts = re.split(r'\n(?=Question\s+\d+\b)', full_text)
    print(f"Total question sections found: {len(parts)}")

    parsed = []
    for p in parts:
        m_id = re.match(r'Question\s+(\d+)', p.strip())
        if not m_id:
            continue
        qid = int(m_id.group(1))

        # Question text
        q_match = re.search(r'Question\s*/\s*ค\s*าถาม:\s*(.*?)(?=Options\s*/\s*ตัวเลือก:)', p, re.DOTALL)
        q_text = q_match.group(1).strip() if q_match else ''

        # Options
        opts_match = re.search(r'Options\s*/\s*ตัวเลือก:\s*(.*?)(?=[✓\u2713]?\s*CORRECT ANSWER)', p, re.DOTALL)
        opts_text = opts_match.group(1).strip() if opts_match else ''
        raw_opts = re.findall(r'[•\-\*]?\s*([A-D])\.\s*(.*?)(?=(?:[•\-\*]?\s*[A-D]\.|$))', opts_text, re.DOTALL)
        options = [' '.join(o[1].strip().split()) for o in raw_opts]

        # Correct Answer
        ans_match = re.search(r'[✓\u2713]?\s*CORRECT ANSWER\s*\|\s*ค\s*าตอบ:\s*([A-D])\.\s*(.*?)(?=(?:Explanation\s*/\s*ค\s*าอธิบาย:|$))', p, re.DOTALL)
        correct_letter = ans_match.group(1).strip() if ans_match else ''
        correct_val = ans_match.group(2).strip() if ans_match else ''
        correct_val = ' '.join(correct_val.split())

        ans_idx = ord(correct_letter) - ord('A') if correct_letter in ['A', 'B', 'C', 'D'] else -1

        # Explanation
        exp_match = re.search(r'Explanation\s*/\s*ค\s*าอธิบาย:\s*(.*?)(?=(?:CAAT LO Ref\.:|Learning Objective:|Learning Point|─{5,}|$))', p, re.DOTALL)
        explanation = exp_match.group(1).strip() if exp_match else ''
        explanation = ' '.join(explanation.split())

        # CAAT LO Ref
        lo_match = re.search(r'CAAT LO Ref\.:\s*(.*?)(?=(?:Learning Objective:|Learning Point|─{5,}|$))', p, re.DOTALL)
        lo = lo_match.group(1).strip() if lo_match else subject_code
        lo = ' '.join(lo.split())

        # Learning Point
        lp_match = re.search(r'Learning Point\s*/\s*จุดจ\s*า:\s*(.*?)(?=(?:─{5,}|$))', p, re.DOTALL)
        learn_point = lp_match.group(1).strip() if lp_match else ''
        learn_point = ' '.join(learn_point.split())

        q_clean = ' '.join(q_text.split())

        # Specific fixes for consolidated source missing options (Subject 040: Q121 & Q237)
        if subject_code == "040":
            if qid == 121:
                options = [
                    "When the excessive use of alcohol repeatedly damages a person's physical, mental or social life",
                    "Consuming alcohol within 8 hours prior to flight duty",
                    "Any alcohol intake leading to blood alcohol concentration exceeding 0.02%",
                    "Social drinking on weekends without occupational impairment"
                ]
                ans_idx = 0
                correct_val = options[0]
                if not explanation:
                    explanation = "The WHO defines alcoholism as when excessive alcohol use repeatedly damages physical, mental or social life."

            if qid == 237:
                options = [
                    "Job enrichment and job enlargement",
                    "Salary increase and reduced flight hours",
                    "Punishment for mistakes and rigid supervision",
                    "Automation and elimination of human tasks"
                ]
                ans_idx = 0
                correct_val = options[0]
                if not explanation:
                    explanation = "The two primary methods in improving job satisfaction are job enrichment (increasing depth and autonomy) and job enlargement."

        full_explanation = explanation
        if learn_point and not learn_point.startswith('Focus on the relationship'):
            full_explanation += f' (จุดจำ: {learn_point})'

        sec_code, sec_name = get_section_for_id(qid, sections)

        parsed.append({
            'id': qid,
            'question': q_clean,
            'options': options,
            'answer': ans_idx,
            'explanation': full_explanation,
            'correct': options[ans_idx] if 0 <= ans_idx < len(options) else correct_val,
            'topic': sec_code,
            'topicName': sec_name,
            'LO': lo,
            'difficulty': 'Medium',
            'cognitive': 'UNDERSTAND',
            'verb': 'Explain'
        })

    print(f"Successfully extracted {len(parsed)} questions.")
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(os.path.abspath(output_json_path)), exist_ok=True)
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(parsed, f, ensure_ascii=False, indent=2)
    print(f"Saved to: {output_json_path}")
    return parsed

if __name__ == '__main__':
    # Default execution parses Subject 040 into data/subjects/human_factors.json
    workspace_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    default_pdf = os.path.join(workspace_dir, 'pdf', 'Subject_040_Aviation_Human_Factors_294Q_Questions_Bank_Study_Edition.pdf')
    default_out = os.path.join(workspace_dir, 'data', 'subjects', 'human_factors.json')

    pdf_file = sys.argv[1] if len(sys.argv) > 1 else default_pdf
    out_file = sys.argv[2] if len(sys.argv) > 2 else default_out
    parse_pdf_question_bank(pdf_file, out_file, subject_code="040")
