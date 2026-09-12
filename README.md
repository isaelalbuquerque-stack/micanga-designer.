# V5.23 — Captura fiel + coluna de correção de cores

- A conversão agora recorta automaticamente o objeto também no modo Fidelidade máxima, evitando transformar margens e fundo da fotografia em miçangas.
- O fundo é estimado pelas bordas da imagem, melhorando o recorte em fotos cujo fundo não é branco ou preto puro.
- A proporção automática de linhas e colunas passa a usar somente a área útil recortada.
- Projetos criados por Foto → Diagrama abrem com uma coluna vertical fixa ao lado da grade contendo todas as cores detectadas.
- Ao selecionar uma cor nessa coluna, basta tocar nas miçangas incorretas para corrigir falhas da captura.
- A coluna não cobre a grade, acompanha a rolagem e possui atalho para adicionar outra cor.
- Mantidos o visual compacto, a borracha corrigida e todas as ferramentas da V5.22.

# V5.22 — Visual compacto + borracha corrigida

- Interface do editor reorganizada conforme o visual aprovado: cabeçalho com Abrir/Salvar/Compartilhar/Menu, barra principal compacta, paleta em faixa única, modo/zoom/linhas/colunas compactos e exportações abaixo da tabela.
- Barras travadas com offsets calculados automaticamente para evitar sobreposição ao rolar.
- Ferramentas avançadas ficam em **Mais/Menu**, reduzindo a carga visual sem remover recursos.
- Borracha corrigida: toca e arrasta apagando células coloridas sem abrir o seletor de troca de cor.
- Mantidas seleção de linhas/colunas/área, espelhamento, tear, captura Foto → Diagrama e demais funções da V5.21.
- Cache do PWA atualizado para V5.22.

# V5.19 — Seleção e cópia de múltiplas linhas

- Toque nos números da régua vertical para selecionar/desmarcar qualquer quantidade de linhas.
- Barra de ações permite copiar o bloco selecionado para cima ou para baixo.
- Campo Repetir permite repetir o padrão de linhas de 1 a 99 vezes.
- A grade cresce automaticamente quando a cópia ultrapassa o fim/início disponível.
- A seleção copiada passa a ser a seleção ativa, facilitando repetir a operação.
- Desfazer/Refazer agora também restaura alterações no número de linhas.
- Mantidas as travas das barras, paleta, tabela e réguas, além das melhorias de captura e fundo limpo.

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


## Atualização V5.5
- Barra de ferramentas fixa durante a rolagem da tela.
- Barra de cores fixa logo abaixo da barra de ferramentas.
- Régua de colunas fixa no topo da grade.
- Régua de linhas fixa à esquerda da grade.
- Zoom alterado para preservar o comportamento sticky no Chrome/Android.
- Cor de fundo da grade agora altera também a área vazia e as células sem cor.
- Cache do PWA atualizado para forçar o carregamento da nova versão.


## Atualização V5.6
- Corrigido editor aparecendo por baixo das telas Home/Novo projeto.
- Editor agora só é exibido quando a view editorView está ativa.
- Mantidas correções V5.5 de barras fixas, réguas sticky e fundo da grade.


## V5.7 — Exportação fiel à grade
- JPG/PDF agora respeitam a cor de fundo da grade nas células vazias.
- Miçangas exportadas recebem volume/sombreamento semelhante ao editor.
- Corrigido o erro que transformava células vazias em branco/bege ao salvar imagem.


## V5.8 — Exportação recortada ao modelo
- JPG e PDF exportam somente a área realmente usada do desenho.
- Linhas e colunas totalmente vazias ao redor do modelo são removidas automaticamente.
- A numeração do arquivo exportado reinicia em 1 e A dentro da área recortada.
- Mantém o fundo e o efeito visual das miçangas da V5.7.


## Atualização V5.9
- Editor ocupa uma área fixa da tela e a grade não se sobrepõe às barras.
- Barra de ferramentas e paleta permanecem fora da rolagem da tabela.
- Nova ferramenta ✋ Mão para arrastar a tabela livremente.
- Réguas continuam dentro do visor com comportamento sticky.
- Pinça de dois dedos continua controlando o zoom.


## V5.10 — Editor compacto com rolagem da página
- A página inteira volta a rolar normalmente.
- Barra de ferramentas e barra de cores permanecem travadas no topo durante a rolagem.
- Ícones e espaçamentos das barras foram reduzidos para aumentar a área útil da grade.
- Lista de miçangas foi compactada e fica imediatamente abaixo da tabela de edição.
- A lista possui rolagem interna quando houver muitos itens.
- A ferramenta Mão da V5.9 foi mantida.

