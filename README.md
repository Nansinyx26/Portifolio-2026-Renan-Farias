# 🚀 Portfólio Avançado - Renan de Oliveira Farias

## 📋 Sobre o Projeto

Portfólio moderno e interativo desenvolvido com tecnologias de ponta para apresentar as habilidades, experiência e projetos do desenvolvedor Renan de Oliveira Farias. O projeto combina design contemporâneo, animações fluidas e interatividade avançada para criar uma experiência envolvente.

## ✨ Características Principais

### 🎨 Design & UX
- **Glassmorphism UI** com efeitos de blur e transparência
- **Animações GSAP** com timeline otimizada e ScrollTrigger
- **Scene 3D interativa** com Three.js no hero section
- **Cursor customizado** com efeitos de hover
- **Tema dark/light** com transições suaves
- **Design responsivo** para todos os dispositivos

### 🤖 IA Integrada
- **Chatbot inteligente** com respostas contextuais sobre o portfólio
- **Sistema de conversação** natural sobre habilidades e projetos
- **Interface moderna** com animações de typing e status online

### ⚡ Performance
- **Carregamento otimizado** com loading screen animada
- **Lazy loading** para imagens de projetos
- **Intersection Observer** para animações sob demanda
- **Código modular** com classes ES6

## 🛠️ Tecnologias Utilizadas

### Frontend Core
- **HTML5** semântico e acessível
- **CSS3** com custom properties e glassmorphism
- **JavaScript ES6+** com programação orientada a objetos
- **Google Fonts** (Inter) para tipografia moderna

### Bibliotecas & Frameworks
- **GSAP 3.12.2** - Animações profissionais
  - ScrollTrigger para animações baseadas em scroll
  - TextPlugin para efeito de digitação
- **Three.js 0.169** - Renderização 3D fisicamente baseada (PBR)
- **Font Awesome 6.4.0** - Ícones vetoriais

### Funcionalidades Avançadas
- **Sistema de temas** com localStorage
- **Menu mobile** responsivo
- **Smooth scrolling** nativo e via JavaScript
- **Custom cursor** com blend modes

## 📂 Estrutura do Projeto

```
portfolio/
├── index.html                  # Estrutura principal
├── css/
│   ├── style.css               # Estilos base e componentes
│   ├── marcadagua.css          # Marca d'água NanDev
│   └── design-system.css       # Design tokens (OKLCH) — carregado por último
├── js/
│   ├── config.js               # Normaliza a configuração em window.APP_CONFIG
│   ├── config.generated.js     # GERADO a partir do .env — não editar à mão
│   ├── hero-scene.js           # Cena 3D do hero (módulo ESM, Three.js moderno)
│   ├── script.js               # Navegação, tema, chatbot, marca d'água
│   └── contact-form-email.js   # Formulário de contato (EmailJS)
├── api/
│   └── tts.example.js          # Proxy serverless para o ElevenLabs (modelo)
├── scripts/
│   └── build-config.mjs        # Gera config.generated.js a partir do .env
├── imagens/
│   ├── logo.svg                # Logo horizontal (marca + assinatura)
│   ├── logo-mark.svg           # Símbolo isolado (favicon)
│   └── profile-img.png
├── Gif/                        # Demonstrações dos projetos
├── .env                        # Configuração local (não versionado)
├── .env.example                # Modelo com instruções
└── README.md
```

## ⚙️ Configuração

As credenciais ficam no `.env`, não no código. Depois de editá-lo, regenere o
arquivo que o navegador carrega:

```bash
cp .env.example .env     # primeira vez
node scripts/build-config.mjs
```

> **Este site é estático.** Qualquer valor exportado para `js/config.generated.js`
> é baixado pelo navegador e fica visível em DevTools. O `build-config.mjs` só
> exporta chaves de uma allowlist e **aborta** se detectar um segredo conhecido
> (OpenAI, Google, AWS, Stripe, MongoDB). Credenciais que dão acesso pago devem
> ficar num proxy no servidor — veja `api/tts.example.js`.

### Voz do chatbot (TTS)

| Configuração no `.env`  | Comportamento                                        |
| ----------------------- | ---------------------------------------------------- |
| tudo vazio *(padrão)*   | Web Speech API do navegador — gratuita, sem chave     |
| `ELEVENLABS_PROXY_URL`  | Vozes do ElevenLabs com a chave protegida no servidor |
| `ELEVENLABS_API_KEY`    | Vozes do ElevenLabs, mas **a chave fica pública**     |

## 🎬 Cena 3D do Hero

`js/hero-scene.js` renderiza a cena com Three.js moderno (via import map):

- **IBL** com `RoomEnvironment` + PMREM — reflexos reais sem baixar HDRI
- **Materiais físicos**: vidro com transmissão e dispersão, metal escovado,
  iridescência de filme fino, verniz (clearcoat) e cerâmica com sheen
- **Tone mapping ACES Filmic** em espaço linear
- **Pós-processamento**: bloom seletivo, aberração cromática, vinheta e grão
- **Poeira volumétrica** animada no vertex shader (custo zero de CPU)

Os objetos são posicionados como frações do frustum da câmera, então permanecem
fora da área do texto em qualquer proporção de tela.

