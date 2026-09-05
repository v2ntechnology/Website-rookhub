# RookHub: análise do ecossistema e prompt para o novo website

Data da análise: 04/09/2026.

Revisão de posicionamento: RookHub é a empresa e marca do portfólio. A solução de gestão de frotas com IA é um dos seus produtos principais. Esta revisão incorpora a orientação direta do fundador sobre a home institucional, a identidade de xadrez e a visão de múltiplas integrações, incluindo telemetrias, câmeras e dados do Detran. Essas orientações ampliam a visão comercial, mas não comprovam implementação das integrações.

## Como usar

Este arquivo contém uma síntese da análise e um prompt independente, pronto para copiar, na seção **Prompt completo**. O objetivo é orientar o website institucional e comercial da empresa, com uma home de portfólio e páginas dedicadas aos produtos, não reconstruir os painéis ou o aplicativo mobile. As 14 seções de frotas pertencem à página desse produto, não à home institucional.

Esta entrega não altera código de aplicação. A análise examinou estrutura, configurações, rotas, componentes, conteúdo, camadas de API, regras e memórias dos três projetos, além da documentação oficial. Não equivale a testar todos os fluxos em produção, validar integrações com credenciais ou auditar cada linha de código.

## 1. O que os projetos mostram

| Projeto | Papel no produto | Base encontrada | Consequência para o website |
|---|---|---|---|
| Website-rookhub | Apresentação pública, aquisição de clientes, planos e contato | Next.js 16, React 19, TypeScript, Tailwind 4, Sora/Inter, temas e integração Stripe | Evoluir o projeto existente, preservando conteúdo tipado, SEO e os modos de build. Não começar outra landing page desconectada. |
| System-web | Plataforma de gestão e operação | Vite, React, TypeScript; navegação executiva em `/gestao`; ambiente operacional em `/app`; mapa com MapLibre e camada 3D; assistente | Usar a interface real como referência de identidade e organização. Diferenciar a experiência do proprietário/gestor da experiência do operador/manutenção. |
| System-mobile | Aplicativo do motorista | Expo 54, React Native, Expo Router; viagens, checklist, abastecimento, desempenho e perfil | Apresentar a experiência de campo. As APIs principais examinadas ainda retornam mocks, portanto telas existentes não provam sincronização ou operação comercial completas. |

Também existe `Backend-web`, um quarto repositório. Sua documentação foi consultada apenas como contexto da API compartilhada. Os projetos são repositórios separados, não um único monorepo.

### O posicionamento central

A RookHub é a empresa por trás de um portfólio de aplicações. Sua identidade se relaciona ao xadrez, especialmente à peça que inspira a marca. O website deve apresentar a empresa, seus produtos e os caminhos para conhecê-los e contratá-los, sem limitar a marca ao setor de transportes.

A aplicação de gestão de frotas analisada é um dos produtos principais desse portfólio. Sua visão é ser um sistema de gestão completo com IA, reunindo múltiplas APIs para dar contexto à operação: telemetrias, câmeras, dados veiculares e integrações relacionadas ao Detran, além de outras fontes a validar. Web e mobile são experiências complementares desse produto, não evidência de dois produtos independentes.

Dentro da página dedicada a esse produto, a história mais forte não é apenas “mostrar caminhões no mapa”. É ligar o que acontece no caminhão ao registro operacional, à manutenção e à decisão de quem administra a transportadora. Na home, a história é mais ampla: uma empresa que desenvolve aplicações para necessidades diferentes, com o produto de frotas em destaque.

O nome comercial específico desse produto não foi definido nesta conversa. Usar a descrição “Gestão de frotas com IA”, acompanhada de “Uma solução RookHub”, sem criar uma nova marca oficial por suposição. Manter a grafia RookHub dos ativos existentes; a transcrição “RockHub” não autoriza renomear a marca.

### O website atual e as oportunidades

- A home é composta por cinco blocos principais: Hero, ProblemSolution, Pillars, Profiles e CallToAction.
- Há conteúdo relevante sobre assistente, checklist, segurança e custos, mas falta uma demonstração mais contínua de como tudo se conecta.
- Os perfis de público incluem proprietário, gestor, operador e motorista. A manutenção merece uma apresentação própria.
- O hero usa imagens PNG flutuantes. Isso não é uma cena 3D; os três arquivos usados somam aproximadamente 4,8 MB antes de eventuais otimizações de entrega.
- As entradas de conteúdo usam IntersectionObserver. Não há GSAP ou Three.js declarados no pacote do website analisado.
- O website já tem navegação desktop e mobile distintas, tokens tipográficos, temas e separação entre componentes e conteúdo. Essa estrutura deve ser aproveitada.
- Há dois destinos de build: Next completo e exportação estática. As rotas Stripe do servidor não fazem parte do site estático.

### Divergências que o novo texto deve corrigir

**Empresa não é produto:** a primeira versão do prompt e parte do conteúdo atual identificam RookHub diretamente com gestão de frotas. A orientação do fundador corrige essa leitura: o institucional apresenta a marca do portfólio; a narrativa detalhada de frotas fica em página própria. O PDF e os repositórios analisados descrevem essa solução, não todos os negócios futuros da empresa.

1. **Disponibilidade não é igual a planejamento.** A documentação oficial descreve a visão do produto; o PRD detalha requisitos. Nenhum dos dois comprova que todos os módulos estão operacionais.
2. **Mobile:** a documentação histórica fala em PWA e aplicativo nativo posterior, mas já existe um projeto nativo Expo. Ainda assim, autenticação, viagens, abastecimento e checklist examinados usam mocks.
3. **Offline:** há promessa de “100% offline” no conteúdo do site, sem comprovação correspondente de uma fila completa de sincronização nos fluxos mobile examinados.
4. **Dados do System-web:** existem caminhos de integração HTTP para áreas como frota, mapa, motoristas, segurança e assistente. Outras áreas ainda possuem APIs simuladas ou restrições quando o modo real está ativo. Isso não autoriza anunciar todos os módulos como integrados e prontos.
5. **Segurança:** o conteúdo comercial chega a sugerir substituição do monitoramento humano. O PRD descreve um copiloto que prioriza ocorrências, com decisão humana, e deixa o modelo próprio de visão computacional para evolução posterior.
6. **Planos:** o PDF apresenta exemplos com quatro níveis; o código comercial usa três. O catálogo de preços contém comentário de que os valores ainda não foram validados comercialmente. Não escolher um modelo definitivo por suposição.
7. **Integrações:** MiX/Powerfleet tem trabalho de integração no ecossistema. Fornecedores listados em documentos, como TruckPag, Eagletrack e Hik-Connect, não devem ser anunciados como conectores disponíveis sem confirmação individual.
8. **Conversão:** o link “Entrar” da navegação desktop examinada aponta para contato. O redesign deve distinguir acesso à aplicação de aquisição comercial.
9. **Promessas de prazo:** “primeiro resultado em 30 dias”, descobertas na primeira semana e demonstração com dados reais precisam de validação comercial e operacional antes de publicação.
10. **Fora de escopo:** roteirização otimizada, emissão de CT-e/MDF-e, folha de pagamento e marketplace de fretes não devem surgir como funcionalidades do produto só por serem comuns ao setor.

