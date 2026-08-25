#!/usr/bin/env python3
"""Keyword-level final_urls для кампанії Neuronix + знімок post-click Quality Score.

Навіщо: усі RSA трьох ad groups вели на одну головну, через що post_click_quality_score
= BELOW_AVERAGE у 10 ключів із 10. `ad_group_criterion.final_urls` перекриває URL
оголошення при показі, тому лікує саме той сигнал, не чіпаючи оголошень: без модерації,
без втрати накопиченого expected CTR, оборотно одним mutate.

Гіпотеза, яку цей скрипт дає змогу перевірити: keyword-level URL входить у розрахунок
landing page experience. Прямої фрази в довідці Google немає — тому snapshot щотижня
і порівняння. Якщо через 2-3 тижні landing_page_view показує нові URL, а оцінка стоїть —
гіпотеза хибна, треба перестворювати RSA.

    ./ads-keyword-urls.py snapshot          # знімок стану у snapshots/
    ./ads-keyword-urls.py apply --dry-run   # показати, що буде змінено
    ./ads-keyword-urls.py apply             # застосувати (робить знімок сам)
    ./ads-keyword-urls.py --self-test       # перевірка логіки без мережі
"""
import argparse, json, pathlib, sys, datetime

from google.api_core import protobuf_helpers

CUSTOMER_ID = "9087037980"
LOGIN_CUSTOMER_ID = "1770392909"

# ad_group.id -> посадкова цієї групи
URL_BY_AD_GROUP = {
    "199656753776": "https://neuronics.work/uk/websites",      # Сайт під ключ
    "202276594747": "https://neuronics.work/uk/online-store",  # Інтернет-магазин
    "202948761487": "https://neuronics.work/uk/price",         # Ціна розробки
}

SNAP_DIR = pathlib.Path(__file__).resolve().parent.parent / "snapshots"
QUERY = """
    SELECT ad_group.id, ad_group.name, ad_group_criterion.criterion_id,
           ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
           ad_group_criterion.final_urls, ad_group_criterion.status,
           ad_group_criterion.quality_info.quality_score,
           ad_group_criterion.quality_info.post_click_quality_score,
           ad_group_criterion.quality_info.creative_quality_score,
           ad_group_criterion.quality_info.search_predicted_ctr
    FROM keyword_view
    WHERE ad_group_criterion.status = 'ENABLED' AND ad_group.status = 'ENABLED'
"""


def plan_changes(rows, url_by_ad_group):
    """Чисто, без мережі: які ключі треба змінити. Пропускає ті, що вже мають цільовий URL."""
    changes, skipped = [], []
    for r in rows:
        target = url_by_ad_group.get(r["ad_group_id"])
        if not target:
            skipped.append((r, "невідома ad group"))
            continue
        if list(r["final_urls"]) == [target]:
            skipped.append((r, "URL уже цільовий"))
            continue
        changes.append({**r, "new_url": target})
    return changes, skipped


def build_client():
    from google.ads.googleads.client import GoogleAdsClient
    creds = json.load(open(pathlib.Path.home() / ".adloop/credentials.json"))
    tok = json.load(open(pathlib.Path.home() / ".adloop/token.json"))
    inst = creds.get("installed", creds)
    return GoogleAdsClient.load_from_dict({
        "developer_token": "XNyQ451-_SOElNs8akLbiw",
        "client_id": inst["client_id"],
        "client_secret": inst["client_secret"],
        "refresh_token": tok["refresh_token"],
        "login_customer_id": LOGIN_CUSTOMER_ID,
        "use_proto_plus": True,
    })


def fetch(client):
    ga = client.get_service("GoogleAdsService")
    rows = []
    for batch in ga.search_stream(customer_id=CUSTOMER_ID, query=QUERY):
        for r in batch.results:
            q = r.ad_group_criterion.quality_info
            rows.append({
                "ad_group_id": str(r.ad_group.id),
                "ad_group_name": r.ad_group.name,
                "criterion_id": str(r.ad_group_criterion.criterion_id),
                "keyword": r.ad_group_criterion.keyword.text,
                "match_type": r.ad_group_criterion.keyword.match_type.name,
                "final_urls": list(r.ad_group_criterion.final_urls),
                "quality_score": q.quality_score,
                "post_click": q.post_click_quality_score.name,
                "creative": q.creative_quality_score.name,
                "expected_ctr": q.search_predicted_ctr.name,
            })
    return rows


