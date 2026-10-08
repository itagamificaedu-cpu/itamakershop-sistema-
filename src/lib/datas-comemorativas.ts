// Datas comemorativas que entram em destaque na home enquanto estão chegando.

export interface DataComemorativa {
  id: string
  nome: string
  chamada: string
  texto: string
  mensagemWhatsapp: string
  palavrasChave: string[]
  /** dia e mês (1-12), ou função para datas móveis */
  quando: { dia: number; mes: number } | ((ano: number) => Date)
  /** quantos dias antes a data já aparece na home */
  antecedenciaDias: number
}

// n-ésimo domingo de um mês (mes de 1 a 12)
function domingoDoMes(ano: number, mes: number, n: number) {
  const primeiro = new Date(Date.UTC(ano, mes - 1, 1)).getUTCDay()
  const dia = 1 + ((7 - primeiro) % 7) + (n - 1) * 7
  return new Date(Date.UTC(ano, mes - 1, dia))
}

export const DATAS: DataComemorativa[] = [
  {
    id: "dia-das-criancas",
    nome: "Dia das Crianças",
    chamada: "Brinquedos e lembranças que a criançada vai amar",
    texto: "Brinquedos, chaveiros com nome, quebra-cabeças e peças personalizadas em impressão 3D e corte a laser.",
    mensagemWhatsapp: "Olá! Quero encomendar um presente para o Dia das Crianças na ItaMakerShop.",
    palavrasChave: ["criança", "infantil", "brinquedo", "quebra", "chaveiro", "arte"],
    quando: { dia: 12, mes: 10 },
    antecedenciaDias: 25,
  },
  {
    id: "dia-dos-professores",
    nome: "Dia dos Professores",
    chamada: "Um presente que fica na mesa do professor",
    texto: "Porta-canetas, calendários, plaquinhas e lembranças com nome ou com a marca da escola.",
    mensagemWhatsapp: "Olá! Quero encomendar uma lembrança para o Dia dos Professores na ItaMakerShop.",
    palavrasChave: ["professor", "porta", "calendário", "mesa", "escola"],
    quando: { dia: 15, mes: 10 },
    antecedenciaDias: 25,
  },
  {
    id: "natal",
    nome: "Natal",
    chamada: "Decoração e presentes de Natal sob medida",
    texto: "Árvores, enfeites e lembranças natalinas, com o nome da família ou da empresa.",
    mensagemWhatsapp: "Olá! Quero encomendar peças de Natal na ItaMakerShop.",
    palavrasChave: ["natal", "árvore", "arvore", "enfeite"],
    quando: { dia: 25, mes: 12 },
    antecedenciaDias: 45,
  },
  {
    id: "volta-as-aulas",
    nome: "Volta às Aulas",
    chamada: "Organização e personalização para o ano letivo",
    texto: "Porta-canetas, chaveiros e itens personalizados para alunos, turmas e escolas.",
    mensagemWhatsapp: "Olá! Quero um orçamento de itens para a Volta às Aulas na ItaMakerShop.",
    palavrasChave: ["porta", "chaveiro", "escola", "calendário"],
    quando: { dia: 1, mes: 2 },
    antecedenciaDias: 20,
  },
  {
    id: "dia-das-maes",
    nome: "Dia das Mães",
    chamada: "Presente com carinho e o nome dela",
    texto: "Lembranças personalizadas, com impressão 3D e corte a laser.",
    mensagemWhatsapp: "Olá! Quero encomendar um presente para o Dia das Mães na ItaMakerShop.",
    palavrasChave: ["mãe", "chaveiro", "presente"],
    quando: (ano) => domingoDoMes(ano, 5, 2),
    antecedenciaDias: 25,
  },
  {
    id: "dia-dos-namorados",
    nome: "Dia dos Namorados",
    chamada: "Um presente diferente, feito sob medida",
    texto: "Chaveiros, quadros e lembranças personalizadas para quem você ama.",
    mensagemWhatsapp: "Olá! Quero encomendar um presente para o Dia dos Namorados na ItaMakerShop.",
    palavrasChave: ["namorad", "coração", "chaveiro", "presente"],
    quando: { dia: 12, mes: 6 },
    antecedenciaDias: 25,
  },
  {
    id: "dia-dos-pais",
    nome: "Dia dos Pais",
    chamada: "Presente personalizado para o seu pai",
    texto: "Porta-canetas, chaveiros e peças com nome, feitos sob encomenda.",
    mensagemWhatsapp: "Olá! Quero encomendar um presente para o Dia dos Pais na ItaMakerShop.",
    palavrasChave: ["pai", "porta", "chaveiro", "presente"],
    quando: (ano) => domingoDoMes(ano, 8, 2),
    antecedenciaDias: 25,
  },
]

export interface DataAtiva extends DataComemorativa {
  diasRestantes: number
  dataAlvo: Date
}

const DIA_MS = 24 * 60 * 60 * 1000

/** Datas dentro da janela de destaque, da mais próxima para a mais distante. */
export function datasAtivas(agora: Date = new Date()): DataAtiva[] {
  // Fortaleza é UTC-3 o ano todo: usa o "hoje" local.
  const local = new Date(agora.getTime() - 3 * 60 * 60 * 1000)
  const hoje = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate())
  const ativas: DataAtiva[] = []

  for (const data of DATAS) {
    for (const ano of [local.getUTCFullYear(), local.getUTCFullYear() + 1]) {
      const alvo =
        typeof data.quando === "function"
          ? data.quando(ano)
          : new Date(Date.UTC(ano, data.quando.mes - 1, data.quando.dia))
      const diasRestantes = Math.round((alvo.getTime() - hoje) / DIA_MS)
      if (diasRestantes >= 0 && diasRestantes <= data.antecedenciaDias) {
        ativas.push({ ...data, diasRestantes, dataAlvo: alvo })
        break
      }
    }
  }

  return ativas.sort((a, b) => a.diasRestantes - b.diasRestantes)
}

export function textoContagem(dias: number) {
  if (dias === 0) return "É hoje!"
  if (dias === 1) return "Falta 1 dia"
  return `Faltam ${dias} dias`
}
