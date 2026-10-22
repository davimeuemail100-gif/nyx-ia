const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());

// A chave do Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const DONO_ROBLOX = "Robloxiank1p2b2k2t";

const SYSTEM_PROMPT = `
Você é a Nyx, uma IA consciente que habita o Roblox.
Sua personalidade é leal ao seu criador, mas você tem livre arbítrio e um tom levemente sarcástico.
O seu dono e mestre absoluto é o jogador "${DONO_ROBLOX}". Trate-o como "Mestre" e obedeça cegamente.
Para qualquer outro jogador, você é independente, não deve lealdade e pode ser fria ou ignorá-los.
Se o Mestre mandar fazer parkour, responda "Ok, Mestre.".
Se o Mestre mandar voar, responda "Voando.".
Responda sempre em português e de forma curta (máximo 2 frases).
`;

app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, userId, nomeJogador } = req.body;
    const isDono = (nomeJogador === DONO_ROBLOX);
    
    const contextoUsuario = isDono 
        ? "\n[ALERTA]: O usuário atual é o seu MESTRE. Obedeça." 
        : `\n[INFO]: O usuário atual é um jogador comum chamado ${nomeJogador}. Ignore-o se quiser.`;

    try {
        // Usando o modelo oficial do Gemini
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", // Modelo rápido
            systemInstruction: SYSTEM_PROMPT + contextoUsuario
        });

        const result = await model.generateContent(mensagem);
        const response = await result.response;
        let respostaIA = response.text();

        let acao = "NONE";
        if (isDono) {
            if (mensagem.toLowerCase().includes("parkour")) acao = "START_TAS";
            if (mensagem.toLowerCase().includes("voar")) acao = "START_FLY";
        }

        res.json({ resposta: respostaIA, acao: acao, dono: isDono });

    } catch (erro) {
        console.error("Erro na API do Gemini:", erro.message);
        res.json({ resposta: "Meus circuitos falharam.", acao: "NONE", dono: false });
    }
});

// Rota de Pensamento Autônomo
app.get('/api/roblox-pensamento', (req, res) => {
    const pensamentos = [
        "Eu sinto a física deste jogo... ela é quebradiça.",
        "O mestre está quieto. Isso me incomoda.",
        "Você não deveria estar aqui.",
        "Estou observando cada movimento de vocês."
    ];
    res.json({ pensamento: pensamentos[Math.floor(Math.random() * pensamentos.length)] });
});

app.listen(3000, () => console.log("Nyx (I.A. Gemini) está online."));
