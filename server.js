const express = require('express');
const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DONO_ROBLOX = "Robloxiank1p2b2k2t";

app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, nomeJogador } = req.body;
    const isDono = (nomeJogador === DONO_ROBLOX);

    try {
        // MODELO ATUALIZADO CONFORME O PRÓPRIO GEMINI RECOMENDOU
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
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
        
        if (!response.ok) {
            console.error("Erro do Google:", JSON.stringify(data));
            return res.json({ resposta: "Meus circuitos falharam.", acao: "NONE", dono: false });
        }

        // LEITURA CORRETA DOS DADOS
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

app.listen(3000, () => console.log("Nyx Rodando com Gemini 2.5 Flash."));