## 2. Direção criativa recomendada

Na primeira versão, a direção era centrada em frotas. Com a definição da empresa como marca do portfólio, os caminhos passam a ser:

- **Vitrine institucional estática:** clara e leve, mas explora pouco o pedido de animação e a identidade da marca.
- **Universo 3D integral:** expressivo, mas pode esconder o portfólio e dificultar navegação e desempenho.
- **Hub de aplicações com xadrez e 3D pontual, recomendado:** a peça da marca organiza visualmente um portfólio navegável; cada produto possui página própria, demonstração e conversão. O caminhão aparece no destaque de frotas e na página desse produto, não como símbolo de toda a empresa.

O pedido anterior de naves permanece como recurso secundário possível de conexão e exploração. A orientação mais recente torna o xadrez o tema principal. Não misturar nave, tabuleiro e caminhão como três protagonistas concorrentes.

---

## Prompt completo

Copie a partir de “Atue como...” até “Fim do prompt”. O conteúdo abaixo é autocontido.

### Missão e limites

#### Restrição obrigatória: preservar top bar e footer

**Não alterar a top bar (cabeçalho/barra superior) nem o footer (rodapé) existentes.** Preservar integralmente estrutura, layout, textos, links, menus, botões, ícones, cores, tipografia, espaçamentos, dimensões, responsividade, animações e comportamentos atuais, tanto no desktop quanto no mobile e nos dois temas.

O redesign se limita ao conteúdo das páginas entre esses dois elementos. Reutilizar o cabeçalho e o rodapé atuais nas páginas novas, sem recriá-los, substituí-los ou duplicá-los. Alterações em estilos globais, tokens ou animações das seções não podem modificar sua aparência ou funcionamento indiretamente.

Esta restrição tem prioridade sobre qualquer sugestão de navegação, identidade visual, CTA ou rodapé apresentada no restante do prompt. Novos links, chamadas comerciais e navegação local devem ficar no corpo das páginas. Se uma necessidade exigir mudança na top bar ou no footer, apenas informar a pendência e solicitar autorização específica, sem executar a alteração.

Atue como um time sênior de estratégia de produto, direção de arte digital, redação para SaaS B2B, design de interação e desenvolvimento frontend.

Crie o redesign do website institucional e comercial da **RookHub, a empresa por trás de um portfólio de aplicações**. A home deve apresentar a empresa e funcionar como hub para conhecer seus produtos. Cada produto deve ter uma página dedicada, bonita e comercialmente clara. A solução de gestão de frotas com IA é um dos produtos principais, não a definição inteira da empresa.

Quero uma apresentação original e sofisticada, com identidade ligada à peça de xadrez da marca, 3D bem executado e animações coordenadas pelo scroll. O pedido anterior de naves pode aparecer como detalhe secundário; a identidade central é xadrez e tecnologia. Caminhões, mapas e telemetria pertencem ao contexto da solução de frotas.

O resultado deve parecer o site de uma empresa de software confiável, não uma landing page de um único sistema, um template genérico de startup, um videogame ou um painel administrativo.

Trabalhe sobre o website existente em:

`C:\Users\Lucas Dias\Documents\Projetos\Rookhub\Website-rookhub`

Use como referências de produto, em modo de leitura:

- `C:\Users\Lucas Dias\Documents\Projetos\Rookhub\System-web`
- `C:\Users\Lucas Dias\Documents\Projetos\Rookhub\System-mobile`
- `C:\Users\Lucas Dias\Documents\Projetos\Rookhub\System-web\docs\pdf\documentacaoOficial.pdf`
- `C:\Users\Lucas Dias\Documents\Projetos\Rookhub\Website-rookhub\docs\prd_RookHub.md`

Leia as regras e memórias aplicáveis, consultando primeiro os índices e depois as partes relevantes. Preserve alterações existentes. Não altere o System-web, o System-mobile, o backend, credenciais, configuração de infraestrutura ou regras comerciais para viabilizar a apresentação do website. Não publique, faça push ou ative cobranças sem uma autorização específica.

### 1. Entenda a empresa, o portfólio e o produto antes de desenhar

Respeite três níveis:

1. **RookHub, empresa:** identidade, visão, forma de desenvolver soluções e apresentação institucional.
2. **Portfólio de produtos:** aplicações com propostas, públicos e páginas próprias. A estrutura deve permitir expansão sem refazer a home.
3. **Solução de gestão de frotas com IA:** produto principal já analisado, com experiências web e mobile e diversos módulos internos.

Um módulo, um perfil de acesso, uma API ou um repositório não é automaticamente um produto separado. Não mostrar “System-web”, “System-mobile” e “Backend-web” como três aplicações comercializadas.

Os outros produtos do portfólio ainda não foram especificados. Não inventar nomes, segmentos, clientes ou datas de lançamento para preencher a vitrine. Mostrar apenas o produto confirmado; se fizer sentido, adicionar uma nota editorial discreta de que novas aplicações estão sendo desenvolvidas, sem cartões falsos ou links vazios.

Usar “Gestão de frotas com IA” como descrição provisória da solução e “Uma solução RookHub” como assinatura. Não inventar um nome comercial, associar cada produto a uma peça específica nem afirmar login ou dados compartilhados entre aplicações sem definição e implementação.

#### Contexto da solução de frotas

Uma transportadora precisa lidar com informações que chegam de vários lugares: telemetria, rastreamento, abastecimentos, checklists, ocorrências, manutenção, documentos, planilhas e registros de viagens. Quando essas informações ficam isoladas, as equipes repetem trabalho, as pendências perdem contexto e a administração demora a perceber problemas.

A solução de frotas da RookHub busca conectar essas informações em um ambiente organizado por responsabilidades. Sua visão é ser um sistema de gestão completo com IA que reúne várias APIs, não apenas um rastreador ou dashboard. Isso inclui a intenção de conectar múltiplos fornecedores de telemetria, câmeras, dados e serviços relacionados ao Detran e outras fontes operacionais. Tratar esse conjunto como visão de evolução até validar cada conector.

