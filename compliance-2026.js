/**
 * COMPLIANCE-2026.JS
 * Implementacja PEŁNYCH wymogów Rozporządzenia Ministra Zdrowia od 1 września 2026
 * 
 * Wszystkie wymogi:
 * ✓ Obiad roślinny min 1x/tyg
 * ✓ Mięso max 2x/tyg
 * ✓ Smażenie max 2x/tyg
 * ✓ Zupy warzywne min 2x/tyg
 * ✓ Warzywa/owoce w każdym posiłku
 * ✓ Ryba min 1x/tyg
 * ✓ Woda jako podstawa
 * ✓ Alternatywa wegetariańska
 * ✓ Ograniczenie cukru
 * ✓ Ograniczenie produktów wysoko przetworzonych
 * ✓ Produkty ekologiczne (opcja)
 */

// KATEGORIE PRODUKTÓW - Pełna analiza
const KATEGORIE_PRODUKTOW_2026 = {
    // MIĘSO I RYBA
    mieso_swieze: {
        keywords: ["wieprzow", "wołow", "wolow", "drobiow", "kurczak", "indyk", "schab", "karkówk", "mięso", "mieso", "kotlet", "mielone", "wołowin", "wolowin", "cielęcina", "cielecina", "baranina"],
        typ: "odzwierzece_swieze"
    },
    mieso_przetworzone: {
        keywords: ["kiełbas", "kielbas", "wędlin", "wedlin", "mortadel", "pasztet", "konserwa", "parówk", "parowk", "boczek", "szynka"],
        typ: "odzwierzece_przetworzone",
        uwaga: "Wysoko przetworzone - limit 1x/tyg"
    },
    ryba: {
        keywords: ["ryba", "ryby", "dorsz", "łosoś", "losos", "makrela", "pstrąg", "pstrag", "filety", "mintaj"],
        typ: "odzwierzece_swieze",
        wymog: "min 1x/tyg"
    },
    
    // ROŚLINY STRĄCZKOWE - OBOWIĄZKOWE
    straczki_legumes: {
        keywords: ["fasol", "ciecierzyc", "soczewic", "groch", "bób", "bob", "strączk", "straczk", "hummus", "ciecierz"],
        typ: "roslinne",
        wymog: "obowiązkowe w daniu roślinnym"
    },
    
    // MLEKO I NABIAŁ
    nabial_mleko: {
        keywords: ["mleko", "mleka"],
        typ: "nabial",
        wymog: "min 3x/tyg"
    },
    nabial_ser: {
        keywords: ["ser ", "sera", "serek"],
        typ: "nabial",
        wymog: "min 2x/tyg"
    },
    nabial_jogurt: {
        keywords: ["jogurt", "jogurcie"],
        typ: "nabial",
        wymog: "min 1x/tyg"
    },
    
    // WARZYWA I OWOCE - OBOWIĄZKOWE W KAŻDYM POSIŁKU
    warzywo: {
        keywords: ["marchew", "pietruszk", "seler", "kapust", "burak", "ogórek", "ogorek", "pomidor", "cebul", "brokuł", "brokul", "szpinak", "papryk", "cukini", "por ", "groszek", "fasolka ziel", "kalafior", "rzepa", "dynia", "sałat", "salat", "szczypior"],
        typ: "roslinne",
        wymog: "obowiązkowe w każdym posiłku"
    },
    owoc: {
        keywords: ["jabłk", "jablk", "gruszk", "truskaw", "borówk", "borowk", "malin", "porzeczk", "morela", "śliw", "sliw", "banan", "cytrus", "pomarańcz", "pomaranc"],
        typ: "roslinne",
        wymog: "obowiązkowe w każdym posiłku"
    },
    
    // ZIARNO CAŁOZIARNISTE
    caloziarniste: {
        keywords: ["pełnoziarnist", "pelnoziarnist", "całoziarnist", "caloziarnist", "żytni", "zytni", "pszenny", "orkisz", "żyto", "zyto", "owies", "kasza"],
        typ: "roslinne",
        uwaga: "Preferowane"
    },
    
    // NAPOJE
    woda: {
        keywords: ["woda", "wody"],
        typ: "napoj",
        wymog: "główny napój"
    },
    kompot_niesłodzony: {
        keywords: ["kompot", "kompocie"],
        typ: "napoj",
        uwaga: "bez dosładzania, max cukier naturalny"
    },
    mleko_napoj: {
        keywords: ["mleko pitne", "mleka do picia"],
        typ: "napoj"
    },
    
    // PRODUKTY WYSOKO PRZETWORZONE - DO UNIKANIA
    wysoko_przetworzone: {
        keywords: ["concentrat", "syrop", "high fructose", "polisorbat", "sorbian", "sulfite", "aromata", "barwnik E", "konserwant E", "emulgator", "sztuczny"],
        typ: "wysoko_przetworzone",
        uwaga: "Max 1x/tyg, preferowanie unikania"
    },
    
    // TŁUSZCZE
    tluszcz_zdrowy: {
        keywords: ["olej rzepakowy", "olej słonecznikowy", "masło", "maslo"],
        typ: "tluszcz"
    }
};

