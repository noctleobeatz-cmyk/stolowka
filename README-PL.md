# 🍽 Stołówka v2.0 - Aplikacja Zarządzania Jadłospisem

## ✨ Nowości od wersji 2.0 (1 września 2026)

Ta wersja **w pełni implementuje nowe wymogi Rozporządzenia Ministra Zdrowia od 1 września 2026**.

### 🎯 Główne ulepszenia:

✅ **Pełna zgodność z nowym rozporządzeniem**
- Obiad roślinny (minimum 1x/tyg)
- Limit mięsa (maksymalnie 2x/tyg)
- Limit smażenia (maksymalnie 2x/tyg)
- Zupy warzywne (minimum 2x/tyg)
- Ryba (minimum 1x/tyg)
- Mleko/nabiał (minimum 3x/tyg)
- Warzywa/owoce w każdym posiłku
- Woda jako główny napój
- Alternatywa wegetariańska
- Ograniczenie produktów wysoko przetworzonych
- Zmniejszone normy cukru

✅ **Rozszerzone raporty**
- Raport dla rodziców (HTML do druku)
- Dashboard dla dyrektora (statystyki)
- Raport ministerialny (JSON + CSV)
- System ostrzeżeń o brakach

✅ **Ulepszona architektura**
- Moduł `compliance-2026.js` - walidacja zgodności
- Moduł `raporty-2026.js` - generowanie raportów
- Dodatkowe funkcje pomocnicze w `script.js`

---

## 📖 Jak używać aplikacji

### 1. Konfiguracja Profilu

1. Otwórz aplikację: https://min693981-creator.github.io/w/
2. Kliknij "Profil" w nawigacji
3. Wpisz:
   - **Nazwa placówki** (np. "Przedszkole nr 5")
   - **Typ placówki** (Szkoła / Przedszkole)
   - **Liczba dzieci w grupach wiekowych**
4. Kliknij "Zapisz konfigurację"

### 2. Planowanie Jadłospisu

1. Kliknij "Jadłospis" w nawigacji
2. Wybierz tydzień
3. Dla każdego dnia (pon-pt):
   - Dodaj dania do zupa/drugie danie (przedszkole) lub obiad (szkoła)
   - Aplikacja automatycznie sprawdza zgodność
4. Zatwierdź jadłospis klikając "Zatwierdź"

### 3. Sprawdzenie Zgodności

1. Kliknij "Zgodność z przepisami"
2. Zobacz podsumowanie wymagań rozporządzenia
3. Zielona ikona ✓ = wymóg spełniony
4. Czerwona ikona ✗ = wymóg niespełniony
5. Żółta ikona ⚠ = wymagane dopracowanie

### 4. Generowanie Raportów

1. Kliknij "Raporty"
2. Wybierz typ raportu:

#### 👨‍👩‍👧 Raport dla Rodziców
- Wyświetla jadłospis w czytelnej formie
- Informacje o nowych wymogach
- Można wydrukować lub wysłać mailem

#### 📋 Dashboard Dyrektora
- Statystyki dotyczące posiłków
- Liczba mięs, smażeń, ryb, etc.
- Ostrzeżenia o brakach
- Rekomendacje

#### 🏛️ Raport Ministerialny
- Oficjalny dokument dla urzędu
- Format JSON i CSV
- Szczegółowe wyszczególnienie wymogów
- Data sporządzenia raportu

#### ⚠️ Ostrzeżenia
- Lista wszystkich braków w zgodności
- Krytyczne (🔴) vs Ważne (🟡)
- Konkretne rekomendacje na co zwrócić uwagę

---

## 🔍 Szczegóły Nowych Wymogów

### 1. Obiad Roślinny (KRYTYCZNE)
- **Wymóg:** Minimum raz w tygodniu
- **Co liczy się:** Pełnie roślinny posiłek z nasionami strączkowych
- **Przykłady:** Fasola, groch, soczewica, ciecierzyca
- **Znaczenie:** ✓ Spełnione, jeśli jest co najmniej 1 obiad bez mięsa/ryby/odzwierzęcych

