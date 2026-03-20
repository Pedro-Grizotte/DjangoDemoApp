import type { Aplicacao } from '@/types';
import { Card, CardConteudo } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, DollarSign, Calendar, Star } from 'lucide-react';

interface CandidateCardProps {
  aplicacao: Aplicacao;
}

function getBoaPontuacao(score: number) {
  if (score >= 2) return 'bg-accent text-accent-foreground';
  if (score === 1) return 'bg-warning text-warning-foreground';
  return 'bg-muted text-muted-foreground';
}

export default function CandidatosCard({ aplicacao }: CandidateCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardConteudo className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{aplicacao.candidato_nome}</h3>
              <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getBoaPontuacao(aplicacao.score)}`}>
                <Star className="h-3 w-3" />
                {aplicacao.score}/2
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{aplicacao.experiencia}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1 font-normal text-xs">
                <DollarSign className="h-3 w-3" />
                R$ {aplicacao.expectativa_salarial.toLocaleString('pt-BR')}
              </Badge>
              <Badge variant="outline" className="gap-1 font-normal text-xs">
                <GraduationCap className="h-3 w-3" />
                {aplicacao.educacao_recente_label}
              </Badge>
              <Badge variant="outline" className="gap-1 font-normal text-xs">
                <Calendar className="h-3 w-3" />
                {new Date(aplicacao.aplicacao_em).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          </div>
        </div>
      </CardConteudo>
    </Card>
  );
}
