function zbudujGrupyWiekowe(zapisaneWartosci) {
    const kontener = document.getElementById("grupy-wiekowe");
    kontener.innerHTML = "";

    GRUPY_WIEKOWE.forEach(function(grupa) {
        const wiersz = document.createElement("section");
        wiersz.className = "wiersz-grupy";

        wiersz.innerHTML = `
        <label for="grupa-${grupa.id}">${grupa.etykieta}</label>
        <input type="number" min="0" id="grupa-${grupa.id}" data-grupa="${grupa.id}" value="${(zapisaneWartosci && zapisaneWartosci[grupa.id]) || 0}">
        `;

        kontener.appendChild(wiersz);
    });

    document.querySelectorAll('[id^="grupa-"]').forEach(function(input) {
        input.addEventListener("input", function() {
            odswiezPodgladKcal();
        });
    });
}

function odczytajGrupyZFormularza() {
    const wynik = {};

    GRUPY_WIEKOWE.forEach(function(grupa) {
        const input = document.getElementById(`grupa-${grupa.id}`);

        if (input) {
            wynik[grupa.id] = Number(input.value) || 0;
        } else {
            wynik[grupa.id] = 0;
        }
    });

    return wynik;
}

function odswiezPodgladKcal() {
    const podglad = document.getElementById("podglad-kcal");

    if (!podglad) {
        return;
    }

    const cel = obliczZapotrzebowanie(odczytajGrupyZFormularza());
    podglad.textContent = cel ? `${cel} kcal` : "- kcal";
}

function wczytajConfig() {
    return wczytajConfigWspolny();
}

function zbudujWyborTypuPlacowki(wybranyTyp) {
    const kontener = document.getElementById("typ-placowki-opcje");

    kontener.innerHTML = TYPY_PLACOWEK.map(function(typ) {
        const zaznaczone = typ.id === (wybranyTyp || "szkola") ? "checked" : "";

        return `
        <label class="pole-checkbox">
            <input type="radio" name="typ-placowki" value="${typ.id}" ${zaznaczone}>
            ${typ.etykieta} <span class="podpowiedz-domyslna">(${typ.opis})</span>
        </label>
        `;
    }).join("");

    kontener.querySelectorAll('input[name="typ-placowki"]').forEach(function(input) {
        input.addEventListener("change", odswiezPoleObiadow);
    });

    odswiezPoleObiadow();
}

function odczytajTypPlacowkiZFormularza() {
    const zaznaczony = document.querySelector('input[name="typ-placowki"]:checked');
    return zaznaczony ? zaznaczony.value : "szkola";
}

function odswiezPoleObiadow() {
    const poleObiady = document.getElementById("pole-obiady");

    if (poleObiady) {
        poleObiady.hidden = odczytajTypPlacowkiZFormularza() === "przedszkole";
    }
}

function pokazEdytor(config) {
    document.getElementById("profil-edytor").hidden = false;
    document.getElementById("akcje-profilu").hidden = true;

    const naglowek = document.getElementById("profil-edytor-naglowek");
    const anulujBtn = document.getElementById("anuluj-edycje-btn");

    if (config) {
        naglowek.textContent = "Edytuj dane placówki";
        anulujBtn.hidden = false;
        document.getElementById("gdzie").value = config.placowka || "";
        document.getElementById("obiady").value = config.obiady || 1;
        zbudujWyborTypuPlacowki(typPlacowkiZConfig(config));
        zbudujGrupyWiekowe(config.grupy);
    } else {
        naglowek.textContent = "Skonfiguruj dane placówki";
        anulujBtn.hidden = true;
        document.getElementById("gdzie").value = "";
        document.getElementById("obiady").value = 1;
        zbudujWyborTypuPlacowki("szkola");
        zbudujGrupyWiekowe(null);
    }

    odswiezPodgladKcal();
}

function ukryjEdytor() {
    document.getElementById("profil-edytor").hidden = true;
    document.getElementById("akcje-profilu").hidden = false;
}

