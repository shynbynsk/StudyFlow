# 🎯 StudyFlow — Organização de Objetivos de Estudo

> **StudyFlow** é uma aplicação web educacional, simples e intuitiva, projetada sob medida para ajudar estudantes iniciantes a organizar, acompanhar e conquistar seus objetivos de estudo com foco e consistência diária.

---

## 📖 Visão do Produto

### 1. O Problema que o StudyFlow Resolve
Estudantes iniciantes frequentemente enfrentam a **paralisia por sobrecarga de conteúdo** (*information overload*) e a falta de método para transformar intenções abstratas em ações concretas:
* **Metas vagas:** Intenções inespecíficas como *"estudar matemática"* ou *"aprender programação"* sem prazo nem critérios de conclusão claros estimulam a procrastinação.
* **Ferramentas corporativas complexas:** Aplicativos como Jira, Notion ou ClickUp trazem excesso de opções e configurações que geram atrito antes mesmo do estudante começar a estudar.
* **Sensação de estagnação:** A ausência de feedback visual de progresso faz com que o iniciante acredite que não está evoluindo, levando ao desânimo e à evasão.
* **Perda de anotações:** Blocos de notas avulsos e abas fechadas provocam descontinuidade no aprendizado.

O **StudyFlow** resolve isso centralizando o essencial: **Título, Descrição, Prazo e Status**, acompanhados de gráficos de distribuição visual, quadro Kanban e marcos de conquista.

---

### 2. Público Principal
* **Autodidatas e Pessoas em Transição de Carreira:** Aprendizes de tecnologia, idiomas e novas habilidades que necessitam de direcionamento autônomo.
* **Vestibulandos e Estudantes do ENEM / Concursos:** Alunos com grande volume de matérias que precisam monitorar prazos e manter consistência diária.
* **Universitários nos Primeiros Semestres:** Estudantes recém-ingressos no ensino superior adaptando-se à gestão de rotina acadêmica independente.

---

## 🚀 Funcionalidades Principais

### ✅ Gestão Completa de Objetivos (CRUD)
- **Cadastrar:** Formulário com validação de campos obrigatórios (Título e Prazo Limite), descrição detalhada, matéria/categoria e nível de prioridade (Baixa, Média, Alta).
- **Visualizar:** Exibição com contagem regressiva de dias restantes, sinalização de prazos urgentes/atrasados e separadores tipográficos limpos.
- **Editar:** Edição rápida e instantânea de qualquer atributo cadastrado.
- **Excluir:** Exclusão segura com diálogo de confirmação prévia para evitar perdas acidentais.
- **Micro-etapas (Subtarefas):** Fatiamento pedagógico de metas grandes em pequenos passos com checklist integrado e barra de progresso.

### 📊 Visão Geral com Gráficos (Recharts)
- Gráfico de pizza/donut interativo no topo da página exibindo a distribuição por status:
  - 🟢 **Concluído**
  - 🔵 **Em andamento**
  - ⚪ **Não iniciado**
  - 🟡 **Pausado**
- Filtro interativo ao clicar nas fatias do gráfico ou nos cartões de status.
- Contador central com o total de objetivos e taxa de conclusão geral em porcentagem.

### 🏆 Sistema de Conquistas e Badges Educacionais
- Faixa comemorativa animada que desliza no topo da tela sempre que o estudante atinge marcos importantes, tais como:
  - 🚩 **Primeiro Objetivo Criado**: Primeiro passo na jornada.
  - 🎯 **Modo Estudo Ativo**: Início da execução prática.
  - ✅ **Primeira Vitória**: Conclusão da primeira meta.
  - 📚 **No Ritmo dos Estudos**: 3 objetivos concluídos.
  - 🏆 **Mestre da Consistência**: 5 objetivos concluídos.
  - 🔥 **Estrategista de Estudos**: 5 objetivos cadastrados.
  - ✂️ **Fatiador de Metas**: Conclusão de todas as micro-etapas de um objetivo.
  - ⏰ **Pontualidade Máxima**: Conclusão dentro do prazo limite estipulado.
- Modal dedicado *"Quadro de Conquistas"* para inspecionar medalhas desbloqueadas e o progresso até as próximas conquistas.

### 🔄 Modos de Visualização & Produtividade
- **Visão em Lista / Cards:** Busca em tempo real por título, matéria ou descrição, filtros segmentados e ordenação por prazo ou criação.
- **Visão em Fluxo (Kanban):** Quadro visual organizado por colunas com movimentação rápida de status em 1 clique.
- **Temporizador de Foco Pomodoro (25 min):** Cronômetro integrado diretamente aos cards para transformar planejamento em ação imediata.
- **Guia Pedagógico do Estudante:** Dicas com metodologia SMART, fatiamento de tarefas e conselhos de consistência.

