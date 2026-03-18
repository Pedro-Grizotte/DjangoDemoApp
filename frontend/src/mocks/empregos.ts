import type { Trabalho, EducacaoLevel, RangeSalario } from '@/types';

export const rangeDeSalarios: RangeSalario[] = [
  { valor: 'up_to_1000', label: 'Até 1.000', minimo: 0, maximo: 1000 },
  { valor: 'from_1000_to_2000', label: 'De 1.000 a 2.000', minimo: 1000, maximo: 2000 },
  { valor: 'from_2000_to_3000', label: 'De 2.000 a 3.000', minimo: 2000, maximo: 3000 },
  { valor: 'above_3000', label: 'Acima de 3.000', minimo: 3000, maximo: null },
];

export const niveisDeEducacao: EducacaoLevel[] = [
  { valor: 'fundamental', label: 'Ensino fundamental', rank: 1 },
  { valor: 'medio', label: 'Ensino médio', rank: 2 },
  { valor: 'tecnologo', label: 'Tecnólogo', rank: 3 },
  { valor: 'superior', label: 'Ensino Superior', rank: 4 },
  { valor: 'pos', label: 'Pós / MBA / Mestrado', rank: 5 },
  { valor: 'doutorado', label: 'Doutorado', rank: 6 },
];

export const TrabalhosMock: Trabalho[] = [
  {
    id: 101,
    titulo: 'Auxiliar Administrativo',
    salario_range: 'from_1000_to_2000',
    salario_range_label: 'De 1.000 a 2.000',
    requisitos: 'Organização, pacote office básico e boa comunicação.',
    educacao_minima: 'medio',
    educacao_minima_label: 'Ensino médio',
    criado_em: '2026-03-01',
    contagem_candidatos: 2,
    criado_por: 1,
  },
  {
    id: 102,
    titulo: 'Analista de Suporte',
    salario_range: 'from_2000_to_3000',
    salario_range_label: 'De 2.000 a 3.000',
    requisitos: 'Conhecimento em atendimento ao cliente, suporte técnico e sistemas internos.',
    educacao_minima: 'tecnologo',
    educacao_minima_label: 'Tecnólogo',
    criado_em: '2026-03-05',
    contagem_candidatos: 3,
    criado_por: 1,
  },
  {
    id: 103,
    titulo: 'Desenvolvedor Python Júnior',
    salario_range: 'above_3000',
    salario_range_label: 'Acima de 3.000',
    requisitos: 'Python, APIs REST, Git e noções de backend.',
    educacao_minima: 'superior',
    educacao_minima_label: 'Ensino Superior',
    criado_em: '2026-03-10',
    contagem_candidatos: 1,
    criado_por: 1,
  },
];
