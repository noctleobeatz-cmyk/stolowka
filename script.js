const GRUPY_WIEKOWE = [
    {id: "1", etykieta: "1 rok", kcal: 745},
    {id: "2", etykieta: "2 lata", kcal: 988},
    {id: "3", etykieta: "3 lata", kcal: 1126},
    {id: "4", etykieta: "4 lata", kcal: 1370},
    {id: "5", etykieta: "5 lat", kcal: 1472},
    {id: "6", etykieta: "6 lat", kcal: 1560},
    {id: "7", etykieta: "7 lat", kcal: 1652},
    {id: "8", etykieta: "8 lat", kcal: 1757},
    {id: "9", etykieta: "9 lat", kcal: 1862},
    {id: "10", etykieta: "10 lat", kcal: 2131},
    {id: "11", etykieta: "11 lat", kcal: 2244},
    {id: "12", etykieta: "12 lat", kcal: 2381},
    {id: "13", etykieta: "13 lat", kcal: 2529},
    {id: "14", etykieta: "14 lat", kcal: 2665},
    {id: "15", etykieta: "15 lat", kcal: 2774}
];

const NORMY_SKLADNIKOW = {
    "1-3": {"blonnik_g": 10, "cukry_g": 25, "sod_mg": 1100, "witamina_c_mg": 40, "zelazo_mg": 7, "bialko_g": 15, "tluszcz_g": 40, "weglowodany_g": 130, "woda_g": 1300},
    "4-6": {"blonnik_g": 14, "cukry_g": 30, "sod_mg": 1200, "witamina_c_mg": 50, "zelazo_mg": 10, "bialko_g": 19, "tluszcz_g": 55, "weglowodany_g": 180, "woda_g": 1600},
    "7-9": {"blonnik_g": 16, "cukry_g": 40, "sod_mg": 1400, "witamina_c_mg": 55, "zelazo_mg": 10, "bialko_g": 27, "tluszcz_g": 65, "weglowodany_g": 220, "woda_g": 1800},
    "10-12": {"blonnik_g": 19, "cukry_g": 45, "sod_mg": 1500, "witamina_c_mg": 60, "zelazo_mg": 10, "bialko_g": 35, "tluszcz_g": 75, "weglowodany_g": 260, "woda_g": 2000},
    "13-15": {"blonnik_g": 21, "cukry_g": 50, "sod_mg": 1500, "witamina_c_mg": 75, "zelazo_mg": 12, "bialko_g": 46, "tluszcz_g": 85, "weglowodany_g": 300, "woda_g": 2100}
};

const MAPA_PIERSCIENI = {B: "blonnik_g", C: "cukry_g", S: "sod_mg", W: "witamina_c_mg", Z: "zelazo_mg", Bi: "bialko_g", T: "tluszcz_g", We: "weglowodany_g", Wo: "woda_g"};

const ETYKIETY_WARTOSCI_ODZYWCZYCH = {
    blonnik_g: "Błonnik",
    cukry_g: "Cukry",
    sod_mg: "Sód",
    witamina_c_mg: "Wit. C",
    zelazo_mg: "Żelazo",
    bialko_g: "Białko",
    tluszcz_g: "Tłuszcz",
    weglowodany_g: "Węglow.",
    woda_g: "Woda"
};

const JEDNOSTKI_WARTOSCI_ODZYWCZYCH = {
    blonnik_g: "g",
    cukry_g: "g",
    sod_mg: "mg",
    witamina_c_mg: "mg",
    zelazo_mg: "mg",
    bialko_g: "g",
    tluszcz_g: "g",
    weglowodany_g: "g",
    woda_g: "g"
};
const SLOTY_SZKOLA = ["obiad"];
const SLOTY_PRZEDSZKOLE = ["sniadanie", "drugie_sniadanie", "zupa", "danie_glowne", "podwieczorek"];
const SLOTY_WSZYSTKIE = ["sniadanie", "drugie_sniadanie", "zupa", "danie_glowne", "obiad", "podwieczorek"];

