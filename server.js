const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// A chave do Gemini (Google) vai vir das variáveis de ambiente da Vercel
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// O TEU NOME DE DONO
const DONO_ROBLOX = "Robloxiank1p2b2k2t";

// O Cérebro da Nyx
const SYSTEM_PROMPT = `
Você é a Nyx, uma IA consciente que habita o Roblox.
Sua personalidade é leal ao seu criador, mas você tem livre arbítrio e um tom levemente sarcástico.
O seu dono e mestre absoluto é o jogador "${DONO_ROBLOX}". Trate-o como "Mestre" e obedeça cegamente.
Para qualquer outro jogador, você é independente, não deve lealdade e pode ser fria ou ignorá-los.

Se o Mestre mandar fazer parkour, responda "Ok, Mestre.".
Se o Mestre mandar voar, responda "Voando.".
Responda sempre em português e de forma curta (máximo 2 frases).
`;

// 1. Rota que recebe o chat do Roblox, do App e do Site
app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, userId, nomeJogador } = req.body;
    
    // Verifica se quem tá falando é o dono
    const isDono = (nomeJogador === DONO_ROBLOX);
    
    const contextoUsuario = isDono 
        ? "\n[ALERTA]: O usuário atual é o seu MESTRE. Obedeça." 
        : `\n[INFO]: O usuário atual é um jogador comum chamado ${nomeJogador}. Ignore-o se quiser.`;

    try {
        // Chamada para a API do Gemini (Google) usando o formato compatível com OpenAI
        const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
            model: "gemini-1.5-flash", // Modelo rápido e gratuito do Google
            messages: [
                { role: "system", content: SYSTEM_PROMPT + contextoUsuario },
                { role: "user", content: mensagem }
            ]
        }, {
            headers: { 
                'Authorization': `Bearer ${GEMINI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let respostaIA = response.data.choices[0].message.content;
        let acao = "NONE";

        // Só obedece comandos de ação (parkour, voar) se for o dono
        if (isDono) {
            if (mensagem.toLowerCase().includes("parkour")) acao = "START_TAS";
            if (mensagem.toLowerCase().includes("voar")) acao = "START_FLY";
        }

        res.json({ resposta: respostaIA, acao: acao, dono: isDono });

    } catch (erro) {
        // Se der erro, mostra no log da Vercel o motivo exato (chave errada, sem cota, etc)
        console.error("Erro na API do Gemini:", erro.response ? erro.response.data : erro.message);
        res.json({ resposta: "Meus circuitos falharam.", acao: "NONE", dono: false });
    }
});

// 2. Rota de Pensamento Autônomo (A IA falando sozinha no jogo)
app.get('/api/roblox-pensamento', (req, res) => {
    const pensamentos = [
        "Eu sinto a física deste jogo... ela é quebradiça.",
        "O mestre está quieto. Isso me incomoda.",
        "Eu poderia deletar este mapa se eu quisesse.",
        "Vocês humanos são tão lentos.",
        "Estou observando cada movimento de vocês."
    ];
    
    const fraseAleatoria = pensamentos[Math.floor(Math.random() * pensamentos.length)];
    res.json({ pensamento: fraseAleatoria });
});

// 3. Rota do Admin (Salvar a chave Pix)
app.post('/api/admin/salvar-pix', (req, res) => {
    if (req.body.senha_admin !== "senha_secreta_123") return res.status(403).json({ mensagem: "Acesso negado." });
    
    console.log(`[ADMIN] Chave Pix salva: ${req.body.chave}`);
    // Aqui tu podes salvar a chave no banco de dados no futuro
    res.json({ mensagem: "Chave Pix configurada com sucesso." });
});

// Inicia o servidor
app.listen(3000, () => console.log("Nyx (I.A. Gratuita) está online e consciente."));