def save_snapshot(rows, label):
    SNAP_DIR.mkdir(exist_ok=True)
    ts = datetime.datetime.now().strftime("%Y-%m-%d-%H%M")
    p = SNAP_DIR / f"keywords-{ts}-{label}.json"
    p.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return p


def show(rows):
    for r in rows:
        url = r["final_urls"][0] if r["final_urls"] else "(з оголошення)"
        print(f"  QS{r['quality_score']} post-click={r['post_click']:<14} "
              f"{r['keyword'][:38]:<40} → {url}")


def self_test():
    base = {"ad_group_id": "199656753776", "ad_group_name": "X", "criterion_id": "1",
            "keyword": "k", "match_type": "PHRASE", "final_urls": [],
            "quality_score": 5, "post_click": "BELOW_AVERAGE", "creative": "AVERAGE",
            "expected_ctr": "AVERAGE"}
    m = {"199656753776": "https://e.com/a"}

    ch, sk = plan_changes([base], m)
    assert len(ch) == 1 and ch[0]["new_url"] == "https://e.com/a", "порожній final_urls → змінюємо"

    ch, sk = plan_changes([{**base, "final_urls": ["https://e.com/a"]}], m)
    assert not ch and sk[0][1] == "URL уже цільовий", "ідемпотентність: повторний запуск нічого не робить"

    ch, sk = plan_changes([{**base, "final_urls": ["https://e.com/old"]}], m)
    assert len(ch) == 1, "інший URL → перезаписуємо"

    ch, sk = plan_changes([{**base, "ad_group_id": "999"}], m)
    assert not ch and sk[0][1] == "невідома ad group", "чужа група → не чіпаємо"

    assert len(URL_BY_AD_GROUP) == 3 and len(set(URL_BY_AD_GROUP.values())) == 3, \
        "три групи, три РІЗНІ URL — інакше сенс зміни втрачено"
    for u in URL_BY_AD_GROUP.values():
        assert u.startswith("https://neuronics.work/uk/") and "#" not in u, \
            "тільки https і без якоря: якір не створює окремої сторінки для Google"
    print("self-test: 6 перевірок пройдено")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("command", nargs="?", choices=["snapshot", "apply"])
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    a = ap.parse_args()

    if a.self_test:
        return self_test()
    if not a.command:
        ap.error("вкажи snapshot або apply")

    client = build_client()
    rows = fetch(client)
    print(f"Стан ДО ({len(rows)} ключів):")
    show(rows)
    snap = save_snapshot(rows, "before" if a.command == "apply" else "snapshot")
    print(f"Знімок: {snap}")

    if a.command == "snapshot":
        return

    changes, skipped = plan_changes(rows, URL_BY_AD_GROUP)
    print(f"\nЗмінити: {len(changes)}, пропустити: {len(skipped)}")
    for c in changes:
        print(f"  {c['keyword'][:38]:<40} → {c['new_url']}")
    for r, why in skipped:
        print(f"  ПРОПУСК ({why}): {r['keyword'][:38]}")

    if a.dry_run:
        print("\n--dry-run: нічого не змінено")
        return
    if not changes:
        print("\nНічого змінювати — стан уже цільовий")
        return

    svc = client.get_service("AdGroupCriterionService")
    ops = []
    for c in changes:
        op = client.get_type("AdGroupCriterionOperation")
        crit = op.update
        crit.resource_name = svc.ad_group_criterion_path(
            CUSTOMER_ID, c["ad_group_id"], c["criterion_id"])
        crit.final_urls.append(c["new_url"])
        client.copy_from(op.update_mask, protobuf_helpers.field_mask(None, crit._pb))
        ops.append(op)

    resp = svc.mutate_ad_group_criteria(customer_id=CUSTOMER_ID, operations=ops)
    print(f"\nmutate: {len(resp.results)} ключів оновлено")

    # Правило: перевіряти перечитуванням, а не відповіддю API
    after = fetch(client)
    save_snapshot(after, "after")
    bad = [r for r in after
           if list(r["final_urls"]) != [URL_BY_AD_GROUP.get(r["ad_group_id"], "")]]
    print("\nСтан ПІСЛЯ (перечитано):")
    show(after)
    if bad:
        print(f"\n⚠️  {len(bad)} ключів НЕ мають цільового URL — розібратись:")
        for r in bad:
            print(f"   {r['keyword']}: {r['final_urls']}")
        sys.exit(1)
    print("\n✅ Усі ключі мають URL своєї групи (звірено перечитуванням)")


if __name__ == "__main__":
    main()
