/**
 * COMPLIANCE-VISUAL-2026.JS
 * 
 * Wizualizacja zgodności na KARCIE DANIA i TYGODNIU
 * 
 * System pokazuje:
 * 1. Na każdym daniu: które wymogi spełnia
 * 2. Na całym tygodniu: postęp zbierania wymogów
 * 3. Auto-licznik: ile już zebrałeś, ile brakuje
 */

// ============================================================
// CZĘŚĆ 1: ANALIZA POJEDYNCZEGO DANIA
// ============================================================

/**
 * Analizuje danie i zwraca które wymogi spełnia
 * Zwraca obiekt z wszystkimi cechami dania
 */
function analizujDanieDlaCE2026(danie) {
    const teksty = tekstySkladnikow(danie);
    
    const analiza = {
        nazwa_dania: danie.nazwa,
        id_dania: danie.id,
        wszystkie_cechy: {},
        wymogi_spelnione: [],
        wymogi_brakujace: [],
        
        // Cechy dania
        cechy: {
            zawiera_mieso: pasujeDoKategorii2026(teksty, "mieso_swieze"),
            zawiera_ryba: pasujeDoKategorii2026(teksty, "ryba"),
            zawiera_straczki: pasujeDoKategorii2026(teksty, "straczki_legumes"),
            zawiera_warzywo: pasujeDoKategorii2026(teksty, "warzywo"),
            zawiera_owoc: pasujeDoKategorii2026(teksty, "owoc"),
            zawiera_nabial: pasujeDoKategorii2026(teksty, "nabial_mleko") || 
                           pasujeDoKategorii2026(teksty, "nabial_ser") || 
                           pasujeDoKategorii2026(teksty, "nabial_jogurt"),
            zawiera_wode: pasujeDoKategorii2026(teksty, "woda"),
            smazone: !!danie.smazone,
            wysoko_przetworzone: pasujeDoKategorii2026(teksty, "wysoko_przetworzone"),
            caloziarniste: pasujeDoKategorii2026(teksty, "caloziarniste"),
            bez_miesa: !pasujeDoKategorii2026(teksty, "mieso_swieze") && 
                       !pasujeDoKategorii2026(teksty, "ryba"),
            bez_miesa_i_odzwierzecych: !pasujeDoKategorii2026(teksty, "mieso_swieze") &&
                                       !pasujeDoKategorii2026(teksty, "mieso_przetworzone") &&
                                       !pasujeDoKategorii2026(teksty, "ryba")
        }
    };

    // Mapa wymogów do cech
    const wymogi_do_cech = {
        "mieso": ["zawiera_mieso"],
        "ryba": ["zawiera_ryba"],
        "warzywo_owoc": ["zawiera_warzywo", "zawiera_owoc"],
        "nabial": ["zawiera_nabial"],
        "woda": ["zawiera_wode"],
        "bez_miesa": ["bez_miesa"],
        "straczki": ["zawiera_straczki"],
        "smazone": ["smazone"],
        "unikac_upf": ["wysoko_przetworzone"]
    };

    // Sprawdzenie które wymogi są spełnione
    Object.entries(wymogi_do_cech).forEach(([wymog, cechy]) => {
        const spelnione = cechy.some(cecha => analiza.cechy[cecha]);
        if (spelnione) {
            analiza.wymogi_spelnione.push(wymog);
        } else {
            analiza.wymogi_brakujace.push(wymog);
        }
    });

    return analiza;
}

/**
 * Renderuje kartę z informacją o zgodności dania
 * Wyświetla ikony i symbole dla każdego wymogu
 */
function renderujKarteZgodnosciDania(danie) {
    const analiza = analizujDanieDlaCE2026(danie);
    
    const ikony = {
        "mieso": "🍖",
        "ryba": "🐟",
        "warzywo_owoc": "🥬",
        "nabial": "🥛",
        "woda": "💧",
        "bez_miesa": "🌱",
        "straczki": "🫘",
        "smazone": "🍳",
        "unikac_upf": "✓ Naturalne"
    };

    const etykiety = {
        "mieso": "Mięso",
        "ryba": "Ryba",
        "warzywo_owoc": "Warzywa/Owoce",
        "nabial": "Mleko/Nabiał",
        "woda": "Woda",
        "bez_miesa": "Opcja roślinne",
        "straczki": "Strączkowe",
        "smazone": "Smażone",
        "unikac_upf": "Naturalne"
    };

    const karta = `
    <div class="karta-zgodnosci" style="border-left: 4px solid #2196f3; padding: 10px; margin: 10px 0; background: #f0f8ff; border-radius: 4px;">
        <div style="font-weight: bold; margin-bottom: 8px;">${danie.nazwa}</div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
            ${analiza.wymogi_spelnione.map(wymog => `
                <span style="background: #4caf50; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                    ${ikony[wymog]} ${etykiety[wymog]}
                </span>
            `).join('')}
        </div>
        
        ${analiza.wymogi_brakujace.length > 0 ? `
            <div style="font-size: 12px; color: #999;">
                Brakuje: ${analiza.wymogi_brakujace.map(w => etykiety[w]).join(", ")}
            </div>
        ` : ''}
    </div>
    `;

    return karta;
}

