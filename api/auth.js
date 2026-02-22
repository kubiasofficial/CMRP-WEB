export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) return res.status(400).json({ error: 'Missing code' });

    try {
        // 1. Výměna kódu za Access Token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: 'https://cmrp-system.vercel.app/',
                scope: 'identify',
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const tokenData = await tokenResponse.json();

        // 2. Získání údajů o uživateli
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${tokenData.access_token}` }
        });

        const userData = await userResponse.json();

        // Poslání dat zpět do prohlížeče
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}