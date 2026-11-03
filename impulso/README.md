# Impulso

MVP de inspiração pessoal com React, Vite, Tailwind CSS, React Router e Motion.
Interface em português, feita primeiro para celular. Não há serviços de backend.

## Executar

Use Node.js 22.12 ou superior (validado com Node 24) e npm.

```sh
cd impulso
npm ci
npm run dev
```

O Vite usa a porta 5173. As páginas são: início, explorar, favoritos, conteúdo
completo e uma tela de recuperação para rotas ou conteúdos inexistentes.

Para gerar e conferir a versão final:

```sh
npm test
npm run build
npm run preview
```

O build fica em `dist/`; a prévia usa a porta 4174. A pasta `dist` pode ser
enviada a uma hospedagem estática. O React Router usa `HashRouter`, por isso
as rotas funcionam sem redirecionamentos de servidor, inclusive em subpastas.
Abra o projeto com um servidor HTTP: o código React não roda por duplo clique.

## O que funciona

- Feed misto com 18 conteúdos: 12 frases autorais, 3 vídeos originais e
  3 sínteses de histórias reais com links e créditos das fontes.
- Seis categorias, filtro por formato e busca que ignora acentos.
- Filtros combináveis, mantidos na URL e restaurados ao recarregar.
- Interesses opcionais sem conta. Categorias escolhidas têm prioridade;
  etiquetas em comum também contribuem para ordenar recomendações.
- Favoritar e remover pela listagem ou pelo conteúdo completo.
- Favoritos e interesses persistidos no `localStorage`, com sincronização entre
  abas, recuperação de dados inválidos e alternativa em memória quando o
  armazenamento está bloqueado.
- Menu mobile fixo, modais nativos com suporte a teclado, foco visível e
  movimento reduzido. Vídeos com controles, legendas e transcrição.

As escolhas ficam neste navegador e nesta origem (domínio/porta). Não são
sincronizadas entre dispositivos. Limpar os dados do navegador remove essas
preferências. No modo em memória, recarregar ou fechar a aba perde as escolhas.

## Estrutura

```text
src/
  components/     Navegação, cartões, feed, filtros, mascote e modal
  pages/          Início, explorar, favoritos, conteúdo completo e 404
  data/
    categories.json
    contents.json
  lib/content.mjs Filtros, recomendações, seleção e validação de embeds
  state.jsx       Contexto de interesses, favoritos e notificações
  styles.css      Tema visual, componentes e Tailwind
public/
  media/          MP4, pôsteres SVG e legendas WebVTT locais
  fonts/          Manrope local com licença
scripts/          Verificação do catálogo antes do build
tests/            Testes de domínio e de navegação
```

## Editar os conteúdos

O catálogo está em `src/data/contents.json`. Campos obrigatórios:

| Campo | Uso |
| --- | --- |
| `id` | Identificador único em formato slug, usado na URL e nos favoritos. |
| `type` | `phrase`, `video` ou `story`. |
| `title`, `description` | Título e apresentação do conteúdo. |
| `category` | ID presente em `categories.json`. |
| `tags` | Lista de etiquetas para busca e afinidade de recomendações. |
| `author` | Autoria ou crédito editorial, sem atribuições inventadas. |
| `source` | `{ kind, label, url }`: `original` ou `external`. Fontes externas usam HTTPS. |
| `media` | `null`, vídeo local, ilustração editorial ou embed autorizado. |
| `status` | `published`, `draft` ou `archived`. Apenas publicados aparecem. |
| `body` | Parágrafos da visualização completa. |
| `prompt` | Pergunta de reflexão ao final. |

Os campos `featured` e `readingMinutes` controlam a prioridade editorial e a
estimativa de leitura. Para histórias, `media.headline` configura o texto da
ilustração editorial; não há fotografias de pessoas ou depoimentos fabricados.
Não altere IDs de conteúdos existentes sem considerar os favoritos já salvos.
IDs removidos ou despublicados são descartados das seleções ao carregar o app.

Vídeos próprios ficam em `public/media` e usam esta estrutura:

```json
{
  "kind": "video",
  "src": "media/arquivo.mp4",
  "poster": "media/capa.svg",
  "captions": "media/legendas.vtt",
  "duration": "0:18"
}
```

Para incorporar um vídeo do YouTube, confira a autorização do titular e a
permissão de incorporação antes de publicar. O app suporta:

```json
{
  "kind": "embed",
  "provider": "youtube",
  "id": "ID_DE_11_CARACTERES",
  "authorized": true,
  "poster": "media/capa-autorizada.svg",
  "duration": "3:00"
}
```

Substitua os dados de exemplo por dados reais. A marcação `authorized` documenta
a decisão editorial; ela não concede direitos. O build rejeita embeds sem a
autorização explícita ou com ID inválido. Os vídeos iniciais são próprios,
silenciosos, têm 18 segundos e não dependem de serviços externos.

Execute `npm run validate:content` após editar o JSON. Essa verificação também
roda no build e confere IDs, categorias, fontes e presença das mídias locais.

## Testes

`npm test` executa nove testes de domínio: filtros combinados, busca, estados
de publicação, recomendações por categoria e etiquetas, estabilidade de ordem,
dados persistidos inválidos, favoritos e autorização de embeds.

Para o teste funcional opcional, com Vite ou preview em execução:

```sh
python3 -m pip install playwright
python3 -m playwright install chromium
python3 tests/browser_smoke.py
```

Se houver Chromium no sistema, o teste usa esse executável. Para testar o build:

```sh
IMPULSO_TEST_URL=http://127.0.0.1:4174 python3 tests/browser_smoke.py
```

O teste cobre as rotas em oito larguras (320–1920 px), filtros e busca,
interesses, persistência e sincronização de favoritos, histórias com fontes,
reprodução real dos vídeos e legendas, recuperação de rotas, menu mobile,
movimento reduzido e armazenamento corrompido/bloqueado.

## Identidade e escopo

Fundo `#101010`, destaque `#FF4D00`, texto `#FFFFFF` e acentos `#FFCC00`.
O mascote SVG em `src/components/Mascot.jsx` é uma arte provisória original,
substituível pela identidade definitiva. Não tem braços ou pernas.

Não há cadastro, IA, pagamentos, anúncios, assinaturas, banco de dados ou
serviços externos de rastreamento. A primeira versão não tem painel editorial:
novos conteúdos são publicados por alteração do JSON e novo build.

## Créditos e fontes

- Textos e vídeos autorais: Impulso.
- Histórias: sínteses editoriais de fontes identificadas da NASA, Malala Fund
  e Nobel Prize, com crédito e link na visualização completa.
- Manrope Variable 5.3.0: SIL Open Font License, incluída em
  `public/fonts/LICENSE.txt`.
- Ícones: Lucide, licença ISC do pacote `lucide-react`.

O projeto está na subpasta `impulso/` para preservar o site Rumo ao ENEM que
já estava neste repositório. Nenhuma publicação ou implantação é automática.