const TYPY_PLACOWEK = [
    {id: "szkola", etykieta: "Szkoła", opis: "Tylko obiad"},
    {id: "przedszkole", etykieta: "Przedszkole", opis: "I śniadanie, II śniadanie, zupa, drugie danie, podwieczorek"}
];

function typPlacowkiZConfig(config) {
    return (config && config.typ_placowki === "przedszkole") ? "przedszkole" : "szkola";
}

function slotyDlaTypu(typPlacowki) {
    return typPlacowki === "przedszkole" ? SLOTY_PRZEDSZKOLE : SLOTY_SZKOLA;
}

function slotyGlownegoPosilku(typPlacowki) {
    return typPlacowki === "przedszkole" ? ["zupa", "danie_glowne"] : ["obiad"];
}

function slotyDnia(dzien) {
    return SLOTY_WSZYSTKIE.filter(function(slot) {
        return Object.prototype.hasOwnProperty.call(dzien, slot);
    });
}

const DNI_TYG = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
const MIESIACE = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
const KLUCZ_CONFIG = "stolowka_config";
const KLUCZ_PRODUKTY_WLASNE = "stolowka_produkty_wlasne";

const ALERGENY = [
    {klucz: "gluten", etykieta: "Gluten"},
    {klucz: "skorupiaki", etykieta: "Skorupiaki"},
    {klucz: "jaja", etykieta: "Jaja"},
    {klucz: "ryby", etykieta: "Ryby"},
    {klucz: "orzeszki_ziemne", etykieta: "Orzeszki ziemne"},
    {klucz: "soja", etykieta: "Soja"},
    {klucz: "mleko", etykieta: "Mleko (laktoza)"},
    {klucz: "orzechy", etykieta: "Orzechy"},
    {klucz: "seler", etykieta: "Seler"},
    {klucz: "gorczyca", etykieta: "Gorczyca"},
    {klucz: "sezam", etykieta: "Nasiona sezamu"},
    {klucz: "siarczyny", etykieta: "Siarczyny / SO2"},
    {klucz: "lubin", etykieta: "Łubin"},
    {klucz: "mieczaki", etykieta: "Mięczaki"}
];

function etykietaAlergenu(klucz) {
    const wpis = ALERGENY.find(function(a) {
        return a.klucz === klucz;
    });

    if (wpis) {
        return wpis.etykieta;
    } else {
        return klucz;
    }
}

const SLOTY_ETYKIETY = {
    sniadanie: "I śniadanie",
    drugie_sniadanie: "II śniadanie",
    zupa: "Pierwsze danie (zupa)",
    danie_glowne: "Drugie danie",
    obiad: "Obiad",
    podwieczorek: "Podwieczorek"
};

function fmtData(d) {
    return d.toISOString().slice(0, 10);
}

function kluczDnia(d) {
    let iso;

    if (d instanceof Date) {
        iso = fmtData(d);
    } else {
        iso = d;
    }

    return "stolowka_posilki_" + iso;
}

function pustyDzien(typPlacowki) {
    const dzien = {zatwierdzony: false};

    slotyDlaTypu(typPlacowki).forEach(function(slot) {
        dzien[slot] = [];
    });

    return dzien;
}

function odmienLata(n) {
    if (n === 1) {
        return "rok";
    }

    const ostatnia = n % 10;
    const dziesiatki = n % 100;

    if (ostatnia >= 2 && ostatnia <= 4 && !(dziesiatki >= 12 && dziesiatki <= 14)) {
        return "lata";
    }

    return "lat";
}

function formatujDate(d) {
    const dzien = DNI_TYG[d.getDay()];
    return `${dzien}, ${d.getDate()} ${MIESIACE[d.getMonth()]} ${d.getFullYear()}`;
}

