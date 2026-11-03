# Rumo ao ENEM — HTML e CSS

Versão sem JavaScript, sem frameworks e sem instalação de dependências.
As imagens e a fonte estão incluídas e são carregadas da própria pasta.

## Como abrir

Extraia o ZIP mantendo as pastas juntas e abra `index.html` no navegador.
Para a segunda página, use o link Sobre nós ou abra `sobre.html`.

## Arquivos

- `index.html`: página inicial, apresentação, oferta e perguntas frequentes.
- `sobre.html`: página Sobre nós.
- `styles.css`: estilos das duas páginas, responsividade e animações.
- `assets/estudante.webp`: imagem da estudante criada para este projeto.
- `assets/livros.svg`: ilustração de livros.
- `assets/favicon.svg`: ícone da aba.
- `assets/fonts/`: fonte Manrope local e sua licença.

Os ícones estão embutidos nos próprios arquivos HTML para que funcionem também
ao abrir os arquivos diretamente, sem servidor.

## Como editar

Edite os textos diretamente no HTML e as cores, tamanhos e espaçamentos no CSS.
O preço está escrito na oferta, no botão principal, na FAQ e na meta descrição
da página inicial. Atualize essas ocorrências juntas se o valor mudar.

### Checkout

Sem um checkout definido, os botões mostram um aviso de inscrições indisponíveis.
O aviso usa o recurso `popover` nativo do HTML, sem JavaScript.

Quando houver um checkout real, substitua cada botão com
`popovertarget="inscricao-aviso"` que abre a inscrição por um link, mantendo
sua classe e seu conteúdo. Exemplo de estrutura (substitua a URL antes de usar):

```html
<a class="button" href="URL_HTTPS_DO_SEU_CHECKOUT">Quero me inscrever</a>
```

Faça isso nas duas páginas. Os botões de fechar o aviso não são botões de compra.
Atualize também a mensagem abaixo da oferta. Não há link de pagamento fictício.

### Vídeo

Enquanto não houver vídeo, a apresentação mostra um aviso de indisponibilidade.
Para incluir um vídeo real, substitua o botão `.video-poster` de `index.html`
por um elemento `<video controls>` com o seu arquivo, ou por um iframe oficial
do YouTube. Preserve a proporção 16:9 e não use reprodução automática com som.

### Contato, redes sociais e entrega

Adicione os links reais diretamente no rodapé e atualize as respostas da FAQ
sobre entrega e compatibilidade pelo celular quando a plataforma for definida.

## Interações sem scripts

- Menu mobile e FAQ usam `details` e `summary` nativos, com suporte a teclado.
- Avisos usam `popover` nativo: os botões abrem/fecham e Escape dispensa o aviso.
- Rolagem suave, hover e animações são feitos em CSS.
- Navegadores com suporte a `animation-timeline: view()` também animam seções
  durante a rolagem. Nos demais, o conteúdo fica normalmente visível.
- A preferência por movimento reduzido desativa as animações.

Use um navegador atual com suporte a HTML Popover API para os avisos. Menu,
perguntas e textos continuam disponíveis sem esse recurso; a indisponibilidade
das inscrições também está informada de forma permanente junto ao preço.

## Créditos

Imagem da estudante gerada por IA; não representa uma aluna real ou depoimento.
Fonte Manrope Variable, `@fontsource-variable/manrope` 5.3.0, licença SIL Open
Font License 1.1 incluída em `assets/fonts/LICENSE.txt`.

O site não foi publicado. Para hospedá-lo, envie o HTML, o CSS e a pasta `assets`
para uma hospedagem estática, preservando a estrutura de diretórios.
