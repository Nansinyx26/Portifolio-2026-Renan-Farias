#!/usr/bin/env node
/**
 * BUILD-CONFIG.MJS
 *
 * Lê o `.env` da raiz e gera `js/config.generated.js`, que define
 * `window.__APP_CONFIG__` antes dos demais scripts rodarem.
 *
 * Uso:
 *   node scripts/build-config.mjs
 *
 * Sem dependências — Node 18+ apenas.
 *
 * ⚠️ Só variáveis da allowlist abaixo são exportadas para o navegador. Isso é
 * intencional: impede que um segredo colado no `.env` por engano seja publicado
 * junto com o site estático.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = resolve(ROOT, '.env');
const OUTPUT_PATH = resolve(ROOT, 'js', 'config.generated.js');

/** Únicas chaves que podem chegar ao navegador. */
const PUBLIC_KEYS = [
    'EMAILJS_SERVICE_ID',
    'EMAILJS_TEMPLATE_OWNER',
    'EMAILJS_TEMPLATE_CLIENT',
    'EMAILJS_PUBLIC_KEY',
    'ELEVENLABS_PROXY_URL',
    'SITE_URL',
    'CONTACT_EMAIL'
];

/**
 * Padrões que indicam um segredo real. Se algum valor bater, o build para:
 * é sempre um erro de configuração, nunca algo que se queira publicar.
 */
const SECRET_PATTERNS = [
    { name: 'chave da OpenAI', regex: /^sk-[A-Za-z0-9_-]{20,}/ },
    { name: 'chave do Google/Gemini', regex: /^AIza[0-9A-Za-z_-]{35}/ },
    { name: 'token do GitHub', regex: /^gh[pousr]_[A-Za-z0-9]{36,}/ },
    { name: 'chave da AWS', regex: /^AKIA[0-9A-Z]{16}$/ },
    { name: 'chave secreta do Stripe', regex: /^sk_(live|test)_[A-Za-z0-9]{20,}/ },
    { name: 'string de conexão do MongoDB', regex: /^mongodb(\+srv)?:\/\// },
    // Chave do ElevenLabs: 64 caracteres hexadecimais.
    { name: 'chave da API do ElevenLabs', regex: /^[a-f0-9]{64}$/i }
];

function parseEnv(contents) {
    const values = {};

    for (const rawLine of contents.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;

        const separator = line.indexOf('=');
        if (separator === -1) continue;

        const key = line.slice(0, separator).trim();
        let value = line.slice(separator + 1).trim();

        // Remove aspas envolventes, se houver.
        if (value.length >= 2 && (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        )) {
            value = value.slice(1, -1);
        }

        values[key] = value;
    }

    return values;
}

function assertNoSecrets(env) {
    const findings = [];

    for (const key of PUBLIC_KEYS) {
        const value = env[key];
        if (!value) continue;
        for (const { name, regex } of SECRET_PATTERNS) {
            if (regex.test(value)) findings.push({ key, name });
        }
    }

    if (findings.length === 0) return;

    console.error('\n❌ Build interrompido: segredo detectado no .env\n');
    for (const { key, name } of findings) {
        console.error(`   ${key} parece conter uma ${name}.`);
    }
    console.error(
        '\n   Este site é estático: qualquer valor exportado fica visível no navegador.\n' +
        '   Mova essa credencial para um proxy serverless e referencie apenas a URL.\n' +
        '   Detalhes em .env.example.\n'
    );
    process.exit(1);
}

function main() {
    if (!existsSync(ENV_PATH)) {
        console.error('❌ .env não encontrado. Copie .env.example para .env e preencha os valores.');
        process.exit(1);
    }

    const env = parseEnv(readFileSync(ENV_PATH, 'utf8'));
    assertNoSecrets(env);

    const config = {};
    const missing = [];

    for (const key of PUBLIC_KEYS) {
        const value = env[key] ?? '';
        config[key] = value;
        if (!value && key.startsWith('EMAILJS_')) missing.push(key);
    }

    // Avisa sobre valores exportados mas não usados no .env.
    const ignored = Object.keys(env).filter((key) => !PUBLIC_KEYS.includes(key));

    const output = `/**
 * ARQUIVO GERADO — NÃO EDITE À MÃO.
 * Origem: .env  |  Gerador: scripts/build-config.mjs
 * Regenere com: node scripts/build-config.mjs
 */
window.__APP_CONFIG__ = ${JSON.stringify(config, null, 4)};
`;

    writeFileSync(OUTPUT_PATH, output, 'utf8');

    console.log(`✅ js/config.generated.js gerado com ${PUBLIC_KEYS.length} valores.`);

    if (missing.length > 0) {
        console.warn(`⚠️  Vazios (o formulário de contato não vai enviar): ${missing.join(', ')}`);
    }
    if (ignored.length > 0) {
        console.log(`ℹ️  Ignorados (fora da allowlist): ${ignored.join(', ')}`);
    }
    if (config.ELEVENLABS_PROXY_URL) {
        console.log('ℹ️  Usando proxy serverless para ElevenLabs TTS.');
    } else {
        console.log('ℹ️  Sem proxy de TTS: o chatbot usa a Web Speech API do navegador.');
    }
}

main();
