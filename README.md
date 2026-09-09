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


## V5 — Projetos compartilháveis e exportação

- Zoom de **5% a 500%**
- Régua com colunas A, B, C... e linhas 1, 2, 3...
- Espelhar horizontal e vertical
- Girar 90°
- 48 cores padrão
- Exportar em JPEG
- Exportar em PDF
- Salvar projeto completo em `.jpm`
- Importar `.jpm` em outro celular
- Compartilhar `.jpm` pela folha de compartilhamento quando suportado
- Salvar como cópia
- Ícones JP 192×192 e 512×512
- Cache offline V5

A associação direta do arquivo `.jpm` depende do suporte do navegador/sistema operacional. O botão “Importar projeto .JPM” funciona como alternativa segura.


## V5.1 — Organização do editor
- Primeira barra mantém os botões de ações do editor.
- Botão 🎨 Paleta adicionado à primeira barra.
- A paleta abre imediatamente abaixo da barra de ações.
- As cores exibidas vêm diretamente de `project.palette`, a mesma tabela de cores do projeto.
- A cor selecionada fica destacada.
- Botão `＋ Cor` permanece junto da paleta.
- A tabela/grade fica logo abaixo da paleta.
- Menus e botões foram compactados para aproveitar melhor a altura da tela no celular.
- Estrutura da grade, réguas e modo Tear da V5 foram preservados.


## V5.2 — troca de cor por célula
- Célula em branco: recebe diretamente a cor selecionada na barra de paleta.
- Célula já preenchida: não é sobrescrita imediatamente.
- Ao tocar em uma célula colorida, aparece “Escolha nova cor” e abre a tabela de cores do próprio projeto.
- A nova cor escolhida também passa a ser a cor selecionada na paleta.


## V5.3 — barras organizadas
- Removidos da barra principal os comandos duplicados de salvar/exportar/compartilhar.
- A primeira barra fica dedicada às ferramentas de edição e visualização.
- A paleta de cores continua imediatamente abaixo da primeira barra.
- A barra de arquivo acima da tabela agora contém: Salvar, JPM, JPG, PDF e Compartilhar.
- Mantida a troca de cor por célula da V5.2.


## V5.4 — zoom na tabela e réguas fixas
- Controles de zoom removidos da primeira barra de ferramentas.
- Zoom − / porcentagem / + colocado no canto superior direito da área da tabela.
- Régua horizontal permanece visível durante a rolagem vertical.
- Régua vertical permanece visível durante a rolagem horizontal.
- Canto das duas réguas permanece fixo para facilitar a localização de linha e coluna.
