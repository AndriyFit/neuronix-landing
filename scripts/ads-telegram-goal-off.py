#!/usr/bin/env python3
"""Вивести `telegram_click` з метрики «Конверсії» після прибирання Telegram-кнопок.

Навіщо. 07.09 усі заклики «Написати в Telegram» прибрано з сайту (перший екран,
навбар, липка панель, посадкові) — лишився один шлях, форма. Конверсія, яка рахувала
КЛІК по тій кнопці, після цього не просто зайва, а шкідлива: вона й раніше міряла не те.

Що з нею було не так (задокументовано в CLAUDE.md, кейс Тетяни 17.08): `telegram_click`
фіксує клік, а не звернення. Один клієнт дав 2 кліки і 1 реальний лід, а сам факт
написання боту Ads не бачить у принципі. При цьому на неї припадало 3 з 4 конверсій
за 30 днів — тобто метрика акаунта складалася переважно з кліків по кнопці, якої
більше немає.

Що робить. Ставить `biddable = false` для цілі категорії CONTACT **на рівні кампанії**
(саме вона керує, бо перекриває акаунтну). Дія при цьому лишається ENABLED і продовжує
рахуватись у «Всіх конверсіях» — історія ціла, рішення оборотне одним прапорцем.
Дію НЕ видаляємо: видалення знищило б і накопичені дані.

⚠️ Подія `telegram_click` у GA4 лишається як була — вона потрібна, щоб бачити, скільки
людей усе-таки йдуть у Telegram із футера й контактів. Прибираємо облік у рекламі,
а не вимірювання.

    ./ads-telegram-goal-off.py show       # поточний стан цілей
    ./ads-telegram-goal-off.py apply --dry-run
    ./ads-telegram-goal-off.py apply
    ./ads-telegram-goal-off.py --self-test
"""
import argparse, datetime, json, pathlib, sys

from importlib.machinery import SourceFileLoader

_kw = SourceFileLoader(
    "ads_keyword_urls",
    str(pathlib.Path(__file__).resolve().parent / "ads-keyword-urls.py"),
).load_module()
CUSTOMER_ID = _kw.CUSTOMER_ID
build_client = _kw.build_client

SNAP_DIR = pathlib.Path(__file__).resolve().parent.parent / "snapshots"
CAMPAIGN_ID = "24138448702"
TARGET_CATEGORY = "CONTACT"

# Фільтруємо по campaign.id з тієї ж причини, що і в ads-quality-fixes.py: пишемо в
# жорстко задану кампанію, тож і читати мусимо саме її, інакше перевірка бреше.
GOALS_QUERY = f"""
    SELECT campaign.id, campaign_conversion_goal.category,
           campaign_conversion_goal.origin, campaign_conversion_goal.biddable
    FROM campaign_conversion_goal
    WHERE campaign.id = {CAMPAIGN_ID}
"""


def plan(goals, category=TARGET_CATEGORY):
    """Чисто, без мережі: чи треба щось міняти. Ідемпотентно."""
    target = [g for g in goals if g["category"] == category]
    if not target:
        return None, f"цілі категорії {category} у кампанії немає"
    g = target[0]
    if not g["biddable"]:
        return None, f"{category} уже не в метриці «Конверсії»"
    return g, None


def fetch_goals(client):
    ga = client.get_service("GoogleAdsService")
    out = []
    for batch in ga.search_stream(customer_id=CUSTOMER_ID, query=GOALS_QUERY):
        for r in batch.results:
            g = r.campaign_conversion_goal
            out.append({
                "campaign_id": str(r.campaign.id),
                "category": g.category.name,
                "origin": g.origin.name,
                "biddable": g.biddable,
            })
    return out


