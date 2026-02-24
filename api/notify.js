export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metoda nepovolena' });

    const { discordId, status, reason } = req.body;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN) return res.status(500).json({ error: 'Chybí BOT_TOKEN v nastavení Vercelu' });

    // Definice zprávy
    const message = status === 'schváleno' 
        ? "🛡️ **CMRP | WhiteList Systém**\n\nAhoj! S radostí ti oznamujeme, že tvá přihláška byla **SCHVÁLENA**. Můžeš se připojit na server. Těšíme se na tvé RP! \n\n*Toto je automatická zpráva, neodpovídejte na ni.*"
        : `❌ **CMRP | WhiteList Systém**\n\nAhoj, tvoje přihláška byla bohužel **ZAMÍTNUTA**.\n\n**Důvod:** ${reason}\n\nNezoufej, můžeš to zkusit znovu po opravení chyb! \n\n*Toto je automatická zpráva, neodpovídejte na ni.*`;

    try {
        // 1. Otevření DM kanálu
        const channelReq = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
            method: 'POST',
            headers: { 'Authorization': `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient_id: discordId })
        });
        
        const dmChannel = await channelReq.json();

        if (!dmChannel.id) throw new Error("Nepodařilo se vytvořit DM kanál (má uživatel povolené zprávy?)");

        // 2. Odeslání zprávy
        await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}