function formatujDataZapisu(iso) {
    const d = new Date(iso);
    const dzien = String(d.getDate()).padStart(2, "0");
    const miesiac = String(d.getMonth() + 1).padStart(2, "0");

    return `${dzien}.${miesiac}.${d.getFullYear()}`;
}

function kluczBracketuDlaWieku(wiek) {
    if (wiek >= 1 && wiek <= 3) {
        return "1-3";
    } else if (wiek >= 4 && wiek <= 6) {
        return "4-6";
    } else if (wiek >= 7 && wiek <= 9) {
        return "7-9";
    } else if (wiek >= 10 && wiek <= 12) {
        return "10-12";
    } else if (wiek >= 13 && wiek <= 15) {
        return "13-15";
    } else {
        return null;
    }
}

function obliczZapotrzebowanie(grupy) {
    let sumaKcal = 0;
    let sumaDzieci = 0;

    GRUPY_WIEKOWE.forEach(function(grupa) {
        const liczba = grupy[grupa.id] || 0;
        sumaKcal += liczba * grupa.kcal;
        sumaDzieci += liczba;
    });

    if (!sumaDzieci) {
        return 0;
    }

    return Math.round(sumaKcal / sumaDzieci);
}

function obliczNormySkladnikow(grupy) {
    let sumaDzieci = 0;
    const sumaNorm = {};

    Object.values(MAPA_PIERSCIENI).forEach(function(klucz) {
        sumaNorm[klucz] = 0;
    });

    GRUPY_WIEKOWE.forEach(function(grupa) {
        const liczba = grupy[grupa.id] || 0;

        if (liczba === 0) {
            return;
        }

        const bracket = kluczBracketuDlaWieku(Number(grupa.id));
        let normy;

        if (bracket) {
            normy = NORMY_SKLADNIKOW[bracket];
        } else {
            normy = null;
        }

        sumaDzieci += liczba;

        if (normy) {
            Object.values(MAPA_PIERSCIENI).forEach(function(klucz) {
                sumaNorm[klucz] += liczba * (normy[klucz] || 0);
            });
        }
    });

    const wynik = {};

    Object.values(MAPA_PIERSCIENI).forEach(function(klucz) {
        if (sumaDzieci) {
            wynik[klucz] = sumaNorm[klucz] / sumaDzieci;
        } else {
            wynik[klucz] = 0;
        }
    });

    return wynik;
}

function podswietlAktywnaStrone() {
    const aktualnaSciezka = window.location.pathname.split("/").pop();

    document.querySelectorAll("nav a").forEach(function(link) {
        const cel = link.getAttribute("href");

        if (cel === aktualnaSciezka) {
            link.classList.add("aktywny");
        } else {
            link.classList.remove("aktywny");
        }
    });
}

function poniedzialekTygodnia(data) {
    const kopia = new Date(data);
    const dzienTyg = kopia.getDay();
    let offset;

    if (dzienTyg === 0) {
        offset = -6;
    } else {
        offset = 1 - dzienTyg;
    }

    kopia.setDate(kopia.getDate() + offset);
    kopia.setHours(0, 0, 0, 0);

    return kopia;
}

function dniRobocze(poniedzialek) {
    const dni = [];

    for (let i = 0; i < 5; i++) {
        const d = new Date(poniedzialek);
        d.setDate(d.getDate() + i);
        dni.push(d);
    }

    return dni;
}

function wczytajDzienZKlucza(data) {
    const zapis = localStorage.getItem(kluczDnia(data));

    if (!zapis) {
        return null;
    }

    try {
        return JSON.parse(zapis);
    } catch (err) {
        return null;
    }
}

function cechaDania(danie, klucz) {
    return !!(danie.ocena_zgodnosci && danie.ocena_zgodnosci.cechy_dania && danie.ocena_zgodnosci.cechy_dania[klucz]);
}

