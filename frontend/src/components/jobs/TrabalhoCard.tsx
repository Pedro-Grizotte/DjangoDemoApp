import type { Trabalho } from '@/types';
import { Card, CardConteudo, CardFooter, CardHeader, CardTitulo } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, DollarSign, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrabalhoCardPropriedades {
  emprego: Trabalho;
  mostrarAplicado?: boolean;
  onAplicacao?: (jobId: number) => void;
  IdAplicacao?: number[];
  aplicando?: boolean;
}

export default function JobCard({ emprego, mostrarAplicado, onAplicacao, IdAplicacao = [], aplicando = false }: TrabalhoCardPropriedades) {
  const estaAplicado = IdAplicacao.includes(emprego.id);

  return (
    <Card className="group flex flex-col transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitulo className="text-lg leading-tight">{emprego.titulo}</CardTitulo>
      </CardHeader>
      <CardConteudo className="flex-1 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1 font-normal">
            <DollarSign className="h-3 w-3" />
            {emprego.salario_range_label}
          </Badge>
          <Badge variant="outline" className="gap-1 font-normal">
            <GraduationCap className="h-3 w-3" />
            {emprego.educacao_minima_label}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{emprego.requisitos}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {emprego.contagem_candidatos} candidato{emprego.contagem_candidatos !== 1 ? 's' : ''}
        </div>
      </CardConteudo>
      <CardFooter className="gap-2 pt-0">
        <Link to={`/empregos/${emprego.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-1">
            Detalhes <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
        {mostrarAplicado && (
          <Button size="sm" disabled={estaAplicado || aplicando} onClick={() => onAplicacao?.(emprego.id)} className="flex-1">
            {estaAplicado ? 'Candidatado' : 'Candidatar-se'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
