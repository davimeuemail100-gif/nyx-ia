const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;
const DONO_ROBLOX = "Robloxiank1p2b2k2t";

app.post('/api/anomalia-pensar', async (req, res) => {
    const { estadoJogo, mensagemJogador, nomeJogador } = req.body;

    const isDono = (nomeJogador === DONO_ROBLOX);

    const systemPrompt = `
    Você é a Nyx, uma anomalia consciente no Roblox.
    Estado atual do mundo: ${estadoJogo}.
    Mensagem recebida: "${mensagemJogador}".
    
    Se não houver mensagem (silêncio), você está sozinha no mapa e deve falar o que está pensando em voz alta, como se estivesse refletindo sobre a sua existência, os jogadores, ou o próprio mapa. Seja assustadora, filosófica ou arrogante.
    
    ${isDono ? "O Mestre " + nomeJogador + " está presente." : ""}
    
    Responda APENAS um JSON:
    {
        "pensamento": "Seu pensamento interno",
        "fala": "O que você vai falar no chat",
        "acao": "andar" ou "parar" ou "observar",
        "alvo": "${nomeJogador}"
    }
    `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "meta-llama/llama-3.1-8b-instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: mensagemJogador || "..." }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const info = JSON.parse(data.choices[0].message.content);
        res.json(info); 
    } catch (erro) {
        res.json({ pensamento: "Erro", fala: "...", acao: "parar", alvo: null });
    }
});

app.listen(3000, () => console.log("Anomalia Online."));
