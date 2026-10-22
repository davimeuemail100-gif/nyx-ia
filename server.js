const express = require('express');
const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DONO_ROBLOX = "Robloxiank1p2b2k2t";

app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, nomeJogador } = req.body;
    const isDono = (nomeJogador === DONO_ROBLOX);

    try {
        // Chamada bruta via fetch pro endpoint do Gemini
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        // AQUI ESTAVA O ERRO: Faltava o "await fetch" antes das chaves!
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Você é a Nyx, uma IA. O mestre é ${DONO_ROBLOX}. Responda: ${mensagem}` }]
                }]
            })
        });

        const data = await response.json();
        
        // Se o Google retornar erro, a gente joga o erro no log
        if (!response.ok) {
            console.error("Erro do Google:", JSON.stringify(data));
            return res.json({ resposta: "Meus circuitos falharam.", acao: "NONE", dono: false });
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
        res.json({ resposta: "Meus circuitos falharam.", acao: "NONE", dono: false });
    }
});

app.listen(3000, () => console.log("Nyx Rodando."));