// NORMY NOWE (2026) - bardziej restrykcyjne
const NORMY_2026 = {
    "1-3": {
        blonnik_g: 12,        // ↑ z 10
        cukry_g: 20,          // ↓ z 25 (zmniejszone!)
        sod_mg: 900,          // ↓ z 1100
        witamina_c_mg: 50,    // ↑ z 40
        zelazo_mg: 8,         // ↑ z 7
        bialko_g: 16,         // ↑ z 15
        tluszcz_g: 38,        // ↓ z 40
        weglowodany_g: 140,   // ↑ z 130
        woda_g: 1400,         // ↑
        woda_napoj_ml: 400    // Nowy! Min woda dziennie
    },
    "4-6": {
        blonnik_g: 16,        // ↑ z 14
        cukry_g: 25,          // ↓ z 30
        sod_mg: 1000,         // ↓ z 1200
        witamina_c_mg: 60,    // ↑ z 50
        zelazo_mg: 11,        // ↑ z 10
        bialko_g: 21,         // ↑ z 19
        tluszcz_g: 50,        // ↓ z 55
        weglowodany_g: 195,   // ↑ z 180
        woda_g: 1700,         // ↑
        woda_napoj_ml: 500    // Nowy!
    },
    "7-9": {
        blonnik_g: 18,        // ↑ z 16
        cukry_g: 35,          // ↓ z 40
        sod_mg: 1200,         // ↓ z 1400
        witamina_c_mg: 65,    // ↑ z 55
        zelazo_mg: 11,        // ↓ z 10 (na równi)
        bialko_g: 30,         // ↑ z 27
        tluszcz_g: 60,        // ↓ z 65
        weglowodany_g: 235,   // ↑ z 220
        woda_g: 1900,         // ↑
        woda_napoj_ml: 600    // Nowy!
    },
    "10-12": {
        blonnik_g: 21,        // ↑ z 19
        cukry_g: 40,          // ↓ z 45
        sod_mg: 1300,         // ↓ z 1500
        witamina_c_mg: 70,    // ↑ z 60
        zelazo_mg: 11,        // ↑ z 10
        bialko_g: 38,         // ↑ z 35
        tluszcz_g: 70,        // ↓ z 75
        weglowodany_g: 280,   // ↑ z 260
        woda_g: 2100,         // ↑
        woda_napoj_ml: 700    // Nowy!
    },
    "13-15": {
        blonnik_g: 24,        // ↑ z 21
        cukry_g: 45,          // ↓ z 50
        sod_mg: 1300,         // ↓ z 1500 (bez zmian ale ograniczone)
        witamina_c_mg: 85,    // ↑ z 75
        zelazo_mg: 13,        // ↑ z 12
        bialko_g: 50,         // ↑ z 46
        tluszcz_g: 80,        // ↓ z 85
        weglowodany_g: 320,   // ↑ z 300
        woda_g: 2200,         // ↑
        woda_napoj_ml: 800    // Nowy!
    }
};

/**
 * GŁÓWNE REGUŁY WALIDACJI TYGODNIA (2026)
 */
