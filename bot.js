"use strict";

const noblox = require("noblox.js");

// Puxa a chave do cofre de variáveis (Secrets) do Replit
const ROBLOX_COOKIE = process.env.COOKIE_CHAVE_BOT;
const PLACE_ID = Number(process.env.PLACE_ID);

async function main() {
    if (!ROBLOX_COOKIE) return console.error("[Bot] ERRO: Falta a variável COOKIE_CHAVE_BOT nos Secrets!");
    if (!PLACE_ID) return console.error("[Bot] ERRO: Falta a variável PLACE_ID nos Secrets!");

    try {
        // 1. Loga na conta
        const user = await noblox.setCookie(ROBLOX_COOKIE);
        console.log(`[Bot] Autenticado como ${user.UserName} (ID: ${user.UserId})`);
        
        // 2. Entra no jogo
        console.log(`[Bot] Tentando entrar no jogo ${PLACE_ID}...`);
        await noblox.joinGame({ placeId: PLACE_ID });
        console.log(`[Bot] Comando de entrada enviado com sucesso.`);

        // 3. Loop de estabilidade (Mantém o bot vivo)
        while (true) {
            await new Promise(r => setTimeout(r, 60000)); // Espera 1 minuto
            console.log("[Bot] Check de estabilidade: Bot ativo.");
        }
    } catch (erro) {
        console.error("[Bot] Erro fatal:", erro.message);
    }
}

main();
