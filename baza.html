<!DOCTYPE html>
<html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Przeglądaj bazę dań i produktów, dodawaj własne posiłki i sprawdzaj ich zgodność z przepisami.">
        <title>Stołówka – Baza dań i produktów</title>
        <link rel="stylesheet" href="style.css">
        <link rel="icon" href="favicon.png" type="image/png">
    </head>

    <body>
        <section class="kontener">

            <section id="marka"><section id="ikona">🍽</section>STOŁÓWKA</section>

            <nav>
                <a href="home.html">Dziś</a>
                <a href="jadlospis.html">Jadłospis</a>
                <a href="przepisy.html">Zgodność z przepisami</a>
                <a href="raporty.html">Raporty</a>
                <a href="dziennik.html">Dziennik</a>
                <a href="profil.html">Profil</a>
            </nav>

            <section id="baza">
                <section id="naglowek-bazy">
                    <h1>Baza dań i produktów</h1>
                    <p id="info"></p>
                </section>

                <section id="sloty" hidden>
                    <label for="wybur">Dodaj wybrane dania do:</label>

                    <select id="wybur"></select>
                </section>

                <section id="wyszukiwarka-dan">
                    <input type="text" id="szukaj" placeholder="Szukaj dania po nazwie...">

                    <select id="typ_posilku">
                        <option value="wszystkie">Wszystkie typy</option>
                    </select>
                </section>

                <section id="lista-dan" aria-live="polite"></section>
                <section id="szczegoly_dania" hidden></section>

                <section id="dodaj-danie">
                    <button id="pokaz-formularz">+ Dodaj własne danie</button>

                    <form id="formularz-danie" hidden>
                        <label for="nowe_nazwa">Nazwa dania</label>
                        <input type="text" id="nowe_nazwa" required>

                        <label for="nowe-typ">Rodzaj posiłku</label>
                        <select id="nowe-typ" required>
                            <option value="sniadanie">I śniadanie (przedszkole)</option>
                            <option value="drugie_sniadanie">II śniadanie (przedszkole)</option>
                            <option value="podwieczorek">Podwieczorek (przedszkole)</option>
                            <option value="obiad_jednodaniowy">Obiad jednodaniowy (szkoła)</option>
                            <option value="zupa_czesc_dwudaniowego">Pierwsze danie - zupa (przedszkole / obiad dwudaniowy)</option>
                            <option value="danie_glowne_czesc_dwudaniowego">Drugie danie - danie główne (przedszkole / obiad dwudaniowy)</option>
                        </select>

                        <fieldset id="cechy-dania-fieldset">
                            <legend>Cechy dania (do oceny zgodności z rozporządzeniem)</legend>
                            <label class="pole-checkbox"><input type="checkbox" id="nowe-smazone"> Danie jest smażone</label>
                            <label class="pole-checkbox" id="pole-wywar-warzywny" hidden><input type="checkbox" id="nowe-wywar-warzywny"> Zupa na wywarze warzywnym (nie mięsnym)</label>
                            <label class="pole-checkbox"><input type="checkbox" id="nowe-koncentrat"> Zawiera koncentraty / gotowe mieszanki w proszku</label>
                        </fieldset>

                        <fieldset>
                            <legend>Składniki</legend>
                            <div id="lista-skladnikow"></div>
                            <button type="button" id="dodaj-skladnik">+ dodaj składnik</button>
                        </fieldset>

                        <datalist id="produkty-datalista"></datalist>

                        <section id="nowy-produkt-panel" hidden>
                            <h4>Nowy produkt (brak w bazie)</h4>
                            <p class="podpowiedz-domyslna">Podaj wartości odżywcze na 100 g produktu, aby program mógł policzyć kaloryczność i ocenić zgodność dania.</p>

                            <label for="np-nazwa">Nazwa produktu</label>
                            <input type="text" id="np-nazwa">

                            <label for="np-kategoria">Kategoria</label>
                            <input type="text" id="np-kategoria" value="Inne">

                            <section class="siatka-wartosci-produktu">
                                <label>Kalorie (kcal)<input type="number" step="0.1" id="np-kcal" value="0"></label>
                                <label>Białko (g)<input type="number" step="0.1" id="np-bialko" value="0"></label>
                                <label>Tłuszcz (g)<input type="number" step="0.1" id="np-tluszcz" value="0"></label>
                                <label>Węglowodany (g)<input type="number" step="0.1" id="np-weglowodany" value="0"></label>
                                <label>Błonnik (g)<input type="number" step="0.1" id="np-blonnik" value="0"></label>
                                <label>Cukry (g)<input type="number" step="0.1" id="np-cukry" value="0"></label>
                                <label>Sód (mg)<input type="number" step="0.1" id="np-sod" value="0"></label>
                                <label>Witamina C (mg)<input type="number" step="0.1" id="np-witaminac" value="0"></label>
                                <label>Żelazo (mg)<input type="number" step="0.1" id="np-zelazo" value="0"></label>
                                <label>Woda (g)<input type="number" step="0.1" id="np-woda" value="0"></label>
                            </section>

                            <fieldset class="edycja-alergenow" id="np-alergeny"></fieldset>

                            <button type="button" id="np-zapisz-btn" class="zapisz-alergeny-btn">Dodaj produkt do bazy</button>
                            <p id="np-status" class="status-zapisu"></p>
                        </section>

                        <fieldset id="przepis-fieldset">
                            <legend>Przepis</legend>
                            <p class="podpowiedz-domyslna">Podaj przepis krok po kroku tak samo, jak przy gotowych daniach w bazie - albo kliknij „Zaproponuj przepis", żeby wygenerować szkic na podstawie dodanych składników i go poprawić.</p>

                            <button type="button" id="zaproponuj-przepis-btn">Zaproponuj przepis na podstawie składników</button>

                            <label for="nowy-przepis-czas">Czas przygotowania (minuty)</label>
                            <input type="number" id="nowy-przepis-czas" min="0" step="1" value="30">

                            <label for="nowy-przepis-kroki">Kroki przygotowania (jeden krok w każdej linii)</label>
                            <textarea id="nowy-przepis-kroki" rows="6" placeholder="1. Obierz i pokrój warzywa...&#10;2. Podsmaż na oleju...&#10;3. ..." required></textarea>
                        </fieldset>

                        <p id="formularz-blad" class="blad" hidden></p>
                        <button type="submit">Zapisz danie i oceń zgodność</button>
                    </form>
                </section>
            </section>
        </section>
        <script src="script.js"></script>
        <script src="baza.js"></script>
    </body>
</html>