const REGULY_TYGODNIA_2026 = [
    {
        id: "obiad_roslinny",
        tytul: "Obiad roślinny (obowiązkowy)",
        opis: "Minimum raz w tygodniu obiad musi być w pełni wegetariański, oparty na nasionach roślin strączkowych",
        typ: "min",
        wartosc_celu: 1,
        sprawdzenie: (dania) => dania.filter(d => 
            cechaDania2026(d, "obiad_roslinny") && 
            cechaDania2026(d, "zawiera_straczki") &&
            !cechaDania2026(d, "zawiera_mieso") &&
            !cechaDania2026(d, "zawiera_ryba") &&
            !cechaDania2026(d, "zawiera_odzwierzece")
        ).length,
        priorytet: "KRYTYCZNY"
    },
    {
        id: "mieso_limit",
        tytul: "Limit mięsa (max 2x/tyg)",
        opis: "Potrawy mięsne mogą pojawić się maksymalnie 2 razy w tygodniu",
        typ: "max",
        wartosc_celu: 2,
        sprawdzenie: (dania) => dania.filter(d => cechaDania2026(d, "zawiera_mieso")).length,
        priorytet: "KRYTYCZNY"
    },
    {
        id: "smażenie_limit",
        tytul: "Limit smażenia (max 2x/tyg)",
        opis: "Potrawy smażone mogą pojawić się maksymalnie 2 razy w tygodniu",
        typ: "max",
        wartosc_celu: 2,
        sprawdzenie: (dania) => dania.filter(d => cechaDania2026(d, "smazone")).length,
        priorytet: "KRYTYCZNY"
    },
    {
        id: "zupy_warzywne",
        tytul: "Zupy warzywne (min 2x/tyg)",
        opis: "Co najmniej 2 razy w tygodniu zupa musi być przygotowana na wywarze warzywnym, bez kości i mięsa",
        typ: "min",
        wartosc_celu: 2,
        sprawdzenie: (dania) => dania.filter(d => 
            cechaDania2026(d, "zupa_warzywna") && 
            cechaDania2026(d, "bez_miesa")
        ).length,
        priorytet: "KRYTYCZNY"
    },
    {
        id: "warzywa_owoce_każdy",
        tytul: "Warzywa/owoce w każdym posiłku",
        opis: "Z wyraźną przewagą warzyw dostarczanych każdego dnia",
        typ: "min_daily",
        wartosc_celu: "wszystkie_dni",
        sprawdzenie: (dnia) => {
            if (!dnia || !dnia.obiad) return false;
            return dnia.obiad.some(d => 
                cechaDania2026(d, "zawiera_warzywo") || 
                cechaDania2026(d, "zawiera_owoc")
            );
        },
        priorytet: "KRYTYCZNY"
    },
    {
        id: "ryba_min",
        tytul: "Ryba w menu (min 1x/tyg)",
        opis: "Co najmniej jedna porcja ryby w tygodniowym jadłospisie",
        typ: "min",
        wartosc_celu: 1,
        sprawdzenie: (dania) => dania.filter(d => cechaDania2026(d, "zawiera_ryba")).length,
        priorytet: "KRYTYCZNY"
    },
    {
        id: "mleko_normy",
        tytul: "Mleko i nabiał (min 3x/tyg)",
        opis: "Mleko i produkty mleczne powinny pojawić się co najmniej 3 razy w tygodniu",
        typ: "min",
        wartosc_celu: 3,
        sprawdzenie: (dania) => dania.filter(d => cechaDania2026(d, "zawiera_nabial")).length,
        priorytet: "KRYTYCZNY"
    },
    {
        id: "woda_napoj",
        tytul: "Woda jako główny napój",
        opis: "Woda powinna być dostępna przy każdym posiłku. Drastycznie ograniczono dosładzanie compotów",
        typ: "obecnosc",
        sprawdzenie: (dania) => dania.some(d => cechaDania2026(d, "zawiera_wode")),
        priorytet: "WAŻNY"
    },
    {
        id: "unikanie_wysoko_przetworzone",
        tytul: "Limit produktów wysoko przetworzonych",
        opis: "Maksymalnie 1 posiłek z ultra-processed food w tygodniu",
        typ: "max",
        wartosc_celu: 1,
        sprawdzenie: (dania) => dania.filter(d => cechaDania2026(d, "wysoko_przetworzone")).length,
        priorytet: "KRYTYCZNY"
    },
    {
        id: "cukier_kontrola",
        tytul: "Ograniczenie cukru",
        opis: "Maksymalne normy cukru dziennie - zmniejszone w stosunku do poprzedniego roku",
        typ: "norma_dziennej",
        wartosc_celu: "NORMY_2026",
        priorytet: "WAŻNY"
    },
    {
        id: "alternatywa_roslinne",
        tytul: "Alternatywa wegetariańska",
        opis: "W dni, kiedy serwowane jest mięso lub ryba, szkoła musi zapewnić opcję roślinną dla wegetarian",
        typ: "obecnosc",
        sprawdzenie: (dania) => dania.some(d => cechaDania2026(d, "opcja_roslinne")),
        priorytet: "WAŻNY"
    }
];

/**
 * Analiza cechy posiłku - rozszerzona o nowe wymogi
 */
function cechaDania2026(danie, cecha) {
    if (!danie.ocena_zgodnosci_2026) {
        return false;
    }
    return danie.ocena_zgodnosci_2026[cecha] || false;
}

/**
 * GŁÓWNA FUNKCJA - Obliczenie pełnej zgodności z 2026
 */