### 💾 Persistência Local Contínua (`localStorage`)
- Todos os dados (objetivos cadastrados, alterações, subtarefas e medalhas conquistadas) são sincronizados no `localStorage` do navegador. Os dados permanecem salvos após recarregar ou reabrir a página.

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)** — Biblioteca reativa para construção de interfaces componentizadas.
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática robusta para contratos de dados e segurança de código.
- **[Vite](https://vitejs.dev/)** — Ferramenta de build moderna e ultrarrápida.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Estilização utilitária com design limpo, acessível e sem dependência de classes legadas.
- **[Recharts](https://recharts.org/)** — Renderização responsiva do gráfico de pizza da seção Visão Geral.
- **[Lucide React](https://lucide.dev/)** — Pacote de ícones SVG semânticos e consistentes.
- **[Motion](https://motion.dev/)** — Animações e transições de feedback visual.

---

## 📂 Estrutura de Diretórios

```
studyflow/
├── index.html                   # Ponto de entrada HTML com tipografia Plus Jakarta Sans
├── package.json                 # Dependências e scripts do projeto
├── tsconfig.json                # Configurações do compilador TypeScript
├── vite.config.ts               # Configuração do Vite e plugins
├── src/
│   ├── main.tsx                 # Inicialização do React DOM
│   ├── App.tsx                  # Componente raiz, estados principais e modais
│   ├── index.css                # Importação Tailwind CSS e estilos globais
│   ├── types/
│   │   ├── objective.ts         # Tipos: StudyObjective, ObjectiveStatus, Subtask, etc.
│   │   └── badge.ts             # Tipos: Badge, BadgeCategory, UnlockedAlert
│   ├── utils/
│   │   ├── date.ts              # Utilitários de cálculo de prazos e datas em pt-BR
│   │   ├── initialData.ts       # Dados de exemplo realistas para iniciantes
│   │   ├── storage.ts           # Gerenciamento de persistência no localStorage
│   │   └── badges.ts            # Mecanismo de avaliação e persistência de conquistas
│   └── components/
│       ├── Header.tsx           # Barra de navegação superior (Top Bar Contract)
│       ├── OverviewSection.tsx  # Seção Visão Geral com gráfico de pizza Recharts
│       ├── StatsBanner.tsx      # Barra de estatísticas e progresso de estudos
│       ├── ObjectiveCard.tsx    # Card de objetivo com metadados limpos e ações
│       ├── ObjectiveModal.tsx   # Modal de criação e edição com validação
│       ├── DeleteConfirmModal.tsx # Diálogo acessível de confirmação de exclusão
│       ├── KanbanBoard.tsx      # Visão em colunas de fluxo de trabalho
│       ├── BadgesBanner.tsx     # Faixa comemorativa de nova conquista no topo
│       ├── BadgesModal.tsx      # Modal com o quadro completo de medalhas
│       ├── FocusTimerModal.tsx  # Cronômetro Pomodoro de 25 minutos
│       ├── StudyGuide.tsx       # Guia com dicas pedagógicas e método SMART
│       └── ProductSpecModal.tsx # Documentação de produto e critérios de teste integrada
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* **npm** ou **yarn**

### Passo a Passo

1. **Clone ou acesse o diretório do projeto:**
   ```bash
   cd studyflow
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000) (ou a porta indicada no terminal).

5. **Para validar tipos e compilação de produção:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🧪 Critérios de Teste da Versão 1.0

| Cenário de Teste | Ação | Resultado Esperado |
| :--- | :--- | :--- |
| **1. Cadastro & Validação** | Clicar em *Cadastrar Objetivo*, tentar submeter sem título/prazo, e depois submeter com dados válidos. | O sistema alerta sobre campos obrigatórios; ao preencher corretamente, cria o card e salva localmente. |
| **2. Gráfico & Visão Geral** | Observar o gráfico de pizza no topo e clicar nas fatias ou cartões. | As fatias refletem a proporção dos status e filtram a listagem instantaneamente. |
| **3. Edição e Status** | Modificar descrição, prazo ou alternar status entre *Em andamento* e *Concluído*. | Os cards, o gráfico e os contadores atualizam imediatamente. |
| **4. Exclusão com Confirmação** | Clicar na lixeira de um objetivo. | Abre-se o diálogo de segurança; ao confirmar, o card é removido permanentemente. |
| **5. Persistência pós-Reload** | Fazer alterações e recarregar a página (`F5`). | Todos os dados, statuses e conquistas permanecem exatamente como estavam. |
| **6. Sistema de Conquistas** | Cadastrar o 1º objetivo ou clicar no botão *"Testar Marco de 5"*. | A faixa dourada desliza no topo anunciando a conquista desbloqueada. |

---

## 📄 Licença
Distribuído sob a licença **Apache-2.0**.
