export const farms = [
  {
    id: 1,
    name: "Fazenda Boa Esperança",
    city: "Rio Verde, GO",
    focus: "Soja, milho e bovinocultura",
    size: "1.180 ha",
    status: "Operação principal",
  },
  {
    id: 2,
    name: "Sítio Santa Clara",
    city: "Patos de Minas, MG",
    focus: "Hortifruti e leite",
    size: "86 ha",
    status: "Unidade em expansão",
  },
];

export const teamRoles = [
  {
    role: "Dono",
    people: "1 pessoa",
    access: "Visão total do negócio e metas de margem.",
    mission: "Decide investimento, acompanha resultado por safra e aprova gastos maiores.",
  },
  {
    role: "Gestor",
    people: "2 pessoas",
    access: "Fluxo de caixa, operações, alertas e logística.",
    mission: "Conecta financeiro com equipe de campo, compra e venda.",
  },
  {
    role: "Financeiro",
    people: "1 pessoa",
    access: "Lançamentos, contas, relatórios e conciliação.",
    mission: "Mantém o caixa confiável e fecha o mês sem depender de planilhas paralelas.",
  },
  {
    role: "Operacional",
    people: "3 pessoas",
    access: "Checklist, logística e informações de apoio ao lançamento.",
    mission: "Traz do campo o dado certo para o sistema aprender a operação real.",
  },
];

export const onboardingChecklist = [
  "Cadastrar a primeira fazenda, cidade, culturas e tamanho da operação.",
  "Definir quem será dono, gestor, financeiro e operacional dentro do sistema.",
  "Criar atividades por frente produtiva para ligar receita, despesa e margem.",
  "Subir os primeiros lançamentos e revisar alertas antes do fechamento da semana.",
];

export const transactionFeed = [
  {
    id: "TR-3021",
    date: "2026-05-02",
    farm: "Fazenda Boa Esperança",
    activity: "Milho safrinha",
    category: "Combustível",
    channel: "Pix",
    type: "expense",
    amount: 3850,
    status: "Confirmado",
  },
  {
    id: "TR-3022",
    date: "2026-05-03",
    farm: "Fazenda Boa Esperança",
    activity: "Bovinocultura",
    category: "Venda de animais",
    channel: "Transferência",
    type: "income",
    amount: 18400,
    status: "Recebido",
  },
  {
    id: "TR-3023",
    date: "2026-05-04",
    farm: "Sítio Santa Clara",
    activity: "Leite",
    category: "Energia",
    channel: "Boleto",
    type: "expense",
    amount: 1290,
    status: "A vencer",
  },
  {
    id: "TR-3024",
    date: "2026-05-05",
    farm: "Sítio Santa Clara",
    activity: "Tomate",
    category: "Venda em atacado",
    channel: "Duplicata",
    type: "income",
    amount: 9640,
    status: "Em cobrança",
  },
  {
    id: "TR-3025",
    date: "2026-05-06",
    farm: "Fazenda Boa Esperança",
    activity: "Milho safrinha",
    category: "Fertilizante",
    channel: "Prazo fornecedor",
    type: "expense",
    amount: 6210,
    status: "Programado",
  },
];

export const notificationCenter = [
  {
    id: 1,
    title: "Combustível acima da média",
    priority: "Alta",
    channel: "Sistema",
    status: "Pendente",
    owner: "Financeiro",
    message: "O gasto de diesel está 18% acima do padrão das últimas 6 semanas.",
  },
  {
    id: 2,
    title: "Recebimento do tomate em atraso",
    priority: "Média",
    channel: "WhatsApp",
    status: "Acompanhar",
    owner: "Gestor",
    message: "Uma venda de R$ 9.640 ainda não foi compensada e impacta o caixa projetado.",
  },
  {
    id: 3,
    title: "Janela boa de venda para café",
    priority: "Alta",
    channel: "Resumo comercial",
    status: "Novo",
    owner: "Dono",
    message: "O preço de mercado abriu oportunidade melhor que a média das últimas 3 semanas.",
  },
  {
    id: 4,
    title: "Conta de energia vence amanhã",
    priority: "Baixa",
    channel: "Email",
    status: "Avisado",
    owner: "Financeiro",
    message: "O sistema sinalizou o vencimento para evitar atraso e ruído na operação.",
  },
];

export const cashflowForecast = [
  {
    label: "7 dias",
    inflow: 22400,
    outflow: 14180,
    balance: 8220,
    note: "Janela curta ainda positiva, mas muito dependente do recebimento do hortifruti.",
  },
  {
    label: "30 dias",
    inflow: 91200,
    outflow: 76850,
    balance: 14350,
    note: "Mês no verde, com atenção maior para fertilizante, frete e energia.",
  },
  {
    label: "90 dias",
    inflow: 274000,
    outflow: 239500,
    balance: 34500,
    note: "Cenário bom se a produtividade esperada e a logística de saída se confirmarem.",
  },
];

export const budgetStatus = [
  {
    category: "Combustível",
    budget: 18000,
    actual: 19540,
    unit: "Mensal",
    note: "Acima da meta. Vale revisar rota, trator e compra fracionada.",
  },
  {
    category: "Fertilizante",
    budget: 42000,
    actual: 38700,
    unit: "Safra",
    note: "Dentro do esperado, com margem pequena para reposição extra.",
  },
  {
    category: "Folha",
    budget: 26500,
    actual: 24890,
    unit: "Mensal",
    note: "Controlado, mas depende do ritmo de colheita das próximas semanas.",
  },
  {
    category: "Manutenção",
    budget: 12400,
    actual: 14980,
    unit: "Mensal",
    note: "Pressão acima do esperado por máquina parada e peças urgentes.",
  },
];

