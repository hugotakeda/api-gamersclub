# Gamers Club API

API não-oficial para consultar dados públicos da plataforma Gamers Club.

**Baseada na biblioteca [rodrigorioo/gamersclub-api](https://github.com/rodrigorioo/gamersclub-api)**

## 🚀 Funcionalidades

- ✅ Buscar dados de perfil (level, KDA, nickname)
- ✅ Listar partidas finalizadas
- ✅ Consultar estatísticas detalhadas (winrate, headshot, kills, deaths, assists)

## 📋 Endpoints

### Perfil do Jogador
\`\`\`
GET /api/player/[playerId]
\`\`\`

Retorna dados básicos do perfil do jogador.

**Resposta:**
\`\`\`json
{
  "success": true,
  "data": {
    "nickname": "PlayerName",
    "level": 10,
    "kda": 1.25
  }
}
\`\`\`

### Partidas
\`\`\`
GET /api/matches/[playerId]?page=1
\`\`\`

Retorna lista de partidas finalizadas.

**Parâmetros:**
- `page` (opcional): Número da página (padrão: 1)

**Resposta:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "123456",
      "date": "01/01/2024",
      "result": "vitória",
      "score": "16 - 14",
      "map": "de_dust2"
    }
  ],
  "page": 1
}
\`\`\`

### Estatísticas
\`\`\`
GET /api/stats/[playerId]
\`\`\`

Retorna estatísticas detalhadas do jogador.

**Resposta:**
\`\`\`json
{
  "success": true,
  "data": {
    "kda": 1.25,
    "headshot": 45.5,
    "winrate": 52.3,
    "kills": 1250,
    "deaths": 1000,
    "assists": 350
  }
}
\`\`\`

## 🏗️ Arquitetura

Esta API foi adaptada da biblioteca `rodrigorioo/gamersclub-api` para funcionar com Next.js:

- **`lib/gamersclub-scraper.ts`**: Classe principal que gerencia o scraping
- **Route Handlers**: Endpoints REST em `/api/*`
- **Parsing HTML**: Extração de dados usando regex (pode ser melhorado com Cheerio)

## ⚠️ Limitações e Soluções

### Proteção Cloudflare

O site da Gamers Club usa proteção Cloudflare. A implementação atual usa `fetch` simples que pode ser bloqueado.

**Soluções para produção:**

1. **Browserless.io** (Recomendado)
   - Serviço de browser headless na nuvem
   - Contorna Cloudflare automaticamente
   - Plano gratuito disponível

2. **ScrapingBee**
   - API de scraping gerenciada
   - Lida com JavaScript e Cloudflare
   - Fácil integração

3. **Bright Data**
   - Proxy residencial
   - Alta taxa de sucesso
   - Mais caro mas muito confiável

### Implementação com Browserless

\`\`\`typescript
// lib/gamersclub-scraper.ts
private async fetchWithPuppeteer(url: string): Promise<string> {
  const response = await fetch('https://chrome.browserless.io/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BROWSERLESS_API_KEY}`
    },
    body: JSON.stringify({
      url,
      waitFor: 2000
    })
  })
  
  return response.text()
}
\`\`\`

## 🔧 Como Configurar os Seletores

**⚠️ IMPORTANTE:** Os seletores HTML atuais são exemplos genéricos. Você precisa identificar os seletores reais do site.

### Passo a Passo:

1. **Leia o guia completo**: Abra o arquivo `SELECTORS_GUIDE.md` para instruções detalhadas

2. **Inspecione o site**:
   - Acesse https://gamersclub.com.br/player/[ID]
   - Pressione F12 para abrir o DevTools
   - Use o seletor de elementos para identificar cada dado

3. **Atualize as funções de parsing**:
   - `app/api/player/[playerId]/route.ts` → função `parsePlayerProfile`
   - `app/api/matches/[playerId]/route.ts` → função `parseMatches`
   - `app/api/stats/[playerId]/route.ts` → função `parsePlayerStats`

4. **Teste os endpoints**: Use a interface web em `/` para testar

### Exemplo de Atualização:

\`\`\`typescript
// Antes (genérico)
const nickname = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1];

// Depois (com seletor real que você encontrou)
const nickname = html.match(/<span class="player-info__name"[^>]*>(.*?)<\/span>/)?.[1];
\`\`\`

## 🛠️ Melhorias Sugeridas

- **Cache**: Implementar Redis/Upstash para cache de respostas
- **Rate Limiting**: Proteger contra abuso da API
- **Cheerio**: Substituir regex por parsing HTML robusto
- **Retry Logic**: Tentar novamente em caso de falha
- **Validação**: Adicionar Zod para validar dados extraídos
- **Testes**: Adicionar testes unitários para parsing

## 📦 Dependências Opcionais

Para melhorar a robustez, considere adicionar:

\`\`\`json
{
  "cheerio": "^1.0.0",  // Parsing HTML
  "zod": "^3.22.0",     // Validação
  "@upstash/redis": "^1.28.0"  // Cache
}
\`\`\`

## 🔐 Variáveis de Ambiente

Se usar serviços externos, adicione no Project Settings:

- `BROWSERLESS_API_KEY`: Para Browserless.io
- `SCRAPINGBEE_API_KEY`: Para ScrapingBee
- `UPSTASH_REDIS_URL`: Para cache Redis

## 📝 Notas

- Esta é uma API não-oficial que faz scraping do site
- Use com responsabilidade e respeite os termos de uso
- Os seletores podem mudar com atualizações do site
- Considere implementar cache para reduzir carga no servidor
