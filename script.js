let urenAlexander = 12;
let urenClement = 18;

function laadPagina() {
  try { controleerEnHerstelSections(); } catch (e) { console.error('controleerEnHerstelSections fout:', e); }
  try { berekenUrenPerLid(); } catch (e) { console.error('berekenUrenPerLid fout:', e); }
  try { totaalUren(); } catch (e) { console.error('totaalUren fout:', e); }
  try { telLogboekEntries(); } catch (e) { console.error('telLogboekEntries fout:', e); }
  try { berekenGemiddeldeUren(); } catch (e) { console.error('berekenGemiddeldeUren fout:', e); }
  try { installeerZoekProjecten(); } catch (e) { console.error('installeerZoekProjecten fout:', e); }
  try { installeerZoekLogboek(); } catch (e) { console.error('installeerZoekLogboek fout:', e); }
  try { laatsteEntry(); } catch (e) { console.error('laatsteEntry fout:', e); }
}

function controleerEnHerstelSections(){
  const verwachte = [
    'dashboard','projecten','logboek-clement','logboek-brands',
    'tijdlijn','uren-tracking','voortgang','instellingen'
  ];

  const body = document.body;
  let created = 0;
  for (const id of verwachte){
    if (!document.getElementById(id)){
      // maak een eenvoudige fallback section zodat navigatie niet faalt
      const sec = document.createElement('section');
      sec.id = id;
      sec.style.display = 'none';
      const home = document.createElement('div');
      home.className = 'home';
      const welkom = document.createElement('div');
      welkom.className = 'welkom';
      const h2 = document.createElement('h2');
      h2.textContent = id.replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
      const p = document.createElement('p');
      p.textContent = 'Automatisch aangemaakte placeholder voor sectie: ' + id;
      welkom.appendChild(h2);
      welkom.appendChild(p);
      home.appendChild(welkom);
      sec.appendChild(home);
      body.appendChild(sec);
      created++;
      console.warn('Placeholder section aangemaakt voor:', id);
    }
  }
  if (created>0) console.info('Herstelde', created, 'ontbrekende sections');
}

// Globale foutlogger om stilstaande JS fouten zichtbaar te maken tijdens debugging
window.addEventListener('error', function (ev) {
  console.error('Globale fout gedetecteerd:', ev.error || ev.message, ev);
  // toon een kleine melding zodat de gebruiker weet dat er een fout is
  try { if (window && window.alert) window.alert('Er is een JavaScript-fout opgetreden. Kijk in de console voor details.'); } catch (e) {}
});

function totaalUren() {
  urenAlexander =
    parseFloat(document.getElementById("urenAlexander").textContent) || 0;
  urenClement =
    parseFloat(document.getElementById("urenClement").textContent) || 0;
  const totaal = urenAlexander + urenClement;

  const pctA = totaal > 0 ? (urenAlexander / totaal) * 100 : 0;
  const pctC = totaal > 0 ? (urenClement / totaal) * 100 : 0;

  const totaleUrenDashboard = document.getElementById("totaleUren-Dashboard");
  if (totaleUrenDashboard) totaleUrenDashboard.innerText = totaal + "u";
  
  const totaleUrenCard = document.getElementById("totaleUren-Dashboard-Card");
  if (totaleUrenCard) totaleUrenCard.innerText = totaal + "u";

  // Update uren-tracking section
  const urenTrackingSection = document.getElementById("uren-tracking");
  if (urenTrackingSection) {
    const items = urenTrackingSection.querySelectorAll(".uren-container .item");
    items.forEach(item => {
      const titel = item.querySelector(".titel");
      if (titel) {
        const aantal = item.querySelector(".aantal");
        if (aantal) {
          if (titel.textContent.includes("Totaal Uren")) {
            aantal.innerText = totaal;
          } else if (titel.textContent.includes("Alexander")) {
            aantal.innerText = urenAlexander;
          } else if (titel.textContent.includes("Clement")) {
            aantal.innerText = urenClement;
          }
        }
      }
    });
  }

  const voortgangClement = document.getElementById("voortgang-clement");
  if (voortgangClement) voortgangClement.innerText = pctC.toFixed(1) + "%";
  
  const voortgangAlexander = document.getElementById("voortgang-alexander");
  if (voortgangAlexander) voortgangAlexander.innerText = pctA.toFixed(1) + "%";
}

function telLogboekEntries() {
  const totaal_entries_clement = document.querySelectorAll(
    "#logboek-clement .logboek-container"
  ).length;
  const totaal_entries_alexander = document.querySelectorAll(
    "#logboek-brands .logboek-container"
  ).length;

  const totaalEntriesEl = document.getElementById("totaal-Aantal-Entries");
  if (totaalEntriesEl) {
    totaalEntriesEl.innerText = totaal_entries_clement + totaal_entries_alexander;
  }
}

function parseUren(txt) {
  txt = (txt || "").replace(",", ".").trim();
  let num = "";
  let started = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    if ((ch >= "0" && ch <= "9") || ch === ".") {
      num += ch;
      started = true;
    } else if (started) break;
  }
  return num ? parseFloat(num) : NaN;
}

