import { useState, useMemo } from 'react';
import type { Usuario } from '@/types';
import { TrabalhosMock, rangeDeSalarios, niveisDeEducacao } from '@/mocks/empregos';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import CardTrabalho from './CardTrabalho';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface TrabalhosPropriedades {
  user: Usuario | null;
}

export default function Trabalhos({ user }: TrabalhosPropriedades) {
  const [busca, setBusca] = useState('');
  const [filtroSalario, setFiltroSalario] = useState('all');
  const [filtroEducacao, setFiltroEducacao] = useState('all');
  const [aplicacaoId, setAplicacaoId] = useState<number[]>([]);

  const filtros = useMemo(() => {
    return TrabalhosMock.filter(emprego => {
      const matchBusca = emprego.titulo.toLowerCase().includes(busca.toLowerCase())
       || emprego.requisitos.toLowerCase().includes(busca.toLowerCase());
      const matchSalario = filtroSalario === 'all' || emprego.salario_range === filtroSalario;
      const matchEducacao = filtroEducacao === 'all' || emprego.educacao_minima === filtroEducacao;
      return matchBusca && matchSalario && matchEducacao;
    });
  }, [busca, filtroSalario, filtroEducacao]);

  const enviarApply = (trabalhoId: number) => {
    if (aplicacaoId.includes(trabalhoId)) return;
    setAplicacaoId(prev => [...prev, trabalhoId]);
    toast.success('Candidatura enviada com sucesso!');
  };

  return (
    <ConteudoPagina>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Vagas Disponíveis</h1>
          <p className="text-muted-foreground">Encontre a oportunidade ideal para você</p>
        </div>
        {user && (
          <Badge variant={user.tipo === 'empresa' ? 'default' : 'secondary'} className="w-fit">
            {user.tipo === 'empresa' ? 'Empresa' : 'Candidato'}
          </Badge>
        )}
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
            <SelectItem value="all">Todas as faixas</SelectItem>
            {rangeDeSalarios.map(r => (
              <SelectItem key={r.valor} value={r.valor}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroEducacao} onValueChange={setFiltroEducacao}>
          <SelectTrigger><SelectValue placeholder="Escolaridade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Escolaridade</SelectItem>
            {niveisDeEducacao.map(e => (
              <SelectItem key={e.valor} value={e.valor}>{e.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtros.length === 0 ? (
        <EstadoVazio icone={Briefcase} titulo="Nenhuma vaga encontrada" descricao="Tente ajustar os filtros de busca." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtros.map(job => (
            <CardTrabalho
              key={job.id}
              emprego={job}
              showApply={user?.tipo === 'candidato'}
              onApply={enviarApply}
              appliedIds={aplicacaoId}
            />
          ))}
        </div>
      )}
    </ConteudoPagina>
  );
}
