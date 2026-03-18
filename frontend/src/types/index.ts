export type TipoUsuario = 'empresa' | 'candidato';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  perfil?: PerfilCandidato;
}

export interface PerfilCandidato {
  expectativa_salarial: number;
  experiencia: string;
  educacao_recente: string;
}

export interface RangeSalario {
  valor: string;
  label: string;
  minimo: number;
  maximo: number | null;
}

export interface EducacaoLevel {
  valor: string;
  label: string;
  rank: number;
}

export interface Trabalho {
  id: number;
  titulo: string;
  salario_range: string;
  salario_range_label: string;
  requisitos: string;
  educacao_minima: string;
  educacao_minima_label: string;
  criado_em: string;
  contagem_candidatos: number;
  criado_por: number;
}

export interface Aplicacao {
  id: number;
  trabalho_id: number;
  candidato_id: number;
  candidato_nome: string;
  expectativa_salarial: number;
  experiencia: string;
  educacao_recente: string;
  educacao_recente_label: string;
  score: number;
  aplicacao_em: string;
}

export interface ReportMensal {
  mes: string;
  contagem: number;
}