// ============================================================
// CZĘŚĆ 2: LICZNIK WYMOGÓW NA TYDZIEŃ
// ============================================================

/**
 * Analiza całego tygodnia - która wymóg jest spełniony
 */
function licznikWymogowTygodnia(jadlospis_tygodnia) {
    const licznik = {
        mieso: 0,
        ryba: 0,
        warzywo_owoc: 0,
        nabial: 0,
        woda: 0,
        bez_miesa_dni: 0,
        straczki: 0,
        smazone: 0,
        dni_z_warzywem: 0,
        
        // Wymogi na tydzień
        wymogi: {
            mieso_limit_2: { liczba: 0, limit: 2, rodzaj: "max", spelnione: false },
            smazone_limit_2: { liczba: 0, limit: 2, rodzaj: "max", spelnione: false },
            obiad_roslinny_1: { liczba: 0, limit: 1, rodzaj: "min", spelnione: false },
            zupy_warzywne_2: { liczba: 0, limit: 2, rodzaj: "min", spelnione: false },
            ryba_1: { liczba: 0, limit: 1, rodzaj: "min", spelnione: false },
            nabial_3: { liczba: 0, limit: 3, rodzaj: "min", spelnione: false },
            warzywo_cada_dzien: { liczba: 0, limit: 5, rodzaj: "min", spelnione: false }
        }
    };

    // Przejdź przez każdy dzień
    Object.entries(jadlospis_tygodnia).forEach(([dzien, dane]) => {
        if (!dane || !dane.obiad) return;

        let dzien_ma_warzywo = false;

        dane.obiad.forEach(danie => {
            const analiza = analizujDanieDlaCE2026(danie);

            // Liczenie
            if (analiza.cechy.zawiera_mieso) licznik.wymogi.mieso_limit_2.liczba++;
            if (analiza.cechy.zawiera_ryba) licznik.wymogi.ryba_1.liczba++;
            if (analiza.cechy.zawiera_straczki && analiza.cechy.bez_miesa_i_odzwierzecych) {
                licznik.wymogi.obiad_roslinny_1.liczba++;
            }
            if (analiza.cechy.smazone) licznik.wymogi.smazone_limit_2.liczba++;
            if (analiza.cechy.zawiera_warzywo) dzien_ma_warzywo = true;
            if (analiza.cechy.zawiera_nabial) licznik.wymogi.nabial_3.liczba++;
        });

        if (dzien_ma_warzywo) licznik.wymogi.warzywo_cada_dzien.liczba++;
    });

    // Sprawdzenie czy wymogi są spełnione
    Object.entries(licznik.wymogi).forEach(([wymog, dane]) => {
        if (dane.rodzaj === "max") {
            dane.spelnione = dane.liczba <= dane.limit;
        } else if (dane.rodzaj === "min") {
            dane.spelnione = dane.liczba >= dane.limit;
        }
    });

    return licznik;
}

/**
 * Renderuje pasek postępu tygodnia
 */
