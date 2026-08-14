#!/usr/bin/env python3
"""Вбудовує mp3-записи дзвінків у презентацію як data URI.

Артефакти на claude.ai не мають доступу до зовнішніх хостів, тому аудіо
мусить лежати всередині сторінки.

    python3 docs/assets/build-offer.py <вихідний.html>
"""
import base64
import pathlib
import sys

DOCS = pathlib.Path(__file__).resolve().parent.parent
SRC = DOCS / "2026-08-14-cornix-partners-offer.html"
CALLS = DOCS / "assets" / "calls"

out = pathlib.Path(sys.argv[1])
html = SRC.read_text(encoding="utf-8")

for n in (1, 2, 3):
    mp3 = (CALLS / f"call{n}.mp3").read_bytes()
    uri = "data:audio/mpeg;base64," + base64.b64encode(mp3).decode("ascii")
    html = html.replace(f"__CALL{n}__", uri)

assert "__CALL" not in html, "лишився незамінений плейсхолдер"
out.write_text(html, encoding="utf-8")
print(f"{out} — {len(html) / 1024 / 1024:.2f} MB")
