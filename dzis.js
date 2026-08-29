const DATA_MINIMALNA = new Date(2026, 8, 1);
DATA_MINIMALNA.setHours(0, 0, 0, 0);

function odczytajDateZUrl() {
    const params = new URLSearchParams(window.location.search);
    const iso = params.get("data");

    if (!iso) {
        return new Date();
    }

    const d = new Date(iso);

    if (isNaN(d.getTime())) {
        return new Date();
    }

    return d;
}

const state = {
    aktualnaData: odczytajDateZUrl(),
    config: null,
    typPlacowki: "szkola",
    dzien: null
};

function zmienDate(liczbaDni) {
    const nowaData = new Date(state.aktualnaData);
    nowaData.setDate(nowaData.getDate() + liczbaDni);
    nowaData.setHours(0, 0, 0, 0);

    if (nowaData < DATA_MINIMALNA) {
        return;
    }

    state.aktualnaData = nowaData;
    odswiezDate();
}

function odswiezDate() {
    const element = document.getElementById("pokaz");
    const sformatowanaData = formatujDate(state.aktualnaData);

    if (element) {
        element.textContent = sformatowanaData;
    } else {
        console.error("Element #pokaz nie znaleziony w DOM");
    }

    wczytajDzien();
}

function aktualizujZapotrzebowanie() {
    const element = document.getElementById("zapotrzebowanie");
    const grupy = state.config && state.config.grupy;
    const cel = grupy ? obliczZapotrzebowanie(grupy) : 0;

    if (cel) {
        element.textContent = `${cel} kcal`;
    } else {
        element.textContent = "-kcal";
    }
}

function pokazBrakKonfiguracji() {
    document.getElementById("widok-podsumowania").hidden = true;
    document.getElementById("brak-konfiguracji").hidden = false;
    aktualizujZapotrzebowanie();
}

function pokazTrybPodsumowania() {
    document.getElementById("widok-podsumowania").hidden = false;
    document.getElementById("brak-konfiguracji").hidden = true;

    const typEtykieta = TYPY_PLACOWEK.find(function(t) { return t.id === state.typPlacowki; });

    document.getElementById("podsumowanie-placowka").textContent = state.config.placowka || "-";
    document.getElementById("podsumowanie-typ-placowki").textContent = typEtykieta ? typEtykieta.etykieta : "Szkoła";
    document.getElementById("data-zapisu").textContent = formatujDataZapisu(state.config.zaktualizowano);
    aktualizujZapotrzebowanie();
}

function wczytajConfig() {
    state.config = wczytajConfigWspolny();
    state.typPlacowki = typPlacowkiZConfig(state.config);

    if (!state.config) {
        pokazBrakKonfiguracji();
        return;
    }

    pokazTrybPodsumowania();
}

function zbudujSekcjePosilkow() {
    const kontener = document.getElementById("posilki-dnia");
    const sloty = slotyDlaTypu(state.typPlacowki);

    kontener.innerHTML = sloty.map(function(slot) {
        return `
        <section data-posilek="${slot}">
          <section class="nazwa">${SLOTY_ETYKIETY[slot]}</section>
          <section class="meta"><span><b class="czas"></b></span><b class="kcal"></b></section>
          <a href="baza.html">
            <section class="puste"><span><h1>+</h1></span><p>Nie dodano jeszcze posiłku</p></section>
            <section class="stopka-posiłku"><button>+ Dodaj posiłek</button></section>
          </a>
          <section class="zgodnosc"></section>
        </section>
        `;
    }).join("");
}

function wczytajDzien() {
    const zapis = localStorage.getItem(kluczDnia(state.aktualnaData));

    if (zapis) {
        state.dzien = JSON.parse(zapis);
    } else {
        state.dzien = pustyDzien(state.typPlacowki);
    }

    zbudujSekcjePosilkow();
    renderujWszystkiePosilki();
    aktualizujPiersienieIPozostalo();
    aktualizujStanZatwierdzenia();
    wczytajWymaganiaDnia();
    renderujPostepTygodnia();
}

function zapiszDzien() {
    localStorage.setItem(kluczDnia(state.aktualnaData), JSON.stringify(state.dzien));
}

function renderujWszystkiePosilki() {
    slotyDnia(state.dzien).forEach(renderujPosilek);
}