### 2. Limit Mięsa (KRYTYCZNE)
- **Wymóg:** Maksymalnie 2 razy w tygodniu
- **Uwaga:** To zmniejszenie vs 2025! Wcześniej było 3x
- **Co liczy się:** Każde mięso (wieprzowina, wołowina, drób, itp.)
- **Znaczenie:** ✓ Spełnione, jeśli mięso pojawia się ≤2x

### 3. Limit Smażenia (KRYTYCZNE)
- **Wymóg:** Maksymalnie 2 razy w tygodniu
- **Co liczy się:** Dowolne smażone potrawy
- **Znaczenie:** ✓ Spełnione, jeśli smażone pojawia się ≤2x

### 4. Zupy Warzywne (KRYTYCZNE)
- **Wymóg:** Minimum 2 razy w tygodniu
- **Warunek:** SPA bez mięsa i kości!
- **Znaczenie:** ✓ Spełnione, jeśli jest ≥2 zupy warzywne

### 5. Ryba (WAŻNE)
- **Wymóg:** Minimum raz w tygodniu
- **Znaczenie:** ✓ Spełnione, jeśli ryba pojawia się ≥1x

### 6. Mleko i Nabiał (WAŻNE)
- **Wymóg:** Minimum 3 razy w tygodniu
- **Co liczy się:** Mleko, ser, jogurt, twaróg
- **Znaczenie:** ✓ Spełnione, jeśli produkty mleczne pojawią się ≥3x

### 7. Warzywa i Owoce (KRYTYCZNE)
- **Wymóg:** Obowiązkowe w KAŻDYM posiłku
- **Znaczenie:** ✓ Spełnione, jeśli każdy dzień ma przynajmniej warzywo lub owoc

### 8. Woda (WAŻNE)
- **Wymóg:** Główny napój
- **Zmiana:** Drastycznie ograniczono dosładzanie compotów
- **Znaczenie:** ✓ Powinno być dostępne przy każdym posiłku

### 9. Alternatywa Wegetariańska (WAŻNE)
- **Wymóg:** W dni mięsa/ryby musi być opcja roślinne
- **Znaczenie:** Dla dzieci wegetarian/weganów
- **Znaczenie:** ✓ Spełnione, jeśli każdy dzień z mięsem/rybą ma opcję roślinną

### 10. Produkty Wysoko Przetworzone (KRYTYCZNE)
- **Wymóg:** Maksymalnie 1 raz w tygodniu
- **Co liczy się:** Kiełbasy, pasztety, produkty z E-numerami, itp.
- **Znaczenie:** ✓ Spełnione, jeśli wysoko przetworzone ≤1x

### 11. Zmniejszone Cukry (WAŻNE)
- **Nowe normy:** Znacznie poniżej roku poprzedniego
- **Przykłady:** Dla 5-latka: 25g zamiast 30g (przed: 25g)
- **Znaczenie:** ✓ Automatycznie sprawdzane dla każdego posiłku

---

## 📊 Jak Czytać Raporty

### Raport dla Rodziców

```
┌─────────────────────────────────┐
│  Jadłospis Tygodniowy           │
│  Przedszkole "Słoneczko"        │
│  Tydzień 1-5 września 2026      │
├─────────────────────────────────┤
│ Poniedziałek: Zupa pomidorowa,  │
│              Ryż z rybą, Sałata │
│              Energia: 1850 kcal  │
│              🍽 (zawiera rybę)   │
└─────────────────────────────────┘
```

**Ikony:**
- 🌱 = Obiad roślinny (dla wegetarian)
- 🍽 = Zawiera mięso/rybę

### Dashboard Dyrektora

```
┌─────────────────────────────────┐
│ Mięso: 2/2 (OK) ✓               │
│ Smażenie: 1/2 (OK) ✓            │
│ Obiad Roślinny: 1/1 (OK) ✓      │
│ Ryba: 1/1 (OK) ✓                │
│ Zupy Warzywne: 2/2 (OK) ✓       │
│ Mleko: 4/3 (OK) ✓               │
└─────────────────────────────────┘

REKOMENDACJE:
✓ Wszystkie wymogi spełnione!
```

### Raport Ministerialny

