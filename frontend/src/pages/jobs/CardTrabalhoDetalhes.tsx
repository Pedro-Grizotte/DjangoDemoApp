import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Trabalho, Usuario } from '@/types';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import { Card, CardConteudo, CardHeader, CardTitulo } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, GraduationCap, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface TrabalhoDetalhesPaginaPropriedades {
  user: Usuario | null;
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

export default function CardTrabalhoDetalhes({ user }: TrabalhoDetalhesPaginaPropriedades) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aplicado, setAplicado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [emprego, setEmprego] = useState<Trabalho | null>(null);

  useEffect(() => {
    const carregartrabalho = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch(`/api/trabalhos/${id}/`);
        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(dados?.detail || 'Nao foi possivel carregar a vaga.');
        }
        setEmprego(mapearTrabalhoDaAPI(dados));
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao carregar a vaga.';
        toast.error(mensagem);
      } finally {
        setCarregando(false);
      }
    };

    if (id) {
      carregartrabalho();
    }
  }, [id]);

  const handleApply = () => {
    setAplicado(true);
    toast.success('Candidatura enviada com sucesso!');
  };

  if (carregando) {
    return (
      <ConteudoPagina>
        <p className="text-muted-foreground">Carregando vaga...</p>
      </ConteudoPagina>
    );
  }

  if (!emprego) {
    return (
      <ConteudoPagina>
        <p className="text-muted-foreground">Vaga não encontrada.</p>
        <Link to="/"><Button variant="outline" className="mt-4">Voltar</Button></Link>
      </ConteudoPagina>
    );
  }

  return (
    <ConteudoPagina>
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Button>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitulo className="text-2xl">{emprego.titulo}</CardTitulo>
        </CardHeader>
        <CardConteudo className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
              <DollarSign className="h-4 w-4" /> {emprego.salario_range_label}
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
              <GraduationCap className="h-4 w-4" /> {emprego.educacao_minima_label}
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
              <Users className="h-4 w-4" /> {emprego.contagem_candidatos} candidato{emprego.contagem_candidatos !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
              <Calendar className="h-4 w-4" /> {new Date(emprego.criado_em).toLocaleDateString('pt-BR')}
            </Badge>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Requisitos</h3>
            <p className="text-muted-foreground">{emprego.requisitos}</p>
          </div>

          {user?.tipo === 'candidato' && (
            <Button className="w-full" disabled={aplicado} onClick={handleApply}>
              {aplicado ? 'Candidatura Enviada ✓' : 'Candidatar-se'}
            </Button>
          )}
        </CardConteudo>
      </Card>
    </ConteudoPagina>
  );
}
