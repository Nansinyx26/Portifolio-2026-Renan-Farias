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
        anchor.addEventListener('click', function(e) {
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
    }

    init() {
        this.setupEventListeners();
        this.loadWelcomeMessage();
    }

    setupEventListeners() {
        const trigger = document.getElementById('chatbotTrigger');
        const input = document.getElementById('chatbotInput');

        trigger.addEventListener('click', () => this.toggleChat());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            const chatbotContainer = document.querySelector('.chatbot-container');
            if (!chatbotContainer.contains(e.target) && this.isOpen) {
                this.closeChat();
            }
        });
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
        messageDiv.textContent = message;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
        return "Interessante pergunta! Posso te ajudar com informações sobre as habilidades do Renan, experiência profissional, projetos, educação ou contato. O que gostaria de saber especificamente?";
    }

    generateResponses() {
        return [{
                keywords: ['experiência', 'trabalho', 'emprego', 'profissional', 'carreira'],
                responses: [
                    "Renan tem experiência sólida como Técnico de Laboratório Jr. na Maker Mania LTDA (2025) e anteriormente na Amadotec (2023-2024). Trabalhou também na Secretaria da Educação com desenvolvimento em C# e suporte técnico. Tem experiência em prototipagem, impressão 3D, programação e integração de IAs educacionais.",
                    "A experiência profissional do Renan inclui desenvolvimento de protótipos com impressoras 3D, programação de microcontroladores Arduino, elaboração de workshops sobre tecnologias maker e integração de ChatGPT e Claude AI em processos educacionais.",
                ]
            },
            {
                keywords: ['habilidades', 'skills', 'tecnologias', 'competências', 'conhecimentos'],
                responses: [
                    "As principais habilidades do Renan incluem: JavaScript, C#, Python, Arduino, integração com ChatGPT e Claude AI, Prompt Engineering, impressão 3D, cortadora laser, prototipagem, eletrônica, Blender, Unity e desenvolvimento de jogos VR/AR.",
                    "Renan é especialista em tecnologias maker (impressão 3D, cortadora laser, prototipagem), programação (JavaScript, C#, Python, Arduino), desenvolvimento 3D (Blender, WebGL, Three.js) e integração de Inteligência Artificial em processos educacionais.",
                ]
            },
            {
                keywords: ['projetos', 'portfolio', 'trabalhos', 'desenvolvimento'],
                responses: [
                    "Entre os projetos destacados estão: Maker Coins 3.0 (sistema de gamificação), Sistema Solar VR 3.0 (experiência em realidade virtual), Sistema de Futebol de Botão (plataforma de gerenciamento), Sistema Escolar e Sistema de Avaliação. Todos disponíveis no GitHub.",
                    "Renan desenvolveu projetos inovadores como sistemas de gamificação, experiências VR educacionais, plataformas de gerenciamento e sistemas escolares. Você pode encontrar todos os projetos no GitHub: github.com/Nansinyx26",
                ]
            },
            {
                keywords: ['educação', 'formação', 'curso', 'faculdade', 'estudo'],
                responses: [
                    "Renan é graduado em Tecnologia em Jogos Digitais pela Fatec Americana. Tem conhecimento intermediário em inglês e é especialista em integração de IAs como ChatGPT e Claude em processos educacionais.",
                    "Formação: Graduado em Tecnologia em Jogos Digitais pela Fatec Americana. Especialização em tecnologias maker, desenvolvimento de jogos, prototipagem e integração de Inteligência Artificial educacional.",
                ]
            },
            {
                keywords: ['contato', 'email', 'telefone', 'linkedin', 'localização'],
                responses: [
                    "Você pode entrar em contato com Renan através do email: oliversinyxcontato@gmail.com, telefone: (19) 98427-5085, LinkedIn: bit.ly/46QNGZv. Ele está localizado em Americana, SP.",
                    "Para contato: Email: oliversinyxcontato@gmail.com | Telefone: (19) 98427-5085 | LinkedIn: bit.ly/46QNGZv | GitHub: github.com/Nansinyx26 | Localização: Americana, SP.",
                ]
            },
            {
                keywords: ['ia', 'inteligência artificial', 'ai', 'chatgpt', 'claude', 'prompt'],
                responses: [
                    "Renan é especialista em Prompt Engineering e integração de IAs como ChatGPT e Claude AI em processos educacionais e administrativos. Utiliza essas tecnologias para otimizar processos pedagógicos e criar experiências educacionais mais eficazes.",
                    "A expertise em IA do Renan inclui uso avançado de ChatGPT e Claude AI para automação educacional, criação de material didático, otimização de processos e desenvolvimento de soluções inovadoras para laboratórios maker.",
                ]
            },
            {
                keywords: ['maker', 'impressão 3d', '3d', 'prototipagem', 'arduino'],
                responses: [
                    "Renan é especialista em tecnologias maker: impressão 3D, cortadora laser, prototipagem rápida, programação Arduino, desenvolvimento de circuitos eletrônicos e criação de projetos educacionais hands-on.",
                    "Na área maker, Renan domina impressão 3D, prototipagem, eletrônica com Arduino, cortadora laser e desenvolvimento de workshops educacionais. Trabalha integrando tecnologia física com programação para criar soluções inovadoras.",
                ]
            },
            {
                keywords: ['jogos', 'unity', 'vr', 'ar', 'realidade virtual'],
                responses: [
                    "Renan desenvolveu projetos em VR como o Sistema Solar 3.0 Incialmente na faculdade, tem experiência com Unity para desenvolvimento de jogos e criação de experiências imersivas educacionais. Especialista em game design e prototipagem de jogos.",
                    "Na área de jogos, Renan trabalha com Unity, desenvolvimento VR/AR, game design e criação de experiências interativas educacionais. Seu projeto Sistema Solar VR demonstra expertise em realidade virtual aplicada à educação.",
                ]
            },
            {
                keywords: ['web', 'javascript',  'frontend'],
                responses: [
                    "Renan domina tecnologias web modernas: JavaScript avançado, React, Three.js para gráficos 3D, GSAP para animações, CSS avançado e desenvolvimento de interfaces interativas e responsivas.",
                    "No desenvolvimento web, Renan utiliza JavaScript, React, Three.js, WebGL, GSAP e CSS avançado para criar experiências visuais impactantes e interfaces modernas como este próprio portfólio.",
                ]
            },
            {
                keywords: ['disponibilidade', 'disponível', 'projetos', 'oportunidades'],
                responses: [
                    "Renan está disponível para novos projetos e oportunidades! Busca desafios em desenvolvimento, tecnologias maker, integração de IA educacional e projetos inovadores. Entre em contato para discutir colaborações.",
                    "Sim! Renan está aberto a novas oportunidades em desenvolvimento de software, projetos maker, consultoria em IA educacional e criação de soluções tecnológicas inovadoras.",
                ]
            },
            {
                keywords: ['idade', 'anos', 'nascimento'],
                responses: [
                    "Renan tem 27 anos e está localizado em Americana, SP. Graduado em Tecnologia em Jogos Digitais com ampla experiência em desenvolvimento e tecnologias maker.",
                ]
            },
            {
                keywords: ['olá', 'oi', 'hello', 'hi', 'bom dia', 'boa tarde', 'boa noite'],
                responses: [
                    "Olá! Como posso te ajudar com informações sobre o Renan? Posso falar sobre suas habilidades, experiência, projetos, formação ou como entrar em contato com ele.",
                    "Oi! Seja bem-vindo! Estou aqui para responder suas perguntas sobre o Renan de Oliveira. O que você gostaria de saber?",
                ]
            },
            {
                keywords: ['obrigado', 'obrigada', 'valeu', 'thanks', 'thank you'],
                responses: [
                    "Por nada! Fico feliz em ajudar. Se tiver mais dúvidas sobre o Renan ou quiser saber mais detalhes sobre algum projeto específico, estarei aqui!",
                    "De nada! Espero ter ajudado. Qualquer outra pergunta sobre as habilidades, projetos ou experiência do Renan, pode perguntar!",
                ]
            },
            {
    keywords: ['certificados', 'cursos', 'aprendizado', 'capacitação'],
    responses: [
        "Renan possui diversos certificados e cursos em tecnologia, programação e inovação. Seus certificados estão disponíveis em: https://bit.ly/3TMRBAN.",
        "Além da graduação, Renan buscou capacitação contínua em áreas como IA, programação, eletrônica e tecnologias maker. Os cursos podem ser conferidos em seu portfólio de certificados online."
    ]
},
{
    keywords: ['idiomas', 'língua', 'inglês'],
    responses: [
        "Renan possui inglês em nível intermediário, com capacidade de leitura, escrita e conversação técnica na área de tecnologia.",
        "O inglês de Renan é intermediário, o que lhe permite atuar em contextos acadêmicos, técnicos e profissionais, incluindo documentação, softwares e colaboração internacional."
    ]
},
{
    keywords: ['experiência administrativa', 'administração', 'estoque', 'lojas'],
    responses: [
        "Renan também tem experiência administrativa e de atendimento ao cliente, adquirida nas Lojas Americanas (2019-2020) e como Aprendiz na UPS Serviços (2018-2019).",
        "Além da área técnica, Renan trabalhou com organização de estoque, atendimento ao cliente e suporte administrativo, o que contribuiu para sua versatilidade profissional."
    ]
},
{
    keywords: ['programação', 'c#', 'javascript', 'html', 'css'],
    responses: [
        "Renan programou em diversas linguagens, incluindo C#, JavaScript, HTML, CSS e C++. Criou sistemas web, aplicações desktop e soluções educacionais interativas.",
        "Na Secretaria da Educação, Renan desenvolveu aplicações em C# e web (HTML, CSS, JavaScript), além de utilizar C++ e Scratch para ensino de programação."
    ]
},
{
    keywords: ['laboratório', 'maker mania', 'amadotec'],
    responses: [
        "Renan atuou como Técnico de Laboratório Jr. tanto na Maker Mania (2025) quanto na Amadotec (2023-2024), onde geriu laboratórios maker, deu workshops e desenvolveu protótipos.",
        "Sua atuação em laboratórios envolveu desde prototipagem rápida (impressão 3D, laser, Arduino) até ensino de programação, suporte técnico e integração de IA em ambientes educacionais."
    ]
},
{
    keywords: ['rede', 'ti', 'infraestrutura', 'hardware', 'suporte'],
    responses: [
        "No estágio na Secretaria da Educação, Renan foi responsável por suporte em hardware, redes e software, atuando com Google Workspace, Microsoft 365 e manutenção preventiva/corretiva.",
        "Renan tem experiência em diagnóstico e resolução de incidentes, criação de topologias de rede TCP/IP, além de instalação e atualização de sistemas Windows e Linux."
    ]
}


            
            
        ];
    }

    loadWelcomeMessage() {
        // Welcome message is already in HTML
    }
}

// Initialize Chatbot
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new Chatbot();
    chatbot.init();
});

// Alternative initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const chatbot = new Chatbot();
        chatbot.init();
    });
} else {
    const chatbot = new Chatbot();
    chatbot.init();
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
    contactForm.addEventListener('submit', function(e) {
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
