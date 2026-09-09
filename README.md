# JPmiçangas Designer PWA

Primeira versão funcional do aplicativo para criação de diagramas de miçangas.

## Como publicar grátis pelo celular

1. Crie um repositório no GitHub chamado `micanga-designer`.
2. Envie TODOS os arquivos desta pasta, mantendo a pasta `icons`.
3. No Netlify, escolha "Add new site" > "Import an existing project".
4. Conecte o GitHub e escolha o repositório.
5. Como este projeto não precisa compilar:
   - Build command: deixe vazio
   - Publish directory: `.`
6. Publique.
7. Abra o endereço gerado no Chrome Android.
8. Use o botão "Instalar" do aplicativo ou o menu do Chrome > "Adicionar à tela inicial".

## Recursos desta versão

- Criar projeto
- Escolher linhas e colunas
- Grade interativa
- Pincel e borracha
- Paleta de cores
- Adicionar cor personalizada
- Simetria horizontal
- Desfazer/refazer
- Limpar desenho
- Contagem por cor
- Medidas aproximadas
- Salvar no aparelho
- Abrir e excluir projetos
- Funcionamento offline via Service Worker
- Instalação como PWA

Os projetos são salvos no armazenamento local do navegador do aparelho.


## Atualização V2.1
- Zoom 50% a 250%
- Pinça com dois dedos
- Arrastar grade ampliada
- 32 cores padrão
- Paleta e barras de rolagem maiores
- Espelhar desenho inteiro horizontalmente
- Espelhar desenho inteiro verticalmente
- Simetria durante a pintura mantida
- Modo Tear realista com fios de urdidura/trama visíveis
- Projetos antigos recebem automaticamente a paleta ampliada


## Atualização V3 — Imagem para Diagrama

- Upload de foto do brinco direto do celular
- Processamento local no navegador, sem API paga
- Escolha de 12 a 40 colunas
- Escolha de 4 a 24 cores
- Opção de ignorar fundo claro ou escuro
- Recorte automático aproximado do objeto
- Conversão da imagem em grade editável
- Geração automática de paleta
- Contagem das miçangas por cor após conversão
- Compatível com zoom, espelhamento e edição manual

Observação: a conversão é aproximada. Fotos com fundo simples, boa iluminação e o brinco visto de frente produzem resultados melhores.


## Atualização V3.1
- Aplicativo renomeado para JPmiçangas Designer
- Cor de fundo do aplicativo personalizável
- Cor de fundo da grade personalizável
- Escolhas de fundo ficam salvas no aparelho
- Botão para restaurar as cores padrão
- Atalho de cor de fundo no editor


## V4 — Identidade JPmiçangas Designer
- Nome oficial alterado para **JPmiçangas Designer**
- Nova logo lilás aplicada na tela inicial
- Nova logo aplicada no cabeçalho
- Ícones 192x192 e 512x512 atualizados para instalação no celular
- Interface redesenhada em tons lilás
- Botões principais com gradiente lilás
- Cards, bordas, seleção, barras de rolagem e destaques harmonizados
- Cor padrão do fundo atualizada para lilás claro
- Cor padrão da grade atualizada para branco-lilás
- Mantidas as funções de imagem → diagrama, zoom, espelhamento, tear, paleta e personalização


## V6 — Modos de edição no celular
- Modo Lápis ✏️: pinta continuamente e permite arrastar sobre as células.
- Modo Padrão ◉: ao tocar numa célula, abre o menu de cores para escolher a cor daquela miçanga.
- Modo Célula ▦: mantém a cor selecionada e aplica a mesma cor nas próximas células tocadas.
- A escolha de uma cor na paleta não troca automaticamente o modo de edição.
- Cache offline atualizado para forçar a instalação da nova versão.


## V6.1 — Captura por foto com grade manual
- Na função Imagem → Diagrama, linhas e colunas agora são definidas manualmente.
- O app não calcula mais automaticamente o número de linhas pela proporção da foto.
- Limites: 4–80 linhas e 4–60 colunas.
- Quantidade de cores continua configurável separadamente.


## V6.2
- Foto: mínimo de 2 cores.
- Linhas e colunas manuais.
- Opção automática para ignorar o fundo da imagem.
