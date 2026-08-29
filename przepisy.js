function obliczSredniaKcalBracketu(bracket) {
    const grupyBracketu = GRUPY_WIEKOWE.filter(function(grupa) {
        return kluczBracketuDlaWieku(Number(grupa.id)) === bracket;
    });

    const suma = grupyBracketu.reduce(function(s, grupa) {
        return s + grupa.kcal;
    }, 0);

    return Math.round(suma / grupyBracketu.length);
}

function renderujTabeleNorm() {
    const bracketId = Object.keys(NORMY_SKLADNIKOW);
    const nagłowki = document.getElementById("naglowki-tabeli-norm");

    nagłowki.innerHTML = `
    <span class="komorka-naglowek">Grupa wiekowa</span>
    <span class="komorka-naglowek">kcal</span>
    ${Object.values(MAPA_PIERSCIENI).map(function(klucz) {
        return `<span class="komorka-naglowek">${ETYKIETY_SKLADNIKOW_PRZEPISY[klucz]}</span>`;
    }).join("")}
    `;

    const wiersze = document.getElementById("wiersze-tabeli-norm");

    wiersze.innerHTML = bracketId.map(function(bracket) {
        const normy = NORMY_SKLADNIKOW[bracket];
        const kcal = obliczSredniaKcalBracketu(bracket);

        return `
        <section class="wiersz-tabeli-norm">
            <span class="komorka-tabeli">${bracket} lat</span>
            <span class="komorka-tabeli">${kcal}</span>
            ${Object.values(MAPA_PIERSCIENI).map(function(klucz) {
                return `<span class="komorka-tabeli">${normy[klucz]}</span>`;
            }).join("")}
        </section>
        `;
    }).join("");
}

const ETYKIETY_SKLADNIKOW_PRZEPISY = ETYKIETY_WARTOSCI_ODZYWCZYCH;

function renderujZgodnoscRozporzadzenie() {
    const config = wczytajConfigWspolny();
    const typPlacowki = typPlacowkiZConfig(config);

    const poniedzialek = poniedzialekTygodnia(new Date());
    const piatek = new Date(poniedzialek);
    piatek.setDate(piatek.getDate() + 4);

    document.getElementById("zr-zakres-tygodnia").textContent =
        `tydzień ${formatujDataZapisu(fmtData(poniedzialek))}\u2013${formatujDataZapisu(fmtData(piatek))}`;

    const dni = dniRobocze(poniedzialek);
    const zebrane = zbierzObiadyTygodnia(dni, typPlacowki);
    const kontenerReguly = document.getElementById("zr-lista-regul");
    const statusOgolny = document.getElementById("zr-status-ogolny");

    if (zebrane.dniZDanymi === 0) {
        kontenerReguly.innerHTML = `<p class="zr-brak-danych">Brak zatwierdzonych posiłków w tym tygodniu &ndash; dodaj i zatwierdź posiłki na stronie „Dziś", aby sprawdzić zgodność z rozporządzeniem.</p>`;
        statusOgolny.className = "tag";
        statusOgolny.textContent = "brak danych";
        return;
    }

    const reguly = regulyZgodnosciZWynikow(zebrane);

    let wszystkoOk = true;

    kontenerReguly.innerHTML = reguly.map(function(regula) {
        const spelniona = czyRegulaSpelniona(regula);

        if (!spelniona) {
            wszystkoOk = false;
        }

        let procent;

        if (regula.cel > 0) {
            procent = Math.min(100, Math.round((regula.wartosc / regula.cel) * 100));
        } else if (regula.wartosc > 0) {
            procent = 100;
        } else {
            procent = 0;
        }

        let licznik;

        if (regula.typ === "max") {
            licznik = `${regula.wartosc} / maks. ${regula.cel}`;
        } else {
            licznik = `${regula.wartosc} / min. ${regula.cel}`;
        }

        let klasaSpelniona;
        let tekstSpelniona;

        if (spelniona) {
            klasaSpelniona = "ok";
            tekstSpelniona = "spełnione";
        } else {
            klasaSpelniona = "bad";
            tekstSpelniona = "sprawdź";
        }

        return `
        <section class="zr-regula ${klasaSpelniona}">
            <section class="zr-regula-naglowek">
                <span class="zr-regula-tytul">${regula.tytul}</span>
                <span class="tag ${klasaSpelniona}">${tekstSpelniona}</span>
            </section>
            <p class="zr-regula-opis">${regula.opis}</p>
            <section class="zr-pasek"><span style="width:${procent}%"></span></section>
            <p class="zr-regula-wartosc">${licznik}</p>
        </section>
        `;
    }).join("");

    if (wszystkoOk) {
        statusOgolny.className = "tag ok";
        statusOgolny.textContent = "zgodny z rozporządzeniem";
    } else {
        statusOgolny.className = "tag bad";
        statusOgolny.textContent = "wymaga poprawek";
    }
}