function berekenUrenPerLid() {
  function sumVoor(sectionId, naam) {
    const containers = document.querySelectorAll(sectionId + " .logboek-container");
    let s = 0;
    containers.forEach((container) => {
      const item = container.querySelector(".item");
      if (!item) return;
      
      // Check if this entry belongs to the right person
      const infoEl = item.querySelector(".info");
      if (infoEl && !infoEl.textContent.toLowerCase().includes(naam.toLowerCase())) {
        return;
      }
      
      const tijdEl = item.querySelector(".tijd-datum") || item.querySelector(".tijd");
      if (!tijdEl) return;
      const v = parseUren(tijdEl.textContent);
      if (!isNaN(v)) s += v;
    });
    return s;
  }

  const sumC = sumVoor("#logboek-clement", "clément");
  const sumA = sumVoor("#logboek-brands", "alexander");
  urenClement = Math.round(sumC * 100) / 100;
  urenAlexander = Math.round(sumA * 100) / 100;
  
  const ec = document.getElementById("urenClement");
  if (ec) ec.innerText = urenClement;
  const ea = document.getElementById("urenAlexander");
  if (ea) ea.innerText = urenAlexander;
  
  // Update totaalUren after calculating
  totaalUren();
}

function berekenGemiddeldeUren() {
  const t = document.querySelectorAll(
    "#uren-tracking .uren-entries-container .item .tijd"
  );
  let sum = 0;
  let n = 0;

  function haalGetal(txt) {
    txt = txt.replace(",", ".").trim();
    let s = "";
    let gestart = false;
    for (let i = 0; i < txt.length; i++) {
      const ch = txt[i];
      if ((ch >= "0" && ch <= "9") || ch === ".") {
        s += ch;
        gestart = true;
      } else if (gestart) {
        break;
      }
    }
    return s ? parseFloat(s) : NaN;
  }

  t.forEach((el) => {
    const val = haalGetal(el.textContent);
    if (!isNaN(val)) {
      sum += val;
      n++;
    }
  });

  const avg = n ? sum / n : 0;
  const items = document.querySelectorAll(
    "#uren-tracking .uren-container .item"
  );
  for (const it of items) {
    const tittel = it.querySelector(".titel");
    if (tittel && tittel.textContent.trim() === "Gemiddeld per Dag") {
      const a = it.querySelector(".aantal");
      if (a) a.innerText = avg.toFixed(2);
      break;
    }
  }
}

function installeerZoekProjecten() {
  const input = document.getElementById("zoek-projecten");
  if (!input) return;

  function filterProjecten() {
    const q = (input.value || "").toLowerCase().trim();

    const projectElementen = document.querySelectorAll(
      "#projecten .item-container"
    );
    projectElementen.forEach((container) => {
      const text = (container.textContent || "").toLowerCase();
      container.style.display = q === "" || text.includes(q) ? "" : "none";
    });

    const voortgangElementen = document.querySelectorAll(
      "#voortgang .voortgang-container .item"
    );
    voortgangElementen.forEach((item) => {
      const text = (item.textContent || "").toLowerCase();
      item.style.display = q === "" || text.includes(q) ? "" : "none";
    });
  }

  input.addEventListener("input", filterProjecten);
}

function installeerZoekLogboek() {
  const koppelingen = [
    { section: "#logboek-clement" },
    { section: "#logboek-brands" },
  ];

  koppelingen.forEach(({ section }) => {
    const sectionEl = document.querySelector(section);
    if (!sectionEl) return;
    
    // Find the search input within this section
    const input = sectionEl.querySelector(".logboek-search input[type='search']");
    if (!input) return;

    const selectorContainer = section + " .logboek-container";

    function filterLogboek() {
      const q = (input.value || "").toLowerCase().trim();
      document.querySelectorAll(selectorContainer).forEach((container) => {
        const text = (container.textContent || "").toLowerCase();
        container.style.display = q === "" || text.includes(q) ? "" : "none";
      });
    }

    input.addEventListener("input", filterLogboek);
  });
}

function laatsteEntry() {
  // Find the most recent entry from both logboeken
  let laatsteDatum = null;
  let laatsteTekst = "";
  
  const alleEntries = document.querySelectorAll("#logboek-clement .logboek-container, #logboek-brands .logboek-container");
  
  alleEntries.forEach(container => {
    const datumEl = container.querySelector(".tijd-datum");
    if (!datumEl) return;
    
    const datumText = datumEl.textContent;
    // Extract date from text like "0.42 uren 11/3/2025"
    const dateMatch = datumText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (dateMatch) {
      const [maand, dag, jaar] = dateMatch[1].split('/').map(Number);
      const datum = new Date(jaar, maand - 1, dag);
      
      if (!laatsteDatum || datum > laatsteDatum) {
        laatsteDatum = datum;
        const titelEl = container.querySelector(".titel");
        if (titelEl) {
          laatsteTekst = titelEl.textContent.trim();
        }
      }
    }
  });
  
  const laatsteEntryEl = document.getElementById("laatste-entry");
  if (laatsteEntryEl && laatsteTekst) {
    const vandaag = new Date();
    vandaag.setHours(0, 0, 0, 0);
    if (laatsteDatum && laatsteDatum.getTime() === vandaag.getTime()) {
      laatsteEntryEl.innerText = "Laatste entry vandaag";
    } else if (laatsteDatum) {
      const dagenGeleden = Math.floor((vandaag - laatsteDatum) / (1000 * 60 * 60 * 24));
      if (dagenGeleden === 1) {
        laatsteEntryEl.innerText = "Laatste entry gisteren";
      } else if (dagenGeleden > 1) {
        laatsteEntryEl.innerText = `Laatste entry ${dagenGeleden} dagen geleden`;
      } else {
        laatsteEntryEl.innerText = "Laatste entry vandaag";
      }
    }
  }
}
