/**
 * Configuração central — edite aqui os nomes, cargos e descrições.
 * Após editar, reinicie o servidor (dev) ou faça deploy (Vercel).
 */

const MEMBERS = [
  "Giovana",
  "Israel",
  "Edileuza",
  "Samara",
  "Paulo",
  "Leonardo",
  "Kelly",
  "Carla",
  "Peterson",
  "Keven",
  "Dani"
];

const POSITIONS = [
  {
    id: "presidencia",
    title: "Presidência",
    description: `O presidente é o rosto público da instituição. Preside todas as reuniões, conduz as deliberações e tem a palavra final nas decisões executivas. Assina documentos oficiais, representa o grupo em eventos externos e é o principal ponto de contato com órgãos parceiros, entidades e a comunidade em geral.

No dia a dia, a função exige presença ativa: acompanhar o andamento de cada área da diretoria, garantir que as decisões tomadas em reunião sejam de fato executadas, cobrar responsabilidades sem gerar atrito desnecessário e manter o grupo coeso mesmo em momentos de divergência.

Mais do que qualquer habilidade técnica, o cargo exige algo mais difícil de aprender: a capacidade de liderar pessoas com perfis muito diferentes, de tomar decisões sob pressão e de falar pelo grupo de forma que todos se sintam representados. O presidente que funciona bem é aquele que a diretoria respeita. Não porque impõe, mas porque inspira.`,
    skills: [
      "Liderança de grupo",
      "Comunicação clara",
      "Condução de reuniões",
      "Mediação de conflitos",
      "Tomada de decisão",
      "Presença pública",
      "Visão estratégica",
      "Senso de responsabilidade"
    ]
  },
  {
    id: "vice_presidencia",
    title: "Vice-Presidência",
    description: `O vice-presidente é o substituto imediato do presidente em qualquer ausência ou impedimento. Isso significa que precisa estar tão alinhado quanto o titular em relação a tudo que está em andamento: compromissos assumidos, projetos em execução, conflitos abertos e decisões pendentes.

Na prática, o cargo vai muito além de "reserva técnica". O vice costuma assumir a coordenação de frentes específicas, fazer a ponte entre as diferentes áreas da diretoria e acompanhar de perto os pontos críticos que o presidente não consegue monitorar sozinho. Em gestões ativas, é comum que vice e presidente se dividam estrategicamente: um com foco externo, outro cuidando da operação interna.

O perfil ideal é de alguém organizado, proativo e que não precisa ser cobrado para entregar. Que antecipa problemas antes que virem crise, transita bem entre diferentes situações e tem boa relação com todos os membros da diretoria. A capacidade de articular sem impor e de manter tudo funcionando nos bastidores é o que define um bom vice.`,
    skills: [
      "Organização",
      "Proatividade",
      "Gestão de projetos",
      "Autonomia",
      "Articulação entre áreas",
      "Trabalho em equipe",
      "Versatilidade",
      "Planejamento"
    ]
  },
  {
    id: "primeiro_secretario",
    title: "1º Secretário(a)",
    description: `O 1º secretário é o guardião da memória institucional. Toda decisão tomada em reunião passa por ele: é sua responsabilidade redigir as atas, registrar com precisão o que foi discutido e deliberado, e garantir que esses registros sejam acessíveis e organizados, tanto em arquivo físico quanto digital.

Além das atas, o cargo cuida de toda a correspondência oficial da instituição: ofícios, comunicados internos, convocações de reunião, respostas formais a entidades externas. É o secretário quem organiza as pautas, controla as listas de presença e zela pelo cumprimento das formalidades previstas no estatuto.

O perfil ideal é de alguém com boa escrita e capacidade de síntese. Conseguir ouvir uma discussão de uma hora e transformá-la em um registro claro, objetivo e fiel ao que foi dito. Precisa ser detalhista, organizado e gostar de manter processos em dia. Domínio de ferramentas como Google Docs ou Word é essencial; familiaridade com Drive ou sistemas de armazenamento em nuvem é um diferencial importante.`,
    skills: [
      "Boa escrita",
      "Redação formal",
      "Síntese de informações",
      "Google Docs / Word",
      "Google Drive / nuvem",
      "Organização de arquivos",
      "Atenção a detalhes",
      "Pontualidade nos registros"
    ]
  },
  {
    id: "segundo_secretario",
    title: "2º Secretário(a)",
    description: `O 2º secretário apoia diretamente o trabalho do 1º secretário e assume suas funções integralmente quando necessário. Na prática, participa da produção documental, ajuda a organizar os arquivos, contribui na preparação de reuniões e dá suporte na gestão da correspondência oficial.

Em instituições mais ativas, o cargo não é coadjuvante: existe volume suficiente de documentos e comunicações para que as duas secretarias trabalhem em paralelo, cada uma com responsabilidades bem definidas. Em alguns casos, o 2º secretário assume a responsabilidade exclusiva sobre um tipo de documento, como as atas de assembleias, enquanto o 1º cuida das reuniões ordinárias.

O perfil ideal combina boa escrita com organização e espírito colaborativo. Trabalhar bem em dupla, sem disputar protagonismo e garantindo continuidade quando o titular está ausente, é a competência central do cargo. Quem gosta de manter processos organizados e se sente bem no suporte estruturado tende a se destacar.`,
    skills: [
      "Boa escrita",
      "Organização de arquivos",
      "Google Docs / Word",
      "Trabalho em equipe",
      "Revisão de textos",
      "Atenção a detalhes",
      "Pontualidade",
      "Colaboração"
    ]
  },
  {
    id: "primeiro_tesoureiro",
    title: "1º Tesoureiro(a)",
    description: `O 1º tesoureiro controla tudo que envolve dinheiro na instituição. Isso inclui registrar todas as entradas (mensalidades, doações, receitas de eventos), autorizar e documentar todas as saídas, manter o fluxo de caixa atualizado e elaborar relatórios financeiros periódicos para prestação de contas à diretoria e aos membros.

Também é responsável por garantir que a instituição esteja em dia com suas obrigações fiscais, e que todo gasto tenha nota, recibo ou comprovante adequado. Em períodos de planejamento, lidera a elaboração do orçamento anual e acompanha sua execução mês a mês.

O perfil ideal é de alguém que se sente à vontade com números e planilhas. Não precisa ser contador ou ter formação financeira, mas precisa gostar de organizar dados, ter método e ser criterioso. Quem usa Excel ou Google Sheets no dia a dia com naturalidade, que não deixa pra depois uma conciliação financeira e que se sente responsável pelo dinheiro coletivo tende a se sair bem. Transparência é inegociável: o tesoureiro lida com recursos de todos.`,
    skills: [
      "Planilhas (Excel / Google Sheets)",
      "Controle de fluxo de caixa",
      "Organização financeira",
      "Atenção a números",
      "Prestação de contas",
      "Planejamento orçamentário",
      "Organização de comprovantes",
      "Responsabilidade fiscal"
    ]
  },
  {
    id: "segundo_tesoureiro",
    title: "2º Tesoureiro(a)",
    description: `O 2º tesoureiro apoia o trabalho do titular e o substitui integralmente em caso de ausência. Na prática, auxilia no controle de entradas e saídas, ajuda a manter os registros financeiros atualizados e participa da conferência de documentos, notas e comprovantes.

Em muitas gestões, o cargo não é passivo: o 2º tesoureiro assume uma frente financeira específica, como o controle de inadimplência, a gestão de um fundo reserva, o acompanhamento de projetos com orçamento próprio ou a conciliação de extratos bancários.

O perfil ideal combina organização com aptidão numérica e confiabilidade. Assim como o 1º tesoureiro, precisa ser criterioso com os registros e responsável no trato com os recursos da instituição. Saber trabalhar com planilhas é fundamental. E a competência que mais diferencia um bom 2º tesoureiro é a capacidade de atuar em dupla: manter tudo alinhado com o titular e garantir que nada se perca quando há necessidade de substituição.`,
    skills: [
      "Planilhas (Excel / Google Sheets)",
      "Organização financeira",
      "Controle de entradas e saídas",
      "Atenção a detalhes",
      "Conciliação de registros",
      "Trabalho em equipe",
      "Responsabilidade",
      "Confiabilidade"
    ]
  }
];

const TOTAL_VOTERS = 11;

module.exports = { MEMBERS, POSITIONS, TOTAL_VOTERS };
