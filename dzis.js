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

const stateDzis = {
    aktualnaData: odczytajDateZUrl(),
    config: null,
    typPlacowki: "szkola",
    dzien: null
};

function zmienDate(liczbaDni) {
    const nowaData = new Date(stateDzis.aktualnaData);
    nowaData.setDate(nowaData.getDate() + liczbaDni);
    nowaData.setHours(0, 0, 0, 0);

    if (nowaData < DATA_MINIMALNA) {
        return;
    }

    stateDzis.aktualnaData = nowaData;
    odswiezDate();
}

function odswiezDate() {
    const element = document.getElementById("pokaz");
    const sformatowanaData = formatujDate(stateDzis.aktualnaData);

    if (element) {
        element.textContent = sformatowanaData;
    } else {
        console.error("Element #pokaz nie znaleziony w DOM");
    }

    wczytajDzien();
}

function aktualizujZapotrzebowanie() {
    const element = document.getElementById("zapotrzebowanie");
    const grupy = stateDzis.config && stateDzis.config.grupy;
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

    const typEtykieta = TYPY_PLACOWEK.find(function(t) { return t.id === stateDzis.typPlacowki; });

    document.getElementById("podsumowanie-placowka").textContent = stateDzis.config.placowka || "-";
    document.getElementById("podsumowanie-typ-placowki").textContent = typEtykieta ? typEtykieta.etykieta : "Szkoła";
    document.getElementById("data-zapisu").textContent = formatujDataZapisu(stateDzis.config.zaktualizowano);
    aktualizujZapotrzebowanie();
}

function wczytajConfig() {
    stateDzis.config = wczytajConfigWspolny();
    stateDzis.typPlacowki = typPlacowkiZConfig(stateDzis.config);

    if (!stateDzis.config) {
        pokazBrakKonfiguracji();
        return;
    }

    pokazTrybPodsumowania();
}

function zbudujSekcjePosilkow() {
    const kontener = document.getElementById("posilki-dnia");
    const sloty = slotyDlaTypu(stateDzis.typPlacowki);

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
    const zapis = localStorage.getItem(kluczDnia(stateDzis.aktualnaData));

    if (zapis) {
        stateDzis.dzien = JSON.parse(zapis);
    } else {
        stateDzis.dzien = pustyDzien(stateDzis.typPlacowki);
    }

    zbudujSekcjePosilkow();
    renderujWszystkiePosilki();
    aktualizujPiersienieIPozostalo();
    aktualizujStanZatwierdzenia();
}

function zapiszDzien() {
    localStorage.setItem(kluczDnia(stateDzis.aktualnaData), JSON.stringify(stateDzis.dzien));
}

function renderujWszystkiePosilki() {
    slotyDnia(stateDzis.dzien).forEach(renderujPosilek);
}

function renderujPosilek(slot) {
    const sekcja = document.querySelector(`section[data-posilek="${slot}"]`);

    if (!sekcja) {
        return;
    }

    const dania = stateDzis.dzien[slot] || [];
    const puste = sekcja.querySelector(".puste");
    const stopka = sekcja.querySelector(".stopka-posiłku");
    const kcalEl = sekcja.querySelector(".meta .kcal");
    const czasEl = sekcja.querySelector(".meta .czas");
    const zgodnoscEl = sekcja.querySelector(".zgodnosc");
    const link = sekcja.querySelector("a");

    if (link) {
        link.href = `baza.html?slot=${slot}&data=${fmtData(stateDzis.aktualnaData)}`;
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

    if (slot === "obiad" && stateDzis.config && stopka) {
        const limit = stateDzis.config.obiady || 1;
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

    slotyDnia(stateDzis.dzien).forEach(function(slot) {
        (stateDzis.dzien[slot] || []).forEach(function(danie) {
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
    const normy = stateDzis.config ? obliczNormySkladnikow(stateDzis.config.grupy) : {};

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

    const cel = stateDzis.config ? obliczZapotrzebowanie(stateDzis.config.grupy) : 0;
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

    if (!zapisz) {
        return;
    }

    if (stateDzis.dzien.zatwierdzony) {
        zapisz.textContent = "✅ Posiłki zatwierdzone";
        zapisz.disabled = true;
    } else {
        zapisz.textContent = "Zatwierdz posiłki";
        zapisz.disabled = false;
    }
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
            const brakDan = slotyDnia(stateDzis.dzien).every(function(slot) {
                const posilek = stateDzis.dzien[slot] || [];
                return posilek.length === 0;
            });

            if (brakDan) {
                alert("Nie dodano jeszcze żadnych posiłków na ten dzień");
                return;
            }

            const czyZatwierdzic = confirm("Czy na pewno zatwierdzić posiłki na ten dzień? Nie będzie można ich później edytować");

            if (czyZatwierdzic) {
                stateDzis.dzien.zatwierdzony = true;
                zapiszDzien();
                aktualizujStanZatwierdzenia();
            }
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
