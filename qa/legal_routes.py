"""Impressum/Datenschutz yönlendirme kontrolü (Playwright, /usr/bin/python3).

Kullanım: npm run build && python3 qa/legal_routes.py [ekran_görüntüsü_klasörü]
`vite preview` başlatır; /impressum ve /datenschutz doğrudan adresle açılmalı,
ana sayfadaki düğmeler bu adreslere bağlantı olmalı.
"""
import subprocess, sys, time, urllib.request, pathlib
from playwright.sync_api import sync_playwright

PORT = 4173
BASE = f"http://127.0.0.1:{PORT}"
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
fails = []

def check(name, ok, detail=""):
    print(("OK    " if ok else "HATA  ") + name + (f" — {detail}" if detail else ""))
    if not ok:
        fails.append(name)

srv = subprocess.Popen(["npx", "vite", "preview", "--port", str(PORT), "--host", "127.0.0.1", "--strictPort"],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try:
            urllib.request.urlopen(BASE, timeout=1); break
        except Exception:
            time.sleep(0.2)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1280, "height": 900})

        for path, heading in (("/impressum", "Impressum"), ("/datenschutz", "Datenschutzerklärung")):
            resp = pg.goto(BASE + path)
            pg.wait_for_timeout(800)
            h2 = pg.locator("h2").first.inner_text() if pg.locator("h2").count() else ""
            check(f"doğrudan adres {path}", resp.status == 200 and h2.strip().lower() == heading.lower(), f"durum={resp.status} h2={h2!r}")
            if OUT:
                OUT.mkdir(parents=True, exist_ok=True)
                pg.screenshot(path=str(OUT / (path.strip('/') + ".png")), full_page=True)
            if path == "/impressum":
                txt = pg.locator("body").inner_text()
                check("Impressum: § 5 DDG", "§ 5 DDG" in txt)
                check("Impressum: § 18 Abs. 2 MStV", "§ 18 Abs. 2 MStV" in txt)
                check("Impressum: TMG/RStV atfı yok", "TMG" not in txt and "RStV" not in txt)

        pg.goto(BASE + "/")
        pg.wait_for_timeout(500)
        for path, label in (("/impressum", "Impressum"), ("/datenschutz", "Datenschutz")):
            link = pg.locator(f'footer a[href="{path}"]')
            check(f"ana sayfa altbilgi bağlantısı {label}", link.count() == 1 and link.first.inner_text().strip().lower() == label.lower())
            if link.count() == 1:
                link.first.click()
                pg.wait_for_timeout(900)
                check(f"{label} tıklaması adresi değiştirir", pg.url == BASE + path, pg.url)
                pg.go_back()
                pg.wait_for_timeout(900)
                check(f"geri düğmesi {label} sonrası ana sayfaya döner", pg.url == BASE + "/", pg.url)
        b.close()
finally:
    srv.terminate()

print("\nSONUÇ:", "HATA " + str(len(fails)) if fails else "tümü OK")
sys.exit(1 if fails else 0)