function podsumujDzienPrzepisy(dzien) {
    const suma = {};

    Object.values(MAPA_PIERSCIENI).forEach(function(klucz) {
        suma[klucz] = 0;
    });

    let sumaKcal = 0;

    slotyDnia(dzien).forEach(function(slot) {
        (dzien[slot] || []).forEach(function(danie) {
            sumaKcal += danie.kcal || 0;
            const wo = danie.wartosci_odzywcze || {};

            Object.values(MAPA_PIERSCIENI).forEach(function(klucz) {
                suma[klucz] += wo[klucz] || 0;
            });
        });
    });

    return {suma: suma, sumaKcal: sumaKcal};
}

function renderujSprawdzenieDzisiaj() {
    const kontener = document.getElementById("wynik-sprawdzenia-dzisiaj");
    const config = wczytajConfigWspolny();

    if (!config) {
        kontener.innerHTML = "<p>Uzupełnij dane placówki na stronie „Dziś”, aby sprawdzić zgodność z normami</p>";
        return;
    }

    const typPlacowki = typPlacowkiZConfig(config);
    const kluczDzisiaj = kluczDnia(new Date());
    const zapisDnia = localStorage.getItem(kluczDzisiaj);
    let dzien;

    if (zapisDnia) {
        dzien = JSON.parse(zapisDnia);
    } else {
        dzien = pustyDzien(typPlacowki);
    }

    const podsumowanie = podsumujDzienPrzepisy(dzien);
    const normySkladnikow = obliczNormySkladnikow(config.grupy);
    const celKcal = obliczZapotrzebowanie(config.grupy);

    let kcalTag;

    if (celKcal && podsumowanie.sumaKcal <= celKcal * 1.1 && podsumowanie.sumaKcal >= celKcal * 0.9) {
        kcalTag = `<span class="tag ok">✅ zgodne</span>`;
    } else {
        kcalTag = `<span class="tag bad">⚠️ sprawdź</span>`;
    }

    const wierszeSkladnikow = Object.entries(MAPA_PIERSCIENI).map(function(para) {
        const klucz = para[1];
        const wartosc = podsumowanie.suma[klucz];
        const norma = normySkladnikow[klucz] || 0;
        let procent;

        if (norma) {
            procent = Math.round((wartosc / norma) * 100);
        } else {
            procent = 0;
        }

        let klasa;

        if (procent >= 80 && procent <= 120) {
            klasa = "ok";
        } else {
            klasa = "bad";
        }

        return `
        <section class="wiersz-sprawdzenia">
            <span>${ETYKIETY_SKLADNIKOW_PRZEPISY[klucz]}</span>
            <span>${wartosc.toFixed(1)} / ${norma.toFixed(1)}</span>
            <span class="tag ${klasa}">${procent}%</span>
        </section>
        `;
    }).join("");

    kontener.innerHTML = `
    <section class="wiersz-sprawdzenia">
        <span>Kalorie</span>
        <span>${Math.round(podsumowanie.sumaKcal)} / ${celKcal || "-"} kcal</span>
        ${kcalTag}
    </section>
    ${wierszeSkladnikow}
    `;
}

renderujSprawdzenieDzisiaj();
renderujTabeleNorm();
renderujZgodnoscRozporzadzenie();
