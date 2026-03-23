import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import CandidatosCard from '@/components/jobs/CandidatosCard';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { Card, CardConteudo } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, DollarSign, GraduationCap, Star } from 'lucide-react';
import type { Aplicacao } from '@/types';
import { toast } from 'sonner';

const AUTH_TOKEN_CHAVE = 'auth_token';

interface TrabalhoAPI {
  id: number;
  nome: string;
  range_salario: 'UP_TO_1000' | 'FROM_1000_TO_2000' | 'FROM_2000_TO_3000' | 'ABOVE_3000';
  requisitos: string;
  educacao_minima: 1 | 2 | 3 | 4 | 5 | 6;
  empresa: number;
  contagem_candidatos?: number;
  criado_em: string;
  atualizado_em: string;
}

interface AplicacaoAPI {
  id: number;
  trabalho: number;
  nome_trabalho: string;
  candidato: number;
  candidato_data: {
    id: number;
    email: string;
    salario_expectativa: string | null;
    experiencia: string | null;
    nivel_educacao: number | null;
  };
  score: number;
  criado_em: string;
}

const RANGE_SALARIO_LABEL: Record<TrabalhoAPI['range_salario'], string> = {
  UP_TO_1000: 'Até 1.000',
  FROM_1000_TO_2000: 'De 1.000 a 2.000',
  FROM_2000_TO_3000: 'De 2.000 a 3.000',
  ABOVE_3000: 'Acima de 3.000',
};

const EDUCACAO_LABEL: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'Ensino fundamental',
  2: 'Ensino medio',
  3: 'Tecnologo',
  4: 'Ensino Superior',
  5: 'Pos / MBA / Mestrado',
  6: 'Doutorado',
};

function mapearAplicacao(api: AplicacaoAPI): Aplicacao {
  const nivelEducacao = api.candidato_data.nivel_educacao;

  return {
    id: api.id,
    trabalho_id: api.trabalho,
    candidato_id: api.candidato,
    candidato_nome: api.candidato_data.email,
    expectativa_salarial: Number(api.candidato_data.salario_expectativa ?? 0),
    experiencia: api.candidato_data.experiencia ?? 'Sem experiencia informada.',
    educacao_recente: String(nivelEducacao ?? ''),
    educacao_recente_label: nivelEducacao ? EDUCACAO_LABEL[nivelEducacao] : 'Nao informado',
    score: api.score,
    aplicacao_em: api.criado_em,
  };
}

export default function EmpresaCandidatos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emprego, setEmprego] = useState<TrabalhoAPI | null>(null);
  const [candidatos, setCandidatos] = useState<Aplicacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_CHAVE);

      if (!token || token === 'null' || token === 'undefined' || !id) {
        toast.error('Nao foi possivel carregar os candidatos da vaga.');
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        const [respostaVaga, respostaCandidatos] = await Promise.all([
          fetch(`/api/trabalhos/minhas-vagas/${id}/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          }),
          fetch(`/api/trabalhos/minhas-vagas/${id}/candidatos/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          }),
        ]);

        const dadosVagas = await respostaVaga.json();
        const dadosCandidatos = await respostaCandidatos.json();
        if (!respostaVaga.ok) {
          throw new Error(dadosVagas?.detail || 'Nao foi possivel carregar a vaga.');
        }
        if (!respostaCandidatos.ok) {
          throw new Error(dadosCandidatos?.detail || 'Nao foi possivel carregar os candidatos.');
        }

        setEmprego(dadosVagas);
        setCandidatos(dadosCandidatos.map(mapearAplicacao));
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao carregar os candidatos.';
        toast.error(mensagem);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [id]);

  if (carregando) {
    return <ConteudoPagina><p className="text-muted-foreground">Carregando candidatos...</p></ConteudoPagina>
  }

  if (!emprego) {
    return <ConteudoPagina><p className="text-muted-foreground">Vaga não encontrada.</p></ConteudoPagina>;
  }

  return (
    <ConteudoPagina>
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Button>

      <Card className="mb-6">
        <CardConteudo className="p-5">
          <h2 className="text-xl font-bold">{emprego.nome}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1"><DollarSign className="h-3 w-3" />{RANGE_SALARIO_LABEL[emprego.range_salario]}</Badge>
            <Badge variant="outline" className="gap-1"><GraduationCap className="h-3 w-3" />{EDUCACAO_LABEL[emprego.educacao_minima]}</Badge>
          </div>
        </CardConteudo>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Candidatos ({candidatos.length})</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5" /> Pontuação: 0 a 2 pontos
        </div>
      </div>

      {candidatos.length === 0 ? (
        <EstadoVazio icone={Users} titulo="Nenhum candidato" descricao="Ainda não há candidaturas para esta vaga." />
      ) : (
        <div className="space-y-3">
          {candidatos.map(app => <CandidatosCard key={app.id} aplicacao={app} />)}
        </div>
      )}
    </ConteudoPagina>
  );
}