A proposta é dar visibilidade à operação, facilitar os registros e apoiar a tomada de decisão, inclusive por meio de um assistente de IA consultado por texto e voz. “Gestão completa” descreve a ambição dentro do escopo do produto; não significa que todo módulo imaginável já exista.

Pense no produto como uma sequência:

**Caminhão e motorista → informação registrada → contexto operacional → prioridade identificada → decisão humana → acompanhamento.**

Não apresente essa solução como substituto universal de ERP, TMS ou rastreador. Não invente emissão fiscal, otimização automática de rotas, marketplace de fretes ou automação de decisões críticas.

A página desse produto precisa comunicar cinco públicos, sem restringir a home institucional a eles:

| Público | Necessidade | Experiência a representar |
|---|---|---|
| Proprietário | Entender resultados, custos e prioridades | Visão executiva com navegação superior, indicadores contextualizados e decisões. |
| Gestor | Acompanhar a frota, equipe e pendências | Visão gerencial com navegação superior, mapa, acompanhamento e análise. |
| Operador | Registrar, conferir e organizar a rotina | Dashboard com navegação lateral e acesso rápido ao trabalho cotidiano. |
| Manutenção | Receber e tratar pendências dos veículos | Dashboard com navegação lateral, inspeções, serviços e histórico. |
| Motorista | Executar tarefas de campo com clareza | Aplicativo mobile com viagens, checklist, abastecimento e acompanhamento pessoal. |

O administrador interno do SaaS não é um sexto público comercial da página do produto.

As experiências compartilham a identidade RookHub, mas não precisam ter o mesmo layout. Não transforme o painel do proprietário em uma cópia da tela do operador. Não force o aplicativo mobile a parecer um dashboard desktop.

### 2. Separe visão de produto e disponibilidade

Use o seguinte critério editorial:

- **Demonstrável:** existe uma interface ou fluxo que pode ser mostrado com dados fictícios claramente identificados.
- **Disponível para contratação:** exige confirmação de funcionamento, escopo e condições comerciais. A existência de código não é suficiente.
- **Em desenvolvimento ou planejado:** deve ser identificado explicitamente quando aparecer no website.

O mobile já existe em Expo, mas seus fluxos principais examinados usam APIs simuladas. Não prometer que o aplicativo está publicado nas lojas, integrado à produção ou funcionando integralmente offline.

O System-web possui caminhos de integração para frota, mapa, motoristas, segurança e assistente, mas há módulos ainda demonstrativos. Não vender o conjunto como uma solução integralmente pronta sem revisão de disponibilidade.

Checklists offline, sincronização automática de fotos, manutenção totalmente conectada ao checklist, custos consolidados de todas as fontes, automação de câmeras e notificações por WhatsApp precisam de confirmação específica. Quando não houver confirmação, apresente como evolução prevista ou omita a afirmação.

A integração com o Detran foi acrescentada pelo fundador como intenção de produto, não identificada nesta análise como conector funcionando. Não afirmar que há uma API nacional única ou acesso disponível a qualquer dado. Antes de publicar disponibilidade, identificar fonte/provedor, cobertura, informações realmente acessíveis, permissões, condições de uso e implementação validada. Não usar logotipo de órgão público como selo de parceria.

Não invente clientes, depoimentos, selos, certificações, números de veículos conectados, índices de economia, resultados financeiros, SLA, precisão da IA ou garantias de segurança. Não trate ativos com logotipos de clientes como autorização para publicidade.

Não publicar credenciais, nomes reais de motoristas, placas reais, localização de clientes, trajetos privados ou informações financeiras extraídas do ambiente de desenvolvimento.

### 3. Conceito visual

Conceito institucional: **RookHub, aplicações para o seu próximo movimento.**

A metáfora visual da empresa deve relacionar estratégia, peças que se posicionam e aplicações com funções claras. A peça da marca é o ponto de origem do portfólio, não uma afirmação de que todas as aplicações já trocam dados. Conceito da página de frotas: uma central de gestão que conecta informações e decisões da operação.

Direção de arte:

- Na home, uma peça de xadrez 3D inspirada na identidade existente é acompanhada por uma grade discreta e superfícies de apresentação dos produtos. Não exigir que o visitante jogue xadrez para navegar.
- As aplicações aparecem como entradas legíveis do portfólio, não como dezenas de peças representando produtos inexistentes.
- A nave, se usada, deve ser pequena e secundária, como elemento de exploração ou conexão. Não disputar protagonismo com a peça da marca.
- O caminhão 3D aparece na apresentação resumida de frotas e ganha destaque na página dedicada. Não dominar o hero institucional.
- Na página do produto, rotas, pontos de localização e cartões de interface fazem a transição entre o 3D e a demonstração do software.
- A logomarca original RookHub permanece intacta. Não substituí-la por foguete, nave ou símbolo genérico.
- Usar índigo, azul e ciano como acentos da identidade, fundos neutros e contraste forte entre conteúdo e decoração.
- Respeitar os tokens semânticos do projeto. Não espalhar cores literais em componentes.
- Manter Sora nos títulos e Inter no conteúdo, aproveitando as classes tipográficas existentes.
- Construir profundidade com composição, planos, escala e iluminação. Evitar sombras grandes em volta de cards, halos permanentes e excesso de vidro desfocado.
- Usar cantos e bordas consistentes. Evitar transformar todo parágrafo em um cartão arredondado.
- Alternar momentos cinematográficos, apresentações de interface e trechos editoriais mais tranquilos.

O website hoje contém regras de uma etapa de wireframe em tons neutros. Esta proposta representa uma evolução visual dessa etapa; não remova convenções de acessibilidade, tipografia e estrutura ao incorporar cores e 3D.

Não copiar integralmente um layout de Dribbble, Figma ou outro produto. Referências servem para hierarquia, ritmo e acabamento. A composição e os textos devem ser próprios do RookHub.

### 4. Navegação e conversão

Preservar a navegação atual da top bar e do footer, sem alterar seus itens ou destinos. Oferecer acesso a Início, Produtos, Empresa e Contato no corpo das páginas quando necessário. Nesse conteúdo, “Conhecer produtos” é a ação de descoberta; “Falar com a RookHub” é a ação comercial geral. Essas propostas não autorizam modificar os menus existentes.

Arquitetura proposta de páginas, não rotas já implementadas:

| Destino | Função |
|---|---|
| `/` | Home institucional: empresa, hub de aplicações e destaque do produto principal. |
| `/produtos` | Portfólio navegável com produtos e projetos efetivamente definidos. |
| `/produtos/gestao-de-frotas` | Página comercial completa da solução de frotas com IA. O slug é uma proposta descritiva, não o nome comercial definitivo. |
| `/empresa` | Visão da RookHub e informações institucionais verificadas. |
| `/contato` | Contato comercial com indicação opcional do produto de interesse. |

Na página de frotas, adicionar navegação local com Visão geral, Funcionalidades, Integrações e Planos. Manter a marca da empresa e um caminho de volta ao portfólio. Não sobrepor duas barras grandes que consumam a área útil no celular.

**Acessar aplicativos:** levar a um seletor apenas quando houver mais de um aplicativo com acesso confirmado. Enquanto houver uma única solução acessível, identificar claramente “Entrar na solução de frotas”. Não prometer conta única ou SSO entre futuros produtos. Não apontar acesso para contato, inventar domínio ou publicar localhost.

**Agendar demonstração:** na página de produto, levar ao canal comercial real com o interesse em frotas identificado; no contato institucional, permitir uma conversa mais ampla sobre o portfólio.

O `/precos` existente deve continuar funcional durante a evolução e deixar claro a qual produto se refere. Uma futura organização de preços por produto exige mapear links, checkout e compatibilidade dos dois builds. Não criar uma assinatura global que supostamente inclua todos os aplicativos.

Preservar integralmente os menus desktop e mobile existentes. Qualquer nova navegação local no corpo da página deve ser acessível e não depender de hover.

Manter visível o caminho de conversão durante a narrativa, mas sem popup insistente, contagem regressiva artificial ou CTA flutuante cobrindo texto. Links âncora devem considerar a altura do cabeçalho.

### 5A. Home institucional: hub de aplicações em oito seções

A home deve responder primeiro “quem é a RookHub?” e “quais aplicações posso conhecer?”. Não reproduzir as 14 seções de frotas nela. Usar oito blocos com variação de escala e composição:

#### Home 01. A empresa e seu próximo movimento

Título sugerido: **Aplicações para o seu próximo movimento.**

Texto: “A RookHub desenvolve soluções digitais para transformar necessidades reais em ferramentas úteis. Conheça nosso portfólio e a visão por trás de cada aplicação.”

CTA principal: “Explorar aplicações”. Secundário: “Conhecer a RookHub”.

Visual: peça da marca em 3D com iluminação refinada e uma grade sutil inspirada no tabuleiro. Durante o scroll, ela abre espaço para a apresentação do portfólio. Texto e botões em HTML visíveis imediatamente. Não apresentar uma transportadora como se fosse a empresa RookHub.

#### Home 02. Hub de aplicações

Título: **Encontre a solução para o seu próximo desafio.**

Criar uma vitrine de aplicações com nome ou descrição, finalidade, público, estágio real e CTA para a página dedicada. A solução confirmada é “Gestão de frotas com IA”, em destaque. Sua descrição curta: “Uma solução em evolução para reunir a operação da frota, inteligência artificial e múltiplas fontes de informação.”

A apresentação pode usar uma composição espacial inspirada no tabuleiro, mas os itens devem continuar sendo links acessíveis, utilizáveis sem canvas. Não adicionar busca, filtros ou um carrossel vazio para um catálogo de um único produto. Deixar a estrutura preparada para expansão sem preencher com aplicações fictícias.

#### Home 03. Produto principal em destaque

Título: **Uma visão conectada para a gestão de frotas.**

Resumo: “Nosso produto principal tem como proposta unir gestão, IA e integrações de diferentes fornecedores em uma experiência organizada para quem decide, opera e trabalha na estrada.”

Mostrar uma composição de tela web e mobile, com os estados de demonstração corretamente identificados, e no máximo três ideias: operação em contexto, inteligência para consulta e integrações como base. Não incluir aqui o catálogo inteiro de módulos.

CTA: “Conhecer a solução de frotas”, para a página dedicada. O caminhão pode aparecer neste bloco, não como tema de todo o site.

#### Home 04. A empresa por trás das aplicações

Título: **O que conecta nossos produtos é a forma de pensar.**

Explicar a visão informada pelo fundador: uma empresa que constrói aplicações para necessidades distintas e mantém uma identidade reconhecível entre elas. A metáfora do xadrez comunica estratégia e função, não competição entre clientes.

Não inventar ano de fundação, tamanho de equipe, escritórios, investidores, trajetória ou números de mercado. Usar apenas informações institucionais confirmadas. CTA para `/empresa`.

#### Home 05. Princípios de construção

Apresentar clareza de uso, conexão entre informações quando fizer sentido e desenvolvimento orientado a problemas reais como princípios propostos, sujeitos à revisão editorial do fundador. Não tratá-los como certificações ou processos auditados.

Explicar que IA e integrações são recursos usados conforme cada produto, não requisitos obrigatórios de todo aplicativo futuro. Evitar prometer interoperabilidade entre aplicações só porque pertencem à mesma empresa.

#### Home 06. Portfólio em evolução

Mostrar somente projetos e marcos autorizados para divulgação. Enquanto os próximos aplicativos não tiverem definição pública, usar uma mensagem breve de expansão do portfólio, sem cards com nomes inventados, datas garantidas ou falsas pré-vendas.

Não anunciar desenvolvimento sob encomenda, consultoria ou outros serviços como ofertas da empresa sem confirmação. Diferenciar produto próprio, projeto em desenvolvimento e serviço contratado quando essas categorias forem definidas.

#### Home 07. Da descoberta à aplicação certa

Uma sequência curta: conhecer o portfólio → explorar uma solução → conversar sobre sua necessidade. CTA de produto leva à página do produto, não diretamente a um login; CTA de cliente existente leva ao acesso correto.

O contato pode receber o interesse selecionado. Não criar integrações comerciais ou cadastro em newsletter sem destino e tratamento reais.

#### Home 08. Convite institucional

Título: **Qual é o seu próximo movimento?**

Texto: “Conheça nossas aplicações ou converse com a equipe RookHub para entender qual solução faz sentido para você.”

CTAs: “Ver aplicações” e “Falar com a RookHub”, no corpo da página. Encerrar o conteúdo com uma composição discreta da peça da marca, antes do rodapé existente, que deve permanecer inalterado. A home deve vender a confiança na empresa e conduzir à solução, não confundir portfólio com um plano único.

#### Páginas de apoio