function renderujPosilek(slot) {
    const sekcja = document.querySelector(`section[data-posilek="${slot}"]`);

    if (!sekcja) {
        return;
    }

    const dania = state.dzien[slot] || [];
    const puste = sekcja.querySelector(".puste");
    const stopka = sekcja.querySelector(".stopka-posiłku");
    const kcalEl = sekcja.querySelector(".meta .kcal");
    const czasEl = sekcja.querySelector(".meta .czas");
    const zgodnoscEl = sekcja.querySelector(".zgodnosc");
    const link = sekcja.querySelector("a");

    if (link) {
        link.href = `baza.html?slot=${slot}&data=${fmtData(state.aktualnaData)}`;
    }

    if (dania.length === 0) {
        if (puste) {
            puste.style.display = "";
        }

        if (kcalEl) {
            kcalEl.textContent = "";
        }

        if (czasEl) {
            czasEl.textContent = "";
        }

        if (zgodnoscEl) {
            zgodnoscEl.innerHTML = "";
        }

        return;
    }

    const sumaKcal = dania.reduce(function(s, d) {
        return s + (d.kcal || 0);
    }, 0);

    if (kcalEl) {
        kcalEl.textContent = `${sumaKcal} kcal`;
    }

    if (czasEl) {
        czasEl.textContent = dania[dania.length - 1].godzina || "";
    }

    if (puste) {
        puste.style.display = "none";
    }

    if (zgodnoscEl) {
        const wszystkieOk = dania.every(function(d) {
            return d.ocena_zgodnosci && d.ocena_zgodnosci.energia_zgodna_z_udzialem_docelowym !== false;
        });

        let klasa = "bad";
        let tekst = "⚠️ sprawdź zgodność";

        if (wszystkieOk) {
            klasa = "ok";
            tekst = "✅ zgodne z normą";
        }

        const nazwyDan = dania.map(function(d) {
            return `<li>${escapeHtmlProdukt(d.nazwa)}</li>`;
        }).join("");

        zgodnoscEl.innerHTML = `
        <span class="tag ${klasa}">
        ${tekst}
        </span>

        <div class="lista-dan">
        <ul>${nazwyDan}</ul>
        </div>
        `;
    }

    if (slot === "obiad" && state.config && stopka) {
        const limit = state.config.obiady || 1;
        const przycisk = stopka.querySelector("button");

        if (przycisk) {
            const osiagnietoLimit = dania.length >= limit;

            przycisk.disabled = osiagnietoLimit;

            if (osiagnietoLimit) {
                przycisk.textContent = `Osiągnięto limit ${limit} dań`;
            } else {
                przycisk.textContent = "+ Dodaj posiłek";
            }
        }
    }
}

function zsumujWartosciOdzywcze() {
    const suma = {};

    Object.values(MAPA_PIERSCIENI).forEach(function(klucz) {
        suma[klucz] = 0;
    });

    let sumaKcal = 0;

    slotyDnia(state.dzien).forEach(function(slot) {
        (state.dzien[slot] || []).forEach(function(danie) {
            sumaKcal += danie.kcal || 0;
            const wo = danie.wartosci_odzywcze || {};

            Object.values(MAPA_PIERSCIENI).forEach(function(klucz) {
                suma[klucz] += wo[klucz] || 0;
            });
        });
    });

    return {suma: suma, sumaKcal: sumaKcal};
}

function aktualizujPiersienieIPozostalo() {
    const wynikSumy = zsumujWartosciOdzywcze();
    const suma = wynikSumy.suma;
    const sumaKcal = wynikSumy.sumaKcal;
    const normy = state.config ? obliczNormySkladnikow(state.config.grupy) : {};

    Object.entries(MAPA_PIERSCIENI).forEach(function(para) {
        const sufiks = para[0];
        const klucz = para[1];
        const pierscien = document.getElementById(`pierścień_${sufiks}`);

        if (!pierscien) {
            return;
        }

        const obecnieEl = pierscien.querySelector(".obecnie");
        const normaEl = pierscien.querySelector(".norma_dawkowa");

        if (obecnieEl) {
            obecnieEl.textContent = suma[klucz].toFixed(1);
        }

        if (normaEl) {
            normaEl.textContent = (normy[klucz] || 0).toFixed(1);
        }
    });

    const cel = state.config ? obliczZapotrzebowanie(state.config.grupy) : 0;
    const elementPozostalo = document.getElementById("pozostalo");

    if (elementPozostalo) {
        if (cel) {
            elementPozostalo.textContent = `${cel - sumaKcal} kcal`;
        } else {
            elementPozostalo.textContent = "-kcal";
        }
    }
}

function aktualizujStanZatwierdzenia() {
    const zapisz = document.getElementById("zapisz");
    const napojSelect = document.getElementById("napoj-typ");
    const alternatywaCheckbox = document.getElementById("alternatywa-wegetarianska");

    if (napojSelect) {
        napojSelect.disabled = !!state.dzien.zatwierdzony;
    }

    if (alternatywaCheckbox) {
        alternatywaCheckbox.disabled = !!state.dzien.zatwierdzony;
    }

    if (!zapisz) {
        return;
    }

    if (state.dzien.zatwierdzony) {
        zapisz.textContent = "✅ Posiłki zatwierdzone";
        zapisz.disabled = true;
    } else {
        zapisz.textContent = "Zatwierdz posiłki";
        zapisz.disabled = false;
    }
}

