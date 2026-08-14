#!/usr/bin/env python3
"""Збирає презентацію для партнерів Cornix, підставляючи записи дзвінків.

    python3 docs/assets/build-offer.py <вихідний.html>           # аудіо всередині
    python3 docs/assets/build-offer.py <вихідний.html> /cornix   # аудіо поруч

Перший режим — для артефакту на claude.ai: там сторінка не має доступу до
зовнішніх хостів, тому mp3 мусить лежати в самому HTML як data URI.
Другий — для neuronics.work, де аудіо віддається окремими файлами.
"""
import base64
import pathlib
import sys

DOCS = pathlib.Path(__file__).resolve().parent.parent
SRC = DOCS / "2026-08-14-cornix-partners-offer.html"
CALLS = DOCS.parent / "public" / "cornix"

out = pathlib.Path(sys.argv[1])
base = sys.argv[2].rstrip("/") if len(sys.argv) > 2 else None
html = SRC.read_text(encoding="utf-8")

for n in (1, 2, 3):
    if base:
        src = f"{base}/call{n}.mp3"
    else:
        mp3 = (CALLS / f"call{n}.mp3").read_bytes()
        src = "data:audio/mpeg;base64," + base64.b64encode(mp3).decode("ascii")
    html = html.replace(f"__CALL{n}__", src)

assert "__CALL" not in html, "лишився незамінений плейсхолдер"

if base:
    # Артефакт отримує <head> від хостингу, а окремій сторінці його треба дати:
    # без viewport сторінка рендериться на телефоні як десктопна.
    head, body = html.split("</style>", 1)
    html = f"""<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Що Neuronix автоматизує в магазині партнера Cornix: голосове підтвердження замовлень, накладні й фіскальні чеки, каталог і сайти.">
<meta property="og:type" content="website">
<meta property="og:title" content="Від дзвінка до чека">
<meta property="og:description" content="Голосове підтвердження замовлень, накладні й чеки, каталог. Із записами реальних дзвінків.">
{head}</style>
</head>
<body>
{body}
</body>
</html>
"""

out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"{out} — {len(html) / 1024:.0f} KB")
