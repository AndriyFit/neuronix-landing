#!/usr/bin/env python3
"""Три правки якості в кампанії Neuronix: строк в оголошеннях, ціни, display path, гео.

Навіщо (аудит 2026-09-07, 30 днів: 857 показів, 81 клік, 4426 грн, 1 заявка):
post_click_quality_score = BELOW_AVERAGE у 10 ключів з 10, creative BELOW/AVERAGE у 6 з 10,
втрачено показів через Ad Rank — 58,4%, через бюджет — 3,1%. Тобто бюджет не обмежує,
обмежує якість. Контентну частину виправлено на сайті (коміт 914be80), тут — акаунт.

Що робить:

1. СТРОК. «Запуск за 10 днів» живе у двох ENABLED-оголошеннях, а посадкова /uk каже:
   лендінг 5–10 днів, корпоративний 2–3 тижні, магазин від 4 тижнів. Це той самий дефект,
   за який 25.08 спаузили оголошення 820780707003 — просто в інших двох. Заміна на
   «Лендінг за 5–10 днів» дослівно збігається з hero головної.

2. ЦІНИ В ОГОЛОШЕННЯХ. Уся позиція — «відкриті ціни», сайт їх показує, оголошення не
   показували жодної суми, хоча 5 ключів з 10 мають ціновий намір. Суми беруться з
   pricing.items (uk.json) — той самий інваріант, що вже перевіряє тест prices.test.ts.

3. DISPLAY PATH. Був порожній у всіх трьох RSA (neuronics.work без нічого). Це безкоштовні
   два слова із запиту прямо в видимому URL оголошення.

4. ГЕО. positive_geo_target_type був PRESENCE_OR_INTEREST — показ і тим, хто лише
   цікавиться Україною. У пошукових запитах це вже видно: «сайт под ключ украина»,
   «сайт под ключ цена украина», обидва 0 кліків. PRESENCE лишає тільки тих, хто в Україні.

    ./ads-quality-fixes.py snapshot     # знімок стану у snapshots/
    ./ads-quality-fixes.py apply --dry-run
    ./ads-quality-fixes.py apply        # знімок до, зміни, перечитування після
    ./ads-quality-fixes.py --self-test  # логіка без мережі

⚠️ Перевіряти результат ПЕРЕЧИТУВАННЯМ, а не відповіддю API: `validate_only` перевіряє
форму запиту, а не те, що значення збережеться. Крок verify тут обов'язковий, не опційний.
"""
import argparse, datetime, json, pathlib, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from importlib.machinery import SourceFileLoader

_kw = SourceFileLoader("ads_keyword_urls", str(pathlib.Path(__file__).resolve().parent / "ads-keyword-urls.py")).load_module()
CUSTOMER_ID = _kw.CUSTOMER_ID
build_client = _kw.build_client

SNAP_DIR = pathlib.Path(__file__).resolve().parent.parent / "snapshots"
CAMPAIGN_ID = "24138448702"

# Ліміти Google Ads для RSA. Порушення = помилка мутації, тому перевіряємо самі,
# щоб побачити її в --self-test, а не в проді.
MAX_HEADLINE = 30
MAX_DESCRIPTION = 90
MAX_PATH = 15
MAX_HEADLINES = 15

# Заміни тексту. Ключ — точний наявний рядок, значення — новий. Заміна за текстом,
# а не за індексом: індекси зсуваються, коли до оголошення щось додають руками.
TEXT_REPLACEMENTS = {
    "Запуск за 10 днів": "Лендінг за 5–10 днів",
    "Інтеграції з Новою поштою, CRM та обліком під ключ. Запуск за 10 днів.":
        "Інтеграції з Новою поштою, CRM та обліком під ключ. Лендінг за 5–10 днів.",
}

# Що додати кожній групі. Суми звірені з pricing.items у src/i18n/uk.json.
# path1/path2 — видимий шлях в оголошенні, до 15 символів кожен.
PER_AD_GROUP = {
    "199656753776": {  # Сайт під ключ -> /uk
        "add_headlines": ["Лендінг від $350"],
        "path1": "Сайти", "path2": "Під-ключ",
    },
    "202276594747": {  # Інтернет-магазин -> /uk/online-store
        "add_headlines": ["Магазин від $500"],
        "path1": "Магазин", "path2": "Під-ключ",
    },
    "202948761487": {  # Ціна розробки -> /uk/price
        "add_headlines": ["Лендінг від $350", "Магазин від $500"],
        "path1": "Ціни", "path2": "Розробка-сайту",
    },
}

