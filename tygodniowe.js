// Zasady tygodniowe (od 1 września 2026)
// Ministerstwo Edukacji Narodowej - Rozporządzenie o żywieniu

const ZASADY_TYGODNIOWE = {
    posilek_roslinny_bezodzwierzecych: {
        wymog: "minimum_raz",
        opis: "Minimum raz w tygodniu musi być posiłek w pełni wegetariański (bez produktów odzwierzęcych)"
    },
    potrawy_miecne_max: {
        wymog: 2,
        opis: "Potrawy mięsne maksymalnie 2 razy w tygodniu"
    },
    zupy_na_wywarze_warzywnym_min: {
        wymog: 2,
        opis: "Minimum 2 razy w tygodniu zupa na wywarze warzywnym (bez kości i mięsa)"
    },
    rybe_min: {
        wymog: 1,
        opis: "Minimum jedna porcja ryby w tygodniowym jadłospisie"
    },
    smazone_max: {
        wymog: 2,
        opis: "Potrawy smażone maksymalnie 2 razy w tygodniu"
    }
};

function zbierzTygodnioweDania(poniedzialek, typPlacowki) {
    const sloty = slotyGlownegoPosilku(typPlacowki);
    const dania = [];
    const dniDo = [];

    for (let i = 0; i < 5; i++) {
        const data = new Date(poniedzialek);
        data.setDate(data.getDate() + i);
        
        const dzien = wczytajDzienZKlucza(data);
        
        if (!dzien || !dzien.zatwierdzony) {
            dniDo.push({data: data, dania: [], zatwierdzony: false});
            continue;
        }

        const daniaDnia = sloty.reduce(function(acc, slot) {
            return acc.concat(dzien[slot] || []);
        }, []);

        dniDo.push({data: data, dania: daniaDnia, zatwierdzony: true});
        dania = dania.concat(daniaDnia);
    }

    return {
        wszystkieDania: dania,
        dniDo: dniDo,
        liczbaRoboczyDni: dniDo.filter(function(d) { return d.zatwierdzony; }).length
    };
}

function sprawdzZgodnoscTygodnia(poniedzialek, typPlacowki) {
    const wynik = zbierzTygodnioweDania(poniedzialek, typPlacowki);
    const dania = wynik.wszystkieDania;
    const dniZatwierdzonych = wynik.liczbaRoboczyDni;

    const zgodnosciWymagane = {
        posilek_roslinny_bezodzwierzecych: {
            wymog: 1,
            liczba: 0,
            zgodny: false,
            szczegoly: []
        },
        potrawy_miecne: {
            wymog: 2,
            liczba: 0,
            zgodny: true,
            szczegoly: []
        },
        zupy_na_wywarze_warzywnym: {
            wymog: 2,
            liczba: 0,
            zgodny: false,
            szczegoly: []
        },
        rybe: {
            wymog: 1,
            liczba: 0,
            zgodny: false,
            szczegoly: []
        },
        smazone: {
            wymog: 2,
            liczba: 0,
            zgodny: true,
            szczegoly: []
        }
    };

    dania.forEach(function(danie) {
        const cechy = danie.ocena_zgodnosci ? danie.ocena_zgodnosci.cechy_dania : {};

        // Posiłek roślinny
        if (cechy.danie_roslinne_bez_odzwierzecych) {
            zgodnosciWymagane.posilek_roslinny_bezodzwierzecych.liczba += 1;
            if (zgodnosciWymagane.posilek_roslinny_bezodzwierzecych.szczegoly.indexOf(danie.nazwa) === -1) {
                zgodnosciWymagane.posilek_roslinny_bezodzwierzecych.szczegoly.push(danie.nazwa);
            }
        }

        // Potrawy mięsne
        if (cechy.zawiera_mieso_swieze) {
            zgodnosciWymagane.potrawy_miecne.liczba += 1;
        }

        // Zupy na wywarze warzywnym
        if (cechy.zupa_na_wywarze_warzywnym) {
            zgodnosciWymagane.zupy_na_wywarze_warzywnym.liczba += 1;
            if (zgodnosciWymagane.zupy_na_wywarze_warzywnym.szczegoly.indexOf(danie.nazwa) === -1) {
                zgodnosciWymagane.zupy_na_wywarze_warzywnym.szczegoly.push(danie.nazwa);
            }
        }

        // Ryba
        if (cechy.zawiera_ryba) {
            zgodnosciWymagane.rybe.liczba += 1;
            if (zgodnosciWymagane.rybe.szczegoly.indexOf(danie.nazwa) === -1) {
                zgodnosciWymagane.rybe.szczegoly.push(danie.nazwa);
            }
        }

        // Smażone
        if (cechy.smazone) {
            zgodnosciWymagane.smazone.liczba += 1;
        }
    });

    // Ocena zgodności
    zgodnosciWymagane.posilek_roslinny_bezodzwierzecych.zgodny = 
        zgodnosciWymagane.posilek_roslinny_bezodzwierzecych.liczba >= zgodnosciWymagane.posilek_roslinny_bezodzwierzecych.wymog;

    zgodnosciWymagane.potrawy_miecne.zgodny = 
        zgodnosciWymagane.potrawy_miecne.liczba <= zgodnosciWymagane.potrawy_miecne.wymog;

    zgodnosciWymagane.zupy_na_wywarze_warzywnym.zgodny = 
        zgodnosciWymagane.zupy_na_wywarze_warzywnym.liczba >= zgodnosciWymagane.zupy_na_wywarze_warzywnym.wymog;

    zgodnosciWymagane.rybe.zgodny = 
        zgodnosciWymagane.rybe.liczba >= zgodnosciWymagane.rybe.wymog;

    zgodnosciWymagane.smazone.zgodny = 
        zgodnosciWymagane.smazone.liczba <= zgodnosciWymagane.smazone.wymog;

    const calkowicieZgodny = Object.values(zgodnosciWymagane).every(function(w) { return w.zgodny; });

    return {
        calkowicieZgodny: calkowicieZgodny,
        dniZatwierdzonych: dniZatwierdzonych,
        wymagania: zgodnosciWymagane,
        wszystkieDania: dania
    };
}

