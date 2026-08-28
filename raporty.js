const state_raporty = {
    aktualnyPoniedzialek: null
};

function poniedzialekBiezacyTygodnia() {
    const dzisiaj = new Date();
    return poniedzialekTygodnia(dzisiaj);
}

function zmienTydzien(przesuniecieUstaw) {
    const nowy = new Date(state_raporty.aktualnyPoniedzialek);
    nowy.setDate(nowy.getDate() + (przesuniecieUstaw * 7));
    state_raporty.aktualnyPoniedzialek = nowy;
    odswiezRaporty();
}

function formatujOkresRaportu(poniedzialek) {
    const piatek = new Date(poniedzialek);
    piatek.setDate(piatek.getDate() + 4);
    
    const formatDnia = function(d) {
        return d.getDate() + ' ' + MIESIACE[d.getMonth()];
    };
    
    return formatDnia(poniedzialek) + ' – ' + formatDnia(piatek) + ' ' + poniedzialek.getFullYear();
}

function odswiezRaporty() {
    const element = document.getElementById('okres-tygodnia');
    if (element) {
        element.textContent = formatujOkresRaportu(state_raporty.aktualnyPoniedzialek);
    }

    const config = wczytajConfigWspolny();
    const typPlacowki = typPlacowkiZConfig(config);

    const html = renderujRaportTygodniowy(state_raporty.aktualnyPoniedzialek, typPlacowki);
    const kontener = document.getElementById('raporty-kontener');
    if (kontener) {
        kontener.innerHTML = html;
    }
}

function inicjujStronaRaporty() {
    state_raporty.aktualnyPoniedzialek = poniedzialekBiezacyTygodnia();

    const przyciskPoprzedni = document.getElementById('tydzien-poprzedni');
    const przyciskNastepny = document.getElementById('tydzien-nastepny');

    if (przyciskPoprzedni) {
        przyciskPoprzedni.addEventListener('click', function() {
            zmienTydzien(-1);
        });
    }

    if (przyciskNastepny) {
        przyciskNastepny.addEventListener('click', function() {
            zmienTydzien(1);
        });
    }

    odswiezRaporty();
}

if (document.getElementById('raporty-kontener')) {
    inicjujStronaRaporty();
}