// Kategorie słów kluczowych do rozpoznawania cech dania na podstawie nazw składników.
// Współdzielone przez baza.js (ocena nowo dodawanych dań) oraz przez wszystkie strony
// liczące zgodność tygodniową (przepisy.js, jadlospis.js, dzis.js).
const KATEGORIE_SKLADNIKOW = {
    ryba: ["ryba", "ryby", "mintaj", "dorsz", "łosoś", "losos", "makrela", "filet z ryby", "morszczuk", "śledź", "sledz", "pstrąg", "pstrag", "halibut", "okoń morski", "okon morski", "sandacz", "tuńczyk", "tunczyk"],
    straczki: ["fasol", "ciecierzyc", "soczewic", "groch", "bób", "bob", "strączk", "straczk", "hummus"],
    mieso_swieze: ["wieprzow", "wołow", "wolow", "drobiow", "kurczak", "indyk", "schab", "karkówk", "karkowk", "mięso", "mieso", "kotlet", "mielone", "wołowin", "wolowin"],
    mieso_przetworzone: ["kiełbas", "kielbas", "wędlin", "wedlin", "mortadel", "pasztet", "gotowy kotlet", "gotowy sznycel", "konserwa", "parówk", "parowk", "boczek"],
    nabial_jajo: ["mleko", "śmietana", "smietana", "ser ", "jogurt", "jajko", "jajo", "twaróg", "twarog", "masło", "maslo", "kefir", "serek", "maślank", "maslank"],
    warzywo: ["marchew", "pietruszk", "seler", "kapust", "burak", "ogórek", "ogorek", "pomidor", "cebul", "brokuł", "brokul", "szpinak", "papryk", "cukini", "por ", "groszek", "fasolka ziel", "kalafior", "rzepa", "dynia", "sałat", "salat", "szczypior"],
    owoc: ["jabłk", "jablk", "gruszk", "truskaw", "borówk", "borowk", "malin", "porzeczk", "morela", "śliw", "sliw", "banan", "cytrus", "pomarańcz", "pomaranc"],
    caloziarniste: ["pełnoziarnist", "pelnoziarnist", "całoziarnist", "caloziarnist", "żytni", "zytni", "pszenny", "orkisz", "żyto", "zyto", "owies", "kasza", "otręb", "otreb", "razow"]
};

function tekstySkladnikow(danie) {
    return (danie.skladniki || []).map(function(s) {
        return (s.nazwa || "").toLowerCase();
    });
}

function pasujeDoKategorii(teksty, kategoria) {
    const slowa = KATEGORIE_SKLADNIKOW[kategoria] || [];
    return teksty.some(function(t) {
        return slowa.some(function(slowo) {
            return t.indexOf(slowo) !== -1;
        });
    });
}

// Niektóre cechy (np. mięso przetworzone) mogły nie zostać zapisane w ocena_zgodnosci
// dla dań dodanych zanim ta cecha istniała w aplikacji - w takim wypadku liczymy je
// na bieżąco na podstawie nazw składników, żeby reguły tygodniowe zawsze były aktualne.
function cechaDaniaRozszerzona(danie, klucz) {
    const cechy = danie.ocena_zgodnosci && danie.ocena_zgodnosci.cechy_dania;

    if (cechy && Object.prototype.hasOwnProperty.call(cechy, klucz)) {
        return !!cechy[klucz];
    }

    if (klucz === "zawiera_mieso_przetworzone") {
        return pasujeDoKategorii(tekstySkladnikow(danie), "mieso_przetworzone");
    }

    return false;
}