function renderujRaportTygodniowy(poniedzialek, typPlacowki) {
    const wynik = sprawdzZgodnoscTygodnia(poniedzialek, typPlacowki);
    const wymagania = wynik.wymagania;

    let html = `
    <section class="raport-tygodniowy">
        <h2>Raport tygodniowy (${formatujDate(poniedzialek)})</h2>
        
        <section class="podsumowanie-status">
            ${wynik.calkowicieZgodny ? 
                '<span class="tag ok">✅ Tygodniowy jadłospis zgodny z rozporządzeniem!</span>' : 
                '<span class="tag bad">⚠️ Tygodniowy jadłospis NIE spełnia wszystkich wymogów</span>'}
            <p>Zatwierdzonych dni: <b>${wynik.dniZatwierdzonych}/5</b></p>
        </section>

        <section class="wymogi-szczegoly">
            <h3>Wymogi tygodniowe:</h3>
    `;

    // Posiłek roślinny
    const w1 = wymagania.posilek_roslinny_bezodzwierzecych;
    html += `
        <section class="wymog-wiersz ${w1.zgodny ? 'ok' : 'bad'}">
            <div class="wymog-nazwa">
                <b>Posiłek w pełni wegetariański</b>
                <span class="wymog-status">${w1.liczba}/${w1.wymog}</span>
            </div>
            ${w1.szczegoly.length > 0 ? `
                <div class="wymog-szczegoly">
                    <ul>${w1.szczegoly.map(function(d) { return '<li>' + d + '</li>'; }).join('')}</ul>
                </div>
            ` : ''}
            ${w1.zgodny ? '<span class="ikona">✅</span>' : '<span class="ikona">⚠️ Brak lub za mało</span>'}
        </section>
    `;

    // Mięso
    const w2 = wymagania.potrawy_miecne;
    html += `
        <section class="wymog-wiersz ${w2.zgodny ? 'ok' : 'bad'}">
            <div class="wymog-nazwa">
                <b>Potrawy mięsne (maksymalnie)</b>
                <span class="wymog-status">${w2.liczba}/${w2.wymog}</span>
            </div>
            ${w2.zgodny ? '<span class="ikona">✅</span>' : '<span class="ikona">⚠️ Za wiele mięsa</span>'}
        </section>
    `;

    // Zupy na wywarze warzywnym
    const w3 = wymagania.zupy_na_wywarze_warzywnym;
    html += `
        <section class="wymog-wiersz ${w3.zgodny ? 'ok' : 'bad'}">
            <div class="wymog-nazwa">
                <b>Zupy na wywarze warzywnym (minimum)</b>
                <span class="wymog-status">${w3.liczba}/${w3.wymog}</span>
            </div>
            ${w3.szczegoly.length > 0 ? `
                <div class="wymog-szczegoly">
                    <ul>${w3.szczegoly.map(function(d) { return '<li>' + d + '</li>'; }).join('')}</ul>
                </div>
            ` : ''}
            ${w3.zgodny ? '<span class="ikona">✅</span>' : '<span class="ikona">⚠️ Brak lub za mało</span>'}
        </section>
    `;

    // Ryba
    const w4 = wymagania.rybe;
    html += `
        <section class="wymog-wiersz ${w4.zgodny ? 'ok' : 'bad'}">
            <div class="wymog-nazwa">
                <b>Ryba w tygodniowym jadłospisie (minimum)</b>
                <span class="wymog-status">${w4.liczba}/${w4.wymog}</span>
            </div>
            ${w4.szczegoly.length > 0 ? `
                <div class="wymog-szczegoly">
                    <ul>${w4.szczegoly.map(function(d) { return '<li>' + d + '</li>'; }).join('')}</ul>
                </div>
            ` : ''}
            ${w4.zgodny ? '<span class="ikona">✅</span>' : '<span class="ikona">⚠️ Brak lub za mało</span>'}
        </section>
    `;

    // Smażone
    const w5 = wymagania.smazone;
    html += `
        <section class="wymog-wiersz ${w5.zgodny ? 'ok' : 'bad'}">
            <div class="wymog-nazwa">
                <b>Potrawy smażone (maksymalnie)</b>
                <span class="wymog-status">${w5.liczba}/${w5.wymog}</span>
            </div>
            ${w5.zgodny ? '<span class="ikona">✅</span>' : '<span class="ikona">⚠️ Za wiele smażonych</span>'}
        </section>
    `;

    html += `
        </section>
    </section>
    `;

    return html;
}