function renderujPasekPostepu(licznik) {
    const wymogi_lista = Object.entries(licznik.wymogi);
    const spelnione = wymogi_lista.filter(([_, d]) => d.spelnione).length;
    const razem = wymogi_lista.length;
    const procent = Math.round((spelnione / razem) * 100);

    const html = `
    <div style="margin: 20px 0; background: #f5f5f5; padding: 15px; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0;">📊 Postęp Spełniania Wymogów Tygodnia</h3>
        
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Wymogi spełnione:</span>
                <strong>${spelnione}/${razem} (${procent}%)</strong>
            </div>
            <div style="width: 100%; height: 24px; background: #ddd; border-radius: 12px; overflow: hidden;">
                <div style="width: ${procent}%; height: 100%; background: ${procent === 100 ? '#4caf50' : procent >= 80 ? '#8bc34a' : procent >= 60 ? '#ffc107' : '#f44336'}; transition: width 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                    ${procent}%
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            ${wymogi_lista.map(([wymog, dane]) => `
                <div style="background: white; padding: 10px; border-radius: 4px; border-left: 4px solid ${dane.spelnione ? '#4caf50' : '#f44336'};">
                    <div style="font-size: 12px; color: #999; margin-bottom: 4px;">
                        ${wymog.replace(/_/g, ' ')}
                    </div>
                    <div style="font-weight: bold; font-size: 14px;">
                        ${dane.liczba}${dane.rodzaj === 'max' ? ' ≤' : ' ≥'} ${dane.limit}
                        <span style="color: ${dane.spelnione ? '#4caf50' : '#f44336'}; margin-left: 5px;">
                            ${dane.spelnione ? '✓' : '✗'}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div style="margin-top: 15px; padding: 10px; background: ${procent === 100 ? '#e8f5e9' : '#fff3e0'}; border-left: 4px solid ${procent === 100 ? '#4caf50' : '#ffc107'}; border-radius: 4px;">
            ${procent === 100 ? 
                '✅ <strong>ŚWIETNIE!</strong> Wszystkie wymogi tygodnia są spełnione!' :
                `⚠️ <strong>Brakuje ${razem - spelnione}</strong> wymogów. Dodaj jeszcze ${wymogi_lista.filter(([_, d]) => !d.spelnione).map(([w]) => w.replace(/_/g, ' ')).join(', ')}`
            }
        </div>
    </div>
    `;

    return html;
}

// ============================================================
// CZĘŚĆ 3: INTEGRACJA Z INTERFEJSEM
// ============================================================

/**
 * Inicjalizacja wizualizacji na stronie jadłospisu
 */
function inicjalizujWizualizacjeZgodnosci() {
    // Dodaj styl dla kart
    const style = `
    <style>
        .karta-zgodnosci {
            animation: slideIn 0.3s ease-in-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .pasek-skladnika {
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px;
            margin: 4px 0;
            background: #f9f9f9;
            border-radius: 4px;
        }

        .pasek-skladnika.spelniony {
            background: #e8f5e9;
            border-left: 3px solid #4caf50;
        }

        .pasek-skladnika.niespelniony {
            background: #ffebee;
            border-left: 3px solid #f44336;
        }
    </style>
    `;

    // Wstaw do dokumentu
    if (!document.querySelector('style[data-compliance]')) {
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-compliance', 'true');
        styleEl.textContent = style.replace(/<\/?style>/g, '');
        document.head.appendChild(styleEl);
    }
}

/**
 * Aktualizuj wyświetlanie wymogów gdy użytkownik zmienia dania
 */
function aktualizujWyswietlanieZgodnosci() {
    const config = wczytajConfigWspolny();
    if (!config) return;

    const poniedzialek = poniedzialekTygodnia(new Date());
    const dni = dniRobocze(poniedzialek);
    
    const jadlospis_tygodnia = {};
    dni.forEach(d => {
        const dzien = wczytajDzienZKlucza(d);
        if (dzien) jadlospis_tygodnia[d] = dzien;
    });

    // Oblicz licznik
    const licznik = licznikWymogowTygodnia(jadlospis_tygodnia);
    
    // Renderuj pasek postępu
    const pasekElement = document.getElementById('pasek-postepu-wymogów');
    if (pasekElement) {
        pasekElement.innerHTML = renderujPasekPostepu(licznik);
    }
}

/**
 * Event listener - gdy użytkownik dodaje/usuwa danie
 */
function sluchajZmianDan() {
    document.addEventListener('danie-dodane', aktualizujWyswietlanieZgodnosci);
    document.addEventListener('danie-usuniete', aktualizujWyswietlanieZgodnosci);
    document.addEventListener('danie-zmienione', aktualizujWyswietlanieZgodnosci);
}

// Inicjalizacja przy załadowaniu
document.addEventListener('DOMContentLoaded', function() {
    inicjalizujWizualizacjeZgodnosci();
    aktualizujWyswietlanieZgodnosci();
    sluchajZmianDan();
});

// Eksport dla zintegr owania
window.renderujKarteZgodnosciDania = renderujKarteZgodnosciDania;
window.licznikWymogowTygodnia = licznikWymogowTygodnia;
window.aktualizujWyswietlanieZgodnosci = aktualizujWyswietlanieZgodnosci;
window.renderujPasekPostepu = renderujPasekPostepu;
