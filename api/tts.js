/**
 * /api/tts — Proxy serverless para o ElevenLabs (Vercel)
 *
 * A chave da API fica NO SERVIDOR, como variável de ambiente da Vercel. O
 * navegador nunca a recebe: ele só chama este endpoint, que repassa o pedido
 * ao ElevenLabs e devolve o áudio.
 *
 * -----------------------------------------------------------------------------
 * CONFIGURAÇÃO NA VERCEL
 * -----------------------------------------------------------------------------
 * Settings > Environment Variables:
 *
 *   ELEVENLABS_API_KEY = <sua chave NOVA, depois de revogar a antiga>
 *
 * Marque os ambientes Production, Preview e Development. Variáveis novas só
 * valem para deploys NOVOS — é preciso refazer o deploy depois de criá-las.
 *
 * ALLOWED_ORIGIN é opcional: o site chama este endpoint pelo caminho relativo
 * /api/tts, ou seja, na mesma origem, e nesse caso o CORS nem entra em cena.
 *
 * -----------------------------------------------------------------------------
 * FORMATO DO MÓDULO
 * -----------------------------------------------------------------------------
 * CommonJS (module.exports) de propósito. Sem um package.json com
 * "type": "module", a Vercel interpreta arquivos .js como CommonJS — um
 * `export default` aqui quebraria a função com "Unexpected token 'export'".
 */

// Vozes que este proxy aceita. Sem a lista, alguém poderia usar sua conta para
// sintetizar com qualquer voz do catálogo.
const ALLOWED_VOICE_IDS = new Set([
    'cgSgspJ2msm6clMCkdW9', // Português (BR)
    '21m00Tcm4TlvDq8ikWAM', // English (US)
    'ThT5KcBeYPX3keUQqHPh', // Español
    'cjVigY5qzO86Huf0OWal', // Deutsch
    'XB0fDUnXU5powFXDhCwa', // 中文
    'yoZ06aMxZJJ28mfd3POQ'  // Русский
]);

const MAX_TEXT_LENGTH = 800;

module.exports = async function handler(request, response) {
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
        console.error('ELEVENLABS_API_KEY ausente no ambiente da Vercel.');
        return response.status(500).json({ error: 'Serviço de voz não configurado' });
    }

    // A Vercel já entrega o corpo JSON parseado, mas em alguns cenários ele
    // chega como string — normalizar evita uma falha silenciosa.
    let body = request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch {
            return response.status(400).json({ error: 'JSON inválido' });
        }
    }

    const { text, voiceId } = body || {};

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
            // O corpo do erro pode conter detalhes da conta: fica só no log.
            const detail = await upstream.text();
            console.error('Erro do ElevenLabs:', upstream.status, detail);

            // 401 costuma ser chave inválida/revogada; 429, cota esgotada.
            return response.status(502).json({
                error: 'Falha na síntese de voz',
                upstreamStatus: upstream.status
            });
        }

        const audio = Buffer.from(await upstream.arrayBuffer());

        response.setHeader('Content-Type', 'audio/mpeg');
        response.setHeader('Cache-Control', 'public, max-age=86400');
        return response.status(200).send(audio);

    } catch (error) {
        console.error('Erro no proxy de TTS:', error);
        return response.status(500).json({ error: 'Erro interno' });
    }
};
