let urenAlexander = 12;
let urenClement = 18;

function laadPagina(){
    berekenUrenPerLid();
    totaalUren();
    telLogboekEntries();
    berekenGemiddeldeUren();
    installeerZoekProjecten();
    installeerZoekLogboek();
}

function totaalUren(){
    urenAlexander = parseFloat(document.getElementById('urenAlexander').textContent) || 0;
    urenClement = parseFloat(document.getElementById('urenClement').textContent) || 0;
    const totaal = urenAlexander + urenClement;

    const pctA = (urenAlexander / totaal) * 100;
    const pctC = (urenClement / totaal) * 100;

    document.getElementById('totaleUren-Dashboard').innerText = totaal + 'u';
    document.getElementById('totaleUren-Dashboard-Card').innerText = totaal + 'u';
    document.getElementById('Uren-Tracking-Alexander').innerText = urenAlexander + 'u';
    document.getElementById('Uren-Tracking-Clement').innerText = urenClement + 'u';

    document.getElementById('voortgang-clement').innerText = pctC.toFixed(1) + '%';
    document.getElementById('voortgang-alexander').innerText = pctA.toFixed(1) + '%';

    const te = document.getElementById('totaleUren-Uren-Tracking'); if(te) te.innerText = totaal + 'u';
}

function telLogboekEntries(){
    const totaal_entries_clement = document.querySelectorAll('#logboek-item-clement').length;
    const totaal_entries_alexander = document.querySelectorAll('#logboek-item-alexander').length;

    document.getElementById('totaal-Aantal-Entries').innerText = (totaal_entries_clement + totaal_entries_alexander);
}

function parseUren(txt){
    txt = (txt||'').replace(',', '.').trim();
    let num = '';
    let started = false;
    for (let i=0;i<txt.length;i++){
        const ch = txt[i];
        if ((ch>='0' && ch<='9') || ch==='.') { num += ch; started = true; }
        else if (started) break;
    }
    return num ? parseFloat(num) : NaN;
}

function berekenUrenPerLid(){
    function sumVoor(selector){
        const els = document.querySelectorAll(selector);
        let s = 0;
        els.forEach(info => {
            const item = info.closest('.item');
            if (!item) return;
            const tijdEl = item.querySelector('.tijd-datum') || item.querySelector('.tijd');
            if (!tijdEl) return;
            const v = parseUren(tijdEl.textContent);
            if (!isNaN(v)) s += v;
        });
        return s;
    }

    const sumC = sumVoor('#logboek-item-clement');
    const sumA = sumVoor('#logboek-item-alexander');
    urenClement = Math.round(sumC * 100) / 100;
    urenAlexander = Math.round(sumA * 100) / 100;
    const ec = document.getElementById('urenClement'); if(ec) ec.innerText = urenClement;
    const ea = document.getElementById('urenAlexander'); if(ea) ea.innerText = urenAlexander;
}

function berekenGemiddeldeUren(){
    const t = document.querySelectorAll('#uren-tracking .uren-entries-container .item .tijd');
    let sum = 0;
    let n = 0;

    function haalGetal(txt){
        txt = txt.replace(',', '.').trim();
        let s = '';
        let gestart = false;
        for (let i = 0; i < txt.length; i++){
            const ch = txt[i];
            if ((ch >= '0' && ch <= '9') || ch === '.'){
                s += ch;
                gestart = true;
            } else if (gestart) {
                break;
            }
        }
        return s ? parseFloat(s) : NaN;
    }

    t.forEach(el => {
        const val = haalGetal(el.textContent);
        if (!isNaN(val)){
            sum += val;
            n++;
        }
    });

    const avg = n ? (sum / n) : 0;
    const items = document.querySelectorAll('#uren-tracking .uren-container .item');
    for (const it of items){
        const tittel = it.querySelector('.titel');
        if (tittel && tittel.textContent.trim() === 'Gemiddeld per Dag'){
            const a = it.querySelector('.aantal');
            if (a) a.innerText = avg.toFixed(2);
            break;
        }
    }
}

function installeerZoekProjecten(){
    const input = document.getElementById('zoek-projecten');
    if (!input) return;

    function filterProjecten(){
        const q = (input.value || '').toLowerCase().trim();

        
        const projectElementen = document.querySelectorAll('#projecten .item-container');
        projectElementen.forEach(container => {
            const text = (container.textContent || '').toLowerCase();
            container.style.display = q === '' || text.includes(q) ? '' : 'none';
        });

        
        const voortgangElementen = document.querySelectorAll('#voortgang .voortgang-container .item');
        voortgangElementen.forEach(item => {
            const text = (item.textContent || '').toLowerCase();
            item.style.display = q === '' || text.includes(q) ? '' : 'none';
        });
    }

    input.addEventListener('input', filterProjecten);
}

function installeerZoekLogboek(){
    const koppelingen = [
        { id: 'zoek-logboek-clement', section: '#logboek-clement' },
        { id: 'zoek-logboek-alexander', section: '#logboek-brands' }
    ];

    koppelingen.forEach(({id, section}) => {
        const input = document.getElementById(id);
        if (!input) return;

        const selectorContainer = section + ' .logboek-container';

        function filterLogboek(){
            const q = (input.value || '').toLowerCase().trim();
            document.querySelectorAll(selectorContainer).forEach(container => {
                const text = (container.textContent || '').toLowerCase();
                container.style.display = q === '' || text.includes(q) ? '' : 'none';
            });
        }

        input.addEventListener('input', filterLogboek);
    });
}