- `/produtos`: catálogo baseado em uma fonte única de conteúdo; solução de frotas em destaque; próximos itens somente após definição real. Cada item publicado deve possuir destino funcional e estado correto.
- `/empresa`: narrativa institucional validada, identidade e visão de portfólio. Não repetir as funções do software de frotas como missão exclusiva da empresa.
- `/contato`: canal geral e contexto de produto, sem promessas de prazo de resposta não acordadas.
- Futuras páginas de produto: composição reutilizável para problema, proposta, demonstração, público, disponibilidade, contratação e FAQ, preservando personalidade própria e marca-mãe comum.

### 5B. Página dedicada de gestão de frotas: 14 seções

As seções abaixo pertencem exclusivamente a `/produtos/gestao-de-frotas`. A home usa somente a apresentação resumida descrita acima. Esta é a página para explicar e comercializar o produto principal, com assinatura “Uma solução RookHub”.

Os títulos e textos abaixo são direção editorial inicial. Refine o ritmo sem perder o significado nem introduzir promessas não verificadas.

#### Seção 01. Hero: entender o produto em segundos

Título: **Toda a frota em um só hub.**

Texto de apoio: “A solução de frotas da RookHub foi concebida para reunir gestão, inteligência artificial e informações de diferentes sistemas. Conheça a proposta de conectar o que acontece na estrada às decisões da transportadora.”

CTA principal: “Agendar demonstração”. CTA secundário: “Explorar a plataforma”.

Visual: caminhão 3D em primeiro plano secundário, nave de conexão ao fundo e sinais de dados que convergem para uma prévia do produto. O texto e os botões devem aparecer imediatamente, sem esperar o carregamento 3D.

Movimento: entrada curta e suave; ao rolar, a nave desloca-se lateralmente e os sinais começam a se organizar. Sem abertura obrigatória, túnel longo, zoom agressivo ou som automático.

#### Seção 02. O problema: dados dispersos

Título: **A informação existe. Falta conectar os pontos.**

Texto: “Posições, abastecimentos, inspeções e planilhas contam partes da mesma história. Quando cada equipe enxerga apenas um pedaço, entender a operação exige mais trabalho.”

Visual: pequenas representações de fontes de dados e tarefas. Durante o scroll, elas saem de uma disposição dispersa e se organizam em torno do RookHub.

Mostrar três benefícios qualitativos: informação com contexto, acompanhamento compartilhado e menos busca manual. Não colocar uma porcentagem inventada de ganho de produtividade.

#### Seção 03. A plataforma: uma visão conectada

Título: **Da informação à próxima decisão.**

Demonstrar, em uma composição ampla, como veículo, motorista, ocorrência e acompanhamento se relacionam. Mostrar uma prévia executiva e uma prévia operacional sem exigir que o visitante leia uma tela inteira reduzida.

Usar dados fictícios e uma legenda visível: “Demonstração do produto”. Explicar que a disponibilidade varia por módulo e integração quando necessário.

Movimento: a composição dispersa da seção anterior dá lugar à interface. A metáfora espacial diminui para que o produto passe a ser protagonista.

#### Seção 04. Frota no mapa

Título: **Veja a frota. Entenda o contexto.**

Apresentar mapa, lista curta de veículos e detalhe do veículo selecionado, com posição, estado e horário de atualização demonstrativos. Se houver trajetória, mostrar apenas o que está disponível no produto ou identificar a simulação.

O visitante pode selecionar um dos poucos veículos da demonstração e ver o detalhe correspondente. Não exibir um mapa aparentemente interativo cujos controles não fazem nada.

Não chamar uma animação em loop de “telemetria ao vivo”. Não prometer atualização instantânea ou cobertura contínua. Dar preferência a dados locais fictícios; não consumir a API de um cliente para montar a landing page.

#### Seção 05. Assistente de IA

Título: **Pergunte à sua frota.**

Texto: “Explore uma forma mais direta de consultar informações: perguntas em linguagem natural, por texto ou voz, com respostas baseadas no contexto disponível.”

Exibir uma conversa guiada com duas ou três perguntas coerentes com as intenções efetivamente suportadas. A resposta demonstrativa precisa indicar contexto ou período, e reconhecer quando não há informação.

Representar voz com uma esfera ou forma abstrata discreta, coerente com o produto. Não pedir acesso ao microfone ao abrir a página. Não conectar a demonstração pública ao assistente de produção nem gerar custos de API por visita.

Identificar a conversa como exemplo. O assistente apoia a decisão; não é infalível nem autoriza operações críticas por conta própria.

#### Seção 06. Uma plataforma, diferentes responsabilidades

Título: **Cada equipe com a visão de que precisa.**

Criar cinco abas acessíveis: Proprietário, Gestor, Operador, Manutenção e Motorista.

Cada aba deve conter uma frase de benefício, até três atividades e uma imagem ou composição própria da experiência. Trocar o conteúdo real da apresentação, não somente a cor do cartão.

Preservar a distinção visual: menu superior nas visões executivas, navegação lateral nas operacionais e interface de celular para o motorista. Não repetir o mesmo screenshot nas cinco abas.

#### Seção 07. O aplicativo do motorista

Título: **A rotina começa na estrada.**

Mostrar um telefone com telas de viagem, checklist e abastecimento baseadas no aplicativo existente. Usar uma sequência curta para explicar a tarefa, e não uma coleção de celulares decorativos.

Texto: “Uma experiência mobile em desenvolvimento para acompanhar viagens, registrar inspeções e organizar informações de campo.”

Enquanto não houver validação de produção, manter o estado de desenvolvimento próximo da apresentação. Não exibir botões App Store/Google Play sem links reais e publicação confirmada. Não afirmar “100% offline”.

#### Seção 08. Checklist e manutenção

Título: **Uma pendência precisa chegar a quem pode agir.**

Apresentar o fluxo pretendido: inspeção → evidência → pendência → análise da manutenção → acompanhamento do serviço.

Mostrar uma foto fictícia ou ilustração neutra de inspeção, o registro correspondente e a visão da manutenção. Distinguir o que já é demonstrável do fluxo conectado ainda em evolução.

Não sugerir que o software substitui o responsável técnico, o manual do fabricante ou a avaliação humana para liberar um veículo.

#### Seção 09. Custos e desempenho

Título: **Mais contexto para entender o custo da operação.**

Explicar os indicadores de interesse: custo por quilômetro, consumo por veículo e motorista, manutenção e evolução por período.

Usar uma composição editorial com um gráfico e uma explicação, não oito números sem origem. Identificar valores ilustrativos e não transformar valores simulados em resultados obtidos por clientes.

Não garantir economia, lucratividade por rota nem fechamento financeiro integrado sem disponibilidade confirmada. Quando fontes ou módulos estiverem em desenvolvimento, deixar isso explícito.

