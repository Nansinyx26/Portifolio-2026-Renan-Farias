// ===== ADVANCED PORTFOLIO JAVASCRIPT CORRIGIDO =====

class AdvancedPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupGSAP();
        this.setupThreeJS();
        this.setupTypingEffect();
        this.setupScrollAnimations();
        this.setupCustomCursor();
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupLoadingScreen();
        this.setupMobileMenu();

        console.log('🚀 Advanced Portfolio Initialized');
    }

    // GSAP Setup - VELOCIDADES AUMENTADAS
    setupGSAP() {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger, TextPlugin);

        // Hero animations - mais rápidas
        const tl = gsap.timeline({ delay: 0.5 });
        tl.from('.hero-badge', { duration: 0.6, y: 50, opacity: 0, ease: 'power3.out' })
            .from('.hero-title', { duration: 0.8, y: 100, opacity: 0, ease: 'power3.out' }, '-=0.4')
            .from('.hero-subtitle', { duration: 0.6, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.3')
            .from('.hero-buttons', { duration: 0.6, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.2')
            .from('.scroll-indicator', { duration: 0.6, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.1');

        // Scroll-triggered animations - mais rápidas
        gsap.utils.toArray('.fade-in').forEach((element, i) => {
            gsap.fromTo(element, { opacity: 0, y: 50 }, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Skill cards animation - mais rápidas
        gsap.utils.toArray('.skill-card').forEach((card, i) => {
            gsap.fromTo(card, { opacity: 0, y: 30, rotationY: 15 }, {
                opacity: 1,
                y: 0,
                rotationY: 0,
                duration: 0.5,
                delay: i * 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Project cards animation - mais rápidas
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.fromTo(card, { opacity: 0, scale: 0.9, rotation: 2 }, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.5,
                delay: i * 0.08,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Timeline items animation - mais rápidas
        gsap.utils.toArray('.timeline-content').forEach((item, i) => {
            gsap.fromTo(item, { opacity: 0, y: 30 }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Header scroll effect
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top -100',
            end: 'bottom bottom',
            onUpdate: (self) => {
                const header = document.querySelector('.header');
                if (self.direction === -1) {
                    header.classList.add('scrolled');
                } else if (self.scroll < 100) {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    // Three.js 3D Scene
    setupThreeJS() {
        if (typeof THREE === 'undefined') return;

        const canvas = document.querySelector('.hero-canvas');
        if (!canvas) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create floating geometries
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.7, 16, 16),
            new THREE.OctahedronGeometry(0.8),
            new THREE.CylinderGeometry(0.5, 0.5, 1, 6),
        ];

        const materials = [
            new THREE.MeshBasicMaterial({
                color: 0x00ff88,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshBasicMaterial({
                color: 0x0099ff,
                wireframe: true,
                transparent: true,
                opacity: 0.4
            }),
            new THREE.MeshBasicMaterial({
                color: 0xff0088,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            }),
        ];

        const meshes = [];

        // Create multiple floating objects
        for (let i = 0; i < 12; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            // Random positions
            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );

            // Random rotations
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            scene.add(mesh);
            meshes.push(mesh);
        }

        camera.position.z = 15;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate meshes
            meshes.forEach((mesh, i) => {
                mesh.rotation.x += 0.005 + i * 0.001;
                mesh.rotation.y += 0.005 + i * 0.001;

                // Float animation
                mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01;
            });

            // Camera movement based on mouse
            camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Advanced Typing Effect
    setupTypingEffect() {
        const texts = [
            'Desenvolvedor Junior & Maker',
            'Especialista em Prototipagem 3D e Eletrônica',
            'Engenharia de Prompts para IA (ChatGPT & Claude)',
            'Modelagem 3D • Arduino • C++ • JavaScript',
            'Transformando Ideias em Projetos Reais',
            'Técnico de Suporte ao Usuário'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typedElement = document.getElementById('typed-text');
        if (!typedElement) return;

        const type = () => {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typedElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 30 : 80;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 300;
            }

            setTimeout(type, typeSpeed);
        };

        // Start typing effect after a delay
        setTimeout(type, 1000);
    }

    // Advanced Scroll Animations
    setupScrollAnimations() {
        // Profile image rotation on scroll
        if (typeof gsap !== 'undefined') {
            gsap.to('.profile-ring', {
                rotation: 360,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1
                }
            });

            // Skill tags hover animations
            document.querySelectorAll('.skill-tag').forEach(tag => {
                tag.addEventListener('mouseenter', () => {
                    gsap.to(tag, { scale: 1.1, duration: 0.2, ease: 'back.out(1.7)' });
                });

                tag.addEventListener('mouseleave', () => {
                    gsap.to(tag, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
                });
            });
        }

        // Intersection Observer para elementos fade-in
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Custom Cursor
    setupCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor movement
        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .nav-link');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Hide cursor on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            cursor.style.display = 'none';
        }
    }

    // Advanced Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const sections = document.querySelectorAll('.section, .hero');

        // Smooth scroll with offset
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                    }
                }
            });
        });

        // Active navigation highlighting
        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // CORREÇÃO: Theme Toggle funcional
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        if (!themeToggle || !themeIcon) return;

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(themeIcon, savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(themeIcon, newTheme);

            // Animate theme transition
            if (typeof gsap !== 'undefined') {
                gsap.to('body', {
                    duration: 0.3,
                    ease: 'power2.inOut'
                });
            }
        });
    }

    updateThemeIcon(icon, theme) {
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // CORREÇÃO: Mobile Menu funcional
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!mobileMenuBtn || !mobileMenu) return;

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // Loading Screen
    setupLoadingScreen() {
        window.addEventListener('load', () => {
            const loader = document.querySelector('.loader');
            if (!loader) return;

            if (typeof gsap !== 'undefined') {
                gsap.to(loader, {
                    duration: 0.8,
                    opacity: 0,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        loader.style.display = 'none';
                    }
                });
            } else {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 1000);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedPortfolio();
});

// Performance optimization - Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all animatable elements when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Add smooth scrolling fallback for browsers without CSS support
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Throttled scroll event for better performance
let ticking = false;

function updateScrollElements() {
    // Add any scroll-based updates here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
    }
});
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.responses = this.generateResponses();

        // ========================
        // 🔑 CONFIGURAÇÃO ELEVENLABS API
        // ========================
        // INSTRUÇÕES: Cole sua API Key do ElevenLabs aqui
        // 1. Acesse: https://elevenlabs.io
        // 2. Faça login e vá em Profile Settings
        // 3. Copie sua API Key e cole entre as aspas abaixo
        this.ELEVENLABS_API_KEY = '2e89a7df2f014e0c2adac55415b8dcfee91b18143b1705ffa34659d120e46fed'; // ✅ API KEY CONFIGURADA

        // Voice IDs (vozes pré-selecionadas de alta qualidade)
        this.VOICES = {
            pt: { id: 'cgSgspJ2msm6clMCkdW9', name: 'Português (BR)', flag: '🇧🇷' },
            en: { id: '21m00Tcm4TlvDq8ikWAM', name: 'English (US)', flag: '🇺🇸' },
            es: { id: 'ThT5KcBeYPX3keUQqHPh', name: 'Español', flag: '🇪🇸' },
            de: { id: 'cjVigY5qzO86Huf0OWal', name: 'Deutsch', flag: '🇩🇪' },
            zh: { id: 'XB0fDUnXU5powFXDhCwa', name: '中文', flag: '🇨🇳' },
            ru: { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Русский', flag: '🇷🇺' }
        };

        this.currentVoice = 'pt'; // Voz padrão

        this.currentAudio = null; // Para controlar o áudio em reprodução
    }

    init() {
        this.setupEventListeners();
        this.loadWelcomeMessage();
    }

    setupEventListeners() {
        const trigger = document.getElementById('chatbotTrigger');
        const input = document.getElementById('chatbotInput');
        const closeBtn = document.getElementById('closeChatBtn');
        const sendBtn = document.getElementById('sendMessageBtn');

        trigger.addEventListener('click', () => this.toggleChat());

        // New Close Button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChat());
        }

        // New Send Button
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Voice Menu Button
        const voiceMenuBtn = document.getElementById('voiceMenuBtn');
        if (voiceMenuBtn) {
            voiceMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleVoiceMenu();
            });
        }

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Close voice menu if clicking outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('voiceDropdownMenu');
            if (menu && !e.target.closest('#voiceMenuBtn') && !e.target.closest('#voiceDropdownMenu')) {
                menu.remove();
            }
        });
    }

    toggleVoiceMenu() {
        const existingMenu = document.getElementById('voiceDropdownMenu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.id = 'voiceDropdownMenu';
        menu.className = 'voice-dropdown-menu';

        Object.entries(this.VOICES).forEach(([key, voice]) => {
            const option = document.createElement('div');
            option.className = 'voice-option';
            if (key === this.currentVoice) {
                option.classList.add('active');
            }

            option.innerHTML = `
                <span class="voice-flag">${voice.flag}</span>
                <span class="voice-name">${voice.name}</span>
                ${key === this.currentVoice ? '<i class="bi bi-check-lg"></i>' : ''}
            `;

            option.onclick = async (e) => {
                e.stopPropagation();
                this.currentVoice = key;
                this.toggleVoiceMenu();

                // Traduzir todas as mensagens existentes
                await this.updateAllMessagesLanguage();
            };

            menu.appendChild(option);
        });

        const header = document.querySelector('.chatbot-header');
        header.style.position = 'relative';
        header.appendChild(menu);
    }

    async translateText(text, targetLang) {
        if (!targetLang || targetLang === 'pt') return text;

        try {
            // Usando MyMemory API (Gratuita e não requer key para uso moderado)
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|${targetLang}`);
            const data = await response.json();

            if (data.responseData && data.responseData.translatedText) {
                return data.responseData.translatedText;
            }
            return text;
        } catch (error) {
            console.error('Erro na tradução:', error);
            return text;
        }
    }

    async updateAllMessagesLanguage() {
        const messages = document.querySelectorAll('.message.bot');
        for (const msgDiv of messages) {
            const contentDiv = msgDiv.querySelector('.message-content');
            if (contentDiv) {
                const originalText = contentDiv.getAttribute('data-original-pt') || contentDiv.innerText;
                // Salvar o original se for a primeira vez
                if (!contentDiv.getAttribute('data-original-pt')) {
                    contentDiv.setAttribute('data-original-pt', originalText);
                }

                if (this.currentVoice === 'pt') {
                    contentDiv.innerText = originalText;
                    contentDiv.setAttribute('data-lang', 'pt');
                } else {
                    const translated = await this.translateText(originalText, this.currentVoice);
                    contentDiv.innerText = translated;
                    contentDiv.setAttribute('data-lang', this.currentVoice);
                }
            }
        }
    }

    toggleChat() {
        const window = document.getElementById('chatbotWindow');
        const trigger = document.getElementById('chatbotTrigger');

        if (this.isOpen) {
            this.closeChat();
        } else {
            window.classList.add('active');
            trigger.classList.remove('pulse');
            this.isOpen = true;

            // Focus on input
            setTimeout(() => {
                document.getElementById('chatbotInput').focus();
            }, 300);
        }
    }

    closeChat() {
        const window = document.getElementById('chatbotWindow');
        const trigger = document.getElementById('chatbotTrigger');

        window.classList.remove('active');
        trigger.classList.add('pulse');
        this.isOpen = false;
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        this.showTypingIndicator();

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        this.hideTypingIndicator();
        const response = this.generateResponse(message);
        this.addMessage(response, 'bot');
    }

    addMessage(message, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        // Wrapper para o texto
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        let displayMessage = typeof message === 'object' ? message.pt : message;

        // Tradução automática se não for português
        if (sender === 'bot' && this.currentVoice !== 'pt') {
            const originalText = displayMessage;
            contentDiv.innerHTML = '<i class="bi bi-translate"></i> Translating...';
            messageDiv.appendChild(contentDiv);

            this.translateText(originalText, this.currentVoice).then(translated => {
                contentDiv.innerHTML = translated;
                contentDiv.setAttribute('data-original-pt', originalText);
                contentDiv.setAttribute('data-lang', this.currentVoice);
            });
        } else {
            contentDiv.innerHTML = displayMessage;
            messageDiv.appendChild(contentDiv);
            if (sender === 'bot') {
                contentDiv.setAttribute('data-original-pt', displayMessage);
                contentDiv.setAttribute('data-lang', 'pt');
            }
        }

        if (sender === 'bot') {
            // Container para botões (posicionado no canto inferior direito)
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'message-controls';
            controlsDiv.style.position = 'absolute';
            controlsDiv.style.bottom = '5px';
            controlsDiv.style.right = '8px';
            controlsDiv.style.display = 'flex';
            controlsDiv.style.gap = '5px';

            // Botão TTS
            const ttsBtn = document.createElement('button');
            ttsBtn.className = 'tts-btn';
            ttsBtn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
            ttsBtn.title = "Ouvir mensagem";

            ttsBtn.onclick = (e) => {
                e.stopPropagation(); // Prevenir fechamento do chat
                const textToSpeak = contentDiv.innerText;
                const lang = contentDiv.getAttribute('data-lang') || 'pt';
                this.speakResponse(textToSpeak, ttsBtn, lang);
            };
            controlsDiv.appendChild(ttsBtn);

            // Botão Tradução
            if (typeof message === 'object' && message.en) {
                const translateBtn = document.createElement('button');
                translateBtn.className = 'tts-btn';
                translateBtn.innerHTML = '<i class="bi bi-translate"></i>';
                translateBtn.title = "Traduzir / Translate";

                translateBtn.onclick = (e) => {
                    e.stopPropagation(); // Prevenir fechamento do chat
                    const currentLang = contentDiv.getAttribute('data-lang');
                    if (currentLang === 'pt') {
                        contentDiv.innerHTML = message.en;
                        contentDiv.setAttribute('data-lang', 'en');
                    } else {
                        contentDiv.innerHTML = message.pt;
                        contentDiv.setAttribute('data-lang', 'pt');
                    }
                };
                controlsDiv.appendChild(translateBtn);
            }

            messageDiv.appendChild(controlsDiv);
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async speakResponse(text, btn, lang = 'pt') {
        // Parar áudio atual se estiver tocando
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
            if (btn && btn.classList.contains('speaking')) {
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
                return;
            }
        }

        // Limpar estado de todos os botões
        document.querySelectorAll('.tts-btn').forEach(b => b.classList.remove('speaking'));

        // Verificar se a API key foi configurada
        if (this.ELEVENLABS_API_KEY === 'SUA_API_KEY_AQUI' || !this.ELEVENLABS_API_KEY) {
            console.warn('⚠️ ElevenLabs API Key não configurada. Usando Web Speech API como fallback.');
            this.speakWithWebAPI(text, btn, lang);
            return;
        }

        try {
            // Atualizar UI para estado "carregando"
            if (btn) {
                btn.classList.add('speaking');
                btn.innerHTML = '<i class="bi bi-hourglass-split"></i>'; // Ícone de carregando
            }

            // Selecionar voice ID (Prioriza a voz selecionada no menu superior)
            const voiceId = this.VOICES[this.currentVoice]?.id || this.VOICES[lang]?.id || this.VOICES.pt.id;

            // Chamar API do ElevenLabs
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            // Converter resposta em blob de áudio
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Criar e reproduzir áudio
            this.currentAudio = new Audio(audioUrl);

            // Atualizar ícone para "tocando"
            if (btn) {
                btn.innerHTML = '<i class="bi bi-stop-fill"></i>';
            }

            // Event listeners do áudio
            this.currentAudio.onended = () => {
                if (btn) {
                    btn.classList.remove('speaking');
                    btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
                }
                URL.revokeObjectURL(audioUrl); // Limpar memória
                this.currentAudio = null;
            };

            this.currentAudio.onerror = () => {
                if (btn) {
                    btn.classList.remove('speaking');
                    btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
                }
                console.error('Erro ao reproduzir áudio');
                this.currentAudio = null;
            };

            await this.currentAudio.play();

        } catch (error) {
            console.error('❌ Erro ao usar ElevenLabs API:', error);
            console.log('🔄 Usando Web Speech API como fallback...');

            // Fallback para Web Speech API
            if (btn) {
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
            }
            this.speakWithWebAPI(text, btn, lang);
        }
    }

    // Fallback: Método antigo usando Web Speech API
    speakWithWebAPI(text, btn, lang = 'pt') {
        if (!('speechSynthesis' in window)) return;

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            if (btn && btn.classList.contains('speaking')) {
                btn.classList.remove('speaking');
                return;
            }
        }

        document.querySelectorAll('.tts-btn').forEach(b => b.classList.remove('speaking'));

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'en' ? 'en-US' : 'pt-BR';
        utterance.rate = 1.1;
        utterance.pitch = 1;

        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
            };
        }

        let voice = null;
        if (lang === 'en') {
            voice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en_US'));
        } else {
            voice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
        }

        if (voice) utterance.voice = voice;

        utterance.onstart = () => {
            if (btn) {
                btn.classList.add('speaking');
                btn.innerHTML = '<i class="bi bi-stop-fill"></i>';
            }
        };

        utterance.onend = () => {
            if (btn) {
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
            }
        };

        utterance.onerror = () => {
            if (btn) {
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
            }
        };

        window.speechSynthesis.speak(utterance);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateResponse(message) {
        const lowercaseMessage = message.toLowerCase();

        // Find best matching response
        for (const category of this.responses) {
            for (const keyword of category.keywords) {
                if (lowercaseMessage.includes(keyword)) {
                    const responses = category.responses;
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }

        // Default response if no match found
        return {
            pt: "Interessante pergunta! Posso te ajudar com informações sobre as habilidades do Renan, seus <strong>projetos em destaque</strong> (Gestão Escolar, Maker Coins, Sistema Solar), experiência profissional ou contato. O que gostaria de saber?",
            en: "Interesting question! I can help you with information about Renan's skills, his <strong>featured projects</strong> (School Management, Maker Coins, Solar System), professional experience, or contact. What would you like to know?"
        };
    }

    generateResponses() {
        return [{
            keywords: ['experiência', 'trabalho', 'emprego', 'profissional', 'carreira'],
            responses: [
                {
                    pt: "Renan tem experiência sólida como Técnico de Laboratório Jr. na Maker Mania LTDA (2025) e anteriormente na Amadotec (2023-2024). Trabalhou também na Secretaria da Educação com desenvolvimento em C# e suporte técnico.",
                    en: "Renan has solid experience as a Jr. Laboratory Technician at Maker Mania LTDA (2025) and previously at Amadotec (2023-2024). He also worked at the Department of Education with C# development and technical support."
                },
                {
                    pt: "A experiência do Renan inclui desenvolvimento de protótipos, impressão 3D, workshops maker e integração de IAs educacionais. Ele combina habilidades técnicas (dev) com hands-on (maker).",
                    en: "Renan's experience includes prototype development, 3D printing, maker workshops, and integration of educational AIs. He combines technical skills (dev) with hands-on (maker) expertise."
                }
            ]
        },
        {
            keywords: ['gestão escolar', 'sistema escolar', 'escola', 'mongodb', 'online', 'auth'],
            responses: [
                {
                    pt: "O projeto <strong>Gestão Escolar v3.0</strong> é um sistema 100% online desenvolvido com MongoDB Atlas e Autenticação Google. Possui perfis para Professores e Diretores, interface moderna com Glassmorphism e é totalmente responsivo.",
                    en: "The <strong>School Management v3.0</strong> project is a 100% online system developed with MongoDB Atlas and Google Authentication. It features profiles for Teachers and Directors, a modern interface with Glassmorphism, and is fully responsive."
                },
                {
                    pt: "O <strong>Sistema de Gestão Escolar</strong> é o destaque do portfólio! Ele usa MongoDB Atlas na nuvem, logins seguros (Email/Google), e gerencia turmas e notas com uma interface super moderna (Dark Mode/Glassmorphism).",
                    en: "The <strong>School Management System</strong> is the portfolio highlight! It uses cloud-based MongoDB Atlas, secure logins (Email/Google), and manages classes and grades with a super modern interface (Dark Mode/Glassmorphism)."
                }
            ]
        },
        {
            keywords: ['maker coins', 'coins', 'gamificação', 'gamificado', '3º ano', '5º ano', 'ranking'],
            responses: [
                {
                    pt: "O <strong>Maker Coins</strong> é um sistema de gamificação escolar! Ele usa LocalStorage para salvar pontos ('coins') dos alunos, gera rankings (leaderboards) e permite exportar dados. Tem modos específicos para 3º e 5º anos.",
                    en: "<strong>Maker Coins</strong> is a school gamification system! It uses LocalStorage to save student points ('coins'), generates leaderboards, and allows data export. It has specific modes for 3rd and 5th grades."
                },
                {
                    pt: "Com o <strong>Maker Coins System</strong>, professores podem dar ou tirar pontos dos alunos, gerando competitividade saudável. Inclui proteção por senha e justificativas para penalidades.",
                    en: "With the <strong>Maker Coins System</strong>, teachers can give or take points from students, generating healthy competitiveness. It includes password protection and justifications for penalties."
                }
            ]
        },
        {
            keywords: ['sistema solar', 'vr', 'ar', 'realidade virtual', 'a-frame', 'planetas', 'quiz'],
            responses: [
                {
                    pt: "O <strong>Sistema Solar VR 3.0</strong> é uma experiência imersiva em Realidade Virtual e Aumentada! Feito com A-Frame e Three.js, permite explorar planetas em 3D e responde a quizzes educativos.",
                    en: "<strong>Solar System VR 3.0</strong> is an immersive VR and AR experience! Built with A-Frame and Three.js, it allows exploring 3D planets and answering educational quizzes."
                },
                {
                    pt: "Você pode explorar o espaço com o <strong>Sistema Solar VR</strong>! Ele funciona no navegador e suporta óculos VR. Também tem um modo AR (Realidade Aumentada) usando a câmera do celular com marcadores visuais.",
                    en: "You can explore space with <strong>Solar System VR</strong>! It works in the browser and supports VR headsets. It also has an AR mode using the mobile camera with visual markers."
                }
            ]
        },
        {
            keywords: ['habilidades', 'skills', 'tecnologias', 'competências'],
            responses: [
                {
                    pt: "Skills principais: <strong>JavaScript, C#, Python, Arduino</strong>. Renan também domina integração com ChatGPT/Claude, Prompt Engineering, e tecnologias maker como Impressão 3D e Corte a Laser.",
                    en: "Main skills: <strong>JavaScript, C#, Python, Arduino</strong>. Renan also masters ChatGPT/Claude integration, Prompt Engineering, and maker technologies like 3D Printing and Laser Cutting."
                },
                {
                    pt: "Renan é um desenvolvedor híbrido: domina códigos (Web/Games) e hardware (Arduino/Prototipagem). Especialista em soluções educacionais inovadoras.",
                    en: "Renan is a hybrid developer: mastering code (Web/Games) and hardware (Arduino/Prototyping). Specialist in innovative educational solutions."
                }
            ]
        },
        {
            keywords: ['projetos', 'portfolio', 'trabalhos'],
            responses: [
                {
                    pt: "Além do Gestão Escolar, Maker Coins e Sistema Solar VR, Renan tem projetos como o 'Sistema de Futebol de Botão'. Confira os detalhes clicando nos cards acima!",
                    en: "Besides School Management, Maker Coins, and Solar System VR, Renan has projects like the 'Button Soccer System'. Check the details by clicking the cards above!"
                },
                {
                    pt: "Todos os projetos são práticos e focados em resolver problemas reais, especialmente na educação. O código fonte está disponível no GitHub do Renan.",
                    en: "All projects are practical and focused on solving real problems, especially in education. Source code is available on Renan's GitHub."
                }
            ]
        },
        {
            keywords: ['contato', 'email', 'telefone', 'linkedin', 'contratar'],
            responses: [
                {
                    pt: "Fale com o Renan! <br>📧 Email: oliversinyxcontato@gmail.com <br>📱 Tel: (19) 98427-5085 <br>🔗 LinkedIn: <a href='https://bit.ly/46QNGZv' target='_blank'>Perfil</a>",
                    en: "Contact Renan! <br>📧 Email: oliversinyxcontato@gmail.com <br>📱 Phone: +55 (19) 98427-5085 <br>🔗 LinkedIn: <a href='https://bit.ly/46QNGZv' target='_blank'>Profile</a>"
                },
                {
                    pt: "Renan está disponível para oportunidades! Entre em contato pelo email oliversinyxcontato@gmail.com ou pelo LinkedIn.",
                    en: "Renan is available for opportunities! Contact him via email oliversinyxcontato@gmail.com or LinkedIn."
                }
            ]
        },
        {
            keywords: ['ia', 'artificial', 'intelligence', 'chatgpt', 'claude', 'prompt'],
            responses: [
                {
                    pt: "Renan não só usa IA, ele a <strong>integra</strong>! Especialista em Prompt Engineering e APIs de IA para criar soluções educacionais inteligentes e automatizar processos.",
                    en: "Renan doesn't just use AI, he <strong>integrates</strong> it! Expert in Prompt Engineering and AI APIs to create intelligent educational solutions and automate processes."
                }
            ]
        },
        {
            keywords: ['maker', '3d', 'arduino', 'impressão'],
            responses: [
                {
                    pt: "No mundo Maker, Renan é expert em Impressão 3D, Corte a Laser e Arduino. Ele cria protótipos funcionais que unem o físico ao digital.",
                    en: "In the Maker world, Renan is an expert in 3D Printing, Laser Cutting, and Arduino. He creates functional prototypes that bridge the physical and digital."
                }
            ]
        },
        {
            keywords: ['olá', 'oi', 'bom dia', 'boa tarde'],
            responses: [
                {
                    pt: "Olá! Sou a IA do Renan. Me pergunte sobre o projeto 'Gestão Escolar', 'Maker Coins' ou sobre as skills do Renan!",
                    en: "Hello! I am Renan's AI. Ask me about the 'School Management' project, 'Maker Coins', or Renan's skills!"
                },
                {
                    pt: "Oi! Estou aqui para mostrar o melhor do portfólio do Renan. Quer saber sobre o sistema de Realidade Virtual?",
                    en: "Hi! I'm here to show you the best of Renan's portfolio. Want to know about the Virtual Reality system?"
                }
            ]
        }
        ];
    }


    loadWelcomeMessage() {
        const welcomeMsg = {
            pt: "Olá! 👋 Sou o assistente AI do Renan. Posso responder perguntas sobre suas habilidades, experiência, projetos e muito mais. Como posso te ajudar?",
            en: "Hello! 👋 I'm Renan's AI assistant. I can answer questions about his skills, experience, projects, and more. How can I help you?"
        };
        this.addMessage(welcomeMsg, 'bot');
    }
}

// Initialize Chatbot
function initChatbot() {
    if (!window.chatbotInitialized) {
        const chatbot = new Chatbot();
        chatbot.init();
        window.chatbotInitialized = true;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}

// ===== JAVASCRIPT PARA MARCA D'ÁGUA NANDEV =====
// Adicione este código ao final do seu arquivo script.js

class NandevWatermark {
    constructor() {
        this.init();
    }

    init() {
        this.createWatermark();
        this.setupEventListeners();
        this.createGeometricParticles();
        console.log('🔥 NanDev Watermark Initialized');
    }

    createWatermark() {
        // Verificar se já existe
        if (document.querySelector('.nandev-watermark')) return;

        const watermark = document.createElement('a');
        watermark.href = 'https://www.linkedin.com/in/renan-de-oliveira-farias-66a9b412b/';
        watermark.target = '_blank';
        watermark.rel = 'noopener noreferrer';
        watermark.className = 'nandev-watermark';

        watermark.innerHTML = `
            <div class="holographic-overlay"></div>
            <div class="geometric-particles" id="particles"></div>
            
            <div class="cube-container">
                <div class="wireframe-cube">
                    <div class="cube-face front">
                        <div class="wireframe-lines">
                            <div class="inner-line horizontal-line line-1"></div>
                            <div class="inner-line horizontal-line line-2"></div>
                            <div class="inner-line horizontal-line line-3"></div>
                        </div>
                    </div>
                    <div class="cube-face back">
                        <div class="wireframe-lines">
                            <div class="inner-line vertical-line v-line-1"></div>
                            <div class="inner-line vertical-line v-line-2"></div>
                            <div class="inner-line vertical-line v-line-3"></div>
                        </div>
                    </div>
                    <div class="cube-face right">
                        <div class="wireframe-lines">
                            <div class="inner-line horizontal-line line-1"></div>
                            <div class="inner-line horizontal-line line-3"></div>
                        </div>
                    </div>
                    <div class="cube-face left">
                        <div class="wireframe-lines">
                            <div class="inner-line vertical-line v-line-1"></div>
                            <div class="inner-line vertical-line v-line-3"></div>
                        </div>
                    </div>
                    <div class="cube-face top">
                        <div class="wireframe-lines">
                            <div class="inner-line horizontal-line line-2"></div>
                        </div>
                    </div>
                    <div class="cube-face bottom">
                        <div class="wireframe-lines">
                            <div class="inner-line vertical-line v-line-2"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <span class="watermark-text">
                Desenvolvido por <span class="watermark-highlight">Nan</span>dev
            </span>
            <span class="code-symbol">&lt;/&gt;</span>
        `;

        document.body.appendChild(watermark);
    }

    setupEventListeners() {
        // Event listener para clique
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nandev-watermark')) {
                e.preventDefault();
                this.activateMatrix(e.target.closest('.nandev-watermark'));
                // Ainda permitir navegação após efeito
                setTimeout(() => {
                    window.open('https://www.linkedin.com/in/renan-de-oliveira-farias-66a9b412b/', '_blank');
                }, 2000);
            }
        });

        // Efeito de mouse 3D
        document.addEventListener('mousemove', (e) => {
            const watermark = document.querySelector('.nandev-watermark');
            if (!watermark) return;

            const cube = watermark.querySelector('.wireframe-cube');
            if (!cube) return;

            const rect = watermark.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) / 100;
            const deltaY = (e.clientY - centerY) / 100;

            // Usar GSAP se disponível, senão CSS puro
            if (typeof gsap !== 'undefined') {
                gsap.to(cube, {
                    rotationX: deltaY * 5,
                    rotationY: deltaX * 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                cube.style.transform = `rotateX(${deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
            }
        });

        // Controle de teclado
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                const watermark = document.querySelector('.nandev-watermark');
                if (watermark) {
                    this.activateMatrix(watermark);
                }
            }
        });
    }

    createGeometricParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        // Limpar partículas existentes
        container.innerHTML = '';

        const particleCount = 6;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.animationDelay = (i * 0.5) + 's';
            particle.style.background = `hsl(${180 + i * 20}, 100%, 60%)`;
            container.appendChild(particle);
        }
    }

    activateMatrix(element) {
        const cube = element.querySelector('.wireframe-cube');
        const faces = element.querySelectorAll('.cube-face');
        const particles = element.querySelectorAll('.particle');
        const text = element.querySelector('.watermark-text');

        if (!cube || !faces || !text) return;

        // Usar GSAP se disponível, senão fallback CSS
        if (typeof gsap !== 'undefined') {
            // Animação com GSAP
            gsap.set(cube, { animation: 'none' });
            gsap.to(cube, {
                rotationX: 720,
                rotationY: 720,
                rotationZ: 360,
                duration: 1.5,
                ease: 'power2.inOut'
            });

            gsap.to(text, {
                scale: 1.05,
                textShadow: '0 0 10px rgba(0, 255, 136, 0.8)',
                duration: 0.3
            });

            // Reset após animação
            gsap.to(cube, {
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                duration: 0.5,
                delay: 1.5,
                ease: 'power2.out',
                onComplete: () => {
                    cube.style.animation = 'cubeRotate 8s ease-in-out infinite';
                }
            });

            gsap.to(text, {
                scale: 1,
                textShadow: 'none',
                duration: 0.3,
                delay: 1.8
            });

        } else {
            // Fallback CSS puro
            cube.style.animation = 'cubeRotate 1s ease-in-out 2';
            text.style.transform = 'scale(1.05)';
            text.style.textShadow = '0 0 10px rgba(0, 255, 136, 0.8)';
            text.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                cube.style.animation = 'cubeRotate 8s ease-in-out infinite';
                text.style.transform = 'scale(1)';
                text.style.textShadow = 'none';
            }, 2000);
        }

        // Intensificar faces do cubo
        faces.forEach((face, index) => {
            const colors = [
                '0,255,136',    // primary
                '0,153,255',    // secondary  
                '255,0,136',    // accent
                '0,255,136',    // left
                '255,107,53',   // top
                '196,76,255'    // bottom
            ];

            const originalShadow = face.style.boxShadow;
            face.style.boxShadow = `inset 0 0 20px rgba(${colors[index]}, 0.8)`;
            face.style.borderWidth = '2px';

            setTimeout(() => {
                face.style.boxShadow = originalShadow;
                face.style.borderWidth = '1px';
            }, 1500);
        });

        // Acelerar partículas
        particles.forEach(particle => {
            const originalAnimation = particle.style.animation;
            particle.style.animation = 'particleOrbit 2s linear infinite';

            setTimeout(() => {
                particle.style.animation = originalAnimation || 'particleOrbit 6s linear infinite';
            }, 2000);
        });

        // Criar mini explosão 3D
        this.createMini3DExplosion(element);
    }

    createMini3DExplosion(container) {
        const explosionCount = 8;
        const cubeContainer = container.querySelector('.cube-container');
        if (!cubeContainer) return;

        for (let i = 0; i < explosionCount; i++) {
            const fragment = document.createElement('div');
            fragment.style.position = 'absolute';
            fragment.style.width = '2px';
            fragment.style.height = '2px';
            fragment.style.background = `hsl(${i * 45}, 100%, 60%)`;
            fragment.style.borderRadius = '50%';
            fragment.style.left = '50%';
            fragment.style.top = '50%';
            fragment.style.zIndex = '20';
            fragment.style.boxShadow = '0 0 5px currentColor';

            const angle = (i / explosionCount) * Math.PI * 2;
            const distance = 15;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            cubeContainer.appendChild(fragment);

            // Usar GSAP se disponível
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(fragment,
                    {
                        scale: 0,
                        opacity: 1,
                        x: -1,
                        y: -1
                    },
                    {
                        scale: 1,
                        opacity: 0,
                        x: x * 1.5,
                        y: y * 1.5,
                        duration: 1,
                        ease: 'power2.out',
                        onComplete: () => fragment.remove()
                    }
                );
            } else {
                // Fallback com CSS animations
                fragment.animate([
                    {
                        transform: 'translate(-50%, -50%) scale(0)',
                        opacity: 1
                    },
                    {
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)`,
                        opacity: 0.7
                    },
                    {
                        transform: `translate(-50%, -50%) translate(${x * 1.5}px, ${y * 1.5}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });

                setTimeout(() => fragment.remove(), 1000);
            }
        }
    }

    // Recriar partículas periodicamente
    recreateParticles() {
        setInterval(() => {
            this.createGeometricParticles();
        }, 15000);
    }
}

// Integração com o sistema existente
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que tudo carregou
    setTimeout(() => {
        const nandevWatermark = new NandevWatermark();
        nandevWatermark.recreateParticles();
    }, 1000);
});

// Fallback caso DOMContentLoaded já tenha disparado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const nandevWatermark = new NandevWatermark();
            nandevWatermark.recreateParticles();
        }, 1000);
    });
} else {
    setTimeout(() => {
        const nandevWatermark = new NandevWatermark();
        nandevWatermark.recreateParticles();
    }, 1000);
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Coletar dados do formulário
        const formData = {
            fullName: document.getElementById('fullName').value,
            company: document.getElementById('company').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            product: document.getElementById('product').value,
            message: document.getElementById('message').value
        };

        // Aqui você pode enviar para um backend ou email
        // Por enquanto, vou mostrar um alerta de sucesso

        // Simular envio
        const submitBtn = contactForm.querySelector('.btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
            submitBtn.style.background = 'linear-gradient(45deg, #00ff88, #00cc6a)';

            // Reset form
            contactForm.reset();

            // Restaurar botão após 3 segundos
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);

        console.log('Dados do formulário:', formData);
    });
}
