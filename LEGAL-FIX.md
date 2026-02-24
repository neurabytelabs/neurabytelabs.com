# Legal Fix — neurabytelabs.com
*RICK tarafından hazırlandı | 2026-02-24 | 3 kritik düzeltme*

## Dosya: `src/App.tsx`

---

## FIX 1 — §55 RStV → §18 MStV (Satır ~242)

**BUL:**
```
Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
```

**DEĞİŞTİR:**
```
Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
```

---

## FIX 2 — Betroffenenrechte tam liste + Speicherdauer ekle (Datenschutz bölümü)

**BUL** (mevcut Abschnitt 6):
```tsx
<h3 className="font-mono text-ratio mb-2">6. Ihre Rechte</h3>
<p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Beschwerderecht bei der Aufsichtsbehörde: LDI NRW (https://www.ldi.nrw.de).</p>
```

**DEĞİŞTİR:**
```tsx
<h3 className="font-mono text-ratio mb-2">5. Speicherdauer</h3>
<p>Server-Log-Dateien werden nach spätestens 7 Tagen automatisch gelöscht. Per E-Mail übermittelte Daten werden nach Abschluss der Anfrage und Ablauf gesetzlicher Aufbewahrungsfristen (max. 10 Jahre) gelöscht.</p>

<h3 className="font-mono text-ratio mb-2">6. Ihre Rechte (Art. 15–21 DSGVO)</h3>
<p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
<ul className="list-none space-y-1 mt-2">
  <li>— Recht auf Auskunft (Art. 15 DSGVO)</li>
  <li>— Recht auf Berichtigung (Art. 16 DSGVO)</li>
  <li>— Recht auf Löschung (Art. 17 DSGVO)</li>
  <li>— Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
  <li>— Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
  <li>— Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
</ul>
<p className="mt-2">Beschwerderecht bei der zuständigen Aufsichtsbehörde:<br/>
<a href="https://www.ldi.nrw.de" target="_blank" rel="noreferrer" className="text-spark hover:underline">Landesbeauftragte für Datenschutz und Informationsfreiheit NRW (LDI NRW)</a></p>
```

---

## FIX 3 — Gemini API + Cookie Abschnitt ekle (Datenschutz bölümü)

Abschnitt 5'ten ÖNCE yeni bir bölüm ekle (Analyse-Tools bölümünü güncelle):

**BUL:**
```tsx
<h3 className="font-mono text-ratio mb-2">5. Analyse-Tools und Werbung</h3>
<p>Derzeit werden keine Tracking- oder Analyse-Tools eingesetzt.</p>
```

**DEĞİŞTİR:**
```tsx
<h3 className="font-mono text-ratio mb-2">5. Externe Dienste & KI-Funktionen</h3>
<p><strong>Google Gemini API:</strong> Diese Website nutzt für interaktive Visualisierungen die Gemini API von Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA). Dabei können technische Daten (u.a. Browsertyp, Zeitstempel) an Server von Google in den USA übermittelt werden. Grundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer funktionsfähigen Website). Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-spark hover:underline">Google Datenschutzerklärung</a>.</p>
<p className="mt-2"><strong>Cookies und lokaler Speicher:</strong> Diese Website verwendet ausschließlich technisch notwendige Cookies (z.B. zur Speicherung Ihrer Cookie-Einwilligung). Keine Tracking- oder Werbe-Cookies. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TTDSG.</p>
<p className="mt-2"><strong>Analyse-Tools:</strong> Derzeit werden keine Tracking- oder Analyse-Tools eingesetzt.</p>
```

---

## Commit Message
```
fix: legal compliance — §18 MStV, Gemini API disclosure, Speicherdauer, vollständige Betroffenenrechte

- §55 RStV → §18 Abs. 2 MStV (seit Nov. 2020 gültig)
- Gemini API Drittlandübermittlung (USA) dokumentiert per Art. 44ff DSGVO
- Cookies/TTDSG §25 Abs. 2 Nr. 2 erwähnt
- Speicherdauer ergänzt (Art. 13 Abs. 2 lit. a DSGVO)
- Betroffenenrechte vollständig: Art. 15-21 DSGVO aufgeführt
- LDI NRW als klickbarer Link
```