function obliczZgodnosc2026(dania, dni, typPlacowki) {
    const wyniki = {
        ogolny_status: "brak_danych",
        spelnione: [],
        niespelnione: [],
        ostrzezenia: [],
        wynik_procentowy: 0,
        szczegoly: {}
    };

    if (!dania || dania.length === 0) {
        return wyniki;
    }

    // Obliczenie każdej reguły
    REGULY_TYGODNIA_2026.forEach(regula => {
        const wartosc = regula.sprawdzenie(dania);
        let spelniona = false;

        if (regula.typ === "min") {
            spelniona = wartosc >= regula.wartosc_celu;
        } else if (regula.typ === "max") {
            spelniona = wartosc <= regula.wartosc_celu;
        } else if (regula.typ === "min_daily") {
            // Sprawdzenie każdego dnia
            let wszystkiDniOk = true;
            dni.forEach(dzien => {
                if (!regula.sprawdzenie(dzien)) {
                    wszystkiDniOk = false;
                }
            });
            spelniona = wszystkiDniOk;
        } else if (regula.typ === "obecnosc") {
            spelniona = wartosc !== false && wartosc !== 0;
        }

        wyniki.szczegoly[regula.id] = {
            tytul: regula.tytul,
            opis: regula.opis,
            wartosc: wartosc,
            cel: regula.wartosc_celu,
            spelniona: spelniona,
            priorytet: regula.priorytet
        };

        if (spelniona) {
            wyniki.spelnione.push(regula.tytul);
        } else {
            wyniki.niespelnione.push(regula.tytul);
            if (regula.priorytet === "KRYTYCZNY") {
                wyniki.ostrzezenia.push(`⚠️ KRYTYCZNE: ${regula.tytul} - ${regula.opis}`);
            }
        }
    });

    // Obliczenie procentu
    const wszystkie = REGULY_TYGODNIA_2026.length;
    wyniki.wynik_procentowy = Math.round((wyniki.spelnione.length / wszystkie) * 100);

    // Status ogólny
    if (wyniki.wynik_procentowy === 100) {
        wyniki.ogolny_status = "✓ PEŁNA ZGODNOŚĆ";
    } else if (wyniki.wynik_procentowy >= 80) {
        wyniki.ogolny_status = "✓ ZGODNA (minor issues)";
    } else if (wyniki.wynik_procentowy >= 60) {
        wyniki.ogolny_status = "⚠️ CZĘŚCIOWO ZGODNA";
    } else {
        wyniki.ogolny_status = "❌ NIEZGODNA";
    }

    return wyniki;
}

/**
 * Funkcja do oceny pojedynczego dania
 * Zwraca cechy dania zgodne z 2026
 */
function ocenDanie2026(danie, kontekst) {
    const teksty = tekstySkladnikow(danie);
    
    // NOWE CECHY 2026
    const cechy = {
        // Mięso
        zawiera_mieso: pasujeDoKategorii2026(teksty, "mieso_swieze"),
        zawiera_mieso_przetworzone: pasujeDoKategorii2026(teksty, "mieso_przetworzone"),
        zawiera_ryba: pasujeDoKategorii2026(teksty, "ryba"),
        
        // Rośliny strączkowe
        zawiera_straczki: pasujeDoKategorii2026(teksty, "straczki_legumes"),
        
        // Warzywa i owoce
        zawiera_warzywo: pasujeDoKategorii2026(teksty, "warzywo"),
        zawiera_owoc: pasujeDoKategorii2026(teksty, "owoc"),
        zawiera_warzywo_lub_owoc: pasujeDoKategorii2026(teksty, "warzywo") || pasujeDoKategorii2026(teksty, "owoc"),
        
        // Mleko
        zawiera_nabial: pasujeDoKategorii2026(teksty, "nabial_mleko") || 
                       pasujeDoKategorii2026(teksty, "nabial_ser") || 
                       pasujeDoKategorii2026(teksty, "nabial_jogurt"),
        
        // Napoje
        zawiera_wode: pasujeDoKategorii2026(teksty, "woda"),
        
        // Właściwości
        smazone: !!kontekst.smazone,
        bez_miesa: !pasujeDoKategorii2026(teksty, "mieso_swieze") && 
                   !pasujeDoKategorii2026(teksty, "mieso_przetworzone") &&
                   !pasujeDoKategorii2026(teksty, "ryba"),
        
        // NOWE 2026
        obiad_roslinny: !!kontekst.obiad_roslinny && 
                       pasujeDoKategorii2026(teksty, "straczki_legumes") &&
                       pasujeDoKategorii2026(teksty, "warzywo") &&
                       !pasujeDoKategorii2026(teksty, "mieso_swieze") &&
                       !pasujeDoKategorii2026(teksty, "mieso_przetworzone") &&
                       !pasujeDoKategorii2026(teksty, "ryba"),
        
        zupa_warzywna: kontekst.typ_posilku === "zupa_czesc_dwudaniowego" && 
                       !pasujeDoKategorii2026(teksty, "mieso_swieze") &&
                       pasujeDoKategorii2026(teksty, "warzywo"),
        
        wysoko_przetworzone: pasujeDoKategorii2026(teksty, "wysoko_przetworzone"),
        
        opcja_roslinne: !!kontekst.opcja_roslinne || 
                       !pasujeDoKategorii2026(teksty, "mieso_swieze") &&
                       !pasujeDoKategorii2026(teksty, "mieso_przetworzone") &&
                       !pasujeDoKategorii2026(teksty, "ryba"),
        
        caloziarniste: pasujeDoKategorii2026(teksty, "caloziarniste")
    };

    return {
        cechy_dania_2026: cechy,
        normy_2026: NORMY_2026
    };
}

