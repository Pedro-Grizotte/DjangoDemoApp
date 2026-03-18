import type { Usuario } from '@/types';

export const UsuarioMockado: Record<string, Usuario> = {
  empresa: {
    id: 1,
    nome: 'Empresa Demo',
    email: 'empresa@gmail.com',
    tipo: 'empresa',
  },
  candidato: {
    id: 2,
    nome: 'Candidato Demo',
    email: 'candidato@demo.com',
    tipo: 'candidato',
    perfil: {
      expectativa_salarial: 2500,
      experiencia: '2 anos com atendimento, rotinas administrativas e suporte operacional.',
      educacao_recente: 'superior',
    },
  },
};