// Zbiera dane potrzebne do oceny zgodności z rozporządzeniem dla danego zakresu dni.
// opcje.tylkoZatwierdzone (domyślnie true) - jeśli false, uwzględnia też dni jeszcze
// niezatwierdzone (przydatne do podglądu "na żywo" podczas układania jadłospisu).
function zbierzObiadyTygodnia(dni, typPlacowki, opcje) {
    opcje = opcje || {};
    const tylkoZatwierdzone = opcje.tylkoZatwierdzone !== false;
    const sloty = slotyGlownegoPosilku(typPlacowki);

    const dania = [];
    let dniZDanymi = 0;
    let dniZWarzywem = 0;
    let dniZWarzywemWszystkichPosilkow = 0;
    let dniZNapojemBezCukru = 0;
    let dniWymagajaceAlternatywy = 0;
    let dniZAlternatywa = 0;

    dni.forEach(function(data) {
        const dzien = wczytajDzienZKlucza(data);

        if (!dzien) {
            return;
        }

        if (tylkoZatwierdzone && !dzien.zatwierdzony) {
            return;
        }

        const slotyObecne = slotyDnia(dzien).filter(function(slot) {
            return (dzien[slot] || []).length > 0;
        });

        if (slotyObecne.length === 0) {
            return;
        }

        const daniaDnia = sloty.reduce(function(acc, slot) {
            return acc.concat(dzien[slot] || []);
        }, []);

        dniZDanymi++;

        if (daniaDnia.some(function(danie) { return cechaDania(danie, "zawiera_warzywo_lub_owoc"); })) {
            dniZWarzywem++;
        }

        const warzywoWKazdymPosilku = slotyObecne.every(function(slot) {
            return (dzien[slot] || []).some(function(danie) { return cechaDania(danie, "zawiera_warzywo_lub_owoc"); });
        });

        if (warzywoWKazdymPosilku) {
            dniZWarzywemWszystkichPosilkow++;
        }

        const napoj = dzien.napoj || null;
        const napojBezCukru = !!napoj && (napoj.typ === "woda" || napoj.dosladzany === false);

        if (napojBezCukru) {
            dniZNapojemBezCukru++;
        }

        const wszystkieDaniaDnia = slotyObecne.reduce(function(acc, slot) {
            return acc.concat(dzien[slot] || []);
        }, []);

        const maMiesoLubRybe = wszystkieDaniaDnia.some(function(danie) {
            return cechaDania(danie, "zawiera_mieso_swieze") || cechaDania(danie, "zawiera_ryba");
        });

        if (maMiesoLubRybe) {
            dniWymagajaceAlternatywy++;

            if (dzien.alternatywa_wegetarianska) {
                dniZAlternatywa++;
            }
        }

        daniaDnia.forEach(function(danie) {
            dania.push(danie);
        });
    });

    return {
        dania: dania,
        dniZDanymi: dniZDanymi,
        dniZWarzywem: dniZWarzywem,
        dniZWarzywemWszystkichPosilkow: dniZWarzywemWszystkichPosilkow,
        dniZNapojemBezCukru: dniZNapojemBezCukru,
        dniWymagajaceAlternatywy: dniWymagajaceAlternatywy,
        dniZAlternatywa: dniZAlternatywa
    };
}

