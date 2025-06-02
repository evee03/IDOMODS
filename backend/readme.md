## Opis

Backend dla IDOMODS

## Funkcje

- Pobieranie zamówień z API idoSell
- Automatyczna synchronizacja danych (cron jobs)
- Uwierzytelnianie podstawowe (Basic Auth)
- API endpoints do zarządzania zamówieniami
- Obsługa zmiennych środowiskowych

## Jak zainstalowac?

1. Sklonuj repozytorium i przejdź do backendu:
```bash
git clone [url-repozytorium]
cd backend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Utwórz plik `.env` w katalogu backend i uzupełnij go według env.example:
```env
IDOSELL_DOMAIN=your-domain.idosell.com
IDOSELL_API_KEY=your-api-key
PORT=3000
```

4. Aby uruchomić wpisz polecenie:
```bash
npm start
```