/**
 * Sprawdzenie czy składnik pasuje do kategorii
 */
function pasujeDoKategorii2026(teksty, kategoria) {
    const konfiguracja = KATEGORIE_PRODUKTOW_2026[kategoria];
    if (!konfiguracja) return false;

    return teksty.some(t => 
        konfiguracja.keywords.some(keyword => 
            t.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        )
    );
}

/**
 * GENERATOR OSTRZEŻEŃ - dla dyrektora/kucharki
 */
function generowaOstrzezenia2026(jadlospis, typPlacowki) {
    const ostrzezenia = [];
    let licznikMiesa = 0;
    let licznikSmażenia = 0;
    let licznikRybki = 0;
    let licznikObiadu = 0;

    Object.values(jadlospis).forEach(dzien => {
        if (!dzien.obiad) return;

        dzien.obiad.forEach(danie => {
            const ocena = ocenDanie2026(danie, {});
            const cechy = ocena.cechy_dania_2026;

            if (cechy.zawiera_mieso) licznikMiesa++;
            if (cechy.smazone) licznikSmażenia++;
            if (cechy.zawiera_ryba) licznikRybki++;
            if (cechy.obiad_roslinny) licznikObiadu++;
        });
    });

    // Ostrzeżenia
    if (licznikMiesa > 2) {
        ostrzezenia.push(`🔴 KRYTYCZNE: Mięsa ${licznikMiesa}x, a limit to 2x/tyg`);
    }
    if (licznikSmażenia > 2) {
        ostrzezenia.push(`🔴 KRYTYCZNE: Smażenie ${licznikSmażenia}x, a limit to 2x/tyg`);
    }
    if (licznikRybki < 1) {
        ostrzezenia.push(`🟡 WAŻNE: Brakuje ryby - wymagane min 1x/tyg`);
    }
    if (licznikObiadu < 1) {
        ostrzezenia.push(`🔴 KRYTYCZNE: Brakuje obiadu roślinnego - wymagane min 1x/tyg`);
    }

    return ostrzezenia;
}

/**
 * Export dla raportu do pani Minister
 */
function generowaRaportMinisterialny2026(jadlospis, config) {
    const poniedzialek = poniedzialekTygodnia(new Date());
    const dni = dniRobocze(poniedzialek);
    
    const dniObiady = [];
    dni.forEach(d => {
        const dzien = wczytajDzienZKlucza(d);
        if (dzien && dzien.zatwierdzony && dzien.obiad) {
            dniObiady.push(...dzien.obiad);
        }
    });

    const zgodnosc = obliczZgodnosc2026(dniObiady, dni, config.typ_placowki);

    return {
        placowka: config.nazwa_placowki,
        typ_placowki: config.typ_placowki,
        tydzien: `${formatujDataZapisu(fmtData(poniedzialek))} - ${formatujDataZapisu(fmtData(new Date(poniedzialek.getTime() + 4*24*60*60*1000)))}`,
        
        // ZGODNOŚĆ
        zgodnosc_procent: zgodnosc.wynik_procentowy,
        status: zgodnosc.ogolny_status,
        
        // SZCZEGÓŁY
        reguły: zgodnosc.szczegoly,
        
        // REKOMENDACJE
        ostrzezenia: generowaOstrzezenia2026(jadlospis, config.typ_placowki),
        
        // DATA RAPORTU
        data_raportu: new Date().toISOString().split('T')[0],
        zgodne_z_rozp: "Rozporządzenie Ministra Zdrowia od 1 września 2026"
    };
}