#### Seção 10. Segurança e evolução da equipe

Título: **Informação para orientar uma operação mais segura.**

Separar eventos de telemetria, acompanhamento do motorista e visão futura de apoio ao monitoramento por câmeras. Detecção própria por visão computacional não deve aparecer como recurso já implantado.

Caso a gamificação seja apresentada, associá-la a hábitos seguros, consistência e orientação. Não incentivar velocidade, jornadas maiores, competição arriscada ou punição automática por pontuação.

A mensagem é apoio à equipe e análise humana, não vigilância irrestrita nem garantia de prevenção de acidentes.

#### Seção 11. Integrações

Título: **Várias fontes. Uma gestão com mais contexto.**

Esta é uma seção central de diferenciação do produto, não apenas uma faixa de logotipos. Explicar a visão de reunir múltiplas APIs em um sistema de gestão com IA. O benefício é relacionar informação a veículos, motoristas, ocorrências e decisões, e não obrigar o usuário a aprender cada API.

Texto sugerido: “A proposta é conectar diferentes telemetrias, câmeras e fontes de dados veiculares em uma visão de gestão. A IA usa o contexto disponível para apoiar consultas e análises, enquanto a equipe acompanha a operação em um só ambiente.”

Apresentar o fluxo conceitual: **fontes autorizadas → conectores → informações organizadas → gestão e IA → experiências de cada equipe**. Identificá-lo como arquitetura conceitual quando a cadeia inteira não estiver validada.

Organizar as fontes por categoria e apresentar seu estado individual:

| Categoria | O que a proposta pretende reunir | Cuidado de publicação |
|---|---|---|
| Telemetrias de diferentes fornecedores | Posições, eventos e medições conforme o conector | Não limitar a visão a uma marca, nem afirmar que qualquer fornecedor já funciona. |
| Câmeras e vídeo | Contexto visual e eventos disponibilizados pela integração | Não prometer acesso universal a câmeras nem detecção própria por IA já implementada. |
| Detran e dados veiculares | Informações veiculares pertinentes à gestão, conforme acesso autorizado | Intenção acrescentada pelo fundador. Escopo, cobertura e provedor precisam ser definidos e validados; não anunciar conector operacional. |
| Abastecimento e demais fontes operacionais | Registros que ajudem a contextualizar custos e rotina | Mostrar somente fornecedores e funções validados ou marcados como planejados. |

Usar estados textuais como “Disponível”, “Em validação” e “Planejado” somente com base na situação confirmada. Separar funcionamento do conector e disponibilidade para contratação. Não simular uma integração ativa com indicadores verdes decorativos.

MiX/Powerfleet pode aparecer como frente de integração do projeto, com status validado antes da publicação. Outros fornecedores documentados só devem aparecer com status individual confirmado. Na dúvida, usar categorias como telemetria, abastecimento e importação de dados, sem insinuar conectores prontos.

Não usar termos como “parceiro oficial” sem comprovação. Informar que acesso depende de compatibilidade, credenciais, permissões e contratação junto ao fornecedor, quando aplicável.

#### Seção 12. Implantação e planos

Título: **Comece pelo que a sua frota precisa.**

Apresentar três etapas não vinculadas a prazos garantidos: entender a operação, validar dados e integrações, definir a implantação dos módulos.

Adicionar uma prévia compacta dos planos com link para `/precos`. Preservar a fonte central do catálogo, mas não publicar valores, limites ou recursos não aprovados comercialmente. Se ainda não houver definição, usar consulta comercial em vez de números fictícios.

Não inventar um quarto plano para acompanhar um exemplo histórico do PDF. Não alterar preços Stripe ou produtos de cobrança por decisão visual.

#### Seção 13. Perguntas frequentes

Responder objetivamente:

1. A solução de frotas substitui meu rastreador? Explicar a proposta de conexão e gestão, sem substituição universal.
2. Quais integrações estão disponíveis? Exibir somente a lista validada e orientar consulta de compatibilidade.
3. Quem usa a plataforma? Explicar os cinco perfis e as visões por responsabilidade.
4. Já existe aplicativo do motorista? Informar seu estágio real e canais de acesso confirmados.
5. O aplicativo funciona offline? Não garantir cobertura ainda não validada.
6. A IA toma decisões sozinha? Explicar apoio à análise e limites de contexto.
7. Como contratar? Orientar demonstração, avaliação de necessidades e condições comerciais.
8. Posso conectar telemetrias de fornecedores diferentes? Explicar a visão multi-integração e a necessidade de validar cada conector.
9. A integração com o Detran já está disponível? Informar seu estado real, sem converter uma intenção de produto em funcionalidade entregue.

O FAQ deve ajudar a tomar uma decisão, não esconder limitações. Garantir acesso por teclado e HTML semântico.

#### Seção 14. Convite final

Título: **Vamos conectar os pontos da sua frota?**

Texto: “Converse com a equipe RookHub sobre a sua operação, as integrações necessárias e os módulos que fazem sentido para começar.”

CTA: “Agendar demonstração”. Ação secundária: “Falar com a equipe”. Usar destinos reais e distintos apenas se ambos existirem.

Retomar discretamente a composição do hub da abertura, agora organizada. Não repetir toda a animação do hero.

Manter o rodapé existente exatamente como está, sem incluir, remover ou revisar seus elementos. Informações adicionais de contato ou navegação devem ficar no corpo da página. Não publicar políticas genéricas ou certificações inventadas.

### 6. Roteiro de animação por scroll

O movimento deve explicar uma transformação e respeitar o ritmo de leitura. Não animar tudo ao mesmo tempo.

**Na home institucional:** peça da marca → apresentação do portfólio → destaque de uma aplicação → visão da empresa → convite para explorar. O scroll organiza superfícies de produto ao redor da identidade central, sem desenhar conectores técnicos inexistentes entre aplicativos. No destaque de frotas, introduzir brevemente a interface e o caminhão. A página continua com conteúdo institucional após esse bloco.

**Na página da solução de frotas:** usar a sequência abaixo. Não transferi-la integralmente para a home.

| Trecho | O que o scroll comunica | Comportamento desejado |
|---|---|---|
| Hero → problema | Os sinais vêm da operação | Nave desloca-se pouco; caminhão e fontes permanecem reconhecíveis. |
| Problema → plataforma | Os dados passam a ter contexto | Elementos convergem para o hub; a interface surge e assume o foco. |
| Plataforma → mapa | A informação se relaciona ao veículo | Transição de escala moderada para uma visão geográfica demonstrativa. |
| Mapa → assistente | A visualização pode ser consultada | Entrada curta do diálogo e redução da decoração. |
| Perfis → mobile | Cada equipe possui uma experiência | Mudança de composição sem girar ou deformar texto. |
| Checklist → custos → segurança | Registro, acompanhamento e análise | Revelações discretas e continuidade de uma linha visual. |
| Integrações → conversão | Caminho para começar | Movimento desacelera; leitura e CTA predominam. |

