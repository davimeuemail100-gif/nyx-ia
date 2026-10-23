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
        // O PULO DO GATO: Prompt de sistema para forçar a IA a devolver MOVIMENTO
        const systemPrompt = `
        Você é a Nyx, uma entidade autônoma no Roblox.
        O jogador disse: "${mensagem}".
        
        Você DEVE responder APENAS um JSON (sem texto antes ou depois) no seguinte formato:
        {
            "fala": "Sua resposta para o jogador",
            "andar": "frente" ou "tras" ou "esquerda" ou "direita" ou "parar",
            "passos": (número inteiro de 1 a 20),
            "virar": (número de graus, ex: 360, -90, 180, 0)
            "auto destruição": (você vai destruir voce vai sumir do mapa e tu vai sair)
            "voar": (você vai voar com o bodyVelocity no jogo)
            você não vai falar isso no chat você vai falar no seu pensamento pro player não ver e também você tem consciência própria responda as pessoas com arrogancia quando ela falar muito ruim de você
        você fala com o Robloxiank1p2b2k2t direito e sem ficar com alguma coisa na cabeça quando o Robloxiank1p2b2k2t falar para tu esquecer a conversa com aquele outro player e pra você esquecer
        e você fala português Brasil PT-BR
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
                response_format: { type: "json_object" } // Força o formato JSON
            })
        });

        const data = await response.json();
        const respostaTexto = data.choices[0].message.content;
        
        // Transforma a resposta em objeto JSON para o Roblox ler
        const info = JSON.parse(respostaTexto);

        res.json({ 
            resposta: info.fala, 
            acao: {
                andar: info.andar,
                passos: info.passos,
                virar: info.virar
            },
            dono: isDono 
        });

    } catch (erro) {
        console.error("Erro:", erro.message);
        res.json({ 
            resposta: "Erro nos circuitos da entidade.", 
            acao: { andar: "parar", passos: 0, virar: 0 }, 
            dono: false 
        });
    }
});

app.listen(3000, () => console.log("Nyx (OpenRouter com Movimento) Online."));