const NAPOJ_OPCJE = {
    woda: {typ: "woda", dosladzany: false},
    kompot_bez_cukru: {typ: "kompot", dosladzany: false},
    herbata_bez_cukru: {typ: "herbata", dosladzany: false},
    kompot_slodzony: {typ: "kompot", dosladzany: true},
    herbata_slodzona: {typ: "herbata", dosladzany: true},
    inny_slodzony: {typ: "inny", dosladzany: true}
};

function wczytajWymaganiaDnia() {
    const napojSelect = document.getElementById("napoj-typ");
    const alternatywaCheckbox = document.getElementById("alternatywa-wegetarianska");

    if (napojSelect) {
        napojSelect.value = (state.dzien.napoj && state.dzien.napoj.wybor) || "";
    }

    if (alternatywaCheckbox) {
        alternatywaCheckbox.checked = !!state.dzien.alternatywa_wegetarianska;
    }
}

function zapiszWymaganiaDniaINastepnie() {
    if (state.dzien.zatwierdzony) {
        return;
    }

    zapiszDzien();
    renderujPostepTygodnia();
}

function renderujPostepTygodnia() {
    const kontener = document.getElementById("postep-tygodnia");
    const zakresEl = document.getElementById("postep-tygodnia-zakres");

    if (!kontener) {
        return;
    }

    const poniedzialek = poniedzialekTygodnia(state.aktualnaData);
    const piatek = new Date(poniedzialek);
    piatek.setDate(piatek.getDate() + 4);

    if (zakresEl) {
        zakresEl.textContent = `${formatujDataZapisu(fmtData(poniedzialek))}–${formatujDataZapisu(fmtData(piatek))}`;
    }

    const dni = dniRobocze(poniedzialek);
    const zebrane = zbierzObiadyTygodnia(dni, state.typPlacowki, {tylkoZatwierdzone: false});

    if (zebrane.dniZDanymi === 0) {
        kontener.innerHTML = `<p class="podpowiedz-domyslna">Dodaj posiłki do dowolnego dnia tego tygodnia, aby zobaczyć tu na bieżąco postęp zgodności z rozporządzeniem.</p>`;
        return;
    }

    const reguly = regulyZgodnosciZWynikow(zebrane);

    kontener.innerHTML = reguly.map(function(regula) {
        const spelniona = czyRegulaSpelniona(regula);
        const licznik = regula.typ === "max" ? `${regula.wartosc}/maks. ${regula.cel}` : `${regula.wartosc}/min. ${regula.cel}`;

        return `<span class="tag ${spelniona ? "ok" : "bad"}" title="${regula.opis}">${regula.tytul}: ${licznik}</span>`;
    }).join("");
}

function inicjujStroneDzis() {
    if (document.getElementById("dzien-poprzedni")) {
        document.getElementById("dzien-poprzedni").addEventListener("click", function() {
            zmienDate(-1);
        });
    }

    if (document.getElementById("dzien-nastepny")) {
        document.getElementById("dzien-nastepny").addEventListener("click", function() {
            zmienDate(1);
        });
    }

    if (document.getElementById("zapisz")) {
        document.getElementById("zapisz").addEventListener("click", function() {
            const brakDan = slotyDnia(state.dzien).every(function(slot) {
                const posilek = state.dzien[slot] || [];
                return posilek.length === 0;
            });

            if (brakDan) {
                alert("Nie dodano jeszcze żadnych posiłków na ten dzień");
                return;
            }

            const czyZatwierdzic = confirm("Czy na pewno zatwierdzić posiłki na ten dzień? Nie będzie można ich później edytować");

            if (czyZatwierdzic) {
                state.dzien.zatwierdzony = true;
                zapiszDzien();
                aktualizujStanZatwierdzenia();
            }
        });
    }

    if (document.getElementById("napoj-typ")) {
        document.getElementById("napoj-typ").addEventListener("change", function(event) {
            const wybor = event.target.value;

            if (!wybor) {
                delete state.dzien.napoj;
            } else {
                state.dzien.napoj = Object.assign({wybor: wybor}, NAPOJ_OPCJE[wybor]);
            }

            zapiszWymaganiaDniaINastepnie();
        });
    }

    if (document.getElementById("alternatywa-wegetarianska")) {
        document.getElementById("alternatywa-wegetarianska").addEventListener("change", function(event) {
            state.dzien.alternatywa_wegetarianska = event.target.checked;
            zapiszWymaganiaDniaINastepnie();
        });
    }

    wczytajConfig();
    odswiezDate();
}

function escapeHtmlProdukt(str) {
    const section = document.createElement("section");
    section.textContent = str;
    return section.innerHTML;
}

if (document.getElementById("pokaz")) {
    inicjujStroneDzis();
}
