/**
 * HERO-SCENE.JS — Cena 3D fotorrealista do hero
 * Portfolio Renan de Oliveira Farias
 *
 * Substitui a antiga cena wireframe (Three.js r128) por renderização PBR moderna:
 *   - Iluminação baseada em imagem (IBL) via RoomEnvironment + PMREM — reflexos reais
 *   - Materiais físicos: vidro com transmissão/dispersão, metal escovado, iridescência
 *   - Pipeline linear com tone mapping ACES Filmic (resposta de cor cinematográfica)
 *   - Pós-processamento: bloom seletivo, aberração cromática, vinheta e grão de filme
 *   - Campo de poeira volumétrica animado na GPU
 *
 * Performance e acessibilidade são de primeira classe: a cena reduz qualidade em
 * telas pequenas, congela quando fora de vista ou com a aba oculta, e respeita
 * `prefers-reduced-motion` renderizando um único quadro estático.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ---------------------------------------------------------------------------
// Configuração por nível de dispositivo
// ---------------------------------------------------------------------------

const QUALITY = {
    high: { objects: 7, dust: 900, maxPixelRatio: 2, bloomStrength: 0.55, transmission: true },
    low: { objects: 4, dust: 350, maxPixelRatio: 1.5, bloomStrength: 0.35, transmission: false }
};

/** Paleta alinhada às variáveis CSS do site (--primary / --secondary / --accent). */
const PALETTE = {
    primary: 0x00ff88,
    secondary: 0x0099ff,
    accent: 0xff0088,
    violet: 0xc44cff,
    ember: 0xff6b35
};

// ---------------------------------------------------------------------------
// Shader de acabamento: vinheta + aberração cromática + grão animado
// ---------------------------------------------------------------------------

const FinishShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uVignette: { value: 1.15 },
        uVignetteFloor: { value: 0.55 },
        uAberration: { value: 0.0016 },
        uGrain: { value: 0.045 }
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uVignette;
        uniform float uVignetteFloor;
        uniform float uAberration;
        uniform float uGrain;
        varying vec2 vUv;

        // Ruído hash barato — suficiente para grão de filme.
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
            vec2 uv = vUv;
            vec2 toCenter = uv - 0.5;
            float dist = length(toCenter);

            // Aberração cromática: canais divergem radialmente rumo às bordas.
            vec2 offset = toCenter * uAberration * dist * 2.0;
            vec4 color;
            color.r = texture2D(tDiffuse, uv + offset).r;
            color.g = texture2D(tDiffuse, uv).g;
            color.b = texture2D(tDiffuse, uv - offset).b;
            color.a = 1.0;

            // Vinheta suave (smoothstep evita o anel visível de uma queda linear).
            // O piso é ajustável: escurecer as bordas funciona sobre fundo escuro,
            // mas sobre fundo claro produziria cantos acinzentados e sujos.
            float vignette = smoothstep(0.85, 0.15, dist * uVignette);
            color.rgb *= mix(uVignetteFloor, 1.0, vignette);

            // Grão animado, atenuado nas altas luzes para não sujar os realces.
            float luminance = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
            float grain = hash(uv * 1024.0 + fract(uTime) * 137.0) - 0.5;
            color.rgb += grain * uGrain * (1.0 - luminance);

            gl_FragColor = color;
        }
    `
};

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

/** Textura de partícula gerada em canvas — evita requisição de rede. */
function createDustTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0.0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1.0, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function supportsWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Cena
// ---------------------------------------------------------------------------

class HeroScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.hero = canvas.closest('.hero') || canvas.parentElement;

        this.quality = window.innerWidth < 900 ? QUALITY.low : QUALITY.high;
        this.reducedMotion = prefersReducedMotion();

        this.clock = new THREE.Clock();
        this.objects = [];
        this.disposables = [];

        // Alvo do mouse (-1..1) e valor amortecido que a câmera realmente segue.
        this.pointer = new THREE.Vector2(0, 0);
        this.pointerDamped = new THREE.Vector2(0, 0);
        this.scrollProgress = 0;

        this.isVisible = true;
        this.isFocused = true;
        this.frameHandle = null;

        this.#initRenderer();
        this.#initScene();
        this.#initLights();
        this.#initObjects();
        this.#initDust();
        this.#initComposer();
        this.#bindEvents();

        this.#applyTheme(document.body.getAttribute('data-theme') || 'dark');

        if (this.reducedMotion) {
            // Sem movimento: um único quadro nítido, sem laço de animação.
            this.#renderFrame();
        } else {
            this.#start();
        }
    }

    // -- Setup ---------------------------------------------------------------

    #initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.maxPixelRatio));

        // Tone mapping filmico + espaço de cor correto = base do realismo.
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    #initScene() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45, // FOV cinematográfico — 75 distorce as bordas
            window.innerWidth / window.innerHeight,
            0.1,
            120
        );
        this.camera.position.set(0, 0, 14);

        // IBL procedural: reflexos e resposta de rugosidade realistas sem baixar HDRI.
        const pmrem = new THREE.PMREMGenerator(this.renderer);
        pmrem.compileEquirectangularShader();

        const roomEnvironment = new RoomEnvironment();
        this.envMap = pmrem.fromScene(roomEnvironment, 0.04).texture;
        this.scene.environment = this.envMap;

        roomEnvironment.traverse((node) => {
            if (node.geometry) node.geometry.dispose();
            if (node.material) node.material.dispose();
        });
        pmrem.dispose();
    }

    #initLights() {
        // Três pontos clássicos: key quente, rim fria, fill suave.
        this.keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
        this.keyLight.position.set(6, 8, 10);

        this.rimLight = new THREE.DirectionalLight(PALETTE.secondary, 3.0);
        this.rimLight.position.set(-8, -3, -6);

        this.fillLight = new THREE.DirectionalLight(PALETTE.primary, 0.7);
        this.fillLight.position.set(-5, 4, 8);

        this.scene.add(this.keyLight, this.rimLight, this.fillLight);
    }

    #initObjects() {
        const geometries = [
            new THREE.IcosahedronGeometry(1.15, 6),
            new THREE.TorusKnotGeometry(0.78, 0.26, 220, 32),
            new THREE.SphereGeometry(1.0, 64, 64),
            new THREE.OctahedronGeometry(1.2, 3),
            new THREE.TorusGeometry(0.9, 0.3, 48, 128),
            new THREE.CapsuleGeometry(0.55, 0.9, 16, 32),
            new THREE.DodecahedronGeometry(1.05, 2)
        ];
        this.disposables.push(...geometries);

        const materials = this.#createMaterials();

        const count = this.quality.objects;

        for (let i = 0; i < count; i++) {
            const geometry = geometries[i % geometries.length];
            const material = materials[i % materials.length];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            mesh.scale.setScalar(0.55 + Math.random() * 0.45);

            // As posições são guardadas como FRAÇÕES do frustum, não em unidades
            // de mundo: assim os objetos continuam fora da zona do texto em
            // qualquer proporção de tela, e basta recalcular no resize.
            //
            // Lados alternados mantêm o centro livre para o título.
            mesh.userData = {
                side: i % 2 === 0 ? 1 : -1,
                xFraction: 0.58 + Math.random() * 0.3,   // 58%–88% da meia-largura
                yFraction: (Math.random() - 0.5) * 1.5,
                depth: -3 - (i % 4) * 2.2,
                basePosition: new THREE.Vector3(),
                floatAmplitude: 0.35 + Math.random() * 0.5,
                floatSpeed: 0.25 + Math.random() * 0.35,
                floatPhase: Math.random() * Math.PI * 2,
                spinX: (Math.random() - 0.5) * 0.14,
                spinY: (Math.random() - 0.5) * 0.14,
                parallaxDepth: 0.4 + (i % 4) * 0.22
            };

            this.scene.add(mesh);
            this.objects.push(mesh);
        }

        this.layoutObjects();
    }

    /**
     * Converte as frações guardadas em coordenadas de mundo, medindo o frustum
     * na profundidade de cada objeto. Chamado no init e a cada resize.
     */
    layoutObjects() {
        const fovRadians = THREE.MathUtils.degToRad(this.camera.fov);

        for (const mesh of this.objects) {
            const data = mesh.userData;

            const distance = this.camera.position.z - data.depth;
            const halfHeight = Math.tan(fovRadians / 2) * distance;
            const halfWidth = halfHeight * this.camera.aspect;

            data.basePosition.set(
                data.side * halfWidth * data.xFraction,
                halfHeight * data.yFraction,
                data.depth
            );

            mesh.position.copy(data.basePosition);
        }
    }

    #createMaterials() {
        const materials = [];

        // 1. Vidro — transmissão real com dispersão. Caro, só em desktop.
        if (this.quality.transmission) {
            materials.push(new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0,
                roughness: 0.03,
                transmission: 1,
                thickness: 1.6,
                ior: 1.52,
                dispersion: 1.4,
                clearcoat: 1,
                clearcoatRoughness: 0.05,
                envMapIntensity: 1.6
            }));
        }

        // 2. Metal escovado — a rugosidade média é o que "lê" como metal real.
        materials.push(new THREE.MeshPhysicalMaterial({
            color: 0xcfd4d8,
            metalness: 1,
            roughness: 0.24,
            envMapIntensity: 1.8
        }));

        // 3. Iridescente — filme fino, muda de matiz conforme o ângulo.
        materials.push(new THREE.MeshPhysicalMaterial({
            color: 0x101418,
            metalness: 0.9,
            roughness: 0.18,
            iridescence: 1,
            iridescenceIOR: 1.34,
            iridescenceThicknessRange: [120, 520],
            envMapIntensity: 1.5
        }));

        // 4. Verniz sobre pigmento — o clearcoat cria o realce especular duplo.
        //    A cor é dessaturada de propósito: o verde puro da marca, já claro,
        //    ultrapassa o limiar do bloom e vira um borrão sem forma.
        materials.push(new THREE.MeshPhysicalMaterial({
            color: 0x1f8f5f,
            metalness: 0.2,
            roughness: 0.42,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
            envMapIntensity: 1.2
        }));

        // 5. Emissivo — alimenta o bloom sem estourar a exposição.
        materials.push(new THREE.MeshPhysicalMaterial({
            color: 0x05070a,
            metalness: 0.6,
            roughness: 0.3,
            emissive: PALETTE.accent,
            emissiveIntensity: 0.75,
            envMapIntensity: 1.0
        }));

        // 6. Cerâmica — contraponto fosco que valoriza os materiais brilhantes.
        materials.push(new THREE.MeshPhysicalMaterial({
            color: 0x1b2028,
            metalness: 0.05,
            roughness: 0.78,
            sheen: 0.6,
            sheenColor: new THREE.Color(PALETTE.secondary),
            envMapIntensity: 0.9
        }));

        this.disposables.push(...materials);
        return materials;
    }

    #initDust() {
        const count = this.quality.dust;
        const positions = new Float32Array(count * 3);
        const seeds = new Float32Array(count);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 42;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 4;
            seeds[i] = Math.random() * Math.PI * 2;
            // Faixa estreita e pequena: poeira deve sugerir atmosfera, não competir
            // com os objetos. Valores maiores viram manchas sob o bloom aditivo.
            sizes[i] = 0.35 + Math.random() * 0.75;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

        const texture = createDustTexture();

        // Deriva calculada no vertex shader: zero custo de CPU por quadro.
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: texture },
                uColor: { value: new THREE.Color(PALETTE.primary) },
                uOpacity: { value: 0.26 }
            },
            vertexShader: /* glsl */ `
                attribute float aSeed;
                attribute float aSize;
                uniform float uTime;
                varying float vFade;

                void main() {
                    vec3 pos = position;
                    pos.y += sin(uTime * 0.22 + aSeed) * 1.4;
                    pos.x += cos(uTime * 0.16 + aSeed * 1.7) * 1.1;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

                    // Partículas distantes somem: dá profundidade atmosférica.
                    vFade = smoothstep(48.0, 8.0, -mvPosition.z);

                    // O divisor controla o tamanho aparente; 260 deixava as
                    // partículas do tamanho dos objetos da cena.
                    gl_PointSize = aSize * (65.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: /* glsl */ `
                uniform sampler2D uTexture;
                uniform vec3 uColor;
                uniform float uOpacity;
                varying float vFade;

                void main() {
                    float alpha = texture2D(uTexture, gl_PointCoord).a;
                    if (alpha < 0.01) discard;
                    gl_FragColor = vec4(uColor, alpha * vFade * uOpacity);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.dust = new THREE.Points(geometry, material);
        this.dust.frustumCulled = false;
        this.scene.add(this.dust);

        this.disposables.push(geometry, material, texture);
    }

    #initComposer() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.maxPixelRatio));

        this.composer.addPass(new RenderPass(this.scene, this.camera));

        // Threshold alto = só realces e emissivos brilham, não a cena inteira.
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.quality.bloomStrength,
            0.5,
            0.85
        );
        this.composer.addPass(this.bloomPass);

        this.finishPass = new ShaderPass(FinishShader);
        this.composer.addPass(this.finishPass);

        // OutputPass aplica tone mapping + conversão sRGB no fim da cadeia.
        this.composer.addPass(new OutputPass());
    }

    // -- Eventos -------------------------------------------------------------

    #bindEvents() {
        this.onPointerMove = (event) => {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('pointermove', this.onPointerMove, { passive: true });

        this.onScroll = () => {
            const heroHeight = this.hero?.offsetHeight || window.innerHeight;
            this.scrollProgress = Math.min(window.scrollY / heroHeight, 1);
        };
        window.addEventListener('scroll', this.onScroll, { passive: true });

        this.onResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
            this.composer.setSize(width, height);
            this.bloomPass.setSize(width, height);

            if (this.reducedMotion) this.#renderFrame();
        };
        window.addEventListener('resize', this.onResize);

        // Congela a cena quando o hero sai de vista — economia real de bateria.
        if (this.hero && 'IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                ([entry]) => {
                    this.isVisible = entry.isIntersecting;
                    this.#updateRunState();
                },
                { threshold: 0 }
            );
            this.observer.observe(this.hero);
        }

        this.onVisibilityChange = () => {
            this.isFocused = !document.hidden;
            this.#updateRunState();
        };
        document.addEventListener('visibilitychange', this.onVisibilityChange);

        // Reage à troca de tema do site.
        this.themeObserver = new MutationObserver(() => {
            this.#applyTheme(document.body.getAttribute('data-theme') || 'dark');
            if (this.reducedMotion) this.#renderFrame();
        });
        this.themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    }

    #applyTheme(theme) {
        const isLight = theme === 'light';

        /*
         * Fundo explícito da cena.
         *
         * O renderer usa alpha: true, mas o passe final de pós-processamento
         * grava alpha = 1.0 — o canvas sai opaco de qualquer forma. Sem um fundo
         * definido, o hero virava um retângulo preto sobre a página clara.
         *
         * As cores abaixo espelham --surface-0 de cada tema, então o canvas
         * emenda com o restante da página.
         */
        this.scene.background = new THREE.Color(isLight ? 0xfbfcfd : 0x14181d);

        // No tema claro a cena precisa de menos exposição e menos bloom, ou "lava".
        this.renderer.toneMappingExposure = isLight ? 0.85 : 1.15;
        this.bloomPass.strength = isLight ? this.quality.bloomStrength * 0.45 : this.quality.bloomStrength;

        this.finishPass.uniforms.uGrain.value = isLight ? 0.02 : 0.045;
        this.finishPass.uniforms.uVignette.value = isLight ? 0.7 : 1.15;
        this.finishPass.uniforms.uVignetteFloor.value = isLight ? 0.94 : 0.55;

        this.dust.material.uniforms.uColor.value.set(isLight ? 0x0077cc : PALETTE.primary);
        this.dust.material.uniforms.uOpacity.value = isLight ? 0.14 : 0.26;

        this.rimLight.intensity = isLight ? 1.6 : 3.0;
    }

    // -- Laço ----------------------------------------------------------------

    #updateRunState() {
        if (this.reducedMotion) return;
        if (this.isVisible && this.isFocused) this.#start();
        else this.#stop();
    }

    #start() {
        if (this.frameHandle !== null) return;
        this.clock.getDelta(); // descarta o intervalo acumulado durante a pausa
        const loop = () => {
            this.frameHandle = requestAnimationFrame(loop);
            this.#update();
            this.composer.render();
        };
        this.frameHandle = requestAnimationFrame(loop);
    }

    #stop() {
        if (this.frameHandle === null) return;
        cancelAnimationFrame(this.frameHandle);
        this.frameHandle = null;
    }

    #update() {
        const delta = Math.min(this.clock.getDelta(), 0.05); // trava picos após pausa
        const elapsed = this.clock.elapsedTime;

        // Amortecimento independente da taxa de quadros.
        const damping = 1 - Math.pow(0.001, delta);
        this.pointerDamped.x += (this.pointer.x - this.pointerDamped.x) * damping;
        this.pointerDamped.y += (this.pointer.y - this.pointerDamped.y) * damping;

        for (const mesh of this.objects) {
            const data = mesh.userData;

            mesh.rotation.x += data.spinX * delta;
            mesh.rotation.y += data.spinY * delta;

            // Flutuação absoluta a partir da base — não acumula, não deriva.
            const float = Math.sin(elapsed * data.floatSpeed + data.floatPhase) * data.floatAmplitude;
            mesh.position.y = data.basePosition.y + float;

            // Paralaxe por profundidade: objetos próximos reagem mais ao mouse.
            mesh.position.x = data.basePosition.x + this.pointerDamped.x * data.parallaxDepth;
        }

        this.dust.material.uniforms.uTime.value = elapsed;
        this.finishPass.uniforms.uTime.value = elapsed;

        // A câmera orbita levemente com o mouse e recua conforme a rolagem.
        this.camera.position.x = this.pointerDamped.x * 1.6;
        this.camera.position.y = this.pointerDamped.y * 1.0;
        this.camera.position.z = 14 + this.scrollProgress * 6;
        this.camera.lookAt(0, 0, -2);
    }

    #renderFrame() {
        this.#update();
        this.composer.render();
    }

    // -- Limpeza -------------------------------------------------------------

    dispose() {
        this.#stop();

        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        this.observer?.disconnect();
        this.themeObserver?.disconnect();

        for (const item of this.disposables) item.dispose();
        this.envMap?.dispose();
        this.composer?.dispose();
        this.renderer.dispose();
    }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function init() {
    const canvas = document.querySelector('.hero-canvas');
    if (!canvas) return;

    // Sem WebGL, o CSS assume: a seção mantém o gradiente de fundo.
    if (!supportsWebGL()) {
        canvas.remove();
        document.body.classList.add('no-webgl');
        return;
    }

    try {
        window.heroScene = new HeroScene(canvas);
    } catch (error) {
        console.error('Falha ao inicializar a cena 3D:', error);
        canvas.remove();
        document.body.classList.add('no-webgl');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}
