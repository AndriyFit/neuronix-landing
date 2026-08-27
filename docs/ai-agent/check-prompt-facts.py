#!/usr/bin/env python3
"""Звіряє факти в builder-prompt.md з src/i18n/uk.json.

Промпт агента дублює ціни, строки й перелік статей із сайту. Дублювання неминуче
(агент живе в Google App builder, не в цьому репозиторії), тому єдиний захист від
дрейфу — ця перевірка. Змінив ціни в uk.json — прожени її.

    python3 docs/ai-agent/check-prompt-facts.py

Exit 0 — збігається, exit 1 — перелік розбіжностей.
"""
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
BLOG = os.path.join(ROOT, 'src', 'content', 'blog')

d = json.load(open(os.path.join(ROOT, 'src', 'i18n', 'uk.json'), encoding='utf-8'))
full = open(os.path.join(ROOT, 'docs', 'ai-agent', 'builder-prompt.md'), encoding='utf-8').read()
# Таблиця статей живе після заголовка ЗНАННЯ; у шапці є GCP project id, схожий на slug.
doc = full.split('# ЗНАННЯ', 1)[1] if '# ЗНАННЯ' in full else full

priced = [it for sec in (d['pricing']['items'], d['services']['items'], d['ai']['solutions']['items'])
          for it in sec if it.get('price')]
fails = [f"ціна '{it['price']}' ({it.get('service') or it['title']}) відсутня в промпті"
         for it in priced if it['price'] not in full]

# Зворотний бік: у промпті не має бути цін, яких нема на сайті.
site_prices = {it['price'].strip() for it in priced if '$' in it['price']}
fails += [f"вигадана ціна '{p}'" for p in set(re.findall(r'від \$\d+', full)) - site_prices]

if d['contact']['telegramUrl'] not in full:
    fails.append('Telegram команди відсутній')
fails += [f"цифра кейсу '{n}' відсутня" for n in ('15 000+', '30 сек') if n not in full]

# Головна FAQ каже «від 3 тижнів». Коротший строк = переобіцянка, найдорожча помилка агента.
if '2–3 тижні' in full:
    fails.append("переобіцянка '2–3 тижні' проти 'від 3 тижнів' у faq.items")

slugs = {f[:-3] for f in os.listdir(BLOG) if f.endswith('.ts') and f not in ('index.ts', 'types.ts')}
fails += [f'стаття {s} відсутня в промпті' for s in sorted(slugs) if f'`{s}`' not in doc]
fails += [f"стаття '{m}' у промпті, але не в блозі"
          for m in set(re.findall(r'^\| `([a-z0-9-]+)` \|', doc, re.M)) - slugs]

print(f'перевірено: {len(site_prices)} цін, {len(slugs)} статей, строки, Telegram, кейс')
if fails:
    print('РОЗБІЖНОСТІ:')
    for f in fails:
        print(' -', f)
    sys.exit(1)
print('OK — промпт збігається з uk.json')
