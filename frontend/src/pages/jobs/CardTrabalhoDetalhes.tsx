import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Usuario } from '@/types';
import { TrabalhosMock } from '@/mocks/empregos';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import { Card, CardConteudo, CardHeader, CardTitulo } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, GraduationCap, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface TrabalhoDetalhesPaginaPropriedades {
  user: Usuario | null;
}

export default function CardTrabalhoDetalhes({ user }: TrabalhoDetalhesPaginaPropriedades) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aplicado, setAplicado] = useState(false);
  const emprego = TrabalhosMock.find(j => j.id === Number(id));

  if (!emprego) {
    return (
      <ConteudoPagina>
        <p className="text-muted-foreground">Vaga não encontrada.</p>
        <Link to="/"><Button variant="outline" className="mt-4">Voltar</Button></Link>
      </ConteudoPagina>
    );
  }

  const handleApply = () => {
    setAplicado(true);
    toast.success('Candidatura enviada com sucesso!');
  };

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
