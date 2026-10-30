import json

with open(r'C:\Users\iGen Systems\.gemini\antigravity\brain\24257650-6bb9-47cd-afe7-aec6be5496d1\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines) - 1, -1, -1):
    obj = json.loads(lines[i])
    if obj.get('type') == 'USER_INPUT':
        print(f'Line index: {i}')
        content = obj.get('content', '')
        with open('latest_user_prompt.txt', 'w', encoding='utf-8') as out:
            out.write(content)
        print('Saved to latest_user_prompt.txt, length:', len(content))
        break