## V5.11 — Captura de imagem aprimorada
- A imagem agora é analisada célula por célula, sem reduzir cada célula a um único pixel suavizado.
- Melhor preservação das cores originais e de tonalidades próximas.
- Células só ficam vazias quando realmente possuem pouco conteúdo detectável.
- Novo controle de detecção: Alta, Equilibrada e Limpa.
- Fundo claro/escuro usa limites mais conservadores para não apagar miçangas claras ou escuras.
- Paleta automática passou a usar agrupamento de cores por células e suporta até 32 cores.
- Adicionada opção de 10 colunas para diagramas pequenos.


## V5.12 — Câmera e galeria
- Na tela Imagem → Diagrama, o usuário pode escolher entre abrir a câmera traseira ou selecionar uma imagem local da galeria/arquivos.
- Mantido o processamento aprimorado da V5.11.


## V5.13 — Biblioteca de modelos prontos
- Novo botão 📚 Modelos prontos na tela inicial.
- Galeria visual com miniaturas reais dos diagramas.
- Categorias: Bandeiras, Futebol, Brincos, Pulseiras e Cordões.
- Modelos iniciais incluem Brasil, Argentina, Portugal, França e Itália; padrões inspirados nas cores de Flamengo, Corinthians, Palmeiras, São Paulo, Vasco, Paysandu e Remo; além de modelos geométricos de brinco, pulseira e cordão.
- Cada modelo abre diretamente no editor e pode ser recolorido, alterado e salvo como novo projeto.

## V5.14 — Modelos personalizáveis e escudos detalhados
- Modelos prontos agora permitem escolher linhas, colunas, tamanho da miçanga e quantidade de cores.
- Mostra estimativa do tamanho físico da peça em centímetros.
- Redimensiona o diagrama antes de abrir no editor.
- Novos modelos detalhados de Flamengo e Vasco para grades maiores.
- Mantidos os modelos simples para peças pequenas.

## V5.15 — ficha completa, realismo e bloqueios reforçados
- Novo modelo Bandeira do Brasil realista 35×53 com losango proporcional, globo azul, faixa branca curva e estrelas.
- Cartões da biblioteca mostram grade, técnica, cores e quantidade de miçangas; modelos detalhados exibem nível de detalhe.
- Mantida a personalização de linhas, colunas, tamanho da miçanga e quantidade de cores.
- Barra de botões e paleta permanecem travadas acima da área de edição.
- Tabela permanece contida no visor e as réguas horizontal, vertical e canto ficam sticky durante a movimentação.

## V5.16 — Captura profissional de diagramas
- Quantidade mínima de cores reduzida de 4 para 2 (inclui 2, 3 e 5 cores).
- Linhas e colunas podem ser definidas separadamente; linhas também podem ficar automáticas.
- Novo modo Fidelidade máxima: preenche todas as células e evita buracos no diagrama.
- Novo modo Detectar fundo: permite células vazias somente quando o fundo é realmente identificado.
- Leitura de cor prioriza o centro de cada célula e usa cor dominante quantizada, reduzindo mistura com espaços, fios, reflexos e fundo.
- Maior resolução interna de processamento para preservar detalhes da imagem original.


## V5.17 — Bloqueio robusto do editor
- Barras de ferramentas e paleta reforçadas com sticky e z-index próprios.
- Tabela recortada no viewport para nunca sobrepor as barras.
- Réguas horizontal e vertical travadas por compensação de scroll em JavaScript, evitando falhas do CSS sticky com zoom no Chrome/Android.
- Mantidas todas as melhorias de captura profissional da V5.16.


## V5.18 — Fundo da tabela limpo
- Removidas as linhas grandes verticais/horizontais do fundo no modo Tear realista.
- Mantido o efeito realista dentro das próprias miçangas.
- Mantidos os bloqueios das barras, paleta, tabela e réguas da V5.17.
- Mantidas as melhorias da captura profissional da V5.16.

## V5.20
- Seleção múltipla de colunas pela régua A/B/C com cópia esquerda/direita e repetição.
- Inserção e exclusão de linhas/colunas pelas ferramentas de seleção.
- Seleção retangular por dois cantos, com recolorir, apagar e espelhar horizontal/vertical.
- Centralização automática do desenho e contorno automático com a cor ativa.
- Paleta do editor redesenhada com círculos perfeitamente simétricos.
- Mantidos bloqueios de barras/réguas, captura profissional e recursos anteriores.


## V5.21
- Corrigida de verdade a seleção de colunas pela régua alfabética.
- Toque em A, B, C... ou arraste sobre várias letras para selecionar múltiplas colunas.
- Colunas selecionadas ficam destacadas com marca de confirmação.
- Copiar para esquerda/direita com repetição até 999 e expansão automática da grade.
- Barra contextual de colunas mais visível no celular.
- Mantidas todas as funções da V5.20.
