# JPmiçangas Designer V5.39

- Prévia da geometria agora abre em **tela cheia**, sem painel flutuante.
- A tabela da prévia mantém tamanho legível como no editor; quando não cabe na largura, usa rolagem em vez de virar miniatura.
- Correção crítica do recorte de **6 pontos**: os seis pontos passam a participar da transformação da imagem, inclusive os dois pontos laterais centrais.
- A área selecionada é retificada por seis setores triangulares, preservando a silhueta escolhida antes da detecção.
- Mantidos edição célula por célula, zoom, mover, linhas/colunas, lupa e ações acima da barra inferior do celular.
- Cache do PWA atualizado para V5.39.

# JPmiçangas Designer V5.38

- Prévia ajustada para funcionar como uma **tabela editável no padrão do editor**, preservando edição, mover, zoom, linhas/colunas e correção célula por célula.
- Barra inferior da prévia agora fica **fixa e sempre visível**, com **Voltar e corrigir** e **Gerar diagrama** acima da navegação do celular.
- Aplicada a **área segura do Android/iPhone** (`safe-area`) para impedir que controles fiquem atrás da barra inferior do sistema.
- A **lupa de ajuste fino** agora fica fixa acima da barra inferior do celular em telas pequenas.
- Mantidos zoom por pinça, `−`, `+`, `100%`, `Largura` e `Inteira` da V5.37.
- Cache do PWA atualizado para V5.38.

# JPmiçangas Designer V5.37

- Prévia abre em **Ajustar à largura**, evitando o diagrama estreito demais.
- Barra de zoom fica fixa no topo da prévia.
- Zoom com `−`, `+`, `100%`, `Largura` e `Inteira`.
- Zoom por pinça com dois dedos, mantendo o ponto focal.
- Limite de zoom ampliado para 500%.
- Mantidos editar/mover, linhas/colunas e inserir/remover/trocar miçangas.
- Cache do PWA atualizado para V5.37.

# JPmiçangas Designer V5.36

- Prévia da geometria refeita como **tabela de conferência**, com letras nas colunas e números nas linhas.
- A foto é mostrada somente dentro da área selecionada, em **vista frontal e sem esticar**.
- Controles de **zoom + / −** e botão **Ver inteira** na própria prévia.
- Novo modo **✋ Mover** para arrastar a prévia nos eixos horizontal e vertical.
- Campos **Linhas** e **Colunas** permitem conferir/corrigir a dimensão antes de gerar; Atualizar grade refaz a leitura com a dimensão escolhida.
- Mantidas as ferramentas para **inserir, trocar cor e remover miçangas** célula por célula.
- Barras de rolagem da prévia foram ampliadas para uso no celular.

# JPmiçangas Designer V5.35

- Prévia da geometria agora é **editável** antes de gerar o diagrama.
- Permite completar miçangas faltantes, trocar cor e apagar detecções incorretas.
- Botão **＋ Cor** adiciona uma cor manual à prévia.
- Ajuste dos 6 pontos ganhou **lupa flutuante**, deixando a borda visível mesmo com o dedo sobre o ponto.
- Mantido o modo **✋ Arrastar imagem** nos eixos horizontal e vertical.
- Mantidos zoom por botões/pinça e barras de rolagem ampliadas.

# JPmiçangas Designer V5.34

- Adicionado botão **✋ Arrastar imagem** na tela Imagem → Diagrama.
- O modo Arrastar move a foto ampliada com um dedo sem alterar o recorte nem os 6 pontos.
- Mantido o botão **⬡ Ajustar 6 pontos** para definir a geometria do brinco.
- Mantidos zoom `+`, `−`, `100%` e zoom por pinça.
- Barras de rolagem da imagem ficaram maiores e mais fáceis de usar no celular.
- Área visível da imagem aumentada em telas pequenas.
- Cache do PWA atualizado para V5.34.

# JPmiçangas Designer V5.33

- O ajuste geométrico da imagem agora usa **6 pontos arrastáveis**: topo esquerdo/direito, meio direito, base direita/esquerda e meio esquerdo.
- Os 6 pontos definem a silhueta do brinco e a área usada pelo algoritmo.
- O recorte livre continua disponível como alternativa.
- Zoom da imagem refeito: botões `+`, `−` e `100%` agora ampliam fisicamente a foto dentro de uma área rolável.
- Zoom máximo aumentado para **600%**.
- Adicionado **zoom por pinça com dois dedos**, mantendo o ponto focal da ampliação.
- Rotação fina e Endireitar agora atuam sobre a geometria de 6 pontos.
- Cache do PWA atualizado para V5.33.

# JPmiçangas Designer V5.32

- Removida a opção **Reconstruir padrão repetido** da captura por imagem.
- Removidos os controles de período e sequenciamento do padrão na tela de imagem.
- A conversão agora usa **somente a área definida pelo Recorte livre**.
- Se não houver uma área selecionada, a Prévia da geometria e a geração do diagrama pedem que o usuário faça o recorte primeiro.
- Nenhuma linha, coluna ou bloco é replicado automaticamente durante a captura.
- Mantidos: zoom, ajuste de cantos, perspectiva e Prévia da geometria da V5.31.

# V5.31 — Prévia da geometria + ajuste de cantos e ângulo