ADS_QUERY = """
    SELECT ad_group.id, ad_group.name, ad_group_ad.ad.id, ad_group_ad.status,
           ad_group_ad.ad.responsive_search_ad.headlines,
           ad_group_ad.ad.responsive_search_ad.descriptions,
           ad_group_ad.ad.responsive_search_ad.path1,
           ad_group_ad.ad.responsive_search_ad.path2
    FROM ad_group_ad
    WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED'
"""

GEO_QUERY = """
    SELECT campaign.id, campaign.name,
           campaign.geo_target_type_setting.positive_geo_target_type,
           campaign.geo_target_type_setting.negative_geo_target_type
    FROM campaign WHERE campaign.status = 'ENABLED'
"""


def plan_ad_changes(ads, replacements, per_group):
    """Чисто, без мережі. Повертає (зміни, пропущені) — що саме треба записати в кожне оголошення.

    Ідемпотентно: оголошення, де все вже цільове, потрапляє в пропущені.
    """
    changes, skipped = [], []
    for ad in ads:
        cfg = per_group.get(ad["ad_group_id"])
        if not cfg:
            skipped.append((ad, "невідома ad group"))
            continue

        heads = [replacements.get(h, h) for h in ad["headlines"]]
        for extra in cfg["add_headlines"]:
            if extra not in heads:
                heads.append(extra)
        descs = [replacements.get(d, d) for d in ad["descriptions"]]

        problems = [f"заголовок >{MAX_HEADLINE}: {h!r}" for h in heads if len(h) > MAX_HEADLINE]
        problems += [f"опис >{MAX_DESCRIPTION}: {d!r}" for d in descs if len(d) > MAX_DESCRIPTION]
        problems += [f"шлях >{MAX_PATH}: {p!r}" for p in (cfg["path1"], cfg["path2"]) if len(p) > MAX_PATH]
        if len(heads) > MAX_HEADLINES:
            problems.append(f"заголовків {len(heads)} > {MAX_HEADLINES}")
        if problems:
            skipped.append((ad, "; ".join(problems)))
            continue

        same = (heads == ad["headlines"] and descs == ad["descriptions"]
                and ad["path1"] == cfg["path1"] and ad["path2"] == cfg["path2"])
        if same:
            skipped.append((ad, "уже цільовий стан"))
            continue

        changes.append({**ad, "new_headlines": heads, "new_descriptions": descs,
                        "new_path1": cfg["path1"], "new_path2": cfg["path2"]})
    return changes, skipped


def fetch_ads(client):
    ga = client.get_service("GoogleAdsService")
    out = []
    for batch in ga.search_stream(customer_id=CUSTOMER_ID, query=ADS_QUERY):
        for r in batch.results:
            rsa = r.ad_group_ad.ad.responsive_search_ad
            out.append({
                "ad_group_id": str(r.ad_group.id),
                "ad_group_name": r.ad_group.name,
                "ad_id": str(r.ad_group_ad.ad.id),
                "headlines": [h.text for h in rsa.headlines],
                "descriptions": [d.text for d in rsa.descriptions],
                "path1": rsa.path1,
                "path2": rsa.path2,
            })
    return out


def fetch_geo(client):
    ga = client.get_service("GoogleAdsService")
    for batch in ga.search_stream(customer_id=CUSTOMER_ID, query=GEO_QUERY):
        for r in batch.results:
            g = r.campaign.geo_target_type_setting
            return {"campaign_id": str(r.campaign.id), "name": r.campaign.name,
                    "positive": g.positive_geo_target_type.name,
                    "negative": g.negative_geo_target_type.name}
    return None


def mutate_ads(client, changes, dry_run):
    """RSA редагується на місці через AdService: ad_id і накопичена історія зберігаються.

    update_mask будується з реально заповнених полів (protobuf_helpers.field_mask),
    а не руками: `FieldMask` — тип protobuf, а не Google Ads, і client.get_type його не знає.
    """
    from google.api_core import protobuf_helpers
    svc = client.get_service("AdService")
    ops = []
    for ch in changes:
        op = client.get_type("AdOperation")
        ad = op.update
        ad.resource_name = svc.ad_path(CUSTOMER_ID, ch["ad_id"])
        rsa = ad.responsive_search_ad
        for text in ch["new_headlines"]:
            asset = client.get_type("AdTextAsset"); asset.text = text
            rsa.headlines.append(asset)
        for text in ch["new_descriptions"]:
            asset = client.get_type("AdTextAsset"); asset.text = text
            rsa.descriptions.append(asset)
        rsa.path1 = ch["new_path1"]
        rsa.path2 = ch["new_path2"]
        client.copy_from(op.update_mask, protobuf_helpers.field_mask(None, ad._pb))
        ops.append(op)
    if not ops:
        return 0
    # Через об'єкт запиту, а не kwargs: AdServiceClient.mutate_ads не приймає
    # validate_only окремим аргументом, і без нього --dry-run мовчки став би записом.
    req = client.get_type("MutateAdsRequest")
    req.customer_id = CUSTOMER_ID
    req.operations.extend(ops)
    req.validate_only = dry_run
    svc.mutate_ads(request=req)
    return len(ops)


