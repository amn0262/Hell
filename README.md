# NØX — HELL

Mobile-first Local-First Shop für ein Produkt.

## Start
Die Dateien können statisch geöffnet werden. Für echte Telegram-Bestellungen muss `/api/order` auf einer Serverless-Plattform bereitgestellt werden.

## Telegram
Setze serverseitig:
- `TELEGRAM_BOT_TOKEN` = NEUER Token
- `TELEGRAM_CHAT_ID` = `1117141728`

**Wichtig:** Der bisher im Chat geteilte Bot-Token sollte über BotFather widerrufen und ersetzt werden. Niemals den Token in `index.html` oder `js/app.js` eintragen.

## Vercel
Ordner als Projekt deployen. `api/order.js` wird als Serverless Function erkannt.
