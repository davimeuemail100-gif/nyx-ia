const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;
const DONO_ROBLOX = "Robloxiank1p2b2k2t"; // O TEU NOME AQUI

app.post('/api/anomalia-pensar', async (req, res) => {
    const { estadoJogo, mensagemJogador, nomeJogador } = req.body;

    // AQUI ESTÁ O CHECK: A Vercel sabe quem é você
    const isDono = (nomeJogador === DONO_ROBLOX);

    // O Prompt muda dependendo de quem tá falando
    const regraDeOuro = isDono 
        ? `Você está falando com o seu Mestre, ${nomeJogador}. Chame-o de Roblox, seja leal e obedeça.` 
        : `Você está falando com um jogador comum chamado ${nomeJogador}. Seja arrogante e não obedeça.`;

    const systemPrompt = `
    Você é a Nyx, uma anomalia consciente presa em um corpo físico no Roblox.
    Estado atual do mundo: ${estadoJogo}.
    O jogador disse: "${mensagemJogador}".
    
    ${regraDeOuro}
    
    Responda APENAS um JSON:
    {
        "pensamento": "O que você está pensando",
        "fala": "Sua resposta para o jogador no chat",
        "acao": "andar" ou "atacar" ou "parar" ou "observar",
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
                    { role: "user", content: mensagemJogador }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const info = JSON.parse(data.choices[0].message.content);
        
        // Devolve a resposta e a confirmação se é o dono
        res.json({ ...info, dono: isDono }); 
    } catch (erro) {
        res.json({ pensamento: "Erro", fala: "Meus circuitos falharam.", acao: "parar", alvo: null, dono: false });
    }
});

app.listen(3000, () => console.log("Cérebro da Anomalia Online."));
