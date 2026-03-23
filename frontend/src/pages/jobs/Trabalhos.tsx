import { useState, useMemo, useEffect } from 'react';
import type { Trabalho, Usuario } from '@/types';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import TrabalhoCard from '@/components/jobs/TrabalhoCard';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { enviarCandidatura } from '@/lib/candidaturas';
import { Search, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const AUTH_TOKEN_CHAVE = 'auth_token';

interface TrabalhosPropriedades {
  user: Usuario | null;
}

interface AplicacaoAPI {
  id: number;
  trabalho: number;
  nome_trabalho: string;
  candidato: number;
  score: number;
  criado_em: string;
}

interface TrabalhoAPI {
  id: number;
  nome: string;
  range_salario: 'UP_TO_1000' | 'FROM_1000_TO_2000' | 'FROM_2000_TO_3000' | 'ABOVE_3000';
  requisitos: string;
  educacao_minima: 1 | 2 | 3 | 4 | 5 | 6;
  empresa: number;
  contagem_candidatos: number;
  criado_em: string;
  atualizado_em: string;
}

const rangeDeSalarios = [
  { valor: 'all', label: 'Todas as faixas' },
  { valor: 'UP_TO_1000', label: 'Até 1.000' },
  { valor: 'FROM_1000_TO_2000', label: 'De 1.000 a 2.000' },
  { valor: 'FROM_2000_TO_3000', label: 'De 2.000 a 3.000' },
  { valor: 'ABOVE_3000', label: 'Acima de 3.000' },
];

const niveisDeEducacao = [
  { valor: 'all', label: 'Escolaridade' },
  { valor: '1', label: 'Ensino fundamental' },
  { valor: '2', label: 'Ensino medio' },
  { valor: '3', label: 'Tecnologo' },
  { valor: '4', label: 'Ensino Superior' },
  { valor: '5', label: 'Pos / MBA / Mestrado' },
  { valor: '6', label: 'Doutorado' },
];

const RANGE_SALARIO_LABEL: Record<TrabalhoAPI['range_salario'], string> = {
  UP_TO_1000: 'Até 1.000',
  FROM_1000_TO_2000: 'De 1.000 a 2.000',
  FROM_2000_TO_3000: 'De 2.000 a 3.000',
  ABOVE_3000: 'Acima de 3.000',
};

const EDUCACAO_LABEL: Record<TrabalhoAPI['educacao_minima'], string> = {
  1: 'Ensino fundamental',
  2: 'Ensino medio',
  3: 'Tecnologo',
  4: 'Ensino Superior',
  5: 'Pos / MBA / Mestrado',
  6: 'Doutorado',
};

function mapearTrabalhoDaAPI(emprego: TrabalhoAPI): Trabalho {
  return {
    id: emprego.id,
    titulo: emprego.nome,
    salario_range: emprego.range_salario,
    salario_range_label: RANGE_SALARIO_LABEL[emprego.range_salario],
    requisitos: emprego.requisitos,
    educacao_minima: String(emprego.educacao_minima),
    educacao_minima_label: EDUCACAO_LABEL[emprego.educacao_minima],
    criado_em: emprego.criado_em,
    contagem_candidatos: emprego.contagem_candidatos,
    criado_por: emprego.empresa,
  };
}

export default function Trabalhos({ user }: TrabalhosPropriedades) {
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroSalario, setFiltroSalario] = useState('all');
  const [filtroEducacao, setFiltroEducacao] = useState('all');
  const [aplicacaoId, setAplicacaoId] = useState<number[]>([]);
  const [aplicandoIds, setAplicandoIds] = useState<number[]>([]);

  useEffect(() => {
    const carregarMinhasAplicacoes = async () => {
      if (user?.tipo !== 'candidato') {
        setAplicacaoId([]);
        return;
      }

      const token = localStorage.getItem(AUTH_TOKEN_CHAVE);
      if (!token) {
        setAplicacaoId([]);
        return;
      }

      try {
        const resposta = await fetch(`/api/trabalhos/aplicacoes/minhas/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
          throw new Error(dados?.detail || 'Nao foi possivel carregar suas candidaturas.');
        }
        setAplicacaoId(dados.map((aplicacao: AplicacaoAPI) => aplicacao.trabalho));
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao carregar suas candidaturas.';
        toast.error(mensagem);
      }
    };

    carregarMinhasAplicacoes();
  }, [user]);

  useEffect(() => {
    const carregarTrabalhos = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch('/api/trabalhos/');
        const dados = await resposta.json();

        if (!resposta.ok) {
          const mensagem = dados?.detail || 'Não foi possivel carregar a lista de vagas.';
          throw new Error(mensagem);
        }
        setTrabalhos(dados.map(mapearTrabalhoDaAPI));
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao buscar vagas.';
        toast.error(mensagem);
      } finally {
        setCarregando(false);
      }
    };

    carregarTrabalhos();
  }, []);

  const filtros = useMemo(() => {
    return trabalhos.filter(emprego => {
      const matchBusca = emprego.titulo.toLowerCase().includes(busca.toLowerCase()) || emprego.requisitos.toLowerCase().includes(busca.toLowerCase());
      const matchSalario = filtroSalario === 'all' || emprego.salario_range === filtroSalario;
      const matchEducacao = filtroEducacao === 'all' || emprego.educacao_minima === filtroEducacao;

      return matchBusca && matchSalario && matchEducacao;
    });
  }, [trabalhos, busca, filtroSalario, filtroEducacao]);

  const enviarApply = async (trabalhoId: number) => {
    if (aplicacaoId.includes(trabalhoId) || aplicandoIds.includes(trabalhoId)) {
      return;
    }
    if (user?.tipo !== 'candidato') {
      toast.error('Apenas candidatos podem se candidatar.');
      return;
    }

    const token = localStorage.getItem(AUTH_TOKEN_CHAVE);
    if (!token) {
      toast.error('Faça login para se candidatar.');
      return;
    }

    try {
      setAplicandoIds(prev => [...prev, trabalhoId]);
      await enviarCandidatura(trabalhoId);
      setAplicacaoId(prev => [...prev, trabalhoId]);
      toast.success('Candidatura enviada com sucesso!');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao enviar candidatura.';
      toast.error(mensagem);
    } finally {
      setAplicandoIds(prev => prev.filter(id => id !== trabalhoId));
    }
  };

  return (
    <ConteudoPagina>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Vagas Disponíveis</h1>
          <p className="text-muted-foreground">Encontre a oportunidade ideal para você</p>
        </div>
      </div>

      {/* Filtros de Busca */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar vagas..." className="pl-9" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <Select value={filtroSalario} onValueChange={setFiltroSalario}>
          <SelectTrigger><SelectValue placeholder="Faixa salarial" /></SelectTrigger>
          <SelectContent>
            {rangeDeSalarios.map(r => (
              <SelectItem key={r.valor} value={r.valor}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroEducacao} onValueChange={setFiltroEducacao}>
          <SelectTrigger><SelectValue placeholder="Escolaridade" /></SelectTrigger>
          <SelectContent>
            {niveisDeEducacao.map(e => (
              <SelectItem key={e.valor} value={e.valor}>{e.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {carregando ? (
        <p className="text-sm text-muted-foreground">Carregando vagas...</p>
      ) : filtros.length === 0 ? (
        <EstadoVazio icone={Briefcase} titulo="Nenhuma vaga encontrada" descricao="Tente ajustar os filtros de busca." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtros.map(job => (
            <TrabalhoCard key={job.id} emprego={job} mostrarAplicado={user?.tipo === 'candidato'} onAplicacao={enviarApply} IdAplicacao={aplicacaoId} aplicando={aplicandoIds.includes(job.id)} />
          ))}
        </div>
      )}
    </ConteudoPagina>
  );
}