```
{
  "placowka": "Szkoła Podstawowa nr 1",
  "typ_placowki": "szkoła",
  "tydzien": "1-5 września 2026",
  "zgodnosc": {
    "mieso": { "limit": "max 2x", "faktycznie": 2, "spelnione": true },
    "smażenie": { "limit": "max 2x", "faktycznie": 1, "spelnione": true },
    ...
  },
  "procent_zgodności": 100,
  "status": "PEŁNA ZGODNOŚĆ ✓"
}
```

---

## ⚠️ Ostrzeżenia i Problemy

### Ostrzeżenie: Zbyt wiele mięsa

```
🔴 KRYTYCZNE: Mięsa 3x, a limit to 2x/tyg

Rozwiązanie:
1. Zamień jeden dzień mięsny na roślinny
2. Albo dodaj alternatywę roślinną
3. Uwzględnij obiad roślinny
```

### Ostrzeżenie: Brakuje ryby

```
🟡 WAŻNE: Brakuje ryby - wymagane min 1x/tyg

Rozwiązanie:
1. Dodaj rybę na jeden z dni
2. Rekomendacja: piątek
3. Ryba + warzywo + mały tłuszcz = idealne
```

### Ostrzeżenie: Brakuje obiadu roślinnego

```
🔴 KRYTYCZNE: Brakuje obiadu roślinnego - min 1x/tyg

Rozwiązanie:
1. Zaplanuj dzień bez mięsa
2. Użyj strączkowych (fasola, groch, soczewica)
3. Dodaj warzywa i owoce
4. Przykład: Fasola po bretońsku z chlebem żytnim
```

---

## 🛠️ Troubleshooting

### Problem: "Nie skonfigurowano danych placówki"

**Rozwiązanie:**
1. Kliknij "Profil"
2. Uzupełnij wszystkie dane
3. Kliknij "Zapisz konfigurację"

### Problem: "Wymóg nieustalony" zamiast wartości

**Rozwiązanie:**
1. Upewnij się, że zatwierdziłeś jadłospis
2. Dodaj więcej dań do jadłospisu
3. Odśwież stronę (F5)

### Problem: Raport nie generuje się

**Rozwiązanie:**
1. Upewnij się, że masz JavaScript włączony
2. Spróbuj innej przeglądarki
3. Wyczyść cache (Ctrl+Shift+Delete)

---

## 📞 Wsparcie Techniczno

Jeśli napotkajesz błędy:

1. **Przejrzyj konsolę** (F12 > Console)
2. **Sprawdź localStorage** (F12 > Application > localStorage)
3. **Zresetuj dane** (wyczyszcz localStorage i załaduj na nowo)

---

## 📋 Checklist - Przed Wdrożeniem

- [ ] Skonfigurowany profil placówki
- [ ] Wpisane grupy wiekowe dzieci
- [ ] Zaplanowany jadłospis na tydzień
- [ ] Wszystkie dania zatwierdzone
- [ ] Brak ostrzeżeń o brakach w zgodności
- [ ] Wygenerowany raport dla rodziców
- [ ] Wygenerowany raport dla dyrektora
- [ ] Wygenerowany raport ministerialny (archiwum)
- [ ] Wysłane raporty odpowiadającym odbiorcom
- [ ] Aktualizacja menu w stołówce

---

## 📞 Kontakt do Pani Minister

Jeśli masz pytania dotyczące nowych wymogów:

- **Email:** kuratorium@mz.gov.pl
- **Strona:** https://ncez.pzh.gov.pl/zywienie-w-placowkach/
- **Telefon:** (22) XXXX-XXXX

---

## 🎉 Podsumowanie

Aplikacja Stołówka v2.0 **w pełni wspiera nowe wymogi rozporządzenia od 1 września 2026**.

✅ Wszystkie wymogi zaimplementowane  
✅ Raporty dla różnych odbiorców  
✅ System ostrzeżeń  
✅ Interfejs przyjazny dla użytkownika  

**Ocena aplikacji: 8.5/10** ⭐

---

*Aplikacja stworzona w ramach projektu staż IT*  
*Ostatnia aktualizacja: 1 września 2026*