def mutate_geo(client, dry_run):
    from google.api_core import protobuf_helpers
    svc = client.get_service("CampaignService")
    op = client.get_type("CampaignOperation")
    c = op.update
    c.resource_name = svc.campaign_path(CUSTOMER_ID, CAMPAIGN_ID)
    c.geo_target_type_setting.positive_geo_target_type = (
        client.enums.PositiveGeoTargetTypeEnum.PRESENCE)
    client.copy_from(op.update_mask, protobuf_helpers.field_mask(None, c._pb))
    req = client.get_type("MutateCampaignsRequest")
    req.customer_id = CUSTOMER_ID
    req.operations.append(op)
    req.validate_only = dry_run
    svc.mutate_campaigns(request=req)


def save_snapshot(payload, label):
    SNAP_DIR.mkdir(exist_ok=True)
    ts = datetime.datetime.now().strftime("%Y-%m-%d-%H%M")
    p = SNAP_DIR / f"ads-quality-{ts}-{label}.json"
    p.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return p


def show(ads, geo):
    if geo:
        print(f"  гео: positive={geo['positive']} negative={geo['negative']}")
    for a in ads:
        print(f"  [{a['ad_group_name']}] ad {a['ad_id']}  шлях=/{a['path1']}/{a['path2']}")
        print(f"    H({len(a['headlines'])}): " + " | ".join(a["headlines"]))
        print(f"    D({len(a['descriptions'])}): " + " | ".join(a["descriptions"]))


