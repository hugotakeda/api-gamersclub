# Guia de Seletores - Gamers Club

Este guia te ajuda a identificar os seletores HTML corretos para extrair dados do site da Gamers Club.

## Como Inspecionar o Site

1. **Acesse um perfil de jogador**
   - Vá para `https://gamersclub.com.br/player/[ID]`
   - Exemplo: `https://gamersclub.com.br/player/12345`

2. **Abra o DevTools**
   - Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux)
   - Pressione `Cmd+Option+I` (Mac)

3. **Use o Seletor de Elementos**
   - Clique no ícone de seta no canto superior esquerdo do DevTools
   - Passe o mouse sobre os elementos que você quer extrair

## Dados a Inspecionar

### 1. Perfil do Jogador

Procure por estes elementos na página de perfil:

**Nickname:**
\`\`\`
Procure por: <h1>, <span class="player-name">, ou similar
Exemplo de seletor: .profile-header h1
                    [data-testid="player-name"]
                    .player-info__name
\`\`\`

**Level:**
\`\`\`
Procure por: Badge de nível, número grande, ou ícone com número
Exemplo de seletor: .player-level
                    .badge-level
                    [data-level]
\`\`\`

**KDA (Kill/Death/Assist Ratio):**
\`\`\`
Procure por: Seção de estatísticas, pode estar como "K/D" ou "KDA"
Exemplo de seletor: .stats-kda
                    .player-stats__kda
                    [data-stat="kda"]
\`\`\`

### 2. Partidas Finalizadas

Navegue até a aba/seção de partidas e procure:

**Container de Partidas:**
\`\`\`
Procure por: Lista de partidas, grid de matches
Exemplo de seletor: .matches-list
                    .match-history
                    [data-matches]
\`\`\`

**Cada Partida Individual:**
\`\`\`
Procure por: Card de partida, item da lista
Exemplo de seletor: .match-item
                    .match-card
                    [data-match-id]
\`\`\`

**Dados de Cada Partida:**

- **Data:**
  \`\`\`
  .match-date
  .match__date
  time[datetime]
  \`\`\`

- **Resultado (Vitória/Derrota):**
  \`\`\`
  .match-result
  .match--win / .match--loss
  [data-result]
  \`\`\`

- **Placar:**
  \`\`\`
  .match-score
  .score
  .match__score
  \`\`\`

- **Mapa:**
  \`\`\`
  .match-map
  .map-name
  [data-map]
  \`\`\`

### 3. Estatísticas Detalhadas

Procure pela seção de estatísticas gerais:

**Winrate:**
\`\`\`
Procure por: Porcentagem de vitórias, gráfico circular
Exemplo de seletor: .stat-winrate
                    [data-stat="winrate"]
                    .stats__winrate
\`\`\`

**Headshot %:**
\`\`\`
Procure por: Porcentagem de headshot, ícone de cabeça
Exemplo de seletor: .stat-headshot
                    [data-stat="hs"]
                    .stats__headshot-percentage
\`\`\`

**Kills / Deaths / Assists:**
\`\`\`
Procure por: Números grandes em cards ou tabela de stats
Exemplo de seletor: .stat-kills
                    .stat-deaths
                    .stat-assists
                    [data-stat="kills"]
\`\`\`

## Exemplo Prático

Depois de identificar os seletores, você vai atualizar as funções assim:

\`\`\`typescript
// Antes (exemplo genérico)
const nickname = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1];

// Depois (com seletor real)
const nickname = html.match(/<span class="player-info__name"[^>]*>(.*?)<\/span>/)?.[1];
\`\`\`

## Dicas Importantes

1. **Classes CSS podem mudar**: Prefira atributos `data-*` ou IDs quando disponíveis
2. **Estrutura pode variar**: Teste com diferentes perfis de jogadores
3. **Cloudflare Protection**: Você pode precisar de headers específicos:
   \`\`\`typescript
   headers: {
     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
     'Accept': 'text/html,application/xhtml+xml',
     'Accept-Language': 'pt-BR,pt;q=0.9',
   }
   \`\`\`

## Ferramentas Úteis

- **Chrome DevTools**: Melhor para inspecionar elementos
- **Copy Selector**: Clique com botão direito no elemento → Copy → Copy selector
- **Cheerio**: Biblioteca Node.js para parsing HTML (recomendado)
- **Puppeteer**: Para sites com muito JavaScript (se necessário)

## Próximos Passos

1. Identifique todos os seletores necessários
2. Teste os seletores no console do navegador:
   \`\`\`javascript
   document.querySelector('.player-info__name')?.textContent
   \`\`\`
3. Atualize as funções em `app/api/*/route.ts`
4. Teste os endpoints da API