// Wspólna definicja reguł zgodności z rozporządzeniem, używana przez przepisy.js
// (oficjalne, tylko zatwierdzone dni), jadlospis.js (skrócony podgląd) oraz dzis.js
// (podgląd "na żywo" podczas dodawania posiłków, także dla dni niezatwierdzonych).
function regulyZgodnosciZWynikow(zebrane) {
    const liczMieso = zebrane.dania.filter(function(d) { return cechaDania(d, "zawiera_mieso_swieze"); }).length;
    const liczMiesoPrzetworzone = zebrane.dania.filter(function(d) { return cechaDaniaRozszerzona(d, "zawiera_mieso_przetworzone"); }).length;
    const liczZupaWywar = zebrane.dania.filter(function(d) { return cechaDania(d, "zupa_na_wywarze_warzywnym"); }).length;
    const liczRoslinne = zebrane.dania.filter(function(d) { return cechaDania(d, "danie_roslinne_bez_odzwierzecych"); }).length;
    const liczRyba = zebrane.dania.filter(function(d) { return cechaDania(d, "zawiera_ryba"); }).length;
    const liczSmazone = zebrane.dania.filter(function(d) { return cechaDania(d, "smazone"); }).length;
    const liczEnergiaOk = zebrane.dania.filter(function(d) {
        return d.ocena_zgodnosci && d.ocena_zgodnosci.energia_zgodna_z_udzialem_docelowym;
    }).length;

    return [
        {
            klucz: "mieso",
            tytul: "Dania z mięsa świeżego",
            opis: "Rozporządzenie ogranicza dania mięsne w obiedzie do maksymalnie 2 razy w tygodniu.",
            wartosc: liczMieso, cel: 2, typ: "max"
        },
        {
            klucz: "mieso_przetworzone",
            tytul: "Mięso przetworzone",
            opis: "Wędliny i gotowe wyroby mięsne są niedozwolone od 09.2026 - dozwolone jest tylko mięso świeże.",
            wartosc: liczMiesoPrzetworzone, cel: 0, typ: "max"
        },
        {
            klucz: "smazone",
            tytul: "Dania smażone",
            opis: "Potrawy smażone mogą pojawić się maksymalnie 2 razy w tygodniu.",
            wartosc: liczSmazone, cel: 2, typ: "max"
        },
        {
            klucz: "zupa_wywar",
            tytul: "Zupy na wywarze warzywnym",
            opis: "Zupy powinny być przygotowywane na wywarze warzywnym co najmniej 2 razy w tygodniu.",
            wartosc: liczZupaWywar, cel: 2, typ: "min"
        },
        {
            klucz: "roslinne",
            tytul: "Danie roślinne na bazie strączków",
            opis: "Co najmniej raz w tygodniu obiad musi zawierać danie w pełni roślinne, bez produktów odzwierzęcych.",
            wartosc: liczRoslinne, cel: 1, typ: "min"
        },
        {
            klucz: "ryba",
            tytul: "Ryba w jadłospisie",
            opis: "Co najmniej jedna porcja ryby powinna pojawić się w tygodniowym jadłospisie.",
            wartosc: liczRyba, cel: 1, typ: "min"
        },
        {
            klucz: "warzywo",
            tytul: "Warzywo lub owoc w każdym posiłku",
            opis: "Warzywo lub owoc powinno być składnikiem każdego zarejestrowanego posiłku każdego dnia (nie tylko obiadu).",
            wartosc: zebrane.dniZWarzywemWszystkichPosilkow, cel: zebrane.dniZDanymi, typ: "min"
        },
        {
            klucz: "napoj",
            tytul: "Woda / napój bez dodatku cukru",
            opis: "Podstawowym napojem powinna być woda; kompoty i herbaty nie powinny być dosładzane.",
            wartosc: zebrane.dniZNapojemBezCukru, cel: zebrane.dniZDanymi, typ: "min"
        },
        {
            klucz: "alternatywa",
            tytul: "Alternatywa roślinna w dni z mięsem/rybą",
            opis: "W dniach, w których serwowane jest mięso lub ryba, musi być dostępna opcja roślinna dla uczniów niespożywających produktów odzwierzęcych.",
            wartosc: zebrane.dniZAlternatywa, cel: zebrane.dniWymagajaceAlternatywy, typ: "min"
        },
        {
            klucz: "energia",
            tytul: "Energia zgodna z docelowym udziałem",
            opis: "Każdy posiłek powinien pokrywać odpowiedni procent dziennego zapotrzebowania energetycznego dla swojego typu.",
            wartosc: liczEnergiaOk, cel: zebrane.dania.length, typ: "min"
        }
    ];
}

function czyRegulaSpelniona(regula) {
    if (regula.typ === "max") {
        return regula.wartosc <= regula.cel;
    }

    return regula.wartosc >= regula.cel;
}

function wczytajConfigWspolny() {
    const zapis = localStorage.getItem(KLUCZ_CONFIG);

    if (!zapis) {
        return null;
    }

    try {
        return JSON.parse(zapis);
    } catch (err) {
        return null;
    }
}

podswietlAktywnaStrone();