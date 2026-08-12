/**
 * CONTACT-FORM-EMAILJS.JS - PORTFOLIO RENAN DE OLIVEIRA FARIAS
 * Integração com EmailJS para envio de mensagens do formulário
 * Sistema dual: Email para proprietário + confirmação para cliente
 */

// ============================================
// CONFIGURAÇÃO
// ============================================
// Os valores vêm do .env via scripts/build-config.mjs -> js/config.generated.js.
// Para alterá-los, edite o .env e rode: node scripts/build-config.mjs
//
// Estas credenciais são publicáveis por design (o EmailJS roda no navegador).
// A proteção real é a allowlist de domínios no painel do EmailJS —
// veja .env.example.
const EMAILJS_CONFIG = window.APP_CONFIG?.emailjs || {
    serviceID: '',
    templateID_Owner: '',
    templateID_Client: '',
    publicKey: ''
};

// ============================================
// VARIÁVEIS DE CONTROLE
// ============================================
let emailJSLoaded = false;

// ============================================
// FUNÇÃO: CARREGA EMAILJS
// ============================================
function loadEmailJS() {
    return new Promise((resolve, reject) => {
        if (window.emailjs && emailJSLoaded) {
            console.log('✓ EmailJS já carregado');
            resolve();
            return;
        }

        console.log('⏳ Carregando EmailJS...');

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.type = 'text/javascript';

        const timeout = setTimeout(() => {
            reject(new Error('Timeout ao carregar EmailJS (10s)'));
        }, 10000);

        script.onload = () => {
            clearTimeout(timeout);

            if (window.emailjs) {
                try {
                    emailjs.init(EMAILJS_CONFIG.publicKey);
                    emailJSLoaded = true;
                    console.log('✓ EmailJS inicializado com sucesso');
                    resolve();
                } catch (error) {
                    reject(new Error('Erro ao inicializar EmailJS: ' + error.message));
                }
            } else {
                reject(new Error('window.emailjs não disponível'));
            }
        };

        script.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Falha ao carregar script do EmailJS'));
        };

        document.head.appendChild(script);
    });
}

// ============================================
// FUNÇÃO: VALIDA CONFIGURAÇÃO
// ============================================
function validateConfig() {
    const required = {
        serviceID: 'EMAILJS_SERVICE_ID',
        templateID_Owner: 'EMAILJS_TEMPLATE_OWNER',
        templateID_Client: 'EMAILJS_TEMPLATE_CLIENT',
        publicKey: 'EMAILJS_PUBLIC_KEY'
    };

    const missing = Object.entries(required)
        .filter(([field]) => !EMAILJS_CONFIG[field])
        .map(([, envVar]) => envVar);

    if (missing.length > 0) {
        // Erro de configuração do site, não do visitante: registra no console e
        // deixa o formulário em fallback (mailto) em vez de exibir jargão técnico.
        console.error(
            '❌ EmailJS não configurado. Faltando no .env: ' + missing.join(', ') +
            '\n   Preencha o .env e rode: node scripts/build-config.mjs'
        );
        return false;
    }

    console.log('✓ Configuração válida');
    return true;
}

/**
 * Sem EmailJS configurado o formulário não pode enviar. Em vez de falhar em
 * silêncio, converte o envio em um mailto pré-preenchido — a mensagem do
 * visitante não se perde.
 */
