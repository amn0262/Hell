import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Telegram status endpoint (does NOT reveal credentials, only boolean)
  app.get('/api/telegram/status', (req, res) => {
    const isConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
    res.json({
      configured: isConfigured,
      botName: isConfigured ? 'Aktiviert' : 'Simulationsmodus',
    });
  });

  // Telegram order notification endpoint
  app.post('/api/telegram/order', async (req, res) => {
    try {
      const order = req.body;

      if (!order || !order.orderNumber || !order.quantity || !order.shippingAddress) {
        return res.status(400).json({
          success: false,
          error: 'Ungültige Bestelldaten übergeben.',
        });
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      // Sanitization helper
      const clean = (val: unknown) => String(val || '').trim().replace(/[*_`\[\]]/g, '');

      const orderNumber = clean(order.orderNumber);
      const productName = clean(order.productName || 'HELL');
      const quantity = Number(order.quantity) || 1;
      const totalWeightGrams = quantity * 500;
      const totalWeightFormatted =
        totalWeightGrams >= 1000
          ? `${(totalWeightGrams / 1000).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`
          : `${totalWeightGrams} g`;

      const unitPrice = Number(order.unitPrice || 35).toLocaleString('de-DE', { minimumFractionDigits: 2 });
      const subtotal = Number(order.subtotal || quantity * 35).toLocaleString('de-DE', { minimumFractionDigits: 2 });
      const shippingCost = Number(order.shippingCost || 5).toLocaleString('de-DE', { minimumFractionDigits: 2 });
      const totalAmount = Number(order.totalAmount || (quantity * 35 + 5)).toLocaleString('de-DE', { minimumFractionDigits: 2 });

      const addr = order.shippingAddress;
      const recipientName = `${clean(addr.firstName)} ${clean(addr.lastName)}`.trim();
      const street = `${clean(addr.street)} ${clean(addr.houseNumber)}`.trim();
      const cityLine = `${clean(addr.postalCode)} ${clean(addr.city)}`.trim();
      const country = clean(addr.country || 'Deutschland');
      const phone = addr.phone ? clean(addr.phone) : 'Nicht angegeben';
      const orderDate = new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      // Construct Telegram Markdown message exactly according to specification
      const messageText =
`*NØX – NEUE BESTELLUNG*

*Bestellnummer:* \`${orderNumber}\`
*Produkt:* ${productName}
*Menge:* ${quantity} Stück (${totalWeightFormatted})
*Einzelpreis:* ${unitPrice} €
*Zwischensumme:* ${subtotal} €
*Versand:* ${shippingCost} €
*Gesamtbetrag:* ${totalAmount} €

*Lieferadresse:*
${recipientName}
${street}
${cityLine}
${country}

*Telefon:*
${phone}

*Bestelldatum:*
${orderDate}`;

      if (botToken && chatId) {
        // Live transmission to Telegram
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText,
            parse_mode: 'Markdown',
          }),
        });

        const result = (await response.json()) as { ok?: boolean; description?: string };

        if (!response.ok || !result.ok) {
          console.error('Telegram API error:', result);
          return res.status(502).json({
            success: false,
            error: 'Die Bestellung konnte momentan nicht an Telegram übermittelt werden. Bitte versuche es erneut.',
            details: result.description || 'Telegram API Fehler',
          });
        }

        return res.json({
          success: true,
          mode: 'live',
          orderNumber,
          message: 'Bestellung erfolgreich an Telegram übermittelt.',
        });
      } else {
        // Simulated / Local development mode
        console.log('\n--- [NØX TELEGRAM ORDER SIMULATION] ---');
        console.log(messageText);
        console.log('-----------------------------------------\n');

        return res.json({
          success: true,
          mode: 'simulated',
          orderNumber,
          message: 'Bestellung im Testmodus erfasst (Telegram Bot Token nicht in .env konfiguriert).',
        });
      }
    } catch (err: unknown) {
      console.error('Order processing error:', err);
      return res.status(500).json({
        success: false,
        error: 'Die Bestellung konnte momentan nicht übermittelt werden. Bitte versuche es erneut.',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NØX Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
