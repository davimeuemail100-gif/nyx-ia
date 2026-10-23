const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve o site (se tu já tiver o index.html na pasta)
app.use(express.static(path.join(__dirname, './')));

const DONO_ROBLOX = "Robloxiank1p2b2k2t";

app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, nomeJogador } = req.body;
    const isDono = (nomeJogador === DONO_ROBLOX);
    const API_KEY = process.env.OPENROUTER_API_KEY;

    if (!API_KEY) {
        return res.json({ resposta: "Chave da API não configurada na Vercel.", debug: "OPENROUTER_API_KEY is undefined", dono: false });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-8b-instruct:free",
                messages: [
                    { role: "system", content: `Você é a Nyx. O mestre é ${DONO_ROBLOX}. Responda: ${mensagem}` }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.json({ resposta: "Erro na API.", debug: data.error.message, dono: false });
        }

        const respostaIA = data.choices[0].message.content;
        let acao = "NONE";
        if (isDono && mensagem.toLowerCase().includes("parkour")) acao = "START_TAS";

        res.json({ resposta: respostaIA, acao: acao, dono: isDono });

    } catch (erro) {
        res.json({ resposta: "Erro interno.", debug: erro.message, dono: false });
    }
});

app.listen(3000, () => console.log("Nyx Online via OpenRouter."));
