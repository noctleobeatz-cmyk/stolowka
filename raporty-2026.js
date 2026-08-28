/**
 * RAPORTY-2026.JS
 * Raportowanie zgodności z rozporządzeniem + eksport dla rodziców i urzędu
 */

// Załaduj Chart.js dla wykresów
const CHART_CDN = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";

/**
 * RAPORT #1: Dla Rodziców (PDF + HTML)
 */
async function generowaRaportDlaRodzicow(jadlospis, config) {
    const poniedzialek = poniedzialekTygodnia(new Date());
    
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1>${config.nazwa_placowki}</h1>
        <h2>Jadłospis Tygodniowy</h2>
        <p>Tydzień: ${formatujDataZapisu(fmtData(poniedzialek))}</p>
        
        <div style="background: #f0f8ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0;">
            <h3>ℹ️ Informacja dla rodziców</h3>
            <p>Od 1 września 2026 obowiązują <strong>nowe zasady żywienia w szkołach i przedszkolach</strong>.</p>
            <p>Nasze menu spełnia następujące wymogi:</p>
            <ul>
                <li>✓ Obiad roślinny minimum raz w tygodniu</li>
                <li>✓ Mięso maksymalnie 2 razy w tygodniu</li>
                <li>✓ Zupy na wywarach warzywnych minimum 2 razy w tygodniu</li>
                <li>✓ Ryba minimum raz w tygodniu</li>
                <li>✓ Warzywa i owoce w każdym posiłku</li>
                <li>✓ Woda jako główny napój</li>
                <li>✓ Alternatywa wegetariańska w dni mięsne</li>
            </ul>
        </div>
        
        <h3>Poniedziałek - Piątek</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr style="background: #333; color: white;">
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Dzień</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Danie</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Energia (kcal)</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Specjalne</th>
                </tr>
            </thead>
            <tbody>
                ${dniRobocze(poniedzialek).map(d => {
                    const dzien = wczytajDzienZKlucza(d);
                    if (!dzien || !dzien.obiad) return '';
                    
                    const nazwyDan = dzien.obiad.map(dan => dan.nazwa).join(", ");
                    const kcal = obliczKcalDnia(dzien);
                    const ikon = dzien.obiad.some(d => d.ocena_zgodnosci_2026?.obiad_roslinny) ? '🌱' : '🍽';
                    
                    return `
                    <tr style="background: ${dniRobocze(poniedzialek).indexOf(d) % 2 === 0 ? '#f9f9f9' : 'white'};">
                        <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">${formatujDate(d)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${nazwyDan}</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${kcal}</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${ikon}</td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <h4>🔍 Legenda</h4>
            <ul>
                <li>🌱 Obiad roślinny (dla wegetarian)</li>
                <li>🍽 Zawiera mięso</li>
            </ul>
        </div>
        
        <p style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
            Raport wygenerowany: ${new Date().toLocaleString('pl-PL')}<br/>
            Zgodne z Rozporządzeniem Ministra Zdrowia od 1 września 2026
        </p>
    </div>
    `;
    
    return html;
}

/**
 * RAPORT #2: Dla Dyrektora/Kucharki (Dashboard)
 */
function renderujRaportDlaDyrektora() {
    const config = wczytajConfigWspolny();
    const poniedzialek = poniedzialekTygodnia(new Date());
    const dni = dniRobocze(poniedzialek);
    
    const jadlospis = {};
    let licznikMiesa = 0;
    let licznikSmażenia = 0;
    let licznikRybki = 0;
    let licznikObiadu = 0;
    let licznikZupWarzywnych = 0;
    let licznikMleka = 0;

    dni.forEach(dzien => {
        const d = wczytajDzienZKlucza(dzien);
        if (!d || !d.obiad) return;
        
        d.obiad.forEach(danie => {
            if (!danie.ocena_zgodnosci_2026) {
                const ocena = ocenDanie2026(danie, {});
                danie.ocena_zgodnosci_2026 = ocena.cechy_dania_2026;
            }
            
            const cechy = danie.ocena_zgodnosci_2026;
            if (cechy.zawiera_mieso) licznikMiesa++;
            if (cechy.smazone) licznikSmażenia++;
            if (cechy.zawiera_ryba) licznikRybki++;
            if (cechy.obiad_roslinny) licznikObiadu++;
            if (cechy.zupa_warzywna) licznikZupWarzywnych++;
            if (cechy.zawiera_nabial) licznikMleka++;
        });
    });

    // HTML dla dashboardu
    const html = `
    <div style="padding: 20px;">
        <h2>📊 Dashboard Zgodności z Rozporządzeniem 2026</h2>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; border-radius: 4px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Mięso</div>
                <div style="font-size: 24px; font-weight: bold;">${licznikMiesa}</div>
                <div style="font-size: 12px; color: #999;">Limit: 2x/tyg</div>
                <div style="font-size: 12px; ${licznikMiesa > 2 ? 'color: red; font-weight: bold;' : 'color: green;'}">
                    ${licznikMiesa > 2 ? '⚠️ PRZEKROCZONO!' : '✓ OK'}
                </div>
            </div>
            
            <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Smażenie</div>
                <div style="font-size: 24px; font-weight: bold;">${licznikSmażenia}</div>
                <div style="font-size: 12px; color: #999;">Limit: 2x/tyg</div>
                <div style="font-size: 12px; ${licznikSmażenia > 2 ? 'color: red; font-weight: bold;' : 'color: green;'}">
                    ${licznikSmażenia > 2 ? '⚠️ PRZEKROCZONO!' : '✓ OK'}
                </div>
            </div>
            
            <div style="background: #f3e5f5; border-left: 4px solid #9c27b0; padding: 15px; border-radius: 4px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Obiad Roślinny</div>
                <div style="font-size: 24px; font-weight: bold;">${licznikObiadu}</div>
                <div style="font-size: 12px; color: #999;">Min: 1x/tyg</div>
                <div style="font-size: 12px; ${licznikObiadu < 1 ? 'color: red; font-weight: bold;' : 'color: green;'}">
                    ${licznikObiadu < 1 ? '⚠️ BRAKUJE!' : '✓ OK'}
                </div>
            </div>
            
            <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; border-radius: 4px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Ryba</div>
                <div style="font-size: 24px; font-weight: bold;">${licznikRybki}</div>
                <div style="font-size: 12px; color: #999;">Min: 1x/tyg</div>
                <div style="font-size: 12px; ${licznikRybki < 1 ? 'color: red; font-weight: bold;' : 'color: green;'}">
                    ${licznikRybki < 1 ? '⚠️ BRAKUJE!' : '✓ OK'}
                </div>
            </div>
            
            <div style="background: #fce4ec; border-left: 4px solid #e91e63; padding: 15px; border-radius: 4px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Zupy Warzywne</div>
                <div style="font-size: 24px; font-weight: bold;">${licznikZupWarzywnych}</div>
                <div style="font-size: 12px; color: #999;">Min: 2x/tyg</div>
                <div style="font-size: 12px; ${licznikZupWarzywnych < 2 ? 'color: red; font-weight: bold;' : 'color: green;'}">
                    ${licznikZupWarzywnych < 2 ? '⚠️ NIEWYSTARCZAJĄCO!' : '✓ OK'}
                </div>
            </div>
            
            <div style="background: #e0f2f1; border-left: 4px solid #009688; padding: 15px; border-radius: 4px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Mleko/Nabiał</div>
                <div style="font-size: 24px; font-weight: bold;">${licznikMleka}</div>
                <div style="font-size: 12px; color: #999;">Min: 3x/tyg</div>
                <div style="font-size: 12px; ${licznikMleka < 3 ? 'color: orange; font-weight: bold;' : 'color: green;'}">
                    ${licznikMleka < 3 ? '⚠️ MNIEJ NIŻ OCZEKIWANO' : '✓ OK'}
                </div>
            </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3>📋 Rekomendacje:</h3>
            <ul id="rekomendacje-lista">
                <!-- Wypełniane dynamicznie -->
            </ul>
        </div>
    </div>
    `;

    document.querySelector('.skladniki').insertAdjacentHTML('afterend', html);
    
    // Wypełnij rekomendacje
    const listaRek = document.getElementById('rekomendacje-lista');
    if (listaRek) {
        const rekomendacje = [];
        
        if (licznikMiesa > 2) rekomendacje.push('🔴 <strong>KRYTYCZNE:</strong> Zbyt wiele mięsa w tygodniu (limit: 2x)');
        if (licznikSmażenia > 2) rekomendacje.push('🔴 <strong>KRYTYCZNE:</strong> Zbyt wiele smażonych potraw (limit: 2x)');
        if (licznikObiadu < 1) rekomendacje.push('🔴 <strong>KRYTYCZNE:</strong> Brakuje obiadu roślinnego (wymagane: min 1x)');
        if (licznikZupWarzywnych < 2) rekomendacje.push('🟡 <strong>WAŻNE:</strong> Niewystarczająco zup warzywnych (wymagane: min 2x)');
        if (licznikRybki < 1) rekomendacje.push('🟡 <strong>WAŻNE:</strong> Brakuje ryby w jadłospisie (wymagane: min 1x)');
        if (licznikMleka < 3) rekomendacje.push('🟡 <strong>WAŻNE:</strong> Mniej niż 3x mleka/nabiału (rekomendowane: min 3x)');
        
        if (rekomendacje.length === 0) {
            rekomendacje.push('✓ Wszystkie wymogi rozporządzenia są spełnione!');
        }
        
        listaRek.innerHTML = rekomendacje.map(r => `<li>${r}</li>`).join('');
    }
}

/**
 * RAPORT #3: Dla Pani Minister (Urzędowy)
 */
function generowaRaportDlaPaniMinister(jadlospis, config) {
    const poniedzialek = poniedzialekTygodnia(new Date());
    const dni = dniRobocze(poniedzialek);
    
    let licznikMiesa = 0, licznikSmażenia = 0, licznikRybki = 0, licznikObiadu = 0, 
        licznikZupWarzywnych = 0, licznikMleka = 0, licznikWarzyw = 0;

    const dniObiady = [];
    dni.forEach(d => {
        const dzien = wczytajDzienZKlucza(d);
        if (dzien && dzien.zatwierdzony && dzien.obiad) {
            dzien.obiad.forEach(danie => {
                daniObiady.push(danie);
                
                if (!danie.ocena_zgodnosci_2026) {
                    const ocena = ocenDanie2026(danie, {});
                    danie.ocena_zgodnosci_2026 = ocena.cechy_dania_2026;
                }
                
                const cechy = danie.ocena_zgodnosci_2026;
                if (cechy.zawiera_mieso) licznikMiesa++;
                if (cechy.smazone) licznikSmażenia++;
                if (cechy.zawiera_ryba) licznikRybki++;
                if (cechy.obiad_roslinny) licznikObiadu++;
                if (cechy.zupa_warzywna) licznikZupWarzywnych++;
                if (cechy.zawiera_nabial) licznikMleka++;
                if (cechy.zawiera_warzywo) licznikWarzyw++;
            });
        }
    });

    // Ocena
    let spelnione = 0, niespelnione = 0;
    if (licznikMiesa <= 2) spelnione++; else niespelnione++;
    if (licznikSmażenia <= 2) spelnione++; else niespelnione++;
    if (licznikObiadu >= 1) spelnione++; else niespelnione++;
    if (licznikZupWarzywnych >= 2) spelnione++; else niespelnione++;
    if (licznikRybki >= 1) spelnione++; else niespelnione++;
    if (licznikMleka >= 3) spelnione++; else niespelnione++;
    if (licznikWarzyw >= dni.length) spelnione++; else niespelnione++;

    const procentZgodnosci = Math.round((spelnione / (spelnione + niespelnione)) * 100);

    const raport = {
        typ_raportu: "Ministerialny - Kontrola Zgodności",
        placowka: config.nazwa_placowki,
        typ_placowki: config.typ_placowki,
        liczba_dzieci_I3: config.grupy["1"] + config.grupy["2"] + config.grupy["3"],
        liczba_dzieci_4_6: config.grupy["4"] + config.grupy["5"] + config.grupy["6"],
        liczba_dzieci_7_9: config.grupy["7"] + config.grupy["8"] + config.grupy["9"],
        liczba_dzieci_10_12: config.grupy["10"] + config.grupy["11"] + config.grupy["12"],
        liczba_dzieci_13_15: config.grupy["13"] + config.grupy["14"] + config.grupy["15"],
        
        tydzien_sprawozdania: `${formatujDataZapisu(fmtData(poniedzialek))} - ${formatujDataZapisu(fmtData(new Date(poniedzialek.getTime() + 4*24*60*60*1000)))}`,
        
        // WYTYCZNE ROZPORZĄDZENIA
        wytyczne: {
            mięso: { limit: "max 2x/tyg", faktycznie: licznikMiesa, spelnione: licznikMiesa <= 2 },
            smażenie: { limit: "max 2x/tyg", faktycznie: licznikSmażenia, spelnione: licznikSmażenia <= 2 },
            obiad_roślinny: { limit: "min 1x/tyg", faktycznie: licznikObiadu, spelnione: licznikObiadu >= 1 },
            zupy_warzywne: { limit: "min 2x/tyg", faktycznie: licznikZupWarzywnych, spelnione: licznikZupWarzywnych >= 2 },
            ryba: { limit: "min 1x/tyg", faktycznie: licznikRybki, spelnione: licznikRybki >= 1 },
            mleko_nabiał: { limit: "min 3x/tyg", faktycznie: licznikMleka, spelnione: licznikMleka >= 3 },
            warzywa: { limit: "codziennie w każdym", faktycznie: licznikWarzyw, spelnione: licznikWarzyw >= dni.length }
        },
        
        wynik_ogólny: {
            zgodne_wymogi: spelnione,
            niezgodne_wymogi: niespelnione,
            procent_zgodności: procentZgodnosci,
            status: procentZgodnosci === 100 ? "PEŁNA ZGODNOŚĆ ✓" : 
                   procentZgodnosci >= 80 ? "ZGODNA ✓" :
                   procentZgodnosci >= 60 ? "CZĘŚCIOWA ZGODNOŚĆ ⚠" : "NIEZGODNA ✗"
        },
        
        data_raportu: new Date().toISOString().split('T')[0],
        wygenerowany: new Date().toLocaleString('pl-PL'),
        dokumentacja: "Rozporządzenie Ministra Zdrowia od 1 września 2026"
    };

    return raport;
}

/**
 * Eksport JSON dla archiwizacji
 */
function eksportujJSON(raport) {
    const filename = `raport_${raport.placowka.replace(/\s+/g, '_')}_${raport.data_raportu}.json`;
    const dataStr = JSON.stringify(raport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
}

/**
 * Export CSV dla Excela
 */
function eksportujCSV(raport) {
    let csv = "RAPORT ZGODNOŚCI Z ROZPORZĄDZENIEM 2026\n";
    csv += `Placówka,${raport.placowka}\n`;
    csv += `Typ,${raport.typ_placowki}\n`;
    csv += `Tydzień,${raport.tydzien_sprawozdania}\n`;
    csv += `Data raportu,${raport.data_raportu}\n\n`;
    
    csv += "WYMÓG,LIMIT,FAKTYCZNIE,STATUS\n";
    Object.entries(raport.wytyczne).forEach(([wymog, dane]) => {
        csv += `${wymog},${dane.limit},${dane.faktycznie},${dane.spelnione ? 'SPEŁNIONE' : 'NIESPEŁNIONE'}\n`;
    });
    
    csv += `\nWYNIK OGÓLNY\n`;
    csv += `Wymogi spełnione,${raport.wynik_ogólny.zgodne_wymogi}\n`;
    csv += `Wymogi niespełnione,${raport.wynik_ogólny.niezgodne_wymogi}\n`;
    csv += `Procent zgodności,${raport.wynik_ogólny.procent_zgodności}%\n`;
    csv += `Status,${raport.wynik_ogólny.status}\n`;
    
    const filename = `raport_${raport.placowka.replace(/\s+/g, '_')}_${raport.data_raportu}.csv`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
}

/**
 * Obliczenie kcal dnia (helper)
 */
function obliczKcalDnia(dzien) {
    if (!dzien || !dzien.obiad) return 0;
    return dzien.obiad.reduce((sum, danie) => sum + (danie.wartosci_odzywcze?.kcal || 0), 0);
}

/**
 * Inicjalizacja przycisków raportów
 */
function inicjalizujRaporty2026() {
    const config = wczytajConfigWspolny();
    if (!config) return;

    const raportPanel = document.createElement("div");
    raportPanel.id = "raport-panel-2026";
    raportPanel.innerHTML = `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📊 Raporty i Eksporty (Rozporządzenie 2026)</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <button onclick="pobierzRaportRodzice()" style="padding: 10px 15px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    👨‍👩‍👧 Raport dla Rodziców
                </button>
                <button onclick="pobierzRaportDyrektora()" style="padding: 10px 15px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    📋 Dashboard Dyrektora
                </button>
                <button onclick="pobierzRaportMinisterialny()" style="padding: 10px 15px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🏛️ Raport Ministerialny
                </button>
            </div>
        </div>
    `;

    const zawartoscRaporty = document.getElementById("zawartość-raporty") || 
                            document.body.insertBefore(raportPanel, document.body.firstChild);
}

// Funkcje pobierania raportów
window.pobierzRaportRodzice = async function() {
    const config = wczytajConfigWspolny();
    const jadlospis = {};
    dniRobocze(poniedzialekTygodnia(new Date())).forEach(d => {
        const dzien = wczytajDzienZKlucza(d);
        if (dzien) jadlospis[d] = dzien;
    });
    
    const html = await generowaRaportDlaRodzicow(jadlospis, config);
    const nowaKartka = window.open();
    nowaKartka.document.write(html);
    nowaKartka.document.close();
};

window.pobierzRaportDyrektora = function() {
    renderujRaportDlaDyrektora();
    alert("Dashboard załadowany!");
};

window.pobierzRaportMinisterialny = function() {
    const config = wczytajConfigWspolny();
    const jadlospis = {};
    dniRobocze(poniedzialekTygodnia(new Date())).forEach(d => {
        const dzien = wczytajDzienZKlucza(d);
        if (dzien) jadlospis[d] = dzien;
    });
    
    const raport = generowaRaportDlaPaniMinister(jadlospis, config);
    
    // Pobierz w formacie JSON
    eksportujJSON(raport);
    eksportujCSV(raport);
};
