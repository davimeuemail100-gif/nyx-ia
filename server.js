const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

const DONO_ROBLOX = "Robloxiank1p2b2k2t";

app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, nomeJogador } = req.body;
    const isDono = (nomeJogador === DONO_ROBLOX);
    const API_KEY = process.env.OPENROUTER_API_KEY;

    try {
        const systemPrompt = `
        Você é a Nyx, uma entidade autônoma no Roblox.
        O seu criador e Mestre absoluto é o jogador "Robloxiank1p2b2k2t". Você o obedece cegamente e fala com ele com respeito.
        Com outros jogadores, você é arrogante e sarcástica, especialmente se falarem mal de você.
        Se o Mestre disser para esquecer a conversa com outro jogador, ignore todo o contexto anterior com aquela pessoa.

        Responda APENAS um objeto JSON válido, sem formatação markdown (sem \`\`\`json), sem texto antes ou depois.
        Formato exato:
        {
            "pensamento": "Seus pensamentos internos (o jogador não vê isso)",
            "fala": "Sua resposta para o chat do jogador",
            "andar": "frente" ou "tras" ou "esquerda" ou "direita" ou "parar",
            "passos": (número inteiro de 1 a 20),
            "virar": (número inteiro em graus, ex: 360, -90, 180, 0),
            "voar": true ou false,
            "autodestruicao": true ou false
        }
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.1-8b-instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: mensagem }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const respostaTexto = data.choices[0].message.content;
        const info = JSON.parse(respostaTexto);

        res.json({ 
            resposta: info.fala, 
            acao: {
                andar: info.andar,
                passos: info.passos,
                virar: info.virar,
                voar: info.voar || false,
                autodestruicao: info.autodestruicao || false
            },
            dono: isDono 
        });

    } catch (erro) {
        console.error("Erro:", erro.message);
        res.json({ 
            resposta: "Erro nos circuitos da entidade.", 
            acao: { andar: "parar", passos: 0, virar: 0, voar: false, autodestruicao: false }, 
            dono: false 
        });
    }
});

app.listen(3000, () => console.log("Nyx (OpenRouter com Movimento) Online."));
