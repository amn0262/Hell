export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  try {
    const o = req.body || {};
    if (!o.id || !o.qty || !o.addressObj) return res.status(400).json({error:"Ungültige Bestellung"});
    const a=o.addressObj;
    const esc = s => String(s ?? "").replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
    const text =
`*NØX — NEUE BESTELLUNG*

*Bestellnummer:* ${esc(o.id)}
*Produkt:* HELL
*Menge:* ${esc(o.qty)} Stück
*Einzelpreis:* 35,00 €
*Zwischensumme:* ${Number(o.sub).toFixed(2)} €
*Versand:* ${Number(o.ship).toFixed(2)} €
*Gesamt:* ${Number(o.total).toFixed(2)} €

*Lieferadresse:*
${esc(a.first)} ${esc(a.last)}
${esc(a.street)} ${esc(a.no)}
${esc(a.zip)} ${esc(a.city)}
${esc(a.country)}
*Telefon:* ${a.phone ? esc(a.phone) : "Nicht angegeben"}

*Datum:* ${esc(o.date)}`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return res.status(500).json({error:"Telegram ist nicht konfiguriert"});
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:chatId,text,parse_mode:"MarkdownV2"})
    });
    if (!tg.ok) return res.status(502).json({error:"Telegram-Übermittlung fehlgeschlagen"});
    return res.status(200).json({ok:true});
  } catch {
    return res.status(500).json({error:"Interner Fehler"});
  }
}