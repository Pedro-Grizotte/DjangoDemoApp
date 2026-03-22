import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const AUTH_TOKEN_CHAVE = 'auth_token';

export default function TrabalhosEmpresa() {
  const [empregos, setEmpregos] = useState<TrabalhoAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const carregarVagas = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_CHAVE);

      if (!token) {
        toast.error('Voce precisa estar autenticado como empresa.');
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        const resposta = await fetch('/api/trabalhos/minhas-vagas/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
          const mensagem = dados?.detail || 'Não foi possivel carregar as vagas da empresa.';
          throw new Error(mensagem);
        }

        setEmpregos(dados);
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao buscar vagas.';
        toast.error(mensagem);
      } finally {
        setCarregando(false);
      }
    };

    carregarVagas();
  }, []);

  const enviarDelete = async () => {
    if (deleteId === null) return;

    const token = localStorage.getItem(AUTH_TOKEN_CHAVE);
    if (!token || token === 'null' || token === 'undefined') {
      toast.error('Voce precisa estar autenticado como empresa.');
      return;
    }

    try {
      const resposta = await fetch(`/api/trabalhos/minhas-vagas/${deleteId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!resposta.ok) {
        let mensagem = 'Não foi possivel excluir a vaga.';

        try {
          const dados = await resposta.json();
          mensagem = dados?.detail || mensagem;
        } catch (error) {

        }
        throw new Error(mensagem);
      }
      setEmpregos(prev => prev.filter(j => j.id !== deleteId));
      toast.success('Vaga removida com sucesso.');
      setDeleteId(null);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Error inesperado ao excluir a vaga.';
      toast.error(mensagem);
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

      {carregando ? (
        <p className="text-sm text-muted-foreground">Carregando vagas...</p>
      ) : empregos.length === 0 ? (
        <EstadoVazio icone={Briefcase} titulo="Nenhuma vaga criada" descricao="Crie sua primeira vaga para começar a receber candidatos." />
      ) : (
        <div className="space-y-3">
          {empregos.map(emprego => (
            <Card key={emprego.id}>
              <CardConteudo className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{emprego.nome}</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {RANGE_SALARIO_LABEL[emprego.range_salario]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {EDUCACAO_LABEL[emprego.educacao_minima]}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      {emprego.contagem_candidatos}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/empresa/trabalhos/${emprego.id}/candidatos`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Users className="h-3.5 w-3.5" />
                      Candidatos
                    </Button>
                  </Link>
                  <Link to={`/empresa/trabalhos/${emprego.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
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
