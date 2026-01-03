/**
 * CONTACT-FORM-EMAILJS.JS - PORTFOLIO RENAN DE OLIVEIRA
 * Integração com EmailJS para envio de mensagens do formulário
 * Sistema dual: Email para proprietário + confirmação para cliente
 */

// ============================================
// CONFIGURAÇÃO - SUBSTITUA COM SUAS CREDENCIAIS DO EMAILJS
// ============================================
const EMAILJS_CONFIG = {
    serviceID: 'service_0wckusf',        // Ex: 'service_abc123'
    templateID_Owner: 'template_ca45d9t', // Template para você receber
    templateID_Client: 'template_ja6bn5x', // Template de confirmação para cliente
    publicKey: 'CmCOmPGRuYTCmR-Pl'         // Ex: 'user_xyz789'
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
    const errors = [];
    
    if (EMAILJS_CONFIG.serviceID === 'YOUR_SERVICE_ID' || !EMAILJS_CONFIG.serviceID) {
        errors.push('Service ID não configurado');
    }
    
    if (EMAILJS_CONFIG.templateID_Owner === 'YOUR_TEMPLATE_ID' || !EMAILJS_CONFIG.templateID_Owner) {
        errors.push('Template ID Owner não configurado');
    }
    
    if (EMAILJS_CONFIG.templateID_Client === 'YOUR_CLIENT_TEMPLATE_ID' || !EMAILJS_CONFIG.templateID_Client) {
        errors.push('Template ID Client não configurado');
    }
    
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY' || !EMAILJS_CONFIG.publicKey) {
        errors.push('Public Key não configurada');
    }
    
    if (errors.length > 0) {
        console.error('❌ ERROS DE CONFIGURAÇÃO:', errors);
        showNotification('⚠️ Configure o EmailJS: ' + errors.join(', '), 'error');
        return false;
    }
    
    console.log('✓ Configuração válida');
    return true;
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
        return;
    }
    
    try {
        await loadEmailJS();
        showNotification('✓ Sistema de email pronto!', 'success', 3000);
    } catch (error) {
        console.error('❌ Erro ao carregar EmailJS:', error.message);
        showNotification('Erro ao carregar EmailJS: ' + error.message, 'error');
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
            to_name: 'Renan de Oliveira',
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

console.log('📄 Sistema de contato carregado - Portfolio Renan de Oliveira');