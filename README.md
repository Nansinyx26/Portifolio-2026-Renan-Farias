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
- **Three.js r128** - Gráficos 3D interativos
- **Font Awesome 6.4.0** - Ícones vetoriais

### Funcionalidades Avançadas
- **Sistema de temas** com localStorage
- **Menu mobile** responsivo
- **Smooth scrolling** nativo e via JavaScript
- **Custom cursor** com blend modes

## 📂 Estrutura do Projeto

```
portfolio/
├── index.html          # Estrutura principal
├── style.css           # Estilos e temas
├── script.js           # JavaScript principal
├── images/             # Imagens dos projetos
│   ├── MakerCoins3.0.png
│   ├── SistemaSolar.png
│   ├── SistemaFuteboldeBotão.png
│   ├── SistemaCadastroEscolar.png
│   ├── SistemaAvaliador.png
│   └── SenhaCriptografada.png
└── README.md           # Documentação
```

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