- A tela Imagem → Diagrama ganhou **4 cantos ajustáveis** para enquadrar a peça e corrigir perspectiva antes da leitura.
- Zoom da fotografia de 100% a 400%, com botões `+`, `−` e retorno para 100%, permitindo conferir detalhes das miçangas.
- Rotação fina em passos de 1° e botão **Endireitar** baseado na borda superior selecionada.
- O recorte livre continua disponível e pode ser combinado com os quatro cantos.
- A correção dos cantos é aplicada ao processamento antes da detecção das miçangas.
- Nova tela **Prévia da geometria** antes da geração do diagrama.
- A prévia desenha a grade calculada e círculos sobre as miçangas reconhecidas, permitindo voltar e corrigir enquadramento/recorte.
- O botão final de geração fica dentro da prévia para reduzir conversões com geometria errada.
- Mantida a leitura geométrica, filtragem de pontos isolados e branco puro `#FFFFFF`.
- Cache do PWA atualizado para V5.31.

# V5.30 — Geometria das miçangas

- Mantido o recorte livre: tudo fora do contorno manual é ignorado.
- A captura vermelho/branco agora analisa o **miolo arredondado** de cada posição esperada da miçanga.
- Bordas e pequenos vazios/cruzamentos entre quatro contas ajudam a separar miçangas de fios e fechamentos.
- A análise usa resolução interna maior (até 2400 px no modo de miçangas) para preservar detalhes.
- Pontos isolados sem vizinhos no espaçamento esperado são filtrados e pequenas lacunas alinhadas podem ser reconstruídas.
- Branco continua fixado em `#FFFFFF`.
- Cache do PWA atualizado para V5.30.

# V5.29 — Recorte livre e geometria orientada pela peça

- A tela Imagem → Diagrama ganhou ferramenta **Recorte livre** diretamente sobre a prévia da câmera/galeria.
- O usuário contorna a peça com o dedo e o algoritmo ignora tudo que estiver fora desse polígono.
- O contorno manual passa a definir a área geométrica primária antes da leitura das miçangas.
- Em linhas automáticas, a proporção da área recortada orienta o número de linhas.
- Mantidas as opções de 31×61, cores reais, leitura vermelho/branco e correção manual no editor.
- Cache do PWA atualizado para V5.29.

# V5.28 — Leitura de miçangas vermelhas e brancas

- Modo padrão específico para miçangas vermelhas e brancas, baseado nas fotos da peça sobre fundo preto e claro.
- Usa o vermelho para localizar a área tecida; fundo e fios claros externos deixam de definir o recorte.
- Classifica as contas somente dentro da silhueta estimada por fileira, com branco puro e vermelho da paleta.
- A repetição 6×6 deixou de ser padrão e permanece marcada como experimental.
- Áreas sem evidência suficiente são deixadas vazias para correção manual; a leitura ainda deve ser conferida na grade.

# V5.27 — Cores reais

- Nova opção Fixar cores reais, ativada por padrão na captura.
- A cor neutra mais clara da peça é normalizada para Branco `#FFFFFF`, mesmo quando a sombra da fotografia a deixa cinza.
- Cores cromáticas são aproximadas para a família real correspondente da paleta de miçangas.
- A opção Manter tonalidades da fotografia continua disponível.
- Mantido o sequenciamento 6×6 por linhas e colunas da V5.26.

# V5.26 — Sequenciamento vertical e horizontal

- O modo repetido passa a analisar linhas e colunas simultaneamente.
- Em tabelas 31×61 com repetição 6, identifica um bloco central 6×6 por consenso.
- O bloco é replicado cinco vezes na horizontal e dez vezes na vertical.
- Primeira/última linha e primeira/última coluna são fechadas com a cor mais clara detectada.
- Também é possível escolher análise somente por linhas ou somente por colunas.
- Mantidas a coluna de correção de cores e a conversão comum da fotografia.

# V5.25 — Reconstrução de padrão repetido

- Novo modo Reconstruir padrão repetido.
- Para o modelo de referência, configura automaticamente 31 colunas, 61 linhas e 2 cores.
- Procura na região central da peça a sequência mais consistente de 6 linhas.
- Replica o bloco detectado mantendo o alinhamento das 31 colunas.
- Primeira e última linhas são fechadas com 31 miçangas da cor mais clara detectada.
- A repetição pode ser alterada para blocos de 4 a 8 linhas.
- O modo comum de conversão da fotografia permanece disponível.

# V5.24 — Captura orientada pela tabela

- Adicionada a opção de tabela com 31 colunas em Foto → Diagrama.
- O tratamento passa a usar exatamente as linhas e colunas selecionadas como referência.
- A fotografia é encaixada na proporção da tabela sem esticar ou deformar o desenho.
- No modo automático, as linhas continuam sendo calculadas pela proporção do objeto recortado.
- A remoção de fundo compara cada região com a cor predominante das bordas, reduzindo sombras e ruídos próximos ao fundo.
- O tecido/fundo deixa de entrar na paleta de cores mesmo em Fidelidade máxima.
- Pontos isolados e fios finos são filtrados antes da criação da grade.
- A área externa à silhueta da peça permanece vazia, sem formar um retângulo de miçangas cinzas.
- Mantida a coluna vertical com todas as cores detectadas para correção manual.

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