export const productionCosts = [
  {
    activity: "Milho safrinha",
    perHectare: "R$ 4.280/ha",
    perLot: "R$ 51.360/lote",
    margin: "23%",
    note: "Boa margem, mas muito sensível a diesel e cobertura de solo.",
  },
  {
    activity: "Café",
    perHectare: "R$ 7.940/ha",
    perLot: "R$ 31.760/talhão",
    margin: "18%",
    note: "Resultado estável, com risco de adubação e colheita curta.",
  },
  {
    activity: "Leite",
    perHectare: "R$ 3.180/ha",
    perLot: "R$ 18.900/módulo",
    margin: "15%",
    note: "Margem menor, pedindo rotina forte de energia, nutrição e logística.",
  },
];

export const monthlyReports = [
  {
    month: "Março 2026",
    revenue: 118400,
    expense: 97860,
    balance: 20540,
    topActivity: "Milho safrinha",
  },
  {
    month: "Abril 2026",
    revenue: 124900,
    expense: 103240,
    balance: 21660,
    topActivity: "Bovinocultura",
  },
  {
    month: "Maio 2026",
    revenue: 131700,
    expense: 109580,
    balance: 22120,
    topActivity: "Tomate",
  },
];

export const harvestComparisons = [
  {
    cycle: "Safra 24/25",
    area: "920 ha",
    production: "4.180 sacas equivalentes",
    margin: "17%",
    note: "Ano de aprendizado com logística mais apertada e custo alto de insumo.",
  },
  {
    cycle: "Safra 25/26",
    area: "1.020 ha",
    production: "4.620 sacas equivalentes",
    margin: "22%",
    note: "Melhora por compra antecipada e mais disciplina de lançamento.",
  },
];

export const profitabilityBoard = [
  {
    culture: "Milho safrinha",
    revenue: 126000,
    cost: 96700,
    margin: 29300,
    cycle: "Safra atual",
  },
  {
    culture: "Café",
    revenue: 84200,
    cost: 68880,
    margin: 15320,
    cycle: "Safra atual",
  },
  {
    culture: "Leite",
    revenue: 59200,
    cost: 50400,
    margin: 8800,
    cycle: "Mês corrente",
  },
];

export const testimonials = [
  {
    author: "João Mendes",
    role: "Produtor de grãos",
    quote: "Antes eu fechava o mês no susto. Agora enxergo a margem por frente e ajo antes do problema crescer.",
  },
  {
    author: "Lívia Rocha",
    role: "Gestora rural",
    quote: "O valor não está só no lançamento. Está em ligar caixa, operação, preço e logística no mesmo lugar.",
  },
  {
    author: "Carlos Tavares",
    role: "Fazenda de leite e hortifruti",
    quote: "O primeiro acesso ficou simples para a equipe. Isso reduz resistência e acelera a adoção.",
  },
];

export const pricingPlans = [
  {
    name: "Essencial",
    price: "R$ 149/mês",
    audience: "Produtor pequeno ou início da operação digital",
    highlights: [
      "Livro-caixa e lançamentos com IA",
      "Alertas financeiros",
      "Painel por atividade",
    ],
  },
  {
    name: "Gestão",
    price: "R$ 289/mês",
    audience: "Pequeno e médio produtor com mais de uma frente",
    highlights: [
      "Fluxo de caixa futuro",
      "Orçamento por categoria",
      "Centro de notificações e relatórios",
    ],
  },
  {
    name: "Operação",
    price: "Sob consulta",
    audience: "Fazendas com múltiplas unidades e equipe maior",
    highlights: [
      "Múltiplas fazendas e perfis",
      "Logística e inteligência comercial",
      "Integrações e implantação assistida",
    ],
  },
];

export const faqItems = [
  {
    question: "Preciso entender de tecnologia para usar?",
    answer: "Não. A proposta é ser simples para o time do campo e forte o suficiente para a gestão.",
  },
  {
    question: "Serve só para grãos?",
    answer: "Não. O modelo acomoda grãos, café, leite, hortifruti, pecuária e operações mistas.",
  },
  {
    question: "Consigo usar com mais de uma fazenda?",
    answer: "Sim. A experiência foi expandida para múltiplas fazendas e diferentes perfis de equipe.",
  },
  {
    question: "Posso começar só pelo financeiro?",
    answer: "Sim. O produto começa pelo caixa e vai crescendo para inteligência, mercado e logística.",
  },
];

export const integrationIdeas = [
  {
    title: "WhatsApp rural",
    description: "Enviar resumo semanal, alerta de vencimento e janela de venda direto no celular do produtor.",
    status: "Próximo passo forte",
  },
  {
    title: "Importação CSV/Excel",
    description: "Trazer extrato, planilha antiga ou fechamento de fornecedor sem digitar tudo de novo.",
    status: "Alto impacto imediato",
  },
  {
    title: "OCR de comprovantes",
    description: "Ler nota, recibo e comprovante para acelerar lançamento e reduzir erro manual.",
    status: "Diferencial de adoção",
  },
  {
    title: "Bancos, ERP e preços",
    description: "Conectar dados financeiros e comerciais para dar mais automação ao produtor.",
    status: "Roadmap estratégico",
  },
];