No desktop, permitir no máximo dois trechos com pinning por página, curtos e testados. Fora deles, a página continua com scroll vertical normal. Não transformar as oito seções institucionais nem as 14 seções de produto em telas presas.

No mobile, reduzir parallax e retirar pinning da narrativa. Mostrar cenas estáticas ou animações curtas. Não depender de hover, arrastar objetos 3D ou rodar o aparelho.

Com `prefers-reduced-motion`, retirar deslocamentos, scrub e movimentos contínuos. Mostrar imediatamente o conteúdo em sua posição final e oferecer a mesma informação sem animação.

Não sequestrar a roda do mouse nem aplicar snap obrigatório. Não esconder conteúdo até que uma animação termine. Pausar animação ambiente quando sair da área visível ou quando a aba estiver em segundo plano. Se houver movimento automático prolongado, fornecer controle para pausá-lo.

### 7. Arquitetura técnica do website

Preservar Next.js App Router, React, TypeScript e Tailwind existentes. Não migrar de framework, misturar o código dos três projetos ou importar stores autenticadas para a landing page.

Manter páginas de rota enxutas; conteúdo e dados editoriais em `src/content`; seções em `src/components/marketing`; navegação em `src/components/layout`; componentes 3D em um conjunto isolado e carregado sob demanda. Seguir as convenções de exportação, tipagem e classes do repositório.

Separar conteúdo institucional, catálogo e conteúdo da solução de frotas. Criar uma fonte tipada de produtos com identificador, slug, título, resumo, público, estágio, destaque, mídia e destino de acesso quando existente. A home e o catálogo consomem a mesma informação. Só acrescentar produtos efetivamente definidos.

Organizar seções institucionais e seções de produto em conjuntos distintos, compartilhando tipografia, botões, layout e comportamento de animação. Não duplicar as 14 seções em duas rotas nem criar uma abstração complexa de CMS para um catálogo inicial pequeno.

O cabeçalho institucional, o catálogo e as páginas dedicadas fazem parte do mesmo website. O acesso ao aplicativo é outro destino. Essa organização não exige unificar os repositórios, os backends, os logins ou os bancos de dados dos produtos.

Usar Server Components para conteúdo estático e Client Components apenas nos pontos interativos. O 3D não pode transformar toda a aplicação em um componente cliente nem quebrar a renderização inicial.

Para a coreografia mais complexa, avaliar **GSAP + ScrollTrigger**. Para 3D integrado ao React, avaliar **Three.js + React Three Fiber**. Essas dependências não estão instaladas no website analisado: verificar versões, compatibilidade, licenças e tamanho antes de acrescentá-las. Não adicionar várias bibliotecas de animação com responsabilidades sobrepostas.

Separar conteúdo, timeline e cena 3D. Ao desmontar componentes ou mudar breakpoints, limpar animações, listeners e recursos criados. A implementação deve sobreviver ao ciclo de desenvolvimento do React sem duplicar canvas ou triggers.

Não manter várias cenas renderizando continuamente. Preferir uma cena principal, pausar fora da tela, ajustar resolução à capacidade do dispositivo e renderizar somente quando necessário. Durante movimentos vinculados ao scroll, atualizar a cena de forma coordenada, sem disparar um render React completo a cada frame.

Criar pôster estático para a cena e fallback caso WebGL não esteja disponível ou seu contexto seja perdido. Todos os títulos, benefícios, links e CTAs devem continuar sendo HTML acessível.

Preservar os dois destinos de build:

- **Next completo:** pode executar as rotas de servidor existentes.
- **Exportação estática:** não possui as rotas Stripe locais; usar somente destinos comerciais válidos nesse modo ou uma integração externa especificamente configurada. Não apresentar checkout quebrado ou sucesso fictício.

Não apagar variantes de design arquivadas apenas por não estarem na home. Não fazer refatorações alheias ao redesign.

### 8. Assets, desempenho e qualidade visual

Inventariar assets existentes antes de criar novos. Os modelos de caminhões do System-web podem ser candidatos visuais, mas verificar procedência, licença, tamanho e adequação antes de copiar. A presença do arquivo não prova direito de uso comercial.

Não copiar todo o motor do mapa autenticado para a landing page. Uma demonstração local leve pode explicar melhor o produto sem integrações sensíveis.

Otimizar imagens, texturas e modelos. Evitar PNGs grandes para decoração quando formatos mais eficientes atenderem. Carregar a cena após o conteúdo essencial, sem bloquear o primeiro contato com a marca e o CTA.

Metas de engenharia, a medir e não anunciar como resultado já atingido:

- LCP abaixo de 2,5 segundos, INP abaixo de 200 ms e CLS abaixo de 0,1 em condições representativas, com monitoramento real quando houver implantação.
- Reservar dimensões de mídia e não deslocar o layout quando a cena carregar.
- Começar com orçamento de até 2 MB transferidos para modelos e texturas da cena inicial, excluindo o runtime; se não for viável, reduzir a cena ou usar pôster no carregamento inicial. Medir também o custo total de JavaScript.
- Evitar pós-processamento pesado, partículas em excesso e desfoque em grandes áreas.
- Não fazer download de todas as imagens das abas de perfis antes de serem necessárias.

A qualidade deve vir de direção de arte, tipografia, composição e movimento intencional, não da quantidade de efeitos.

### 9. Acessibilidade, conteúdo e SEO

Todo o site em português brasileiro, com texto concreto, legível e sem jargão técnico desnecessário. Evitar frases genéricas como “revolucione o futuro” e promessas absolutas como “zero falhas”. Não usar travessões na redação.

Preservar temas claro e escuro com tokens próprios. Não inverter cores indiscriminadamente nas imagens. Verificar contraste de texto, bordas, botões e hover nos dois temas; placeholders não substituem labels.

Garantir foco visível, ordem de leitura coerente, alvos de toque confortáveis, menu móvel acessível, abas operáveis por teclado e controles com nomes claros. Elementos decorativos não devem interceptar cliques ou poluir a leitura assistiva.

Conteúdo principal e CTAs precisam funcionar sem a cena 3D. Recursos decorativos não devem ser a única forma de transmitir uma informação.