def mutate(client, goal, dry_run):
    from google.api_core import protobuf_helpers
    svc = client.get_service("CampaignConversionGoalService")
    op = client.get_type("CampaignConversionGoalOperation")
    g = op.update
    g.resource_name = svc.campaign_conversion_goal_path(
        CUSTOMER_ID, goal["campaign_id"], goal["category"], goal["origin"]
    )
    g.biddable = False
    client.copy_from(op.update_mask, protobuf_helpers.field_mask(None, g._pb))
    req = client.get_type("MutateCampaignConversionGoalsRequest")
    req.customer_id = CUSTOMER_ID
    req.operations.append(op)
    req.validate_only = dry_run
    svc.mutate_campaign_conversion_goals(request=req)


def show(goals):
    for g in sorted(goals, key=lambda x: x["category"]):
        mark = "  <— рахується як «Конверсія»" if g["biddable"] else ""
        print(f"  {g['category']:<20} origin={g['origin']:<10} biddable={g['biddable']}{mark}")


def save_snapshot(goals, label):
    SNAP_DIR.mkdir(exist_ok=True)
    ts = datetime.datetime.now().strftime("%Y-%m-%d-%H%M")
    p = SNAP_DIR / f"ads-goals-{ts}-{label}.json"
    p.write_text(json.dumps(goals, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return p


def self_test():
    base = [
        {"campaign_id": "1", "category": "CONTACT", "origin": "WEBSITE", "biddable": True},
        {"campaign_id": "1", "category": "SUBMIT_LEAD_FORM", "origin": "WEBSITE", "biddable": True},
    ]
    g, why = plan(base)
    assert g and g["category"] == "CONTACT" and why is None, "біддабельний CONTACT треба вимкнути"

    off = [{**base[0], "biddable": False}, base[1]]
    g, why = plan(off)
    assert g is None and "уже не в метриці" in why, "повторний запуск — no-op"

    g, why = plan([base[1]])
    assert g is None and "немає" in why, "без цілі CONTACT нічого не робимо"

    # Найважливіше: чіпаємо РІВНО одну категорію й не зачіпаємо заявки з форми.
    g, _ = plan(base)
    assert g["category"] != "SUBMIT_LEAD_FORM", "заявки з форми лишаються основною конверсією"
    assert all(x["biddable"] for x in base if x["category"] == "SUBMIT_LEAD_FORM"), (
        "plan не має мутувати вхідні дані")

    print("self-test: 5 перевірок пройдено")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("command", nargs="?", choices=["show", "apply"])
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    args = ap.parse_args()

    if args.self_test:
        self_test()
        return
    if not args.command:
        ap.error("потрібна команда: show або apply")

    client = build_client()
    goals = fetch_goals(client)

    if args.command == "show":
        print(f"Цілі кампанії {CAMPAIGN_ID}:")
        show(goals)
        return

    goal, why = plan(goals)
    if goal is None:
        print(f"Нічого змінювати: {why}")
        return

    print(f"Стан ДО (кампанія {CAMPAIGN_ID}):")
    show(goals)
    print(f"\nБуде змінено: {goal['category']} biddable True -> False")

    if args.dry_run:
        mutate(client, goal, dry_run=True)
        print("--dry-run: валідацію Google пройдено, нічого не записано.")
        return

    print("Знімок ДО:", save_snapshot(goals, "before"))
    mutate(client, goal, dry_run=False)

    after = fetch_goals(client)
    print("\nСтан ПІСЛЯ (перечитано з API):")
    show(after)
    print("Знімок:", save_snapshot(after, "after"))

    still, _ = plan(after)
    if still is not None:
        print("\nПЕРЕВІРКА: НЕ ЗАСТОСОВАНО — CONTACT досі biddable")
        sys.exit(1)
    lead = [g for g in after if g["category"] == "SUBMIT_LEAD_FORM"]
    if not lead or not lead[0]["biddable"]:
        print("\nПЕРЕВІРКА: ЗЛАМАНО — заявки з форми перестали бути конверсією")
        sys.exit(1)
    print("\nПЕРЕВІРКА: telegram_click виведено з метрики, заявки з форми на місці")


if __name__ == "__main__":
    main()
