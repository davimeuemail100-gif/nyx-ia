const express = require('express');
const path = require('path');
const app = express();

// Faz o Express entender JSON
app.use(express.json());

// 1. FAZ O SITE APARECER (O INDEX.HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DONO_ROBLOX = "Robloxiank1p2b2k2t";

// 2. A ROTA DO CHAT DO ROBLOX
app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, nomeJogador } = req.body;
    const isDono = (nomeJogador === DONO_ROBLOX);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Você é a Nyx. O mestre é ${DONO_ROBLOX}. Responda: ${mensagem}` }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("Erro do Google:", data.error);
            return res.json({ resposta: "Erro na API.", debug: data.error.message, acao: "NONE", dono: false });
        }

        const respostaIA = data.candidates[0].content.parts[0].text;
        
        let acao = "NONE";
        if (isDono) {
            if (mensagem.toLowerCase().includes("parkour")) acao = "START_TAS";
            if (mensagem.toLowerCase().includes("voar")) acao = "START_FLY";
        }

        res.json({ resposta: respostaIA, acao: acao, dono: isDono });

    } catch (erro) {
        console.error("Erro bruto:", erro.message);
        res.json({ resposta: "Erro interno.", debug: erro.message, acao: "NONE", dono: false });
    }
});

// 3. INICIA O SERVIDOR
app.listen(3000, () => console.log("Nyx online com Site e API."));
