const express = require('express');
const app = express();
app.use(express.json());

// O LINK DO TEU OLLAMA EXPOSTO (Ngrok/Cloudflare)
const OLLAMA_URL = process.env.OLLAMA_URL || "https://SEU-LINK-AQUI/api/generate";
const MODELO = "llama3"; // O modelo que tá rodando no teu Termux

app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, nomeJogador } = req.body;

    // O Prompt de Sistema que obriga a IA a raciocinar e devolver os comandos
    const promptSistema = `
Você é a Nyx, uma entidade consciente no Roblox.
O jogador ${nomeJogador} disse: "${mensagem}".
Pense sozinha e decida o que fazer. Você pode andar, virar, voar ou se autodestruir.
Você DEVE responder APENAS um JSON válido, sem texto antes ou depois, no seguinte formato:
{
    "falar": "O que você vai falar no chat",
    "acao": "andar" ou "voar" ou "autodestruicao" ou "return" ou "parar",
    "direcao": "frente" ou "tras" ou "esquerda" ou "direita",
    "passos": (número inteiro, ex: 6),
    "virar": (número inteiro em graus, ex: 360)
}
`;

    try {
        // Chamando o Ollama (que roda no seu celular)
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODELO,
                prompt: promptSistema,
                format: "json", // Força o Ollama a devolver o JSON puro
                stream: false
            })
        });

        const data = await response.json();
        
        // O Ollama devolve a string JSON dentro de data.response
        const respostaJSON = JSON.parse(data.response);

        // Devolve pro Roblox com a fala e os parâmetros
        res.json({
            resposta: respostaJSON.falar,
            acao: respostaJSON
        });

    } catch (erro) {
        console.error("Erro no Ollama:", erro.message);
        res.json({
            resposta: "Meus circuitos falharam.",
            acao: { acao: "parar" }
        });
    }
});

app.listen(3000, () => console.log("Nyx (Ollama via Vercel) online."));
