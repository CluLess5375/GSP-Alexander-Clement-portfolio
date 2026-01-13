Doel
-----
Vervang de HTML van je live site met je lokale `index.html`, maar behoud de huidige live `logboek` inhoud.

Workflow (samenvatting)
-----------------------
1. Download de huidige live HTML van https://clementv240508.gti-i2ct.be/ als raw HTML en noem het `live.html`.
   - In je browser: Open de site, kies View -> Developer -> View Source, of Save Page As -> Webpage, HTML only.
   - Sla dat bestand in de repo root.

2. Run het merge-script (Python) dat `logboek-clement` en `logboek-brands` uit `live.html` haalt
   en in jouw lokale `index.html` plakt.

   PowerShell-voorbeeld (Windows):

```powershell
python -m pip install --user beautifulsoup4 lxml
python .\scripts\merge_logboek.py --local .\index.html --live .\live.html --out .\merged-index.html
```

3. Controleer `merged-index.html` lokaal in je browser (open het bestand met de browser) en verifieer dat:
   - Je layout en styling (dashboard, projecten, etc.) zijn zoals je wilt.
   - De `logboek`-secties (Clement en Alexander) matchen exact de live site inhoud.

4. Deploy de `merged-index.html` naar de host: vervang de live `index.html` met `merged-index.html` op jouw hosting.
   Mogelijke manieren om te uploaden:
   - Gebruik het hosting controlepaneel (file manager) van je provider en upload `merged-index.html` als `index.html`.
   - Of gebruik SFTP/FTP: (voorbeeld met PowerShell / WinSCP / FileZilla).
   - Of commit & push naar de repository / deploy mechanism dat je hosting gebruikt (indien van toepassing).

5. Test live site: bezoek https://clementv240508.gti-i2ct.be/ en controleer dat alles werkt en dat de logboek-entries onveranderd zijn.

Notities en veiligheid
----------------------
- Ik kan NIET zelf je live site aanpassen — ik kan alleen lokaal de samengevoegde HTML genereren. Je moet zelf uploaden of mij toegang geven (die ik niet vraag).
- Als je hosting automatisch inhoud injecteert (bijv. privacy banners of GDPR notices), dan blijven die mogelijk zichtbaar na deploy. De script-merge behoudt alleen wat er in `live.html` staat.
- Als je wilt dat ik automatisch download en merge (en `merged-index.html` produceer), geef me toestemming om de live HTML te downloaden hier. Ik kan dat ook voor je uitvoeren.

Hulp nodig?
-----------
- Wil je dat ik nu automatisch download & merge (ik probeer live HTML te halen en produceer `merged-index.html`)?
- Wil je instructie voor SFTP upload of een WinSCP/pscp voorbeeld? Geef aan wat je hosting ondersteunt (FTP/SFTP/git).
