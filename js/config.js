/**
 * CONFIG.JS — Ponto único de configuração em tempo de execução
 * Portfolio Renan de Oliveira Farias
 *
 * Lê `window.__APP_CONFIG__` (produzido por `scripts/build-config.mjs` a partir
 * do `.env`) e expõe um objeto normalizado. Se o arquivo gerado não existir, o
 * site continua funcionando com os recursos que não dependem de configuração.
 *
 * Nada aqui é secreto. Ver .env.example para o porquê.
 */

(function () {
    'use strict';

    const raw = window.__APP_CONFIG__ || {};

    /** Retorna string limpa, ou '' — nunca undefined, evita "undefined" em URLs. */
    function value(key) {
        const entry = raw[key];
        return typeof entry === 'string' ? entry.trim() : '';
    }

    const config = {
        emailjs: {
            serviceID: value('EMAILJS_SERVICE_ID'),
            templateID_Owner: value('EMAILJS_TEMPLATE_OWNER'),
            templateID_Client: value('EMAILJS_TEMPLATE_CLIENT'),
            publicKey: value('EMAILJS_PUBLIC_KEY')
        },
        tts: {
            // Vazio => o chatbot usa a Web Speech API do navegador.
            proxyUrl: value('ELEVENLABS_PROXY_URL')
        },
        site: {
            url: value('SITE_URL'),
            contactEmail: value('CONTACT_EMAIL')
        }
    };

    config.emailjs.isConfigured = Boolean(
        config.emailjs.serviceID &&
        config.emailjs.templateID_Owner &&
        config.emailjs.templateID_Client &&
        config.emailjs.publicKey
    );

    config.tts.hasProxy = Boolean(config.tts.proxyUrl);

    if (!window.__APP_CONFIG__) {
        console.info(
            '[config] js/config.generated.js não encontrado. ' +
            'Rode `node scripts/build-config.mjs` para gerar a configuração a partir do .env.'
        );
    }

    window.APP_CONFIG = Object.freeze(config);
})();