function zapiszConfig() {
    const gdzie = document.getElementById("gdzie").value.trim();
    const obiady = Number(document.getElementById("obiady").value) || 1;
    const typPlacowki = odczytajTypPlacowkiZFormularza();
    const grupy = odczytajGrupyZFormularza();

    const sumaDzieci = GRUPY_WIEKOWE.reduce(function(s, grupa) {
        return s + (grupy[grupa.id] || 0);
    }, 0);

    if (sumaDzieci === 0) {
        document.getElementById("status-profilu").textContent = "⚠️ Wpisz liczbę dzieci przynajmniej w jednej grupie wiekowej";
        return;
    }

    const config = {
        placowka: gdzie,
        typ_placowki: typPlacowki,
        obiady: obiady,
        grupy: grupy,
        zaktualizowano: new Date().toISOString()
    };

    localStorage.setItem(KLUCZ_CONFIG, JSON.stringify(config));

    ukryjEdytor();
    renderujProfil();

    document.getElementById("status-profilu").textContent = "✅ Dane placówki zostały zapisane";
}

function renderujProfil() {
    const config = wczytajConfig();
    const brakProfilu = document.getElementById("brak-profilu");
    const daneProfilu = document.getElementById("dane-profilu");

    if (!config) {
        brakProfilu.hidden = false;
        daneProfilu.hidden = true;
        document.getElementById("edytuj-profil-btn").hidden = true;
        pokazEdytor(null);
        return;
    }

    brakProfilu.hidden = true;
    daneProfilu.hidden = false;
    document.getElementById("edytuj-profil-btn").hidden = false;
    ukryjEdytor();

    const cel = obliczZapotrzebowanie(config.grupy);
    const typPlacowki = typPlacowkiZConfig(config);
    const typEtykieta = TYPY_PLACOWEK.find(function(t) { return t.id === typPlacowki; });

    document.getElementById("profil-placowka").textContent = config.placowka || "-";
    document.getElementById("profil-typ-placowki").textContent = typEtykieta ? typEtykieta.etykieta : "Szkoła";
    document.getElementById("profil-kcal").textContent = cel ? `${cel} kcal` : "-";
    document.getElementById("profil-data").textContent = formatujDataZapisu(config.zaktualizowano);

    document.getElementById("wiersz-profil-obiady").hidden = typPlacowki === "przedszkole";
    document.getElementById("profil-obiady").textContent = config.obiady || 1;

    const sumaDzieci = GRUPY_WIEKOWE.reduce(function(s, grupa) {
        return s + (config.grupy[grupa.id] || 0);
    }, 0);

    document.getElementById("profil-dzieci").textContent = sumaDzieci;

    const kontenerGrup = document.getElementById("profil-grupy-wiekowe");
    const grupyZDziecmi = GRUPY_WIEKOWE.filter(function(grupa) {
        return (config.grupy[grupa.id] || 0) > 0;
    });

    if (grupyZDziecmi.length === 0) {
        kontenerGrup.innerHTML = "<p>Brak dodanych dzieci</p>";
        return;
    }

    kontenerGrup.innerHTML = grupyZDziecmi.map(function(grupa) {
        const liczba = config.grupy[grupa.id];
        return `<span class="tag-grupy-wiekowej">${liczba} × ${grupa.etykieta}</span>`;
    }).join("");
}

function wyczyscWszystkieDane() {
    const potwierdzone = confirm("Czy na pewno usunąć wszystkie zapisane dane stołówki z tej przeglądarki? Tej operacji nie można cofnąć.");

    if (!potwierdzone) {
        return;
    }

    const kluczeDoUsuniecia = [];

    for (let i = 0; i < localStorage.length; i++) {
        const klucz = localStorage.key(i);

        if (klucz && klucz.indexOf("stolowka") === 0) {
            kluczeDoUsuniecia.push(klucz);
        }
    }

    kluczeDoUsuniecia.forEach(function(klucz) {
        localStorage.removeItem(klucz);
    });

    document.getElementById("status-profilu").textContent = "✅ Wszystkie dane zostały wyczyszczone";
    renderujProfil();
}

document.getElementById("wyczysc-dane-btn").addEventListener("click", wyczyscWszystkieDane);
document.getElementById("edytuj-profil-btn").addEventListener("click", function() {
    pokazEdytor(wczytajConfig());
});
document.getElementById("anuluj-edycje-btn").addEventListener("click", function() {
    ukryjEdytor();
});
document.getElementById("zapisz-btn").addEventListener("click", zapiszConfig);

renderujProfil();