**Desempenho e acessibilidade:** a cena reduz qualidade em telas pequenas,
congela quando sai de vista ou a aba fica oculta, e respeita
`prefers-reduced-motion` renderizando um único quadro estático. Sem WebGL, o
canvas é removido e o CSS aplica um gradiente no lugar.

## 🎯 Seções do Portfólio

### 1. **Hero Section**
- Animação 3D de fundo com geometrias flutuantes
- Efeito de typing com múltiplas profissões
- CTAs para projetos e contato
- Indicador de scroll animado

### 2. **Sobre Mim**
- Foto de perfil com anel rotativo animado
- Informações pessoais e profissionais
- Grid de informações complementares

### 3. **Habilidades Técnicas**
- Cards em glassmorphism com hover effects
- Tags interativas para tecnologias
- Categorização por áreas de expertise:
  - Programação (JavaScript, React, Three.js, C#, Python, Arduino)
  - Inteligência Artificial (ChatGPT, Claude AI, Prompt Engineering)
  - Tecnologias Maker (Impressão 3D, Cortadora Laser, Prototipagem)
  - Design & 3D (Blender, WebGL, GSAP)
  - Desenvolvimento de Jogos (Unity, VR/AR)
  - Educação Tech (Workshops, Mentoria, IA na Educação)

### 4. **Experiência Profissional**
- Timeline vertical interativa
- Animações escalonadas nos cards
- Ícones temáticos para cada posição
- Hover effects com transformações 3D

### 5. **Projetos em Destaque**
- Grid responsivo com 6 projetos principais
- Imagens com hover zoom
- Tags tecnológicas específicas
- Links para GitHub e demos ao vivo

### 6. **Contato**
- Informações de contato organizadas
- CTAs para email e LinkedIn
- Design centrado e acessível

## 🤖 Chatbot IA

### Funcionalidades
- **Respostas contextuais** sobre habilidades, experiência e projetos
- **Interface moderna** com glassmorphism
- **Animações fluidas** para mensagens e typing indicator
- **Tema adaptativo** seguindo o tema do site
- **Base de conhecimento** categorizada por tópicos:
  - Experiência profissional
  - Habilidades técnicas
  - Projetos desenvolvidos
  - Formação acadêmica
  - Informações de contato
  - Especialização em IA
  - Tecnologias maker
  - Desenvolvimento de jogos
  - Desenvolvimento web
  - Disponibilidade para projetos

### Uso do Chatbot
1. Clique no botão flutuante no canto inferior direito
2. Digite perguntas sobre Renan, suas habilidades ou projetos
3. Receba respostas detalhadas e contextuais
4. O chatbot se adapta automaticamente ao tema do site

## 🚀 Como Executar

### Desenvolvimento Local
1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd portfolio-renan
   ```

2. **Servidor local**
   ```bash
   # Com Python
   python -m http.server 8000
   
   # Com Node.js
   npx http-server
   
   # Com PHP
   php -S localhost:8000
   ```

3. **Acesse no navegador**
   ```
   http://localhost:8000
   ```

### Deploy
O projeto é estático e pode ser hospedado em:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Surge.sh**
- Qualquer servidor web

## 🎨 Customização

### Cores e Temas
```css
:root {
    --primary: #00ff88;
    --secondary: #0099ff;
    --accent: #ff0088;
    /* Outras variáveis CSS */
}
```

### Conteúdo do Chatbot
Edite as respostas em `script.js` na função `generateResponses()`:

```javascript
generateResponses() {
    return [
        {
            keywords: ['palavra-chave'],
            responses: ['Resposta personalizada']
        }
    ];
}
```

## 📱 Responsividade

- **Desktop**: Layout completo com animações 3D
- **Tablet**: Adaptação de grids e navegação
- **Mobile**: Menu hamburger, layout simplificado, animações otimizadas

## ⚡ Performance

### Otimizações Implementadas
- **Intersection Observer** para lazy loading de animações
- **RequestAnimationFrame** para animações suaves
- **Throttling** em eventos de scroll
- **CSS transforms** para animações performáticas
- **Minificação** de recursos externos via CDN

### Métricas Esperadas
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔧 Manutenção

### Atualizando Projetos
1. Adicione novas imagens na pasta `images/`
2. Edite a seção de projetos no `index.html`
3. Atualize as respostas do chatbot se necessário

### Atualizando Experiência
1. Modifique a timeline no `index.html`
2. Ajuste as animações no `script.js` se necessário

## 📄 Licença

Este projeto é de uso pessoal para o portfólio de Renan de Oliveira Farias. O código pode ser usado como referência respeitando os créditos ao autor original.

## 📞 Contato do Desenvolvedor

- **Email**: oliversinyxcontato@gmail.com
- **Telefone**: (19) 98427-5085
- **LinkedIn**: [bit.ly/46QNGZv](https://bit.ly/46QNGZv)
- **GitHub**: [github.com/Nansinyx26](https://github.com/Nansinyx26)
- **Localização**: Americana, SP

---

*Desenvolvido com tecnologias avançadas e muito ❤️ por Renan de Oliveira Farias*

*Os desenvolvimentos atuais são realizados com auxílio do **Claude Code Pro**, usado para revisão de código, refatoração assistida e aceleração da implementação.*
