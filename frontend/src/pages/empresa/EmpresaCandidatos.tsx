import { useParams, useNavigate } from 'react-router-dom';
import { TrabalhosMock } from '@/mocks/empregos';
import { AplicacoesMock } from '@/mocks/aplicacoes';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import CandidatosCard from '@/components/jobs/CandidatosCard';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { Card, CardConteudo } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, DollarSign, GraduationCap, Star } from 'lucide-react';

export default function EmpresaCandidatos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emprego = TrabalhosMock.find(j => j.id === Number(id));
  const candidatos = AplicacoesMock
    .filter(a => a.trabalho_id === Number(id))
    .sort((a, b) => b.score - a.score || new Date(b.aplicacao_em).getTime() - new Date(a.aplicacao_em).getTime());

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
          <h2 className="text-xl font-bold">{emprego.titulo}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1"><DollarSign className="h-3 w-3" />{emprego.salario_range_label}</Badge>
            <Badge variant="outline" className="gap-1"><GraduationCap className="h-3 w-3" />{emprego.educacao_minima_label}</Badge>
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