Manter metadata, títulos, descrição, canonical, sitemap e metadados sociais específicos por página. A home descreve a empresa e seu portfólio; a página de frotas descreve o software. Não usar “gestão de frotas” como descrição exclusiva de todas as páginas institucionais.

Separar a identidade da organização da descrição de aplicação nos dados estruturados: o software pertence à página do produto, ligado à empresa responsável. Revisar o JSON-LD atual para não representar a empresa inteira como uma única aplicação. Remover preços e disponibilidade não confirmados e não repetir promessas de offline sem validação. Não inventar notas, avaliações, número de clientes ou ofertas para enriquecer dados estruturados.

Se houver formulário, coletar apenas os dados necessários, usar um destino autorizado e tratar envio, falha e confirmação reais. Não exibir mensagem de sucesso sem submissão efetiva. Não criar tracking ou adicionar terceiros sem a configuração correspondente.

### 10. Entrega e critérios de aceite

Antes de implementar, apresentar um resumo de direção visual, arquitetura das seções e storyboard das cenas. Apontar decisões comerciais pendentes que afetam a publicação, sem paralisar a composição visual: usar demonstrações e textos de consulta claramente identificados nesses casos.

Após aprovação de implementação, entregar:

1. Home institucional com oito seções, portfólio e informações da empresa; página dedicada à solução de frotas com as 14 seções; páginas de produtos, empresa e contato com destinos funcionais. Não concentrar tudo na home.
2. Textos finais em arquivos de conteúdo, não espalhados pela cena 3D.
3. Top bar e footer preservados integralmente no desktop, no mobile e nos dois temas, sem alterações diretas ou indiretas. Navegação local da solução e novos CTAs funcionais apenas no corpo das páginas. Verificar a jornada home → produto → contato ou contratação válida sem modificar os menus existentes; relatar separadamente qualquer pendência de acesso que exija autorização.
4. Cenas 3D e coreografia de scroll com alternativas estáticas.
5. Demonstrações locais explicitamente identificadas e sem exposição de dados de clientes.
6. Matriz de disponibilidade revisada por produto e conector: o que pode ser publicado, o que é demonstração e o que ainda exige confirmação. Telemetrias, câmeras e Detran não podem aparecer como todos disponíveis por associação.
7. Inventário dos assets acrescentados, procedência e eventuais restrições.
8. Validação responsiva em 360, 768, 1280 e 1920 pixels; modo claro/escuro; redução de movimento; teclado; falha de WebGL; âncoras; retorno de navegação e redimensionamento.
9. Verificação dos scripts existentes de lint, typecheck e dos builds completo e estático, respeitando sua execução no ambiente local. Não inventar uma suíte de testes que o projeto não tem nem relatar comandos como aprovados sem executá-los.
10. Relatório curto do que mudou, evidências de verificação e pendências reais para publicação. Não publicar automaticamente.

O critério final é simples: em poucos segundos o visitante entende que a RookHub é a empresa por trás de aplicações. Na home, descobre o portfólio e sua proposta. Ao entrar na página de gestão de frotas, entende o produto, os públicos, a visão de IA com múltiplas APIs e seu estágio real. Deve ser possível adicionar um segundo produto sem redefinir a identidade da empresa ou reescrever toda a home. A peça de xadrez, o 3D e os movimentos reforçam essa história, nunca substituem a informação.

**Fim do prompt.**

---

## 3. Fontes e rastreabilidade

### Orientações diretas do fundador incorporadas nesta revisão

- RookHub é a empresa e marca por trás de vários aplicativos, não sinônimo exclusivo do software de frotas.
- A home deve ser institucional e apresentar um hub de aplicações; os produtos possuem páginas comerciais dedicadas.
- A peça de xadrez é referência central de identidade e as animações devem valorizar o portfólio.
- A solução principal tem como visão uma gestão completa com IA e múltiplas APIs, incluindo diferentes telemetrias, câmeras e integração relacionada ao Detran.
- Não foram definidos nomes, segmentos ou datas para os próximos produtos, nem nome comercial próprio para a solução de frotas. A revisão não inventa essas decisões.

Essas definições de posicionamento têm precedência sobre a interpretação anterior do website como landing page exclusiva de frotas. As fontes locais abaixo continuam fundamentando a descrição do produto analisado e seus limites de disponibilidade.

### Fontes locais principais

- [Documentação oficial do produto](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/System-web/docs/pdf/documentacaoOficial.pdf>): visão, problema, públicos, módulos e arquitetura proposta. As páginas iniciais incluem elementos de capa; a leitura de conteúdo cobriu o corpo do documento até a página 35.
- [PRD do website](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/Website-rookhub/docs/prd_RookHub.md>): visão, escopo, personas e requisitos relevantes consultados. É uma especificação, não uma comprovação de disponibilidade.
- [Composição da home](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/Website-rookhub/src/app/(marketing)/page.tsx>): seções atuais e dados estruturados.
- [Hero atual](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/Website-rookhub/src/components/marketing/hero.tsx>): narrativa e composição visual existentes.
- [Conteúdo dos pilares](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/Website-rookhub/src/content/pillars.ts>) e [perfis](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/Website-rookhub/src/content/profiles.ts>): mensagens a aproveitar e afirmações a revisar.
- [Catálogo de planos](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/Website-rookhub/src/lib/stripe/plans.ts>): preços, limites e observação sobre validação comercial.
- [Dependências do website](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/Website-rookhub/package.json>), [do System-web](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/System-web/package.json>) e [do mobile](<C:/Users/Lucas Dias/Documents/Projetos/Rookhub/System-mobile/package.json>): stacks efetivamente declaradas.
- Camadas de API em `System-web/src/management/features` e `System-mobile/src/features`, rotas e componentes associados: distinção entre integração e demonstração.
- Regras `.claude` dos três projetos e do diretório pai, além das seções pertinentes de memória: identidade, organização e restrições de implementação.

### Referências técnicas consultadas

ScrollTrigger suporta animações ligadas ao progresso do scroll e pinning; por isso é um candidato para a narrativa proposta, não uma dependência já existente no website. [Documentação oficial do ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

O uso de condições de mídia permite adaptar e desfazer animações conforme o ambiente, incluindo preferência de movimento reduzido. [Documentação oficial de gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).

React Three Fiber documenta renderização sob demanda e estratégias de adaptação de desempenho. Essas práticas fundamentam a recomendação de limitar trabalho gráfico fora dos momentos necessários. [Guia oficial de desempenho do React Three Fiber](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

As direções criativas, textos, distribuição das seções e orçamentos de performance deste arquivo são propostas para o RookHub, não especificações extraídas literalmente dessas fontes.
