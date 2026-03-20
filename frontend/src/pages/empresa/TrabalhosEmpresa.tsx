import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrabalhosMock } from '@/mocks/empregos';
import type { Trabalho } from '@/types';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import { Button } from '@/components/ui/button';
import { Card, CardConteudo } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Users, Briefcase } from 'lucide-react';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { toast } from 'sonner';
import {
  AlertaDialogo,
  AlertaDialogoAcao,
  AlertaDialogoCancelar,
  AlertaDialogoConteudo,
  AlertaDialogoDescricao,
  AlertaDialogoFooter,
  AlertaDialogoHeader,
  AlertaDialogoTitulo,
} from '@/components/ui/alert-dialog';

export default function TrabalhosEmpresa() {
  const [empregos, setEmpregos] = useState<Trabalho[]>(TrabalhosMock.filter(j => j.criado_por === 1));
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const enviarDelete = () => {
    if (deleteId !== null) {
      setEmpregos(prev => prev.filter(j => j.id !== deleteId));
      toast.success('Vaga removida com sucesso.');
      setDeleteId(null);
    }
  };

  return (
    <ConteudoPagina>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Vagas</h1>
          <p className="text-muted-foreground">Gerencie as vagas da sua empresa</p>
        </div>
        <Link to="/empresa/trabalhos/novo">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Vaga</Button>
        </Link>
      </div>

      {empregos.length === 0 ? (
        <EstadoVazio icone={Briefcase} titulo="Nenhuma vaga criada" descricao="Crie sua primeira vaga para começar a receber candidatos." />
      ) : (
        <div className="space-y-3">
          {empregos.map(emprego => (
            <Card key={emprego.id}>
              <CardConteudo className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{emprego.titulo}</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">{emprego.salario_range_label}</Badge>
                    <Badge variant="outline" className="text-xs">{emprego.educacao_minima_label}</Badge>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Users className="h-3 w-3" /> {emprego.contagem_candidatos}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/empresa/trabalhos/${emprego.id}/candidatos`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Users className="h-3.5 w-3.5" /> Candidatos
                    </Button>
                  </Link>
                  <Link to={`/empresa/trabalhos/${emprego.id}/editar`}>
                    <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setDeleteId(emprego.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </CardConteudo>
            </Card>
          ))}
        </div>
      )}

      <AlertaDialogo open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertaDialogoConteudo>
          <AlertaDialogoHeader>
            <AlertaDialogoTitulo>Confirmar exclusão</AlertaDialogoTitulo>
            <AlertaDialogoDescricao>Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.</AlertaDialogoDescricao>
          </AlertaDialogoHeader>
          <AlertaDialogoFooter>
            <AlertaDialogoCancelar>Cancelar</AlertaDialogoCancelar>
            <AlertaDialogoAcao onClick={enviarDelete}>Excluir</AlertaDialogoAcao>
          </AlertaDialogoFooter>
        </AlertaDialogoConteudo>
      </AlertaDialogo>
    </ConteudoPagina>
  );
}
