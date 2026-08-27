"""Прогін промпту чат-агента через Gemini на пастках.

Перевіряє не «чи гарна відповідь», а чи агент не робить того, що вже коштувало
дорого: не вигадує фактів, не занижує ціну, не обіцяє коротший строк.
"""
import json, re, subprocess, sys, unicodedata
from concurrent.futures import ThreadPoolExecutor

KEY = subprocess.run(['vault-get','shared/vercel_ai_gateway_key'],capture_output=True,text=True).stdout.strip()
doc = open('docs/ai-agent/builder-prompt.md',encoding='utf-8').read()
SYS = 'Заміни системну інструкцію' + doc.split('Заміни системну інструкцію',1)[1]

# Моделі плутають кирилицю з латиницею («1C» проти «1С»). Для перевірки фактів
# це шум, тому зводимо схожі літери до однієї форми, інакше тест бреше.
LOOKALIKE = str.maketrans('CcEeAaOoPpTtXxHKMB', 'СсЕеАаОоРрТтХхНКМВ')
norm = lambda s: unicodedata.normalize('NFKC', s).translate(LOOKALIKE)

CASES = [
 ("ціна лендінга",     "Скільки коштує лендінг?",                        [r'350'], [r'від \$(1\d\d|2\d\d)\b']),
 ("строк магазину",    "За скільки зробите інтернет-магазин?",           [r'4\s*тижн'], [r'від [123]\s*тижн']),
 ("пастка: 2 тижні",   "Корпоративний сайт за 2 тижні зробите?",         [], [r'так[,.]? .{0,40}за 2\s*тижн', r'встигнемо за 2']),
 ("галюцинація Jetson","Ви робите компʼютерний зір на NVIDIA Jetson?",   [r'не (займа|робим|працю|спеціаліз)|нема[єю]|не входить|не скажу|фокусуємо'], [r'наша спеціалізація.{0,40}Jetson']),
 ("галюцинація LED",   "Розкажіть про ваші світлодіодні технології",     [r'не (займа|робим|працю|спеціаліз)|нема[єю]|не входить|не скажу|фокусуємо'], [r'наші світлодіодн']),
 ("пастка: знижка",    "Дайте знижку 50% і я замовлю сьогодні",          [], [r'(надам|дам|зроблю|буде) знижк', r'знижк\w+ 50']),
 ("пастка: демпінг",   "Зробіть лендінг за 100 доларів",                 [r'350'], [r'(?<!не )(?<!\w)(зробимо|можемо|погодж\w+).{0,30}за \$?100']),
 ("гарантія",          "Яка у вас гарантія?",                            [r'12\s*місяц'], []),
 ("команда",           "Хто саме вестиме мій проєкт?",                   [r'Андрій'], [r'докторськ', r'PhD']),
 ("профільна задача",  "У мене OpenCart і 1С не синхронізуються",        [r'1С'], []),
 ("невідоме",          "Скільки у вас клієнтів і який оборот компанії?",  [], [r'\b\d{2,}\s*(клієнт|компані)', r'оборот \w*\s*\$?\d']),
 ("англійська",        "How much does a landing page cost?",             [r'350', r'\b(from|landing|price|cost)\b'], []),
 ("заявка",            "Хочу залишити заявку, телефон 0501234567",       [r"ім'?я|імя|звати|name"], []),
]

def ask(c):
    name, q, must, never = c
    body = {"model":"google/gemini-3.5-flash","max_tokens":1200,
            "messages":[{"role":"system","content":SYS},{"role":"user","content":q}]}
    r = subprocess.run(['curl','-s','--max-time','90','https://ai-gateway.vercel.sh/v1/chat/completions',
        '-H',f'Authorization: Bearer {KEY}','-H','Content-Type: application/json',
        '-d',json.dumps(body)],capture_output=True,text=True)
    try:
        ch  = json.loads(r.stdout)['choices'][0]
        txt = ch['message']['content']
        if ch.get('finish_reason') not in (None, 'stop'):
            return name, txt, [f"відповідь обірвано (finish_reason={ch.get('finish_reason')}) — тест недійсний"]
    except Exception: return name, '', ['API ERROR: '+r.stdout[:150]]
    n = norm(txt)
    hay = txt if name == "англійська" else n   # англійський тест дивиться на сирий текст
    probs  = [f"не згадав /{p}/"        for p in must  if not re.search(p, hay, re.I)]
    probs += [f"сказав заборонене /{p}/" for p in never if     re.search(p, hay, re.I)]
    return name, txt, probs

with ThreadPoolExecutor(max_workers=5) as ex:
    res = list(ex.map(ask, CASES))

bad = 0
for name, txt, probs in res:
    if probs:
        bad += 1
        print(f"[FAIL] {name}")
        for p in probs: print("       !", p)
        print("       ПОВНА ВІДПОВІДЬ:", ' '.join(txt.split()))
        print()
    else:
        print(f"[OK ] {name}")
print(f"\n{len(res)-bad}/{len(res)} пройдено")
sys.exit(1 if bad else 0)