function enableMailtoFallback(form) {
    const contactEmail = window.APP_CONFIG?.site?.contactEmail || 'oliversinyxcontato@gmail.com';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = collectFormData(form);
        if (!data) return;

        const subject = `Contato pelo portfólio — ${data.from_name}`;
        const body =
            `Nome: ${data.from_name}\n` +
            `Empresa: ${data.company}\n` +
            `Email: ${data.from_email}\n` +
            `Telefone: ${data.phone}\n` +
            `Interesse: ${data.product}\n\n` +
            `${data.message}\n`;

        window.location.href =
            `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        showNotification('Abrindo seu aplicativo de email…', 'info', 4000);
    });
}

// ============================================
// FUNÇÃO: INICIALIZA FORMULÁRIO
// ============================================
async function initContactForm() {
    console.log('🔧 Inicializando formulário de contato...');

    const form = document.getElementById('contactForm');

    if (!form) {
        console.error('❌ Formulário não encontrado!');
        showNotification('Erro: Formulário não encontrado no HTML', 'error');
        return;
    }

    console.log('✓ Formulário encontrado');

    if (!validateConfig()) {
        enableMailtoFallback(form);
        return;
    }

    try {
        await loadEmailJS();
    } catch (error) {
        console.error('❌ Erro ao carregar EmailJS:', error.message);
        enableMailtoFallback(form);
        return;
    }

    form.addEventListener('submit', handleFormSubmit);

    console.log('✓ Formulário pronto para envios');
}

// ============================================
// FUNÇÃO: PROCESSA ENVIO DO FORMULÁRIO
// ============================================
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📧 Formulário submetido');

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!submitBtn) {
        console.error('❌ Botão de submit não encontrado');
        showNotification('Erro: Botão de envio não encontrado', 'error');
        return;
    }

    const originalText = submitBtn.innerHTML;

    if (!window.emailjs || !emailJSLoaded) {
        console.error('❌ EmailJS não carregado');
        showNotification('Sistema não inicializado. Recarregue a página.', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        const formData = collectFormData(form);

        if (!formData) {
            throw new Error('Dados do formulário inválidos');
        }

        console.log('📤 Enviando emails...');

        // 1️⃣ Envia email para VOCÊ (Renan)
        const responseOwner = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID_Owner,
            formData
        );

        console.log('✓ Email para proprietário:', responseOwner);

        // 2️⃣ Envia email de CONFIRMAÇÃO para o CLIENTE
        const responseClient = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID_Client,
            formData
        );

        console.log('✓ Email para cliente:', responseClient);

        if (responseOwner.status === 200 && responseClient.status === 200) {
            console.log('✅ EMAILS ENVIADOS COM SUCESSO!');

            // Notificação de sucesso
            showNotification('✅ Mensagem enviada com sucesso! Retornarei em breve.', 'success', 5000);

            // Reseta formulário
            form.reset();

            // Animação de sucesso no botão
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
            submitBtn.style.background = 'linear-gradient(45deg, #00ff88, #00cc6a)';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);

        } else {
            throw new Error(`Status HTTP - Owner: ${responseOwner.status}, Client: ${responseClient.status}`);
        }

    } catch (error) {
        console.error('❌ ERRO AO ENVIAR:', error);

        let errorMsg = 'Erro ao enviar mensagem';

        if (error.text) {
            errorMsg += ': ' + error.text;
        } else if (error.message) {
            errorMsg += ': ' + error.message;
        }

        if (error.text && error.text.includes('Invalid')) {
            errorMsg = '❌ Credenciais inválidas. Verifique as configurações do EmailJS.';
        } else if (error.text && error.text.includes('not found')) {
            errorMsg = '❌ Template ou Service não encontrado. Verifique os IDs no EmailJS.';
        }

        showNotification(errorMsg, 'error', 8000);

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============================================
// FUNÇÃO: COLETA DADOS DO FORMULÁRIO
// ============================================
function collectFormData(form) {
    try {
        const data = {
            from_name: form.fullName?.value?.trim() || 'Não informado',
            from_email: form.email?.value?.trim() || '',
            company: form.company?.value?.trim() || 'Não informado',
            phone: form.phone?.value?.trim() || 'Não informado',
            product: form.product?.options[form.product.selectedIndex]?.text || 'Não selecionado',
            message: form.message?.value?.trim() || '',
            to_name: 'Renan de Oliveira Farias',
            reply_to: form.email?.value?.trim() || ''
        };

        if (!data.from_email) {
            showNotification('Por favor, preencha o email', 'error');
            return null;
        }

        if (!data.from_name || data.from_name === 'Não informado') {
            showNotification('Por favor, preencha seu nome', 'error');
            return null;
        }

        if (!data.message) {
            showNotification('Por favor, escreva uma mensagem', 'error');
            return null;
        }

        return data;

    } catch (error) {
        console.error('Erro ao coletar dados:', error);
        return null;
    }
}

// ============================================
// FUNÇÃO: MOSTRA NOTIFICAÇÃO FLUTUANTE
// ============================================
function showNotification(message, type = 'info', duration = 7000) {
    console.log(`[${type.toUpperCase()}] ${message}`);

    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `form-notification notification-${type}`;

    const icon = type === 'success' ? 'check-circle' :
        type === 'error' ? 'exclamation-triangle' : 'info-circle';

    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('notification-exit');
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}

console.log('📄 Sistema de contato carregado - Portfolio Renan de Oliveira Farias');