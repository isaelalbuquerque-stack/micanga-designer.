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


## V6 — Digitalização fiel e edição rápida
- Detecção automática de cores da foto
- Quantidade de cores automática ou manual a partir de 2 cores
- Cores informadas pelo usuário por nome, código ou hexadecimal
- Agrupamento de cores com média real da fotografia
- Comparação de cor perceptual em LAB
- Prévia das cores detectadas
- Paleta flutuante e arrastável na tela
- Paleta recolhível
- Código da miçanga visível na paleta
- Ferramenta de seleção de cor diretamente pela célula
- Busca de miçanga por nome ou código ao editar a célula


## V6.1 — correções de usabilidade e digitalização
- Barra de ferramentas compacta com botão Mais
- Modo Mão para arrastar o tear com um dedo
- Paleta abaixo da grade, sem cobrir o desenho
- Paleta em grade, sem depender de barra horizontal
- Automático começa em 2 cores e decide a quantidade pela foto
- Detecção automática do fundo pela borda da imagem
- Recorte focado na região densa de miçangas
- Amostragem do centro de cada célula para evitar mistura com o fundo
- Fundo escuro não vira mais uma cor dominante do diagrama


## V6.2 — Seleção direta por célula
- Toque curto em qualquer miçanga abre o seletor de cores daquela célula.
- O seletor mostra cor, nome e código da miçanga e permite busca por nome/código.
- Arrastar com o pincel continua pintando várias células.
- Segurar brevemente também inicia pintura com a cor já selecionada.
- O botão 🎯 permanece como modo dedicado de seleção por célula.


## V6.3 — Botão Voltar do Android
- O botão Voltar do celular agora navega dentro do aplicativo em vez de fechar imediatamente.
- Editor, Imagem → Diagrama, Novo projeto e Meus projetos retornam corretamente para a tela inicial.
- Na tela inicial, o primeiro Voltar mostra “Pressione voltar novamente para sair”.
- Um segundo Voltar em até ~2 segundos libera a saída do aplicativo.
- Mantidas as funções V6.2: seleção de cor por célula, modo Mão, zoom por pinça e digitalização melhorada.
