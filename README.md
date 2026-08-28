# 🍽 Stołówka

Aplikacja do planowania posiłków w szkołach i przedszkolach: liczy
zapotrzebowanie kaloryczne dzieci, prowadzi bazę dań i produktów z
automatyczną oceną zgodności z rozporządzeniem Ministra Zdrowia
(obowiązuje od 1 września 2026), układa jadłospis, prowadzi dziennik i
raporty.

Działa w całości w przeglądarce — bez własnego serwera i bez bazy
danych — dzięki czemu można ją hostować za darmo na GitHub Pages.

> (Automated rebuild trigger: minor README whitespace update)

## Jak zacząć

1. Otwórz stronę **Profil** i wybierz typ placówki:
   - **Szkoła** — tylko obiad.
   - **Przedszkole** — I śniadanie, II śniadanie, zupa, drugie danie,
     podwieczorek.
2. Podaj nazwę placówki i liczbę dzieci w poszczególnych grupach
   wiekowych.
3. Wejdź w **Jadłospis** i dodawaj dania z bazy na kolejne dni tygodnia
   (albo przejdź przez **Dziś**, żeby zaplanować jeden dzień).
4. Zatwierdzaj dni w zakładce **Dziś** — dopiero zatwierdzone dni
    liczą się do zgodności z rozporządzeniem, dziennika i raportów.
5. Zakładka **Zgodność z przepisami** pokazuje, czy tygodniowy
    jadłospis spełnia obowiązkowe zasady (m.in. dania roślinne, limit
    mięsa i smażenia, ryba, warzywa/owoce do każdego posiłku).

## Dodawanie własnych dań

W **Bazie dań** można dodać własne danie: podajesz nazwę, rodzaj
posiłku, składniki (z gramaturą) i przepis krok po kroku — dokładnie
tak samo, jak wyglądają gotowe dania w bazie. Wartości odżywcze i
ocena zgodności z rozporządzeniem liczą się automatycznie na
podstawie składników.

## Uruchomienie lokalnie

Przeglądarki blokują wczytywanie plików JSON bezpośrednio z dysku
(`file://`), więc potrzebny jest dowolny lokalny serwer HTTP:

```bash
python3 -m http.server 8000
```

i otworzyć `http://localhost:8000/home.html`.

## Wdrożenie na GitHub Pages

1. Utwórz repozytorium na GitHub i wgraj do niego całą zawartość tego
   folderu (pliki mają leżeć w głównym katalogu repo, obok
   `index.html`).
2. W repozytorium: **Settings → Pages → Build and deployment → Source:
   Deploy from a branch**, branch **main**, folder **/ (root)** →
   **Save**.
3. Po chwili GitHub poda publiczny adres, np.
   `https://<nazwa-użytkownika>.github.io/<nazwa-repo>/` — otwiera się
   od razu na stronie „Dziś” (`index.html` przekierowuje na
   `home.html`).

## Struktura projektu

```
index.html      punkt wejścia dla GitHub Pages (przekierowuje na home.html)
404.html        strona błędu 404
home.html       "Dziś" - plan posiłków na dany dzień
jadlospis.html  jadłospis tygodniowy (szkolny lub przedszkolny)
profil.html     dane placówki, typ placówki, grupy wiekowe
baza.html       baza dań i produktów, dodawanie własnych
przepisy.html   zgodność z rozporządzeniem Ministra Zdrowia
raporty.html    raporty i eksport
dziennik.html   historia zatwierdzonych dni
style.css       style całej aplikacji
script.js       wspólne funkcje (daty, localStorage, normy wiekowe)
*.js            logika poszczególnych stron
normy.json      baza dań (składniki, wartości odżywcze, przepisy, ocena zgodności)
produkty.json   baza produktów (wartości odżywcze na 100 g, alergeny)
```

## Ograniczenia

- Dane (konfiguracja, jadłospis, dziennik, własne dania) są zapisane
  lokalnie w przeglądarce danej osoby - nie ma współdzielonej bazy
  między kilkoma urządzeniami. Wyczyszczenie danych przeglądarki albo
  tryb prywatny usuwa wszystko.
- Przepisy do dań są generowane automatycznie na podstawie składników
  (albo wpisane ręcznie przy dodawaniu własnego dania) i warto je
  traktować jako punkt wyjścia, a nie gotową, zweryfikowaną recepturę
  kuchenną.

## Licencja

MIT - patrz plik `LICENSE`.
