/**
 * TTS.EXAMPLE.JS — Proxy serverless para o ElevenLabs
 *
 * Mantém a chave da API no servidor, onde o navegador não a alcança.
 * O site estático chama esta função; ela chama o ElevenLabs e devolve o áudio.
 *
 * -----------------------------------------------------------------------------
 * COMO USAR (Vercel)
 * -----------------------------------------------------------------------------
 * 1. Renomeie este arquivo para `api/tts.js`.
 * 2. No painel da Vercel: Settings > Environment Variables
 *       ELEVENLABS_API_KEY = <sua chave NOVA, depois de revogar a antiga>
 *       ALLOWED_ORIGIN     = https://seu-dominio.com
 * 3. Faça o deploy.
 * 4. No `.env` do site, aponte para a função:
 *       ELEVENLABS_PROXY_URL=https://seu-projeto.vercel.app/api/tts
 * 5. Regenere a config: `node scripts/build-config.mjs`
 *
 * Netlify e Cloudflare Workers seguem o mesmo desenho, mudando só a assinatura
 * do handler.
 */

// Vozes que este proxy aceita. Sem essa lista, alguém poderia usar sua conta
// para sintetizar com qualquer voz do catálogo.
const ALLOWED_VOICE_IDS = new Set([
    'cgSgspJ2msm6clMCkdW9', // Português (BR)
    '21m00Tcm4TlvDq8ikWAM', // English (US)
    'ThT5KcBeYPX3keUQqHPh', // Español
    'cjVigY5qzO86Huf0OWal', // Deutsch
    'XB0fDUnXU5powFXDhCwa', // 中文
    'yoZ06aMxZJJ28mfd3POQ'  // Русский
]);

const MAX_TEXT_LENGTH = 800;

export default async function handler(request, response) {
    const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.status(204).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Método não permitido' });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        console.error('ELEVENLABS_API_KEY não configurada no ambiente do servidor.');
        return response.status(500).json({ error: 'Serviço de voz indisponível' });
    }

    const { text, voiceId } = request.body || {};

    // Validação de entrada: limita custo e impede uso da conta como serviço aberto.
    if (typeof text !== 'string' || text.trim().length === 0) {
        return response.status(400).json({ error: 'Texto obrigatório' });
    }
    if (text.length > MAX_TEXT_LENGTH) {
        return response.status(400).json({ error: `Texto excede ${MAX_TEXT_LENGTH} caracteres` });
    }
    if (!ALLOWED_VOICE_IDS.has(voiceId)) {
        return response.status(400).json({ error: 'Voz não permitida' });
    }

    try {
        const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                Accept: 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
        });

        if (!upstream.ok) {
            // Não repassa o corpo do erro: pode conter detalhes da conta.
            console.error('Erro do ElevenLabs:', upstream.status, await upstream.text());
            return response.status(502).json({ error: 'Falha na síntese de voz' });
        }

        const audio = Buffer.from(await upstream.arrayBuffer());

        response.setHeader('Content-Type', 'audio/mpeg');
        response.setHeader('Cache-Control', 'public, max-age=86400');
        return response.status(200).send(audio);

    } catch (error) {
        console.error('Erro no proxy de TTS:', error);
        return response.status(500).json({ error: 'Erro interno' });
    }
}
