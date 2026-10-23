"use strict";

const noblox = require("noblox.js");

const ROBLOX_COOKIE = process.env.ROBLOX_COOKIE;
const PLACE_ID = Number(process.env.PLACE_ID || 0);

async function main() {
    if (!ROBLOX_COOKIE) {
        throw new Error("Configure ROBLOX_COOKIE nos Secrets do projeto.");
    }
    if (!PLACE_ID || PLACE_ID <= 0) {
        throw new Error("Configure PLACE_ID com um ID numérico válido.");
    }

    const user = await noblox.setCookie(ROBLOX_COOKIE);
    console.log(`[Bot] Autenticado como ${user.UserName} (${user.UserId}).`);
    
    // Loop de reconexão (O que a IA do Replit se recusou a fazer)
    while (true) {
        try {
            console.log(`[Bot] Tentando entrar no jogo ${PLACE_ID}...`);
            // Usando a função correta da versão nova
            await noblox.joinGame({ placeId: PLACE_ID });
            
            // Mantém o bot online enviando um ping a cada 1 minuto
            for (let i = 0; i < 10; i++) {
                await new Promise(r => setTimeout(r, 60000));
                await noblox.getCurrentUser(); // Mantém a sessão viva
                console.log("[Bot] Check de estabilidade OK.");
            }
        } catch (erro) {
            console.error("[Bot] Caiu ou tomou kick. Reconectando em 5 segundos...", erro.message);
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

main().catch((erro) => {
    console.error("[Bot] Erro fatal:", erro.message);
    process.exit(1);
});
