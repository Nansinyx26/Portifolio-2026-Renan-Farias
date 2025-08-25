  // ===== ADVANCED PORTFOLIO JAVASCRIPT =====
        
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
                this.setupParticles();
                
                console.log('🚀 Advanced Portfolio Initialized');
            }

            // GSAP Setup
            setupGSAP() {
                gsap.registerPlugin(ScrollTrigger, TextPlugin);
                
                // Hero animations
                const tl = gsap.timeline({ delay: 1 });
                tl.from('.hero-badge', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' })
                  .from('.hero-title', { duration: 1.2, y: 100, opacity: 0, ease: 'power3.out' }, '-=0.8')
                  .from('.hero-subtitle', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.6')
                  .from('.hero-buttons', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.4')
                  .from('.scroll-indicator', { duration: 1, y: 30, opacity: 0, ease: 'power3.out' }, '-=0.2');

                // Scroll-triggered animations
                gsap.utils.toArray('.fade-in').forEach((element, i) => {
                    gsap.fromTo(element, 
                        { opacity: 0, y: 100 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: element,
                                start: 'top 80%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                });

                // Skill cards animation
                gsap.utils.toArray('.skill-card').forEach((card, i) => {
                    gsap.fromTo(card,
                        { opacity: 0, y: 50, rotationY: 45 },
                        {
                            opacity: 1,
                            y: 0,
                            rotationY: 0,
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                });

                // Project cards animation
                gsap.utils.toArray('.project-card').forEach((card, i) => {
                    gsap.fromTo(card,
                        { opacity: 0, scale: 0.8, rotation: 5 },
                        {
                            opacity: 1,
                            scale: 1,
                            rotation: 0,
                            duration: 0.8,
                            delay: i * 0.15,
                            ease: 'back.out(1.7)',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
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
                    new THREE.SphereGeometry(0.7, 32, 32),
                    new THREE.OctahedronGeometry(0.8),
                    new THREE.TetrahedronGeometry(1),
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
                for (let i = 0; i < 15; i++) {
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
                    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
                    camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
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
                     'Tecnico de Suporte ao Usuário'
                ];

                let textIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                const typedElement = document.getElementById('typed-text');

                const type = () => {
                    const currentText = texts[textIndex];
                    
                    if (isDeleting) {
                        typedElement.textContent = currentText.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        typedElement.textContent = currentText.substring(0, charIndex + 1);
                        charIndex++;
                    }

                    let typeSpeed = isDeleting ? 50 : 100;

                    if (!isDeleting && charIndex === currentText.length) {
                        typeSpeed = 2000;
                        isDeleting = true;
                    } else if (isDeleting && charIndex === 0) {
                        isDeleting = false;
                        textIndex = (textIndex + 1) % texts.length;
                        typeSpeed = 500;
                    }

                    setTimeout(type, typeSpeed);
                };

                // Start typing effect after a delay
                setTimeout(type, 1500);
            }

            // Advanced Scroll Animations
            setupScrollAnimations() {
                // Parallax effect for sections
                gsap.utils.toArray('.section').forEach(section => {
                    gsap.to(section, {
                        yPercent: -50,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    });
                });

                // Profile image rotation on scroll
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
                        gsap.to(tag, { scale: 1.1, duration: 0.3, ease: 'back.out(1.7)' });
                    });
                    
                    tag.addEventListener('mouseleave', () => {
                        gsap.to(tag, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
                    });
                });
            }

            // Custom Cursor
            setupCustomCursor() {
                const cursor = document.querySelector('.custom-cursor');
                if (!cursor) return;

                let mouseX = 0;
                let mouseY = 0;

                document.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });

                // Smooth cursor movement
                const updateCursor = () => {
                    cursor.style.left = mouseX + 'px';
                    cursor.style.top = mouseY + 'px';
                    requestAnimationFrame(updateCursor);
                };
                updateCursor();

                // Cursor hover effects
                const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .project-card');
                
                hoverElements.forEach(el => {
                    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
                    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
                });
            }

            // Advanced Navigation
            setupNavigation() {
                const navLinks = document.querySelectorAll('.nav-link');
                const sections = document.querySelectorAll('.section');

                // Smooth scroll with offset
                navLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('href');
                        const targetSection = document.querySelector(targetId);
                        
                        if (targetSection) {
                            gsap.to(window, {
                                duration: 1.5,
                                scrollTo: { y: targetSection, offsetY: 80 },
                                ease: 'power3.inOut'
                            });
                        }
                    });
                });

                // Active navigation highlighting
                ScrollTrigger.batch(sections, {
                    onEnter: (elements) => {
                        const id = elements[0].id;
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    },
                    onEnterBack: (elements) => {
                        const id = elements[0].id;
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }

            // Theme Toggle
            setupThemeToggle() {
                const themeToggle = document.querySelector('.theme-toggle');
                if (!themeToggle) return;

                themeToggle.addEventListener('click', () => {
                    document.body.classList.toggle('light-theme');
                    
                    // Animate theme transition
                    gsap.to('body', {
                        duration: 0.5,
                        ease: 'power2.inOut'
                    });
                });
            }

            // Loading Screen
            setupLoadingScreen() {
                window.addEventListener('load', () => {
                    const loader = document.querySelector('.loader');
                    
                    gsap.to(loader, {
                        duration: 1,
                        opacity: 0,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            loader.style.display = 'none';
                        }
                    });
                });
            }

            // Particles Background
            setupParticles() {
                // Only initialize if particles.js is available
                if (typeof particlesJS === 'undefined') return;

                particlesJS('particles-js', {
                    particles: {
                        number: { value: 50 },
                        color: { value: '#00ff88' },
                        shape: { type: 'circle' },
                        opacity: {
                            value: 0.3,
                            random: true
                        },
                        size: {
                            value: 3,
                            random: true
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: '#00ff88',
                            opacity: 0.2,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: 'none',
                            random: false,
                            straight: false,
                            out_mode: 'out',
                            bounce: false
                        }
                    },
                    interactivity: {
                        detect_on: 'canvas',
                        events: {
                            onhover: { enable: true, mode: 'repulse' },
                            onclick: { enable: true, mode: 'push' }
                        }
                    },
                    retina_detect: true
                });
            }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new AdvancedPortfolio();
        });

        // Performance optimization
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        // Observe all animatable elements
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        });