export default async function handler(req, res) {
    const { discordId, status, reason } = req.body;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    const message = status === 'schváleno' 
        ? "🛡️ **CMRP | WhiteList**\n\nTvá přihláška byla **SCHVÁLENA**! Vítej na serveru."
        : `❌ **CMRP | WhiteList**\n\nTvá přihláška byla **ZAMÍTNUTA**.\n**Důvod:** ${reason}`;

    try {
        const response = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
            headers: { 'Authorization': `Bot ${BOT_TOKEN}` }
        });
        const user = await response.json();

        const channel = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
            method: 'POST',
            headers: { 'Authorization': `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient_id: discordId })
        }).then(r => r.json());

        const send = await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
        });

        if (send.ok) return res.status(200).json({ success: true });
        else return res.status(500).json({ error: "Nepodařilo se odeslat zprávu." });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}