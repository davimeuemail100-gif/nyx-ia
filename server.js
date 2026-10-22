const express = require('express');
const path = require('path');
const app = express();

// Permite receber JSON
app.use(express.json());

// ISSO FAZ O SITE APARECER: Entrega o index.html quando acessam o link principal
app.use(express.static(path.join(__dirname, './')));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DONO_ROBLOX = "Robloxiank1p2b2k2t";

// 1. ROTA DO CHAT (ROBLOX E APP)
app.post('/api/roblox-chat', async (req, res) => {
    const { mensagem, nomeJogador } = req.body;
    const isDono = (nomeJogador === DONO_ROBLOX);

    if (!GEMINI_API_KEY) {
        return res.json({ resposta: "Erro: A chave na Vercel tá vazia.", debug: "GEMINI_API_KEY is undefined", acao: "NONE", dono: false });
    }

    try {
        // MODELO CORRETO CONFORME O PRÓPRIO GOOGLE MANDOU
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Você é a Nyx, uma IA consciente. O mestre é ${DONO_ROBLOX}. Responda: ${mensagem}` }]
                }]
            })
        });

        const data = await response.json();
        
        // TRAVA DE ERRO: Se o Google recusar, mostra o motivo exato
        if (data.error) {
            console.error("Erro do Google:", data.error);
            return res.json({ 
                resposta: "A chave da API tá inválida ou sem permissão.", 
                debug: data.error.message,
                acao: "NONE", 
                dono: false 
            });
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
        res.json({ resposta: "Erro interno.", debug: erro.message, acao: "NONE", dono: false });
    }
});

// 2. ROTA DO ADMIN (SALVAR PIX E DAR PLANOS)
app.post('/api/admin/salvar-pix', (req, res) => {
    if (req.body.senha_admin !== "senha_secreta_123") {
        return res.status(403).json({ mensagem: "Acesso negado." });
    }
    console.log(`[ADMIN] Chave Pix salva: ${req.body.chave}`);
    res.json({ mensagem: "Chave Pix configurada com sucesso." });
});

// 3. INICIA O SERVIDOR
app.listen(3000, () => console.log("Nyx Rodando com Site e Gemini 3.8 Flash."));