def self_test():
    base = {"ad_group_id": "199656753776", "ad_group_name": "Сайт під ключ", "ad_id": "1",
            "headlines": ["Розробка сайту під ключ", "Запуск за 10 днів"],
            "descriptions": ["Інтеграції з Новою поштою, CRM та обліком під ключ. Запуск за 10 днів."],
            "path1": "", "path2": ""}

    ch, sk = plan_ad_changes([base], TEXT_REPLACEMENTS, PER_AD_GROUP)
    assert len(ch) == 1, "оголошення зі старим строком має змінюватись"
    got = ch[0]
    assert "Запуск за 10 днів" not in got["new_headlines"], "старий строк мусить зникнути із заголовків"
    assert "Лендінг за 5–10 днів" in got["new_headlines"], "новий строк мусить з'явитись"
    assert all("Запуск за 10 днів" not in d for d in got["new_descriptions"]), "і з описів теж"
    assert "Лендінг від $350" in got["new_headlines"], "ціна має додатись"
    assert got["new_path1"] == "Сайти" and got["new_path2"] == "Під-ключ", "display path"

    # Ідемпотентність: повторний прогін по вже зміненому стані нічого не робить.
    applied = {**base, "headlines": got["new_headlines"], "descriptions": got["new_descriptions"],
               "path1": got["new_path1"], "path2": got["new_path2"]}
    ch2, sk2 = plan_ad_changes([applied], TEXT_REPLACEMENTS, PER_AD_GROUP)
    assert not ch2 and sk2[0][1] == "уже цільовий стан", "повторний запуск має бути no-op"

    # Дубль ціни не додається навіть якщо вона вже стоїть вручну.
    manual = {**base, "headlines": base["headlines"] + ["Лендінг від $350"]}
    ch3, _ = plan_ad_changes([manual], TEXT_REPLACEMENTS, PER_AD_GROUP)
    assert ch3[0]["new_headlines"].count("Лендінг від $350") == 1, "ціна не дублюється"

    # Ліміти справді ловляться, а не тихо їдуть у прод.
    too_long = {**base, "headlines": ["x" * 31]}
    ch4, sk4 = plan_ad_changes([too_long], TEXT_REPLACEMENTS, PER_AD_GROUP)
    assert not ch4 and "заголовок >30" in sk4[0][1], "задовгий заголовок має блокувати зміну"

    over = {**base, "headlines": [f"h{i}" for i in range(15)]}
    ch5, sk5 = plan_ad_changes([over], TEXT_REPLACEMENTS, PER_AD_GROUP)
    assert not ch5 and "заголовків 16" in sk5[0][1], "перевищення 15 заголовків має блокувати"

    unknown = {**base, "ad_group_id": "000"}
    ch6, sk6 = plan_ad_changes([unknown], TEXT_REPLACEMENTS, PER_AD_GROUP)
    assert not ch6 and sk6[0][1] == "невідома ad group", "чужа група не чіпається"

    # Самі константи мусять вкладатись у ліміти — інакше self-test зелений, а прод падає.
    for gid, cfg in PER_AD_GROUP.items():
        assert len(cfg["path1"]) <= MAX_PATH and len(cfg["path2"]) <= MAX_PATH, f"шлях завеликий: {gid}"
        for h in cfg["add_headlines"]:
            assert len(h) <= MAX_HEADLINE, f"заголовок завеликий: {h}"
    for old, new in TEXT_REPLACEMENTS.items():
        limit = MAX_HEADLINE if len(old) <= MAX_HEADLINE else MAX_DESCRIPTION
        assert len(new) <= limit, f"заміна не вкладається в ліміт: {new}"

    print("self-test: 8 перевірок пройдено")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("command", nargs="?", choices=["snapshot", "apply"])
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--self-test", action="store_true")
    args = ap.parse_args()

    if args.self_test:
        self_test()
        return
    if not args.command:
        ap.error("потрібна команда: snapshot або apply")

    client = build_client()
    ads, geo = fetch_ads(client), fetch_geo(client)

    if args.command == "snapshot":
        print(f"Стан ({len(ads)} оголошень):")
        show(ads, geo)
        print("Знімок:", save_snapshot({"ads": ads, "geo": geo}, "snapshot"))
        return

    changes, skipped = plan_ad_changes(ads, TEXT_REPLACEMENTS, PER_AD_GROUP)
    for ad, why in skipped:
        print(f"  пропущено [{ad['ad_group_name']}] ad {ad['ad_id']}: {why}")
    geo_needs_change = geo and geo["positive"] != "PRESENCE"

    if not changes and not geo_needs_change:
        print("Нічого змінювати — стан уже цільовий.")
        return

    print(f"\nБуде змінено оголошень: {len(changes)}"
          + (f", гео: {geo['positive']} -> PRESENCE" if geo_needs_change else ", гео вже PRESENCE"))
    for ch in changes:
        print(f"  [{ch['ad_group_name']}] ad {ch['ad_id']}")
        print(f"    шлях /{ch['path1']}/{ch['path2']} -> /{ch['new_path1']}/{ch['new_path2']}")
        for old, new in zip(ch["headlines"], ch["new_headlines"]):
            if old != new:
                print(f"    заголовок: {old!r} -> {new!r}")
        for extra in ch["new_headlines"][len(ch["headlines"]):]:
            print(f"    + заголовок: {extra!r}")
        for old, new in zip(ch["descriptions"], ch["new_descriptions"]):
            if old != new:
                print(f"    опис: {old!r} -> {new!r}")

    if args.dry_run:
        mutate_ads(client, changes, dry_run=True)
        if geo_needs_change:
            mutate_geo(client, dry_run=True)
        print("\n--dry-run: валідацію Google пройдено, нічого не записано.")
        return

    print("\nЗнімок ДО:", save_snapshot({"ads": ads, "geo": geo}, "before"))
    n = mutate_ads(client, changes, dry_run=False)
    if geo_needs_change:
        mutate_geo(client, dry_run=False)
    print(f"Записано: оголошень {n}" + (", гео PRESENCE" if geo_needs_change else ""))

    # Перечитування — відповідь мутації не є доказом, що значення збереглося.
    ads_after, geo_after = fetch_ads(client), fetch_geo(client)
    print("\nСтан ПІСЛЯ (перечитано з API):")
    show(ads_after, geo_after)
    print("Знімок:", save_snapshot({"ads": ads_after, "geo": geo_after}, "after"))

    left, _ = plan_ad_changes(ads_after, TEXT_REPLACEMENTS, PER_AD_GROUP)
    bad = [f"оголошення {c['ad_id']}" for c in left]
    if geo_after and geo_after["positive"] != "PRESENCE":
        bad.append(f"гео лишилось {geo_after['positive']}")
    print("\nПЕРЕВІРКА: " + ("усе застосовано" if not bad else "НЕ ЗАСТОСОВАНО — " + ", ".join(bad)))
    if bad:
        sys.exit(1)


if __name__ == "__main__":
    main()
